import { workerData, parentPort } from 'worker_threads';
import pdfParse from 'pdf-parse';

try {
  const data = await pdfParse(Buffer.from(workerData.buffer));
  parentPort.postMessage({
    success: true,
    text: data.text,
    numpages: data.numpages,
    info: data.info
  });
} catch (err) {
  parentPort.postMessage({ success: false, error: err.message });
}