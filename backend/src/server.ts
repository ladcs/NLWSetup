import Fastify from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";

const app = Fastify();
const prisma = new PrismaClient()

const PORT = 3333;

app.register(cors);

app.get('/hello', async () => {
  const habits = await prisma.habit.findMany()

  return habits;
});

app.listen({
  port: PORT,
}).then(() => {
  console.log(`server in port: ${PORT}`);
});