"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSignalAnimationFrame = exports.setSignalTimeout = exports.setSignalInterval = void 0;
/**
 * A setInterval() wrapper that with support for AbortSignal
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
function setSignalInterval(handler, signal, ms, ...args) {
    const id = setInterval(() => {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        handler = typeof handler === 'string' ? new Function(handler) : handler;
        handler();
    }, ms, ...args);
    const clear = () => clearInterval(id);
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', clear);
    return clear;
}
exports.setSignalInterval = setSignalInterval;
/**
 * A setTimeout() wrapper that with support for AbortSignal
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
function setSignalTimeout(handler, signal, ms, ...args) {
    const id = setTimeout(() => {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        handler = typeof handler === 'string' ? new Function(handler) : handler;
        handler();
    }, ms, ...args);
    const clear = () => clearTimeout(id);
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', clear);
    return clear;
}
exports.setSignalTimeout = setSignalTimeout;
/**
 * A requestAnimationFrame() wrapper that with support for AbortSignal
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
