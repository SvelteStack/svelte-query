import { notifyManager, QueryObserverOptions } from "./queryCore"


export function setBatchCalls<Options extends QueryObserverOptions>(options: Options): Options {
    // Make sure results are optimistically set in fetching state before subscribing or updating options
    options.optimisticResults = true
    if (options.onError) {
        options.onError = notifyManager.batchCalls(
            options.onError
        )
    }

    if (options.onSuccess) {
        options.onSuccess = notifyManager.batchCalls(
            options.onSuccess
        )
    }

    if (options.onSettled) {
        options.onSettled = notifyManager.batchCalls(
            options.onSettled
        )
    }
    return options
}