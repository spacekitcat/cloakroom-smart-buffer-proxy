'use strict'

class Proxy {
  constructor(maximumSize = 32000) {
    this.offset = 0;
    this.internalCache = Buffer.from([]);
    this.maximumSize = maximumSize
  }

  append(appendContent) {
    this.internalCache = Buffer.concat([this.internalCache, appendContent]);
    const overflow = this.internalCache.length - this.maximumSize;
    if (overflow > 0) {
      this.offset -= overflow;
      this.internalCache = this.internalCache.slice(this.internalCache.length - this.maximumSize);
    }
  }

  _translate(index) {
    const flipped = this.internalCache.length - index - 2;
    return flipped;
  }

  getCloakroomTicket(cacheSnapshot, index) {
    return this._translate(index) + this.offset;
  }

  readCloakroomTicket(cloakRoomTicket) {
    const value = this.internalCache[cloakRoomTicket + this.offset + 1];
    return value ? value : null;
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
