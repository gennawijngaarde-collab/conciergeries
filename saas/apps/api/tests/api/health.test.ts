import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app/createApp.js';

describe('GET /health', () => {
  it('returns ok status', async () => {
    const app = createApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});
