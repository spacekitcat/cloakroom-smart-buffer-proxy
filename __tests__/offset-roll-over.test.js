import Proxy from '../src/proxy';
import randomstring from 'randomstring';

const verifyTicket = (proxy, ticketDescriptor, index) => {
  console.log(
    `[${index}] Expecting ticket '${ticketDescriptor.ticket}' to resolve to '${
      ticketDescriptor.expectedValue
    }', actually got: ${proxy.resolveTicket(ticketDescriptor.ticket)}`
  );
  expect(proxy.resolveTicket(ticketDescriptor.ticket).value).toBe(
    ticketDescriptor.expectedValue
  );
};

const saveTicket = (savedTickets, ticket, expectedValue) => {
  savedTickets.push({
    ticket: ticket,
    expectedValue: expectedValue
  });
};

const checkTicketListIntegrity = (savedTickets, proxy) => {
  savedTickets.forEach((ticketDescriptor, index) => {
    verifyTicket(proxy, ticketDescriptor, index);
  });
};

const checkTicketListInvalidated = (savedTickets, proxy) => {
  savedTickets.forEach((ticketDescriptor, index) => {
    console.log(
      `[${index}] Expecting ticket '${
        ticketDescriptor.ticket.id
      }' to resolve to 'null', actually got: ${proxy.resolveTicket(
        ticketDescriptor.ticket
      )}`
    );
    expect(proxy.resolveTicket(ticketDescriptor.ticket)).toBe(null);
  });
};

describe('Proxy offset rollover scenario', () => {
  it('should rollover', () => {
    const proxy = new Proxy(10);
    for (let i = 0; i < 20; ++i) {
      proxy.append(Buffer.from(randomstring.generate(1)));
    }

    let savedTickets = [];
    for (let i = 0; i < 5; ++i) {
      saveTicket(
        savedTickets,
        proxy.createTicket(i),
        proxy.getInternalBuffer()[proxy.getInternalBuffer().length - i - 1]
      );
    }
    checkTicketListIntegrity(savedTickets, proxy);

    for (let i = 0; i < 10; ++i) {
      proxy.append(Buffer.from(randomstring.generate(1)));
    }

    checkTicketListInvalidated(savedTickets, proxy);

    savedTickets = [];
    for (let i = 0; i < 5; ++i) {
      saveTicket(
        savedTickets,
        proxy.createTicket(i),
        proxy.getInternalBuffer()[proxy.getInternalBuffer().length - i - 1]
      );
    }
    checkTicketListIntegrity(savedTickets, proxy);

    for (let i = 0; i < 5; ++i) {
      saveTicket(
        savedTickets,
        proxy.createTicket(i),
        proxy.getInternalBuffer()[proxy.getInternalBuffer().length - i - 1]
      );
    }

    checkTicketListIntegrity(savedTickets, proxy);
  });
});
