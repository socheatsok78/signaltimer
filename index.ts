type CancelTimerFunction = () => void

/**
 * A setInterval() wrapper with support for AbortSignal
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
 * A setTimeout() wrapper with support for AbortSignal
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

type CancelAnimationFrame = () => void

/**
 * A requestAnimationFrame() wrapper with support for AbortSignal
 * 
 * **Note:** This function will call the handler immediately, and then call it again on the next animation frame.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
 */
export function requestSignalAnimationFrame(handler: FrameRequestCallback, signal?: AbortSignal): CancelAnimationFrame {
    let cancelled = false
    function step(time: number) {
        if (signal?.aborted) return
        if (cancelled) return
        handler(time)
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    const cancel = () => cancelled = true
    signal?.addEventListener('abort', cancel)
    return cancel
}
