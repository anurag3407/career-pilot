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
        <footer className="bg-muted dark:bg-muted py-12 border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Logo in circular container */}
                    <div className="mb-8 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative rounded-full bg-card p-4 border border-border shadow-lg group-hover:border-primary/50 transition-all duration-500 group-hover:scale-105">
                                <img src="/speed.png" alt="careerpilot" className="w-16 h-16 object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* Navigation links */}
                    <nav className="mb-8 flex flex-wrap justify-center gap-6 md:gap-10">
                        <a href="#" className="text-muted-foreground hover:text-primary font-black uppercase tracking-[0.15em] text-xs transition-colors">Home</a>
                        <a href="#features" className="text-muted-foreground hover:text-primary font-black uppercase tracking-[0.15em] text-xs transition-colors">Features</a>
                        <Link to="/jobs" className="text-muted-foreground hover:text-primary font-black uppercase tracking-[0.15em] text-xs transition-colors">Jobs</Link>
                        <Link to="/upload" className="text-muted-foreground hover:text-primary font-black uppercase tracking-[0.15em] text-xs transition-colors">Resume</Link>
                        <a href="#" className="text-muted-foreground hover:text-primary font-black uppercase tracking-[0.15em] text-xs transition-colors">Contact</a>
                    </nav>

                    {/* Social media buttons */}
                    <div className="mb-8 flex space-x-4 md:space-x-6">
                        {[
                            { Icon: Facebook, label: "Facebook" },
                            { Icon: Twitter, label: "Twitter" },
                            { Icon: Instagram, label: "Instagram" },
                            { Icon: Linkedin, label: "LinkedIn" }
                        ].map(({ Icon, label }) => (
                            <Button key={label} variant="outline" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                                <Icon className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="sr-only">{label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Newsletter subscription form */}
                    <div className="mb-10 w-full max-w-lg">
                        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
                            <div className="flex-grow">
                                <Label htmlFor="email" className="sr-only">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Join our newsletter"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 rounded-xl bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary font-medium px-5 shadow-sm"
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-md shadow-primary/20 transition-all duration-300">
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </form>
                        {subscribeError && (
                            <p className="mt-2 text-xs font-bold text-destructive uppercase tracking-wider">{subscribeError}</p>
                        )}
                        {subscribeSuccess && (
                            <p className="mt-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">{subscribeSuccess}</p>
                        )}
                    </div>

                    {/* Copyright */}
                    <div className="text-center pt-6 border-t border-border w-full max-w-4xl">
                        <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} careerpilot. Handcrafted for your success.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { StackedCircularFooter }
export default StackedCircularFooter