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

      it('should set the internal maximum size', () => {
        const expectedMaximumSize = 5;
        expect(new Proxy(expectedMaximumSize).getMaximumSize()).toBe(expectedMaximumSize);
      });

      it('should set the internal maximum size (alt data)', () => {
        const expectedMaximumSize = 9;
        expect(new Proxy(expectedMaximumSize).getMaximumSize()).toBe(expectedMaximumSize);
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
    describe('when the `Proxy` instance has received one lot of content', () => {

      it('should return a ticket with the expected id (start)', () => {
        const expecteBufferContents = [0x41, 0x43, 0x49, 0x44];
        const proxy = new Proxy();
        proxy.append(Buffer.from(expecteBufferContents));
        const clockroomTicket = proxy.getCloakroomTicket(proxy.getReadOnlyBuffer(), 0);
        
        expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(0x44);
      });
    });

    describe('when the `Proxy` instance has received two lots of content', () => {
      it('should return a ticket with the expected id (end)', () => {
        const expecteBufferContentOne = [0x41, 0x43, 0x49, 0x44];
        const expecteBufferContentTwo = [0x51, 0x53, 0x59, 0x54];
        const proxy = new Proxy();

        proxy.append(Buffer.from(expecteBufferContentOne));
        const clockroomTicket = proxy.getCloakroomTicket(proxy.getReadOnlyBuffer(), 1);
        proxy.append(Buffer.from(expecteBufferContentTwo));
        
        expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(0x49);
      });
    });
  });
});
