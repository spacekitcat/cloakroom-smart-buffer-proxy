# cloakroom-smart-buffer-proxy

This module is designed to reduce the number of repeated lookup operations carried out
against a Node.js Buffer.

Let's say that a downstream dependency starts with a new instance of Cloakroom, i.e.

```javascript
const { Proxy } = require('cloakroom-smart-buffer-proxy');

const proxy = new Proxy(10)
```

The client code can append data to an instance of the Cloakroom proy by calling `proxy.append(Buffer.from[0x55])`

Cloakroom's internal buffer can be read as
a read-only list, by calling `proxy.getReadOnlyBuffer()`.

The buffer indexes are in reverse order (i.e. The last item is always
`0` and the first item is alway `proxy.getReadOnlyBuffer().length - 1`).

If you find an item you want to save a reference to, you can call
`const ticket = proxy.getCloakroomTicket($index)` which issues a "ticket" to represent the item.

You can call `proxy.readCloakroomTicket(ticket)`, which will figure out where the ticket is now and resolve the ticket to its value.

When a Cloakroom instance is insantiated, the maximum size can be passed in as the first parameter to the constructor. The default is `32000`. The Proxy class will ensure that the maximum size isn't exceeded, deleting the oldest entries to make space to accomodate new items when it has to. Tickets that reference deleted items become expired and will resovle to `null`, which indicates to the client that the ticket has expired.

## Usage

### Add to your project

*Change directory to your projects directory*
```bash
your-rad-project <master*> % yarn add cloakroom-smart-buffer-proxy --dev
```

*and then do*
```js
import { Proxy } from 'cloakroom-smart-buffer-proxy';
```
*or, if you don't use the syntactic sugar provided by Babel, do:*
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
