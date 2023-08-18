# signaltimer
A wrapper function for "setInterval" and "setTimeout" that uses "AbortSignal" as cancellation strategy

## Install

```bash
npm install signaltimer
```

## Usage

```js
import { setSignalInterval, setSignalTimeout } from 'signaltimer';

const controller = new AbortController();

setSignalInterval(() => {
  console.log('Hello');
}, controller.signal, 1000);

setSignalTimeout(() => {
  console.log('Hello');
}, controller.signal, 1000);
```

## Available functions

```ts
/**
 * A `setInterval()` wrapper with support for `AbortSignal`
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
 */
function setSignalInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction
```

```ts
/**
 * A `setTimeout()` wrapper with support for `AbortSignal`
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
 */
function setSignalTimeout(handler: Function, signal?: AbortSignal, ms?: number | undefined, ...args: any[]): CancelTimerFunction
```

```ts
/**
 * A `requestAnimationFrame()` wrapper with support for `AbortSignal`
 * 
 * **Note:** This function will call the handler immediately, and then call it again on the next animation frame.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
 */
function requestSignalAnimationFrame(handler: FrameRequestCallback, signal?: AbortSignal): CancelAnimationFrame
```

```ts
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
function setAnimationInterval(handler: Function, signal?: AbortSignal, ms?: number | undefined): CancelTimerFunction
```

## License
Licensed under the [MIT](LICENSE) License.
