type CancelTimerFunction = () => void

/**
 * A `setInterval()` wrapper with support for `AbortSignal`
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
 * A `setTimeout()` wrapper with support for `AbortSignal`
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
 * A `requestAnimationFrame()` wrapper with support for `AbortSignal`
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

/**
 * A `setInterval()` implementation using a combination of `requestAnimationFrame()` and `setTimeout()` with support for `AbortSignal`
 * 
 * **Features**:
 * - Accurate over time
 * - Updates visually steadily
 * - Avoids running in background
 * - Otherwise good CPU usage
 * 
 * [Github Gist](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95) | [Youtube](https://www.youtube.com/watch?v=MCi6AZMkxcU)
 */
export function setAnimationInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined): CancelTimerFunction {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = (document && document.timeline ? document.timeline.currentTime : performance.now()) as number;
    const interval = ms || 0;
    let cancelled = false

    function frame(time: number) {
        if (signal?.aborted) return;
        if (cancelled) return
        handler(time);
        scheduleFrame(time);
    }

    function scheduleFrame(time: number) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / interval) * interval;
        const targetNext = start + roundedElapsed + interval;
        const delay = targetNext - performance.now();
        setSignalTimeout(() => requestAnimationFrame(frame), signal, delay);
    }

    scheduleFrame(start);

    return () => cancelled = true
}
