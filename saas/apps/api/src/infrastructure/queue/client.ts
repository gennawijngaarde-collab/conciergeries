import { Queue } from 'bullmq';
import { getRedis } from '../redis/client.js';

/**
 * BullMQ queue factory stub — wire job processors per domain later.
 */
export function createQueue(name: string): Queue {
  return new Queue(name, {
    connection: getRedis(),
  });
}
