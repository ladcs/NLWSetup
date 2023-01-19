import cors from '@fastify/cors';
import { app } from './lib/'
import { routes } from './route/routes';

const PORT = 3333;

app.register(cors);
app.register(routes)

app.listen({
  port: PORT,
}).then(() => {
  console.log(`server in port: ${PORT}`);
});