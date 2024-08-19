"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const fastify = (0, fastify_1.default)({ logger: true });
const prisma = new client_1.PrismaClient();
async function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing started for:', transaction);
        setTimeout(() => {
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 30000);
    });
}
fastify.post('/send', async (request, reply) => {
    const transaction = request.body;
    const processedTransaction = await processTransaction(transaction);
    await prisma.paymentHistory.create({
        data: Object.assign(Object.assign({}, processedTransaction), { status: 'completed' }),
    });
    return reply.send({ processedTransaction });
});
fastify.post('/withdraw', async (request, reply) => {
    const transaction = request.body;
    const processedTransaction = await processTransaction(transaction);
    await prisma.paymentHistory.create({
        data: Object.assign(Object.assign({}, processedTransaction), { status: 'completed' }),
    });
    return reply.send({ processedTransaction });
});
fastify.listen(3001, (err, address) => {
    if (err)
        throw err;
    fastify.log.info(`server listening on ${address}`);
});
//# sourceMappingURL=paymentManager.js.map