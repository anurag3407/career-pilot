import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '../config/firebase'
import { SkeletonPage } from '../components/ui/Skeleton'

export default function LinkedInCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('Signing you in...')

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token')
            const isNew = searchParams.get('isNew') === 'true'
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

            if(!token) {
                toast.error('Something went wrong. Please try again.')
                navigate('/login')
                return
            }

            try {
                setStatus('Completing sign-in...')
                await signInWithCustomToken(auth, token)
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
    <div className="relative">
      <SkeletonPage width="max-w-3xl" rows={3} />
      <div className="absolute inset-x-0 top-8 text-center">
        <p className="text-muted-foreground text-sm">{status}</p>
      </div>
    </div>
  )
}
