'use strict'

class Proxy {
  constructor() {
    this.offset = 0;
    this.internalCache = Buffer.from([]);
  }

  append(appendContent) {
    console.log(appendContent);
    this.internalCache = Buffer.concat([this.internalCache, appendContent]);
  }

  getClockroomTicket() {
    return ({id: 0x44})
  }

  getReadOnlyBuffer() {
    const readOnlyInternalCacheRef = [...this.internalCache];
    Object.freeze(readOnlyInternalCacheRef);
    return readOnlyInternalCacheRef;
  }
}

export default Proxy;
