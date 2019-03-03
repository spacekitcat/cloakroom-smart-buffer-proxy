import Proxy from '../src/proxy';
import randomstring from 'randomstring';

const verifyTicket = (proxy, ticketDescriptor, index) => {
  console.log(`[${index}] Expecting ticket, ${ticketDescriptor.ticket}, to resolve to, ${ticketDescriptor.expectedValue}, actually: ${proxy.readCloakroomTicket(ticketDescriptor.ticket)}`);
  expect(proxy.readCloakroomTicket(ticketDescriptor.ticket)).toBe(ticketDescriptor.expectedValue);
};

const saveTicket = (savedTickets, ticket, expectedValue) => {
  savedTickets.push({
      ticket: ticket,
      expectedValue: expectedValue
  })
};

const checkTicketListIntegrity = (savedTickets, proxy) => {
  savedTickets.forEach((ticketDescriptor, index) => {
      verifyTicket(proxy, ticketDescriptor, index)
  });
}

describe('Proxy offset rollover scenario', () => {
  it('should rollover', () => {
    const proxy = new Proxy(10);
    for (let i = 0; i < 20; ++i) {
      proxy.append(Buffer.from(randomstring.generate(1)));
    }

    const savedTickets = [];
    for (let i = 0; i < 5; ++i) {
      saveTicket(savedTickets, proxy.getCloakroomTicket(i), proxy.getReadOnlyBuffer()[proxy.getReadOnlyBuffer().length - i - 1]);
    }
    checkTicketListIntegrity(savedTickets, proxy);
  });
});