const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alumni-connect-hub';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

module.exports = {
	PORT,
	MONGO_URI,
	JWT_SECRET,
	RAZORPAY_KEY_ID,
	RAZORPAY_KEY_SECRET,
	RAZORPAY_WEBHOOK_SECRET,
	STRIPE_SECRET_KEY,
	STRIPE_WEBHOOK_SECRET,
	OPENAI_API_KEY,
};
