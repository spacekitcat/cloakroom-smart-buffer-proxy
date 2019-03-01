import Proxy from '../../src/proxy/proxy';

describe('The `Proxy` class', () => {

  describe('when the class is instantiated', () => {
    it('should return the expected result', () => {
      expect(new Proxy().getReadOnlyBuffer()).toMatchObject(Buffer.from([]));
    });
  });

  describe('The `getReadOnlyBuffer` method', () => {
    describe('when the `Proxy` instance is instantiated', () => {
      it('should return an empty buffer object', () => {
        expect(new Proxy().getReadOnlyBuffer()).toMatchObject(Buffer.from([]));
      });
    });

    describe('when the `Proxy` instance has received content', () => {
      it('should return the expected contents', () => {
        const expecteBufferContents = [0x41, 0x43, 0x49, 0x44];
        const proxy = new Proxy();
        proxy.append(Buffer.from(expecteBufferContents));
        expect(proxy.getReadOnlyBuffer()).toMatchObject(expecteBufferContents);
      });
    });

    describe('when the `Proxy` instance has received two lots of content', () => {
      it('should return the expected contents', () => {
        const expecteBufferContentsOne = [0x41, 0x43, 0x49, 0x44];
        const expecteBufferContentsTwo = [0x55, 0x60, 0x65, 0x70];
        const proxy = new Proxy();
        proxy.append(Buffer.from(expecteBufferContentsOne));
        proxy.append(Buffer.from(expecteBufferContentsTwo));
        expect(proxy.getReadOnlyBuffer()).toMatchObject(expecteBufferContentsOne.concat(expecteBufferContentsTwo));
      });
    });

    describe('when the client code attempts write operations against the returned buffer', () => {
      it('should throw an exception', () => {
        const returnedBufferRef = new Proxy().getReadOnlyBuffer();
        expect(() => returnedBufferRef.push('a')).toThrow();
      });
    });
  });

  describe('The `getCloakroomTicket` method', () => {
    it('should return a ticket with the expected id', () => {
      const expecteBufferContents = [0x41, 0x43, 0x49, 0x44];
      const proxy = new Proxy();
      proxy.append(Buffer.from(expecteBufferContents));
      const clockroomTicket = proxy.getClockroomTicket(proxy.getReadOnlyBuffer(), 0);
      
      expect(clockroomTicket).toMatchObject({id: 0x44});
    });
  });
});
