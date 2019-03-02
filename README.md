# cloakroom-smart-buffer-proxy

This is designed to manage a queue implemented as a Buffer. The main goal is to
provide a way to keep track of a specific element as the Queue grows without
having to waste resources searching. This has a use case in some work towards
an experimental implementation of LZ77.

## Usage

```bash
your-rad-project <master*> % yarn add cloakroom-smart-buffer-proxy --dev
```

*and then you can do*
```js
import { Proxy } from 'cloakroom-smart-buffer-proxy';
```
*or, if you don't like Babel's syntactic sugar, you can do:*
```js
const { Proxy } = require('cloakroom-smart-buffer-proxy');
```

## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/lz77-nodejs-streams ‹master*› % yarn test
```

### Build

```
/lz77-nodejs-streams ‹master*› % yarn build
```
