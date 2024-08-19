import Fastify, { FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

interface Transaction {
  amount: number;
  timestamp: Date;
  toAddress: string;
  status: string;
  accountId: number;
}

async function processTransaction(transaction: Transaction): Promise<Transaction> {
  return new Promise((resolve, reject) => {
    console.log('Transaction processing started for:', transaction);

    setTimeout(() => {
      console.log('transaction processed for:', transaction);
      resolve(transaction);
    }, 30000);
  });
}

fastify.post('/send', async (request: FastifyRequest<{ Body: Transaction }>, reply) => {
  const transaction = request.body;
  const processedTransaction = await processTransaction(transaction);
  await prisma.paymentHistory.create({
    data: { ...processedTransaction, status: 'completed' },
  });
  return reply.send({ processedTransaction });
});

fastify.post('/withdraw', async (request: FastifyRequest<{ Body: Transaction }>, reply) => {
  const transaction = request.body;
  const processedTransaction = await processTransaction(transaction);
  await prisma.paymentHistory.create({
    data: { ...processedTransaction, status: 'completed' },
  });
  return reply.send({ processedTransaction });
});

fastify.listen(3002,'0.0.0.0', (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
