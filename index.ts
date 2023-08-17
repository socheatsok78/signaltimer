type CancelTimerFunction = () => void

/**
 * A setInterval() wrapper that with support for AbortSignal
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
export function setSignalInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction {
    const id = setInterval(() => {
        if (signal?.aborted) return
        handler = typeof handler === 'string' ? new Function(handler) : handler
        handler()
    }, ms, ...args)
    const clear = () => clearInterval(id)
    signal?.addEventListener('abort', clear)
    return clear
}

/**
 * A setTimeout() wrapper that with support for AbortSignal
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
export function setSignalTimeout(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction {
    const id = setTimeout(() => {
        if (signal?.aborted) return
        handler = typeof handler === 'string' ? new Function(handler) : handler
        handler()
    }, ms, ...args)
    const clear = () => clearTimeout(id)
    signal?.addEventListener('abort', clear)
    return clear
}
