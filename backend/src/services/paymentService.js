import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

const getRazorpay = () => {
    if (razorpayInstance) return razorpayInstance;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Razorpay key_id and key_secret are required in production');
        }
        console.warn('⚠️ Razorpay credentials missing. Using dummy credentials for startup.');
    }
    
    razorpayInstance = new Razorpay({
        key_id: keyId || 'dummy_key',
        key_secret: keySecret || 'dummy_secret'
    });
    return razorpayInstance;
};

const razorpay = new Proxy({}, {
    get: (target, prop) => {
        const instance = getRazorpay();
        const value = instance[prop];
        if (typeof value === 'function') {
            return value.bind(instance);
        }
        return value;
    }
});

/**
 * Create a Razorpay order for escrow payment
 * @param {number} amount - Amount in INR (will be converted to paise)
 * @param {string} receipt - Unique receipt ID for tracking
 * @param {object} notes - Additional metadata
 * @returns {Promise<object>} Razorpay order object
 */
export const createOrder = async (amount, receipt, notes = {}) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
    }
    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: receipt,
        notes: notes,
        payment_capture: 1 // Auto-capture payment
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log('📦 Razorpay order created:', order.id);
        return order;
    } catch (error) {
        console.error('❌ Failed to create Razorpay order:', error);
        throw new Error(`Failed to create payment order: ${error.message}`);
    }
};

/**
 * Verify payment signature from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} Whether the signature is valid
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.warn('⚠️ Cannot verify payment signature: RAZORPAY_KEY_SECRET is not configured.');
        return false;
    }
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    try {
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        const providedBuffer = Buffer.from(signature, 'hex');

        if (expectedBuffer.length !== providedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    } catch {
        return false;
    }
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<object>} Order details
 */
export const getOrder = async (orderId) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
    }
    try {
        return await razorpay.orders.fetch(orderId);
    } catch (error) {
        console.error('❌ Failed to fetch order:', error);
        throw new Error(`Failed to fetch order: ${error.message}`);
    }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<object>} Payment details
 */
export const getPayment = async (paymentId) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
    }
    try {
        return await razorpay.payments.fetch(paymentId);
    } catch (error) {
        console.error('❌ Failed to fetch payment:', error);
        throw new Error(`Failed to fetch payment: ${error.message}`);
    }
};

export default razorpay;
