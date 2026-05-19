import { useState } from "react"
import { Link } from "react-router-dom"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

function StackedCircularFooter() {
    const [email, setEmail] = useState("")
    const [subscribeError, setSubscribeError] = useState("")
    const [subscribeSuccess, setSubscribeSuccess] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubscribe = async (e) => {
        e.preventDefault()
        setSubscribeError("")
        setSubscribeSuccess("")

        const trimmed = email.trim()
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)

        if (!trimmed) {
            setSubscribeError("Please enter your email")
            return
        }

        if (!isValidEmail) {
            setSubscribeError("Please enter a valid email address")
            return
        }

        setIsSubmitting(true)
        try {
            await Promise.resolve()
            setSubscribeSuccess("Thanks for subscribing!")
            setEmail("")
        } catch (error) {
            setSubscribeError("Subscription failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <footer className="bg-black py-12 border-t border-zinc-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center">
                    {/* Logo in circular container */}
                    <div className="mb-8 rounded-full bg-zinc-900 p-2 border border-zinc-800">
                        <img src="/speed.png" alt="careerpilot" className="w-32 h-32 object-contain" />
                    </div>

                    {/* Navigation links */}
                    <nav className="mb-8 flex flex-wrap justify-center gap-6">
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Home</a>
                        <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
                        <Link to="/jobs" className="text-zinc-400 hover:text-white transition-colors">Jobs</Link>
                        <Link to="/upload" className="text-zinc-400 hover:text-white transition-colors">Resume</Link>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
                    </nav>

                    {/* Social media buttons */}
                    <div className="mb-8 flex space-x-4">
                        <Button variant="outline" size="icon" className="rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800">
                            <Facebook className="h-4 w-4" />
                            <span className="sr-only">Facebook</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800">
                            <Twitter className="h-4 w-4" />
                            <span className="sr-only">Twitter</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800">
                            <Instagram className="h-4 w-4" />
                            <span className="sr-only">Instagram</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                        </Button>
                    </div>

                    {/* Newsletter subscription form */}
                    <div className="mb-8 w-full max-w-md">
                        <form className="flex space-x-2" onSubmit={handleSubscribe}>
                            <div className="flex-grow">
                                <Label htmlFor="email" className="sr-only">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-full bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white">
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </form>
                        {subscribeError && (
                            <p className="mt-2 text-xs text-red-400">{subscribeError}</p>
                        )}
                        {subscribeSuccess && (
                            <p className="mt-2 text-xs text-emerald-400">{subscribeSuccess}</p>
                        )}
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-sm text-zinc-500">
                            © {new Date().getFullYear()} careerpilot. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { StackedCircularFooter }
export default StackedCircularFooter