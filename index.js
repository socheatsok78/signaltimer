"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCounterInterval = exports.requestSignalAnimationInterval = exports.setAnimationInterval = exports.requestSignalAnimationFrame = exports.setSignalTimeout = exports.setSignalInterval = void 0;
/**
 * A `setInterval()` wrapper with support for `AbortSignal`
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
function setSignalInterval(handler, signal, ms, ...args) {
    const id = setInterval(() => {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        handler = typeof handler === 'string' ? new Function(handler) : handler;
        handler(...args);
    }, ms);
    const clear = () => clearInterval(id);
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', clear);
    return clear;
}
exports.setSignalInterval = setSignalInterval;
/**
 * A `setTimeout()` wrapper with support for `AbortSignal`
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
function setSignalTimeout(handler, signal, ms, ...args) {
    const id = setTimeout(() => {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        handler = typeof handler === 'string' ? new Function(handler) : handler;
        handler(...args);
    }, ms);
    const clear = () => clearTimeout(id);
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', clear);
    return clear;
}
exports.setSignalTimeout = setSignalTimeout;
/**
 * A `requestAnimationFrame()` wrapper with support for `AbortSignal`
 *
 * **Note:** This function will call the handler immediately, and then call it again on the next animation frame.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
 */
function requestSignalAnimationFrame(handler, signal) {
    let cancelled = false;
    function step(time) {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        if (cancelled)
            return;
        handler(time);
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    const cancel = () => cancelled = true;
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', cancel);
    return cancel;
}
exports.requestSignalAnimationFrame = requestSignalAnimationFrame;
/**
 * Similar to `setInterval()` implementation using a combination of `requestAnimationFrame()` and `setTimeout()` with support for `AbortSignal`
 *
 * @deprecated Use `requestSignalAnimationInterval()` instead
 *
 * **Features**:
 * - Accurate over time
 * - Updates visually steadily
 * - Avoids running in background
 * - Otherwise good CPU usage
 *
 * [Github Gist](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95) | [Youtube](https://www.youtube.com/watch?v=MCi6AZMkxcU)
 */
exports.setAnimationInterval = requestSignalAnimationInterval;
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
function requestSignalAnimationInterval(handler, signal, ms) {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = (typeof document !== 'undefined' && document.timeline
        ? document.timeline.currentTime
        : performance.now());
    const interval = ms || 0;
    let cancelled = false;
    function frame(time) {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        if (cancelled)
            return;
        handler(time);
        scheduleFrame(time);
    }
    function scheduleFrame(time) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / interval) * interval;
        const targetNext = start + roundedElapsed + interval;
        const delay = targetNext - performance.now();
        setSignalTimeout(() => requestAnimationFrame(frame), signal, delay);
    }
    scheduleFrame(start);
    return () => cancelled = true;
}
exports.requestSignalAnimationInterval = requestSignalAnimationInterval;
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
function setCounterInterval(handler, signal, ms, ...args) {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = (typeof document !== 'undefined' && document.timeline
        ? document.timeline.currentTime
        : performance.now());
    const interval = ms || 0;
    let cancelled = false;
    function frame(time) {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        if (cancelled)
            return;
        handler(...args, time);
        scheduleFrame(time);
    }
    function scheduleFrame(time) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / interval) * interval;
        const targetNext = start + roundedElapsed + interval;
        const delay = targetNext - performance.now();
        setSignalTimeout(() => frame(performance.now()), signal, delay);
    }
    scheduleFrame(start);
    return () => cancelled = true;
}
exports.setCounterInterval = setCounterInterval;
