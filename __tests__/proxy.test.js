import Proxy from '../src/proxy';

describe('The `Proxy` class', () => {

  describe('when the class is instantiated', () => {
    it('should return the expected result', () => {
      expect(new Proxy().getReadOnlyBuffer()).toMatchObject(Buffer.from([]));
    });

    it('should set the internal maximum size', () => {
      expect(new Proxy().getMaximumSize()).toBe(32000);
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

    describe('when the `Proxy` instance has received two lots of contents that overflow the buffer size', () => {
      it('should return the expected contents', () => {
        const expecteBufferContentsOne = [0x41, 0x43, 0x49];
        const expecteBufferContentsTwo = [0x55, 0x60, 0x65];
        const proxy = new Proxy(4);
        proxy.append(Buffer.from(expecteBufferContentsOne));
        proxy.append(Buffer.from(expecteBufferContentsTwo));
        expect(proxy.getReadOnlyBuffer()).toMatchObject([0x49, 0x55, 0x60, 0x65]);
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
        const clockroomTicket = proxy.getCloakroomTicket(0);
        
        expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(0x44);
      });
    });

    describe('when the `Proxy` instance has received two lots of content', () => {
      describe('unbalanced append', () => {
        it('should return a ticket with the expected id (0)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x31, 0x23, 0x19, expectedElementValue];
          const expecteBufferContentTwo = [0x71, 0x63];
          const proxy = new Proxy(5);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a ticket with the expected id (1)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x31, 0x23, expectedElementValue, 0x19];
          const expecteBufferContentTwo = [0x71, 0x63];
          const proxy = new Proxy(5);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(1);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a ticket with the expected id (2)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x31, expectedElementValue, 0x23, 0x19];
          const expecteBufferContentTwo = [0x71, 0x63];
          const proxy = new Proxy(5);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a ticket with the expected id (3), expired', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [expectedElementValue, 0x31, 0x23, 0x19];
          const expecteBufferContentTwo = [0x71, 0x63];
          const proxy = new Proxy(5);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(null);
        });
      });

      describe('balanced append', () => {
        it('should return a ticket with the expected id (0)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x41, 0x43, 0x49, expectedElementValue];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, 0x54];
          const proxy = new Proxy(7);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a ticket with the expected id (1)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x41, 0x43, expectedElementValue, 0x49];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, 0x54];
          const proxy = new Proxy(7);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(1);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a ticket with the expected id (2)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [0x41, expectedElementValue, 0x43, 0x49];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, 0x54];
          const proxy = new Proxy(7);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(expectedElementValue);
        });

        it('should return a null (3)', () => {
          const expectedElementValue = 0xFF;
          const expecteBufferContentOne = [expectedElementValue, 0x41, 0x43, 0x49];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, 0x54];
          const proxy = new Proxy(7);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentTwo));
        
          expect(proxy.readCloakroomTicket(clockroomTicket)).toBe(null);
        });
      });
    });

    describe('when the `Proxy` instance has received three lots of content', () => {
      describe('unbalanced append', () => {
        it('should return a ticket with the expected id (0)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, 0x43, 0x49, expectedElementValue1];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, expectedElementValue2];
          const expecteBufferContentThree = [0x51, 0x53];
          const proxy = new Proxy(8);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(expectedElementValue1);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (1)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, 0x43, expectedElementValue1, 0x49];
          const expecteBufferContentTwo = [0x51, expectedElementValue2, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53];
          const proxy = new Proxy(8);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(1);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(expectedElementValue1);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (2)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, expectedElementValue1, 0x43, 0x49];
          const expecteBufferContentTwo = [0x51, expectedElementValue2, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53];
          const proxy = new Proxy(8);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (3)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [expectedElementValue1, 0x41, 0x43, 0x49];
          const expecteBufferContentTwo = [expectedElementValue2, 0x51, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53];
          const proxy = new Proxy(8);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (4)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [expectedElementValue1, 0x41, 0x43, expectedElementValue2];
          const expecteBufferContentTwo = [0x49, 0x51, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53];
          const proxy = new Proxy(8);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(4);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(4);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });
      });

      describe('balanced append', () => {
        it('should return a ticket with the expected id (0)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, 0x43, 0x49, expectedElementValue1];
          const expecteBufferContentTwo = [0x51, 0x53, 0x59, expectedElementValue2];
          const expecteBufferContentThree = [0x51, 0x53, 0x49, 0x11];
          const proxy = new Proxy(10);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(0);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(expectedElementValue1);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (1)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, 0x43, expectedElementValue1, 0x49];
          const expecteBufferContentTwo = [0x51, expectedElementValue2, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53, 0x49, 0x11];
          const proxy = new Proxy(10);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(1);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(expectedElementValue1);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (2)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [0x41, expectedElementValue1, 0x43, 0x49];
          const expecteBufferContentTwo = [0x51, expectedElementValue2, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53, 0x49, 0x11];
          const proxy = new Proxy(10);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(2);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (3)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [expectedElementValue1, 0x41, 0x43, 0x49];
          const expecteBufferContentTwo = [expectedElementValue2, 0x51, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53, 0x49, 0x11];
          const proxy = new Proxy(10);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(3);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });

        it('should return a ticket with the expected id (4)', () => {
          const expectedElementValue1 = 0xFF;
          const expectedElementValue2 = 0xFE;
          const expecteBufferContentOne = [expectedElementValue1, 0x41, 0x43, expectedElementValue2];
          const expecteBufferContentTwo = [0x49, 0x51, 0x53, 0x59];
          const expecteBufferContentThree = [0x51, 0x53, 0x49, 0x11];
          const proxy = new Proxy(10);

          proxy.append(Buffer.from(expecteBufferContentOne));
          const clockroomTicket1 = proxy.getCloakroomTicket(4);
          proxy.append(Buffer.from(expecteBufferContentTwo));
          const clockroomTicket2 = proxy.getCloakroomTicket(4);
          proxy.append(Buffer.from(expecteBufferContentThree));
        
          expect(proxy.readCloakroomTicket(clockroomTicket1)).toBe(null);
          expect(proxy.readCloakroomTicket(clockroomTicket2)).toBe(expectedElementValue2);
        });
      });
    });
  });
});
