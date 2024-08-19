import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

interface RegisterRequestBody {
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}


declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: number };
  }
}


fastify.addHook('preHandler', async (request, reply) => {
  // Simulate user retrieval from a session or token
  request.user = { id: 1 }; // Replace with actual user extraction logic
});

fastify.post('/register', async (request: FastifyRequest<{ Body: RegisterRequestBody }>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.create({ data: { email, password } });
    return reply.send({ user });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Registration failed' });
  }
});

fastify.post('/login', async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
      return reply.send({ user });
    }
    return reply.status(401).send({ error: 'Invalid credentials' });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Login failed' });
  }
});

fastify.get('/accounts', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const accounts = await prisma.paymentAccount.findMany({ where: { userId } });
    return reply.send({ accounts });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Failed to retrieve accounts' });
  }
});

fastify.get('/transactions', async (request: FastifyRequest<{ Querystring: { accountId: string } }>, reply: FastifyReply) => {
  try {
    const { accountId } = request.query;
    const transactions = await prisma.paymentHistory.findMany({ where: { accountId: Number(accountId) } });
    return reply.send({ transactions });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Failed to retrieve transactions' });
  }
});

fastify.listen(3001, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});