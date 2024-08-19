"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const fastify = (0, fastify_1.default)({ logger: true });
const prisma = new client_1.PrismaClient();
// PreHandler hook to add `user` property to the request
fastify.addHook('preHandler', async (request, reply) => {
    // Simulate user retrieval from a session or token
    request.user = { id: 1 }; // Replace with actual user extraction logic
});
fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.create({ data: { email, password } });
    return reply.send({ user });
});
fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
        return reply.send({ user });
    }
    return reply.status(401).send({ error: 'Invalid credentials' });
});
fastify.get('/accounts', async (request, reply) => {
    var _a;
    const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
    const accounts = await prisma.paymentAccount.findMany({ where: { userId } });
    return reply.send({ accounts });
});
fastify.get('/transactions', async (request, reply) => {
    const { accountId } = request.query;
    const transactions = await prisma.paymentHistory.findMany({ where: { accountId: Number(accountId) } });
    return reply.send({ transactions });
});
fastify.listen(3002, (err, address) => {
    if (err)
        throw err;
    fastify.log.info(`server listening on ${address}`);
});
//# sourceMappingURL=accountManager.js.map