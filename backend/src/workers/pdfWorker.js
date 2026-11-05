import { Worker } from 'bullmq';
import { generatePDF, generatePDFFromHTML, closeSharedBrowser } from '../services/pdfGenerator.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

export function startPdfWorker() {
  const worker = new Worker(
    'pdf-render-queue',
    async (job) => {
      const { type, content, options } = job.data;
      if (type === 'html') {
        const buffer = await generatePDFFromHTML(content, options);
        return { bufferBase64: buffer.toString('base64'), size: buffer.length };
      }
      const buffer = await generatePDF(content, options);
      return { bufferBase64: buffer.toString('base64'), size: buffer.length };
    },
    {
      connection,
      concurrency: parseInt(process.env.PDF_WORKER_CONCURRENCY, 10) || 2,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ PDF Worker: Completed job ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ PDF Worker: Job ${job?.id} failed:`, err.message);
  });

  process.on('SIGTERM', async () => {
    await worker.close();
    await closeSharedBrowser();
  });

  return worker;
}

if (process.env.RUN_AS_WORKER === 'true') {
  console.log('🚀 Starting dedicated PDF Background Worker...');
  startPdfWorker();
}

export default startPdfWorker;
