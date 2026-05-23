import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '../config/firebase'
import { twoFactorApi } from '../services/api'

export default function LinkedInCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('Signing you in...')

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token')
            const error = searchParams.get('error')

            if (error) {
                const messages = {
                    linkedin_denied: 'LinkedIn sign-in was cancelled.',
                    linkedin_invalid_state: 'Invalid session. Please try again.',
                    linkedin_token_failed: 'Could not connect to LinkedIn. Please try again.',
                    linkedin_profile_failed: 'Could not fetch your LinkedIn profile. Please try again.',
                };
                toast.error(messages[error] || 'LinkedIn sign-in failed.')
                navigate('/login')
                return
            }

            if (!token) {
                toast.error('Something went wrong. Please try again.')
                navigate('/login')
                return
            }

            try {
                setStatus('Completing sign-in...')
                await signInWithCustomToken(auth, token)

                try {
                    const tfaStatus = await twoFactorApi.getStatus()
                    if (tfaStatus && tfaStatus.enabled) {
                        setStatus('Two-factor authentication required...')
                        toast.success('Two-factor authentication required')
                        navigate('/login?step=totp')
                        return
                    }
                } catch {
  // 2FA check failed — sign out for security
  await auth.signOut()
  toast.error('Authentication failed. Please try again.')
  navigate('/login')
  return
}

                toast.success('Signed in successfully!')
                navigate('/dashboard')
            } catch (err) {
                console.error('Custom token sign-in failed:', err);
                toast.error('Failed to sign in. Please try again.')
                navigate('/login')
            }
        }

        handleCallback()
    }, [])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">{status}</p>
            </div>
        </div>
    )
}
