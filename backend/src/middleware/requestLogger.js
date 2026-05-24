const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, path } = req;
        const { statusCode } = res;
        let statusColor = '\x1b[32m';
        if (statusCode >= 400) statusColor = '\x1b[33m';
        if (statusCode >= 500) statusColor = '\x1b[31m';
        console.log(`[${new Date().toISOString()}] ${method} ${path} ${statusColor}${statusCode}\x1b[0m - ${duration}ms`);
    });
    next();
};
export default requestLogger;
