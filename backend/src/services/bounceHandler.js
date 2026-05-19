import User from "../models/User.model.js";
import NotificationLog from "../models/NotificationLog.model.js";

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

    await NotificationLog.updateMany(
      {
        recipient: email,
      },
      {
        emailStatus: "bounced",
        errorMessage: reason,
      }
    );

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