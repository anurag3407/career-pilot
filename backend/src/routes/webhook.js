import express from 'express';
import { Webhook } from 'svix';
import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.model.js';
import { saveUserToAppwrite } from '../services/appwriteDataService.js';
import crypto from 'crypto';

const router = express.Router();

router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    const wh = new Webhook(SIGNING_SECRET);

    const payload = req.body;
    const headers = req.headers;

    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: 'Error: Missing Svix headers',
      });
    }

    let evt;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.log('Error verifying webhook:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook received: ${eventType} for User ID ${id}`);

    if (eventType === 'user.created') {
      const email = email_addresses?.[0]?.email_address;
      const name = username || `${first_name || ''} ${last_name || ''}`.trim() || email?.split('@')[0];

      try {
        let user = await User.findOne({ email });
        
        if (!user) {
          user = await User.create({
            email,
            username: name,
            password: crypto.randomBytes(32).toString('hex'), // Mongoose requires a password
          });
          console.log(`Created new user in MongoDB for ${email}`);
        }

        // We can also sync this user to Appwrite proactively
        await saveUserToAppwrite({
          uid: id,
          email,
          name,
          picture: image_url
        });
        
      } catch (err) {
        console.error('Error syncing user on user.created:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  })
);

export default router;
