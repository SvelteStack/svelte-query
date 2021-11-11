import { difference, replaceAt } from './utils'
import { notifyManager } from './notifyManager'
import type { QueryObserverOptions, QueryObserverResult, QueriesObserverResult } from './types'
import type { QueryClient } from './queryClient'
import { NotifyOptions, QueryObserver } from './queryObserver'
import { Subscribable } from './subscribable'

type QueriesObserverListener<T extends readonly [...QueryObserverOptions[]]> = (result: QueriesObserverResult<T>) => void

export class QueriesObserver<T extends readonly [...QueryObserverOptions[]]> extends Subscribable<QueriesObserverListener<T>> {
  private client: QueryClient
  private result: QueriesObserverResult<T>
  private queries: T
  private observers: QueryObserver[]
  private observersMap: Record<string, QueryObserver>

  constructor(client: QueryClient, queries?: T) {
    super()

    this.client = client
    this.queries = [] as any
    this.result = [] as any
    this.observers = []
    this.observersMap = {}

    if (queries) {
      this.setQueries(queries)
    }
  }

  protected onSubscribe(): void {
    if (this.listeners.length === 1) {
      this.observers.forEach(observer => {
        observer.subscribe(result => {
          this.onUpdate(observer, result)
        })
      })
    }
  }

  protected onUnsubscribe(): void {
    if (!this.listeners.length) {
      this.destroy()
    }
  }

  destroy(): void {
    this.listeners = []
    this.observers.forEach(observer => {
      observer.destroy()
    })
  }

  setQueries(
    queries: T,
    notifyOptions?: NotifyOptions
  ): void {
    this.queries = queries
    this.updateObservers(notifyOptions)
  }

  getCurrentResult(): QueriesObserverResult<T> {
    return this.result
  }

  getOptimisticResult(queries: T): QueriesObserverResult<T> {
    return queries.map(options => {
      const defaultedOptions = this.client.defaultQueryObserverOptions(options)
      return this.getObserver(defaultedOptions).getOptimisticResult(
        defaultedOptions
      )
    }) as any
  }

  private getObserver(options: QueryObserverOptions): QueryObserver {
    const defaultedOptions = this.client.defaultQueryObserverOptions(options)
    return (
      this.observersMap[defaultedOptions.queryHash!] ||
      new QueryObserver(this.client, defaultedOptions)
    )
  }

  private updateObservers(notifyOptions?: NotifyOptions): void {
    notifyManager.batch(() => {
      let hasIndexChange = false

      const prevObservers = this.observers
      const prevOberversMap = this.observersMap

      const newResult: QueryObserverResult[] = []
      const newObservers: QueryObserver[] = []
      const newObserversMap: Record<string, QueryObserver> = {}

      this.queries.forEach((options, i) => {
        const defaultedOptions = this.client.defaultQueryObserverOptions(
          options
        )
        const queryHash = defaultedOptions.queryHash!
        const observer = this.getObserver(defaultedOptions)

        if (prevOberversMap[queryHash]) {
          observer.setOptions(defaultedOptions, notifyOptions)
        }

        if (observer !== prevObservers[i]) {
          hasIndexChange = true
        }

        newObservers.push(observer)
        newResult.push(observer.getCurrentResult())
        newObserversMap[queryHash] = observer
      })

      if (prevObservers.length === newObservers.length && !hasIndexChange) {
        return
      }

      this.observers = newObservers
      this.observersMap = newObserversMap
      this.result = newResult as any

      if (!this.hasListeners()) {
        return
      }

      difference(prevObservers, newObservers).forEach(observer => {
        observer.destroy()
      })

      difference(newObservers, prevObservers).forEach(observer => {
        observer.subscribe(result => {
          this.onUpdate(observer, result)
        })
      })

      this.notify()
    })
  }

  private onUpdate(observer: QueryObserver, result: QueryObserverResult): void {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.result = replaceAt(this.result, index, result)
      this.notify()
    }
  }

  private notify(): void {
    notifyManager.batch(() => {
      this.listeners.forEach(listener => {
        listener(this.result)
      })
    })
  }
}
