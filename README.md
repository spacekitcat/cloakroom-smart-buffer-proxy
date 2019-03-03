# cloakroom-smart-buffer-proxy

This module is designed to reduce the number of repeated lookup operations carried out
against a Node.js Buffer.

Let's say that a downstream dependency starts with a new instance of Cloakroom, i.e.

```javascript
const { Proxy } = require('cloakroom-smart-buffer-proxy');

const proxy = new Proxy(10)
```

The client code can append data to an instance of Cloakroom by calling `proxy.append(Buffer.from[0x55])`

Cloakroom's internal buffer can be read as
a read-only list, by calling `proxy.getReadOnlyBuffer()`.

The buffer indexes are in reverse order (i.e. The last item is always
`0` and the first item is alway `proxy.getReadOnlyBuffer().length - 1`).

If you find an item you want to save a reference to, you can call
`const ticket = proxy.createTicket($index)` which issues a "ticket" to represent the item.

You can call `proxy.resolveTicket(ticket)`, which will figure out where the ticket is now and resolve the ticket to its value.

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

const ticket1 = proxy.createTicket(0); // Get a ticket for item zero, 65
console.log(proxy.resolveTicket(ticket1)); // { value: 65, offset 0 }
const ticket2 = proxy.createTicket(4); // Get a ticket for item four, 69
console.log(proxy.resolveTicket(ticket2)); // { value: 69, offset: 4 }

proxy.append(Buffer.from([101, 100, 99, 98, 97]));
console.log(proxy.getReadOnlyBuffer()); // [69, 68, 67, 66, 65, 101, 100, 99, 98, 97]
console.log(proxy.resolveTicket(ticket1)); // { value: 65, offset: 5 }
console.log(proxy.resolveTicket(ticket2)); // { value: 69, offset: 9 }

const ticket3 = proxy.createTicket(0); // Get a ticket for item zero, 97
console.log(proxy.resolveTicket(ticket3)); // { value: 97, offset: 0 }
const ticket4 = proxy.createTicket(9); // Get a ticket for item nine, 69
console.log(proxy.resolveTicket(ticket4)); // { value: 69, offset: 9 }

proxy.append(Buffer.from([0x78]));
console.log(proxy.getReadOnlyBuffer()); // [68, 67, 66, 65, 101, 100, 99, 98, 97, 120]
console.log(proxy.resolveTicket(ticket1)); // { value: 65, offset: 6 }
console.log(proxy.resolveTicket(ticket2)); // null
console.log(proxy.resolveTicket(ticket3)); // { value: 97, offset: 1 }
console.log(proxy.resolveTicket(ticket4)); // null
```


## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/cloakroom-smart-buffer-proxy ‹master*› % yarn test                                                                                             
yarn run v1.13.0
$ jest --coverage
 PASS  __tests__/offset-roll-over.test.js
  ● Console

    console.log __tests__/offset-roll-over.test.js:5
      [0] Expecting ticket, 8, to resolve to, 120, actually: 120
    console.log __tests__/offset-roll-over.test.js:5
      [1] Expecting ticket, 7, to resolve to, 99, actually: 99
    console.log __tests__/offset-roll-over.test.js:5
      [2] Expecting ticket, 6, to resolve to, 84, actually: 84
    console.log __tests__/offset-roll-over.test.js:5
      [3] Expecting ticket, 5, to resolve to, 114, actually: 114
    console.log __tests__/offset-roll-over.test.js:5
      [4] Expecting ticket, 4, to resolve to, 117, actually: 117

 PASS  __tests__/proxy.test.js
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 proxy.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|

Test Suites: 2 passed, 2 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        2.568s
Ran all test suites.
✨  Done in 3.58s.
```

### Build

```bash
/cloakroom-smart-buffer-proxy ‹master*› % yarn build
/cloakroom-smart-buffer-proxy ‹master*› % ls lib
proxy        proxy.js     proxy.js.map
```

### Deploy

`deploy.sh` automatically bumps the patch version, commits and pushes to git, creates a new tag and then
publishes to NPM.

```bash
/cloakroom-smart-buffer-proxy ‹master› % ./publish.sh                                                                                           
Preparing release...
On branch master
nothing to commit, working tree clean
Counting objects: 4, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 415 bytes | 415.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To github.com:spacekitcat/cloakroom-smart-buffer-proxy.git
 * [new tag]         v1.3.24 -> v1.3.24
npm WARN prepublish-on-install As of npm@5, `prepublish` scripts are deprecated.
npm WARN prepublish-on-install Use `prepare` for build steps and `prepublishOnly` for upload-only.
npm WARN prepublish-on-install See the deprecation note in `npm help scripts` for more information.

> cloakroom-smart-buffer-proxy@1.3.24 prepublish .
> npm run build


> cloakroom-smart-buffer-proxy@1.3.24 prebuild /Users/burtol86/lisa-workspace/cloakroom-smart-buffer-proxy
> babel src --out-dir lib --source-maps

Successfully compiled 1 file with Babel.

> cloakroom-smart-buffer-proxy@1.3.24 build /Users/burtol86/lisa-workspace/cloakroom-smart-buffer-proxy
> npm run test


> cloakroom-smart-buffer-proxy@1.3.24 test /Users/burtol86/lisa-workspace/cloakroom-smart-buffer-proxy
> jest --coverage

 PASS  __tests__/offset-roll-over.test.js
  ● Console

    console.log __tests__/offset-roll-over.test.js:5
      [0] Expecting ticket, 8, to resolve to, 106, actually: 106
    console.log __tests__/offset-roll-over.test.js:5
      [1] Expecting ticket, 7, to resolve to, 71, actually: 71
    console.log __tests__/offset-roll-over.test.js:5
      [2] Expecting ticket, 6, to resolve to, 68, actually: 68
    console.log __tests__/offset-roll-over.test.js:5
      [3] Expecting ticket, 5, to resolve to, 90, actually: 90
    console.log __tests__/offset-roll-over.test.js:5
      [4] Expecting ticket, 4, to resolve to, 69, actually: 69

 PASS  __tests__/proxy.test.js
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 proxy.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|

Test Suites: 2 passed, 2 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        1.953s
Ran all test suites.
npm notice 
npm notice 📦  cloakroom-smart-buffer-proxy@1.3.24
npm notice === Tarball Contents === 
npm notice 794B  package.json          
npm notice 77B   index.js              
npm notice 6.7kB README.md             
npm notice 1.3kB lib/proxy.js          
npm notice 2.8kB lib/proxy.js.map      
npm notice 1.3kB lib/proxy/proxy.js    
npm notice 2.7kB lib/proxy/proxy.js.map
npm notice === Tarball Details === 
npm notice name:          cloakroom-smart-buffer-proxy            
npm notice version:       1.3.24                                  
npm notice package size:  3.7 kB                                  
npm notice unpacked size: 15.7 kB                                 
npm notice shasum:        825ff519b03fe2b388ff2dd649a7b205ff40a8b2
npm notice integrity:     sha512-uAa6feZ45/X5F[...]kkxXDQdfxvR/Q==
npm notice total files:   7                                       
npm notice 
npm ERR! publish Failed PUT 401
There was an error while trying authentication due to OTP (One-Time-Password).
The One-Time-Password is generated via applications like Authy or
Google Authenticator, for more information see:
https://docs.npmjs.com/getting-started/using-two-factor-authentication
Enter OTP: 596027
+ cloakroom-smart-buffer-proxy@1.3.24
```
