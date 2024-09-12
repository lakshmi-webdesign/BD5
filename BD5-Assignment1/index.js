let express = require('express');
const { ticket } = require('./model/ticket.model');
const { agent } = require('./model/agent.model');
const { customer } = require('./model/customer.model');
const { ticketCustomer } = require('./model/ticketCustomer.model');
const { ticketAgent } = require('./model/ticketAgent.model');
const { sequelize } = require('./lib');
let app = express();
const PORT = 3000;

let agents = [
  { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
  { agentId: 2, name: 'Dave', email: 'dave@example.com' },
];

let customers = [
  { customerId: 1, name: 'Alice', email: 'alice@example.com' },
  { customerId: 2, name: 'Bob', email: 'bob@example.com' },
];

let tickets = [
  {
    ticketId: 1,
    title: 'Login Issue',
    description: 'Cannot login to account',
    status: 'open',
    priority: 1,
    customerId: 1,
    agentId: 1,
  },
  {
    ticketId: 2,
    title: 'Payment Failure',
    description: 'Payment not processed',
    status: 'closed',
    priority: 2,
    customerId: 2,
    agentId: 2,
  },
  {
    ticketId: 3,
    title: 'Bug Report',
    description: 'Found a bug in the system',
    status: 'open',
    priority: 3,
    customerId: 1,
    agentId: 1,
  },
];

let ticketCustomers = [
  { ticketId: tickets[0].ticketId, customerId: customers[0].customerId },
  { ticketId: tickets[2].ticketId, customerId: customers[0].customerId },
  { ticketId: tickets[1].ticketId, customerId: customers[1].customerId },
];

let ticketAgents = [
  { ticketId: tickets[0].ticketId, agentId: agents[0].agentId },
  { ticketId: tickets[2].ticketId, agentId: agents[0].agentId },
  { ticketId: tickets[1].ticketId, agentId: agents[1].agentId },
];

app.get('/seed_db', async (req, res) => {
  await sequelize.sync({ force: true });
  await agent.bulkCreate(agents);
  await customer.bulkCreate(customers);
  await ticket.bulkCreate(tickets);
  await ticketCustomer.bulkCreate(ticketCustomers);
  await ticketAgent.bulkCreate(ticketAgents);
  res.status(200).json({ message: 'Database seeded successfully' });
});

async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData;
  for (let cus of ticketCustomers) {
    customerData = await customer.findOne({
      where: { id: cus.customerId },
    });
  }

  return customerData;
}

async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({
    where: { ticketId },
  });

  let agentData;
  for (let cus of ticketAgents) {
    agentData = await agent.findOne({
      where: { id: cus.agentId },
    });
  }

  return agentData;
}

async function getTicketDetails(ticketData) {
  const customer = await getTicketCustomers(ticketData.id);
  const agent = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customer,
    agent,
  };
}

app.get('/tickets', async (req, res) => {
  try {
    let alltickets = await ticket.findAll();

    let ticketData = [];
    for (let tic of alltickets) {
      ticketData.push(await getTicketDetails(tic));
    }
    res.status(200).json({ tickets: ticketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tickets/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let data = await ticket.findOne({
      where: { id },
    });
    if (!data) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    let ticketDetails = await getTicketDetails(data);
    res.status(200).json({ ticket: ticketDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tickets/status/:status', async (req, res) => {
  try {
    let status = req.params.status;
    let data = await ticket.findAll({
      where: { status },
    });
    if (!data) {
      return res.status(404).json({ message: 'Tickets not found' });
    }
    let ticketData = [];
    for (let tic of data) {
      ticketData.push(await getTicketDetails(tic));
    }
    res.status(200).json({ tickets: ticketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tickets/sort-by-priority', async (req, res) => {
  try {
    let alltickets = await ticket.findAll();
    alltickets = alltickets.sort((a, b) => a.priority - b.priority);
    let ticketData = [];
    for (let tic of alltickets) {
      ticketData.push(await getTicketDetails(tic));
    }
    res.status(200).json({ tickets: ticketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tickets/new', async (req, res) => {
  try {
    let data = req.body;
    let newData = await ticket.create(data);
    let ticketData = await getTicketDetails(newData);
    res.status(200).json({ ticket: ticketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, (req, res) => {
  console.log('Connected to local host on port', PORT);
});
