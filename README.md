# cloakroom-smart-buffer-proxy

This is designed to manage a queue implemented as a Buffer. The main goal is to
provide a way to keep track of a specific element as the Queue grows without
having to waste resources searching. This has a use case in some work towards
an experimental implementation of LZ77.

## Usage

### Add to your project

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

### Usage

Note: you can run the code below from your browser if you go [here](https://runkit.com/spacekitcat/5c7ae8294ac2290012e7d733)

```js
const { Proxy } = require('cloakroom-smart-buffer-proxy');

// An instance of Proxy with a set length of 10
const proxy = new Proxy(10);

proxy.append(Buffer.from([69, 68, 67, 66, 65]));
console.log(proxy.getReadOnlyBuffer()); // [69, 68, 67, 66, 65]

const ticket1 = proxy.getCloakroomTicket(0); // Get a ticket for item zero, 65
console.log(proxy.readCloakroomTicket(ticket1)); // 65
const ticket2 = proxy.getCloakroomTicket(4); // Get a ticket for item four, 69
console.log(proxy.readCloakroomTicket(ticket2)); // 69

proxy.append(Buffer.from([101, 100, 99, 98, 97]));
console.log(proxy.getReadOnlyBuffer()); // [69, 68, 67, 66, 65, 101, 100, 99, 98, 97]
console.log(proxy.readCloakroomTicket(ticket1)); // 65
console.log(proxy.readCloakroomTicket(ticket2)); // 69

const ticket3 = proxy.getCloakroomTicket(0); // Get a ticket for item zero, 97
console.log(proxy.readCloakroomTicket(ticket3)); // 97
const ticket4 = proxy.getCloakroomTicket(9); // Get a ticket for item nine, 69
console.log(proxy.readCloakroomTicket(ticket4)); // 69

proxy.append(Buffer.from([0x78]));
console.log(proxy.getReadOnlyBuffer()); // [68, 67, 66, 65, 101, 100, 99, 98, 97, 120]
console.log(proxy.readCloakroomTicket(ticket1)); // 65
console.log(proxy.readCloakroomTicket(ticket2)); // null
console.log(proxy.readCloakroomTicket(ticket3)); // 97
console.log(proxy.readCloakroomTicket(ticket4)); // null
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
