export const createSSEStream = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const sendProgress = (value, message) => {
    sendEvent({ type: 'progress', value, message });
  };

  const sendChunk = (content, isFinal = false) => {
    sendEvent({ type: 'chunk', content, isFinal });
  };

  const sendError = (message) => {
    sendEvent({ type: 'error', message });
  };

  const sendDone = (metadata = {}) => {
    sendEvent({ type: 'done', ...metadata });
  };

  const endStream = () => {
    res.end();
  };

  return {
    sendEvent,
    sendProgress,
    sendChunk,
    sendError,
    sendDone,
    endStream
  };
};

export default { createSSEStream };