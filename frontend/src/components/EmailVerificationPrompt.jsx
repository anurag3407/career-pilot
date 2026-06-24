import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function EmailVerificationPrompt() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    try {
      setLoading(true);

      await sendEmailVerification(user);

      setMessage("Verification email sent successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  const checkVerification = async () => {
    try {
      await user.reload();

      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        setMessage("Email is still not verified.");
      }

    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center p-6 rounded-lg border">

        <h1 className="text-2xl font-bold mb-4">
          Verify your email
        </h1>

        <p className="mb-6">
          We sent a verification link to:
        </p>

        <strong>
          {user?.email}
        </strong>

        <div className="mt-6 flex flex-col gap-3">

          <button
            onClick={resendEmail}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </button>


          <button
            onClick={checkVerification}
          >
            I've verified, continue
          </button>

        </div>


        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
