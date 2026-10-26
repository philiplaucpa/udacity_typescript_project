import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createContext } from './presentation/trpc/context';
import { appRouter } from './presentation/trpc/router';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(PORT, () => {
  console.log(`Dashy Analytics API running on http://localhost:${PORT}`);
});
