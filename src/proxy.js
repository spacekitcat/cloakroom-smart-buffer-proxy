'use strict';

class Proxy {
  constructor(maximumSize = 32000) {
    this.offset = 0;
    this.internalCache = Buffer.from([]);
    this.maximumSize = maximumSize;
  }

  append(appendContent) {
    this.internalCache = Buffer.concat([this.internalCache, appendContent]);
    const overflow = this.internalCache.length - this.maximumSize;
    if (overflow > 0) {
      this.offset -= overflow;
      this.offset = this.offset % this.maximumSize;
      this.internalCache = this.internalCache.slice(
        this.internalCache.length - this.maximumSize
      );
    }
  }

  _translate(index) {
    const flipped = this.internalCache.length - index - 2;
    return flipped;
  }

  createTicket(index) {
    return this._translate(index) + this.offset;
  }

  resolveTicket(cloakRoomTicket) {
    const internalCacheArray = cloakRoomTicket + this.offset + 1;
    const resolvedValue = this.internalCache[internalCacheArray];
    const value = resolvedValue ? resolvedValue : null;

    if (value === null) {
      return null;
    }

    const offset = this.internalCache.length - (internalCacheArray + 1);

    return { value, offset };
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
