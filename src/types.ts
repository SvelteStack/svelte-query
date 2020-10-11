import type {
  MutateOptions,
  QueryObserverOptions,
  QueryObserverResult,
} from "./query";

export type MutationReducer<TData, TError> = (
  state: MutationState<TData, TError>,
  action: MutationAction<TData, TError>
) => MutationState<TData, TError>;

export type MutationStatus = "idle" | "loading" | "error" | "success";

export interface MutationState<TData, TError> {
  status: MutationStatus;
  data: TData | undefined;
  error: TError | null;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ResetAction {
  type: "reset";
}

interface LoadingAction {
  type: "loading";
}

interface SuccessAction<TData> {
  type: "success";
  data: TData;
}

interface ErrorAction<TError> {
  type: "error";
  error: TError;
}

export type MutationAction<TData, TError> =
  | ErrorAction<TError>
  | LoadingAction
  | ResetAction
  | SuccessAction<TData>;

export type MutateFunction<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptions<TData, TError, TVariables, TContext>
) => void;

export type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

export type MutateAsyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptions<TData, TError, TVariables, TContext>
) => Promise<TData>;

export interface QueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
> extends QueryObserverOptions<TData, TError, TQueryFnData, TQueryData> {}

export interface QueryResult<TData = unknown, TError = unknown>
  extends QueryObserverResult<TData, TError> {}

export interface MutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> {
  data: TData | undefined;
  error: TError | null;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  mutate: MutateFunction<TData, TError, TVariables, TContext>;
  mutateAsync: MutateAsyncFunction<TData, TError, TVariables, TContext>;
  reset: () => void;
  status: MutationStatus;
}
