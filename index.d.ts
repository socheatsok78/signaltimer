type CancelTimerFunction = () => void;
/**
 * A setInterval() wrapper that with support for AbortSignal
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
export declare function setSignalInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction;
/**
 * A setTimeout() wrapper that with support for AbortSignal
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
export declare function setSignalTimeout(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction;
type CancelAnimationFrame = () => void;
/**
 * A requestAnimationFrame() wrapper that with support for AbortSignal
 *
 * **Note:** This function will call the handler immediately, and then call it again on the next animation frame.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
 */
export declare function requestSignalAnimationFrame(handler: FrameRequestCallback, signal?: AbortSignal): CancelAnimationFrame;
export {};
