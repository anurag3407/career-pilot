const { Worker } = require('bullmq');
const analysisService = require('../services/analysisService');
const { startWorker } = require('../src/workers/analysisWorker');

jest.mock('bullmq');
jest.mock('../services/analysisService');
jest.mock('../config/redis', () => ({ quit: jest.fn() }));
jest.mock('../utils/logger');

describe('Analysis Worker', () => {
    let mockWorkerInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockWorkerInstance = {
            on: jest.fn(),
            close: jest.fn().mockResolvedValue(),
        };
        Worker.mockImplementation(() => mockWorkerInstance);
    });

    test('should create a worker with correct concurrency', async () => {
        process.env.WORKER_CONCURRENCY = '10';
        await startWorker();
        expect(Worker).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Function),
            expect.objectContaining({
                concurrency: 10,
                connection: expect.anything(),
            })
        );
    });

    test('should process repo-analysis job correctly', async () => {
        const job = {
            id: '123',
            data: {
                type: 'repo-analysis',
                payload: { repoUrl: 'https://github.com/test/repo' },
                webhookUrl: null,
            },
        };
        const expectedResult = { score: 85 };
        analysisService.analyzeRepository.mockResolvedValue(expectedResult);

        const handler = Worker.mock.calls[0][1];
        const result = await handler(job);

        expect(analysisService.analyzeRepository).toHaveBeenCalledWith(job.data.payload);
        expect(result).toEqual(expectedResult);
    });

    test('should throw error for unknown job type', async () => {
        const job = {
            id: '456',
            data: { type: 'unknown-type', payload: {} },
        };
        const handler = Worker.mock.calls[0][1];
        await expect(handler(job)).rejects.toThrow('Unknown job type: unknown-type');
    });

    test('should invoke webhook when provided', async () => {
        const sendWebhook = require('../utils/webhook').sendWebhook;
        sendWebhook.mockResolvedValue();
        const job = {
            id: '789',
            data: {
                type: 'resume-scoring',
                payload: { resumeText: 'test' },
                webhookUrl: 'https://example.com/callback',
            },
        };
        analysisService.scoreResume.mockResolvedValue({ score: 92 });

        const handler = Worker.mock.calls[0][1];
        await handler(job);
        expect(sendWebhook).toHaveBeenCalledWith('https://example.com/callback', {
            jobId: '789',
            status: 'completed',
            result: { score: 92 },
        });
    });

    afterAll(() => {
        delete process.env.WORKER_CONCURRENCY;
    });
});