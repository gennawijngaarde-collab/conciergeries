import 'dotenv/config';
import { createApp } from './app/createApp.js';
import pino from 'pino';

const logger = pino({ name: '@pms/api' });
const port = Number(process.env.PORT ?? 3001);

const app = createApp();

app.listen(port, () => {
  logger.info(`PMS API listening on http://localhost:${port}`);
  logger.info(`OpenAPI docs at http://localhost:${port}/docs`);
});
