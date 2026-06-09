import User from "../models/User.model.js";
import NotificationLog from "../models/NotificationLog.model.js";
import JobAlert from "../models/JobAlert.model.js";
import admin from "../config/firebase.js";

export const handleBounceNotification = async ({
  email,
  reason = "Email bounced",
}) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.notificationPreferences.jobAlerts = false;

    await user.save();

    // Retrieve userId from JobAlert matching the email
    const jobAlert = await JobAlert.findOne({ userEmail: email });
    let userId = jobAlert?.userId;

    // Fallback: Retrieve from Firebase Admin if configured
    if (!userId) {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(email);
        userId = firebaseUser?.uid;
      } catch (fbError) {
        // Ignore if Firebase Admin is uninitialized or not configured
      }
    }

    // Fallback: If in development, default to 'dev-user' if email matches
    if (!userId && process.env.NODE_ENV === "development") {
      const devEmail = process.env.DEV_USER_EMAIL || "dev@example.com";
      if (email === devEmail) {
        userId = "dev-user";
      }
    }

    if (userId) {
      await NotificationLog.updateMany(
        {
          userId,
        },
        {
          emailStatus: "bounced",
          errorMessage: reason,
        }
      );
    }

    return {
      success: true,
      message: "Bounce processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};