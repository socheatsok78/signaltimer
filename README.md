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

## License
Licensed under the [MIT](LICENSE) License.
