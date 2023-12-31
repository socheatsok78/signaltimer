export type CancelTimerFunction = () => void;
/**
 * A `setInterval()` wrapper with support for `AbortSignal`
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
export declare function setSignalInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction;
/**
 * A `setTimeout()` wrapper with support for `AbortSignal`
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
export declare function setSignalTimeout(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction;
export type CancelAnimationFrame = () => void;
/**
 * A `requestAnimationFrame()` wrapper with support for `AbortSignal`
 *
 * **Note:** This function will call the handler immediately, and then call it again on the next animation frame.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
 */
export declare function requestSignalAnimationFrame(handler: FrameRequestCallback, signal?: AbortSignal): CancelAnimationFrame;
export interface IntervalDetail {
    elapsed: number;
    roundedElapsed: number;
    targetNext: number;
    delay: number;
}
export type IntervalRequestCallback = (timer: {
    time: number;
    detail: IntervalDetail;
}) => void;
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
export declare function requestSignalAnimationInterval(handler: IntervalRequestCallback, signal?: AbortSignal, ms?: number | undefined): CancelTimerFunction;
export type CounterIntervalCallback = (timer: {
    time: number;
    detail: IntervalDetail;
}, ...args: any[]) => void;
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
export declare function setSignalCounterInterval(handler: CounterIntervalCallback, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction;
