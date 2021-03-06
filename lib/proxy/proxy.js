'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

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
      this.internalCache = this.internalCache.slice(
        this.internalCache.length - this.maximumSize
      );
    }
  }

  _invert(index) {
    const flipped = this.internalCache.length - index - 1;
    return flipped;
  }

  getCloakroomTicket(index) {
    return this._invert(index) + this.offset - 1;
  }

  readCloakroomTicket(cloakRoomTicket) {
    const value = this.internalCache[cloakRoomTicket + this.offset + 1];
    return value === null || value === undefined ? null : value;
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

var _default = Proxy;
exports.default = _default;
//# sourceMappingURL=proxy.js.map
