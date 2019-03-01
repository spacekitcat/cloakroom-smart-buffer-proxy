'use strict'

class Proxy {
  constructor(maximumSize = 1024) {
    this.offset = 0;
    this.internalCache = Buffer.from([]);
    this.maximumSize = maximumSize
  }

  append(appendContent) {
    this.internalCache = Buffer.concat([this.internalCache, appendContent]);
    console.log(this.internalCache);
  }

  getCloakroomTicket(cacheSnapshot, index) {
    return this.internalCache.length - index - 1;
  }

  readCloakroomTicket(cloakRoomTicket) {
    return (this.internalCache[cloakRoomTicket])
  }

  getMaximumSize() {
    return this.maximumSize;
  }

  getReadOnlyBuffer() {
    const readOnlyInternalCacheRef = [...this.internalCache];
    Object.freeze(readOnlyInternalCacheRef);
    return readOnlyInternalCacheRef;
  }
}

export default Proxy;
