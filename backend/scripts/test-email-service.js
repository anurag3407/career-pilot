import axios from 'axios';
import 'dotenv/config';

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

console.log('Testing Email Service Configuration...');

// Avoid exposing sensitive configuration details
console.log(
    'API Key:',
    EMAIL_API_KEY ? 'Configured' : 'Not Set'
);

// Validate EMAIL_SERVICE_URL
if (!EMAIL_SERVICE_URL) {
    console.error('❌ EMAIL_SERVICE_URL is missing in .env');
    process.exit(1);
}

// Validate EMAIL_API_KEY
if (!EMAIL_API_KEY) {
    console.error('❌ EMAIL_API_KEY is missing in .env');
    process.exit(1);
}

// Validate URL format and protocol
let parsedUrl;

try {
    parsedUrl = new URL(EMAIL_SERVICE_URL);

    if (
        parsedUrl.protocol !== 'http:' &&
        parsedUrl.protocol !== 'https:'
    ) {
        console.error(
            '❌ EMAIL_SERVICE_URL must use http or https protocol'
        );
        process.exit(1);
    }

} catch {
    console.error('❌ EMAIL_SERVICE_URL is not a valid URL');
    process.exit(1);
}

const testHealth = async () => {
    try {

        console.log('\nTesting /api/health...');

        const response = await axios.get(
            `${EMAIL_SERVICE_URL}/api/health`,
            {
                timeout: 5000,
                headers: {
                    Authorization: `Bearer ${EMAIL_API_KEY}`,
                },
            }
        );

        console.log('✅ Health Check Passed:', response.status);

        return true;

    } catch (error) {

        if (axios.isAxiosError(error)) {

            // Timeout error
            if (error.code === 'ECONNABORTED') {

                console.error('❌ Request timed out');

            // Server responded with error status
            } else if (error.response) {

                console.error(
                    `❌ Service responded with status ${error.response.status}`
                );

                // Log only safe metadata
                console.error(
                    'Error Message:',
                    error.response.statusText || 'Unknown server error'
                );

            // No response received
            } else if (error.request) {

                console.error(
                    '❌ No response received from the email service'
                );

            // Axios setup/config issue
            } else {

                console.error(
                    '❌ Axios request setup failed:',
                    error.message
                );
            }

        } else {

            console.error('❌ Unexpected runtime error:', error);
        }

        return false;
    }
};

const run = async () => {

    const healthPassed = await testHealth();

    if (!healthPassed) {

        console.log(
            '\n❌ Service checks failed. Please verify deployment status and configuration.'
        );

        // Ensure CI/CD detects failure
        process.exitCode = 1;

        return;
    }

    console.log('\n✅ Email Service looks reachable!');
};

// Top-level async error handling
run().catch((error) => {

    console.error('❌ Fatal runtime error:', error);

    process.exit(1);
});