import express from 'express';
import { createHash, timingSafeEqual } from 'crypto';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import redisManager from '../config/redis.js';

const router = express.Router();

const BULL_BOARD_BASE_PATH = '/api/admin/queues';
const QUEUE_NAMES = ['job-alerts', 'weekly-digests'];

const isBullBoardEnabled = () => process.env.BULL_BOARD_ENABLED === 'true';

const safeCompare = (value, expected) => {
  const hash = (input) => createHash('sha256').update(input || '').digest();

  return timingSafeEqual(hash(value), hash(expected));
};

const bullBoardBasicAuth = (req, res, next) => {
  const expectedUsername = process.env.BULL_BOARD_USERNAME;
  const expectedPassword = process.env.BULL_BOARD_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return res
      .status(503)
      .send('BullMQ dashboard credentials are not configured.');
  }

  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="BullMQ Dashboard"');
    return res.status(401).send('Authentication required.');
  }

  const encodedCredentials = authHeader.replace('Basic ', '');
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString(
    'utf-8'
  );

  const [username, ...passwordParts] = decodedCredentials.split(':');
  const password = passwordParts.join(':');

  const isValidUsername = safeCompare(username, expectedUsername);
  const isValidPassword = safeCompare(password, expectedPassword);

  if (!isValidUsername || !isValidPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="BullMQ Dashboard"');
    return res.status(401).send('Invalid dashboard credentials.');
  }

  return next();
};

let bullBoardRouter = null;
let bullBoardError = null;

const initializeBullBoard = () => {
  if (!isBullBoardEnabled()) {
    bullBoardError = new Error('BullMQ dashboard is disabled.');
    return null;
  }


  try {
    const connection = redisManager.get('bull-board');

    if (!connection) {
      bullBoardError = new Error('Redis connection could not be created.');
      return null;
    }

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(BULL_BOARD_BASE_PATH);

    const queueAdapters = QUEUE_NAMES.map((queueName) => {
      const queue = new Queue(queueName, { connection });
      return new BullMQAdapter(queue);
    });

    createBullBoard({
      queues: queueAdapters,
      serverAdapter,
    });

    bullBoardError = null;
    return serverAdapter.getRouter();
  } catch (error) {
    bullBoardError = error;
    return null;
  }
};

bullBoardRouter = initializeBullBoard();

router.use(bullBoardBasicAuth);

router.get('/health', (req, res) => {
  res.json({
    enabled: isBullBoardEnabled(),
    ready: Boolean(bullBoardRouter),
    basePath: BULL_BOARD_BASE_PATH,
    queues: QUEUE_NAMES,
    error: bullBoardError?.message || null,
  });
});

router.use((req, res, next) => {
  if (!bullBoardRouter) {
    return res
      .status(503)
      .send(bullBoardError?.message || 'BullMQ dashboard is not available.');
  }

  return bullBoardRouter(req, res, next);
});

export default router;