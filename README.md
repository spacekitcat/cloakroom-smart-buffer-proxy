# cloakroom-smart-buffer-proxy

This module is designed to reduce the number of repeated lookup operations carried out
against a Node.js Buffer.

Let's say that a downstream dependency starts with a new instance of Cloakroom, i.e.

```javascript
const { Proxy } = require('cloakroom-smart-buffer-proxy');

const proxy = new Proxy(10)
```

The client code can append data to an instance of the Cloakroom by calling `proxy.append(Buffer.from[0x55])`

Cloakroom's internal buffer can be read as
a read-only list, by calling `proxy.getReadOnlyBuffer()`.

The buffer indexes are in reverse order (i.e. The last item is always
`0` and the first item is alway `proxy.getReadOnlyBuffer().length - 1`).

If you find an item you want to save a reference to, you can call
`const ticket = proxy.getCloakroomTicket($index)` which issues a "ticket" to represent the item.

You can call `proxy.readCloakroomTicket(ticket)`, which will figure out where the ticket is now and resolve the ticket to its value.

When a Cloakroom instance is insantiated, the maximum size can be passed in as the first parameter to the constructor. The default is `32000`. The Proxy class will ensure that the maximum size isn't exceeded, deleting the oldest entries to make space to accomodate new items when it has to. Tickets that reference deleted items become expired and will resovle to `null`, which indicates to the client that the ticket has expired.

## Guide

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
yarn run v1.13.0
$ jest --coverage
 PASS  __tests__/proxy.test.js
  The `Proxy` class
    when the class is instantiated
      ✓ should return the expected result (3ms)
      ✓ should set the internal maximum size
    The `getReadOnlyBuffer` method
      when the `Proxy` instance is instantiated
        ✓ should return an empty buffer object
        ✓ should set the internal maximum size
        ✓ should set the internal maximum size (alt data)
      when the `Proxy` instance has received content
        ✓ should return the expected contents (1ms)
      when the `Proxy` instance has received two lots of content
        ✓ should return the expected contents
      when the `Proxy` instance has received two lots of contents that overflow the buffer size
        ✓ should return the expected contents
      when the client code attempts write operations against the returned buffer
        ✓ should throw an exception (6ms)
    The `getCloakroomTicket` method
      when the `Proxy` instance has received one lot of content
        ✓ should return a ticket with the expected id (start)
      when the `Proxy` instance has received two lots of content
        unbalanced append
          ✓ should return a ticket with the expected id (0)
          ✓ should return a ticket with the expected id (1)
          ✓ should return a ticket with the expected id (2)
          ✓ should return a ticket with the expected id (3), expired
        balanced append
          ✓ should return a ticket with the expected id (0) (1ms)
          ✓ should return a ticket with the expected id (1)
          ✓ should return a ticket with the expected id (2)
          ✓ should return a null (3)
      when the `Proxy` instance has received three lots of content
        unbalanced append
          ✓ should return a ticket with the expected id (0)
          ✓ should return a ticket with the expected id (1) (1ms)
          ✓ should return a ticket with the expected id (2)
          ✓ should return a ticket with the expected id (3)
          ✓ should return a ticket with the expected id (4) (1ms)
        balanced append
          ✓ should return a ticket with the expected id (0)
          ✓ should return a ticket with the expected id (1)
          ✓ should return a ticket with the expected id (2) (1ms)
          ✓ should return a ticket with the expected id (3)
          ✓ should return a ticket with the expected id (4)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 proxy.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        2.434s
Ran all test suites.
✨  Done in 3.70s.
```

### Build

```bash
/cloakroom-smart-buffer-proxy ‹master*› % yarn build
/cloakroom-smart-buffer-proxy ‹master*› % ls lib
proxy        proxy.js     proxy.js.map
```
