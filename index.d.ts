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
export {};
