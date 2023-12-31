export type CancelTimerFunction = () => void

/**
 * A `setInterval()` wrapper with support for `AbortSignal`
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
export function setSignalInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction {
    const id = setInterval(() => {
        if (signal?.aborted) return
        handler = typeof handler === 'string' ? new Function(handler) : handler
        handler(...args)
    }, ms)
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
        handler(...args)
    }, ms)
    const clear = () => clearTimeout(id)
    signal?.addEventListener('abort', clear)
    return clear
}

export type CancelAnimationFrame = () => void

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

export interface IntervalDetail{
    elapsed: number
    roundedElapsed: number
    targetNext: number
    delay: number
}

export type IntervalRequestCallback = (timer: { time: number, detail: IntervalDetail }) => void

/**
 * Similar to `setInterval()` implementation using a combination of `requestAnimationFrame()` and `setTimeout()` with support for `AbortSignal`
 * 
 * **Features**:
 * - Accurate over time
 * - Updates visually steadily
 * - Avoids running in background
 * - Otherwise good CPU usage
 * 
 * [Github Gist](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95) | [Youtube](https://www.youtube.com/watch?v=MCi6AZMkxcU)
 */
export function requestSignalAnimationInterval(handler: IntervalRequestCallback, signal?: AbortSignal, ms?: number | undefined): CancelTimerFunction {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = (
        typeof document !== 'undefined' && document.timeline 
        ? document.timeline.currentTime 
        : performance.now()
    ) as number;

    const interval = ms || 0;
    let cancelled = false

    function frame(time: number, detail: IntervalDetail) {
        if (signal?.aborted) return;
        if (cancelled) return
        handler({ time, detail });
        scheduleFrame(time);
    }

    function scheduleFrame(time: number) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / interval) * interval;
        const targetNext = start + roundedElapsed + interval;
        const delay = targetNext - performance.now();
        const detail = { elapsed, roundedElapsed, targetNext, delay }
        setSignalTimeout(() => requestAnimationFrame((time) => frame(time, detail)), signal, delay);
    }

    scheduleFrame(start);

    return () => cancelled = true
}

export type CounterIntervalCallback = (timer: { time: number, detail: IntervalDetail }, ...args: any[]) => void

/**
 * Similar to `requestSignalAnimationInterval` without the use of `requestAnimationFrame()`, can be used in a `SharedWorker`.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 * 
 * **Further reading**:
 * [Reasons for delays longer than specified](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified)
 * | [Timeouts in inactive tabs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#timeouts_in_inactive_tabs)
 * | [Throttling of tracking scripts](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#throttling_of_tracking_scripts)
 * | [Late timeouts](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#late_timeouts)
 */
export function setSignalCounterInterval(handler: CounterIntervalCallback, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = (
        typeof document !== 'undefined' && document.timeline
            ? document.timeline.currentTime
            : performance.now()
    ) as number;

    const interval = ms || 0;
    let cancelled = false

    function frame(time: number, detail: IntervalDetail) {
        if (signal?.aborted) return;
        if (cancelled) return
        handler({ time, detail }, ...args);
        scheduleFrame(time);
    }

    function scheduleFrame(time: number) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / interval) * interval;
        const targetNext = start + roundedElapsed + interval;
        const delay = targetNext - performance.now();
        const detail = { elapsed, roundedElapsed, targetNext, delay }
        setSignalTimeout(() => frame(performance.now(), detail), signal, delay);
    }

    scheduleFrame(start);

    return () => cancelled = true
}
