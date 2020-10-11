<script context="module" lang="ts">
  import { writable } from "svelte/store";

  import { getStatusProps } from "./query/core/utils";
  import type {
    MutationState,
    MutationReducer,
    MutationAction,
    MutationResult,
  } from "./types";

 function reduce<TData = unknown, TError = unknown>(
    reducer: MutationReducer<TData, TError>,
    initial?: MutationState<TData, TError>
  ) {
    const state = writable(initial);
    const subscribe = (run) => state.subscribe(run);
    const dispatch = (action: MutationAction<TData, TError>) => {
      state.update((value) => reducer(value, action));
    };

    return { subscribe, dispatch };
  }

  function getDefaultMutationState<TData, TError>(): MutationState<
    TData,
    TError
  > {
    return {
      ...getStatusProps("idle"),
      data: undefined,
      error: null,
    };
  }

  function reducer<TData, TError>(
    state: MutationState<TData, TError>,
    action: MutationAction<TData, TError>
  ): MutationState<TData, TError> {
    switch (action.type) {
      case "reset":
        return getDefaultMutationState();
      case "loading":
        return {
          ...getStatusProps("loading"),
          data: undefined,
          error: null,
        };
      case "success":
        return {
          ...getStatusProps("success"),
          data: action.data,
          error: null,
        };
      case "error":
        return {
          ...getStatusProps("error"),
          data: undefined,
          error: action.error,
        };
      default:
        return state;
    }
  }
</script>

<script lang="ts">
  import type { MutationOptions, QueryClient } from "./query/core";
  import { getLogger } from "./query/core/logger";
  import { notifyManager } from "./query/core/notifyManager";
  import { noop } from "./query/core/utils";
  import type {
    MutationFunction,
    MutateFunction,
    MutateAsyncFunction,
  } from "./types";
import { useQueryClient } from "./QueryClientProvider.svelte";

  export let mutationFn: MutationFunction;
  export let options: MutationOptions;

  export let mutation: MutationResult;

  const client: QueryClient = useQueryClient();
  const defaultedOptions = client.defaultMutationOptions(options);

  const initial = getDefaultMutationState();
  const state = reduce(reducer, initial);
  const dispatch = state.dispatch;

  const safeDispatch = (action) => {
    notifyManager.schedule(() => {
      dispatch(action);
    });
  };

  let lastMutationIdRef = 0;

  const mutateAsync: MutateAsyncFunction<unknown, unknown, void, unknown> = (
    vars,
    mutateOpts = {}
  ): Promise<unknown> => {
    const mutationId = ++lastMutationIdRef;
    const mutationOpts = defaultedOptions;
    const lastMutationFn = mutationFn;

    let ctx;
    let data;

    safeDispatch({ type: "loading" });

    return Promise.resolve()
      .then(() => mutationOpts.onMutate?.(vars))
      .then((context) => {
        ctx = context;
      })
      .then(() => lastMutationFn(vars))
      .then((result) => {
        data = result;
      })
      .then(() => mutationOpts.onSuccess?.(data, vars, ctx))
      .then(() => mutationOpts.onSettled?.(data, null, vars, ctx))
      .then(() => mutateOpts.onSuccess?.(data, vars, ctx))
      .then(() => mutateOpts.onSettled?.(data, null, vars, ctx))
      .then(() => {
        if (lastMutationIdRef === mutationId) {
          safeDispatch({ type: "success", data });
        }
        return data;
      })
      .catch((error) => {
        getLogger().error(error);
        return Promise.resolve()
          .then(() => mutationOpts.onError?.(error, vars, ctx))
          .then(() => mutationOpts.onSettled?.(undefined, error, vars, ctx))
          .then(() => mutateOpts.onError?.(error, vars, ctx))
          .then(() => mutateOpts.onSettled?.(undefined, error, vars, ctx))
          .then(() => {
            if (lastMutationIdRef === mutationId) {
              safeDispatch({ type: "error", error });
            }
            throw error;
          });
      });
  };

  const mutate: MutateFunction<unknown, unknown, void> = (
    variables,
    mutateOptions
  ) => {
    mutateAsync(variables, mutateOptions).catch(noop);
  };

  const reset = () => {
    safeDispatch({ type: "reset" });
  };

  $: mutation = {
    ...$state,
    mutate,
    mutateAsync,
    reset,
  };
</script>

<slot name="mutation" {mutation} />
