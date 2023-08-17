"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSignalTimeout = exports.setSignalInterval = void 0;
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
