'use strict';

class Proxy {
  constructor(maximumSize = 32000) {
    this.offset = 0;
    this.internalCache = Buffer.from([]);
    this.maximumSize = maximumSize;
    this._updateReadOnlyBuffer();
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

    this._updateReadOnlyBuffer();
  }

  _updateReadOnlyBuffer() {
    this.readOnlyBuffer = Buffer.from(this.internalCache);
  }

  _translate(index) {
    const flipped = this.internalCache.length - index - 2;
    return flipped;
  }

  _resolveValue(ticketId) {
    const internalCacheArray = ticketId + this.offset + 1;
    const resolvedValue = this.internalCache[internalCacheArray];
    return resolvedValue ? resolvedValue : null;
  }

  createTicket(index) {
    const id = this._translate(index) + this.offset;
    return { id, value: this._resolveValue(id) };
  }

  resolveTicket(cloakRoomTicket) {
    const internalCacheArray = cloakRoomTicket.id + this.offset + 1;

    const value = this._resolveValue(cloakRoomTicket.id);
    if (value === null || value !== cloakRoomTicket.value) {
      return null;
    }

    const offset = this.internalCache.length - (internalCacheArray + 1);

    return { value, offset };
  }

  getMaximumSize() {
    return this.maximumSize;
  }

  getReadOnlyBuffer() {
    return this.readOnlyBuffer;
  }
}

export default Proxy;
