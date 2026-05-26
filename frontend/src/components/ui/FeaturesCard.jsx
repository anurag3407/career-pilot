import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Video,
    GraduationCap,
    Building2,
    FileText,
    BarChart3,
    Briefcase,
    Bell,
    Mic,
    Brain,
    Trophy,
    DollarSign,
    Users,
    MessageSquare,
    Hash,
    Send
} from "lucide-react";
import InterviewSimulatorCard from "./InterviewSimulatorCard";
import FellowshipChallengesCard from "./FellowshipChallengesCard";

export default function FeaturesCards() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Powerful <span className="text-primary">Features</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to accelerate your career and land your dream job faster.
                    </p>
                </motion.div>

                {/* Main Feature Cards Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Interview Simulator Card - Premium Redesigned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0 }}
                    >
                        <InterviewSimulatorCard />
                    </motion.div>

                    {/* Fellowship Challenges Card - Premium Redesigned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="h-full flex flex-col">
                            <FellowshipChallengesCard />
                        </div>
                    </motion.div>

                    {/* Full Width Secondary Features Card */}
                    <FeatureCard className="p-6 lg:col-span-2" index={2}>
                        <p className="mx-auto my-6 max-w-lg text-balance text-center text-xl md:text-2xl font-semibold text-foreground">
                            Complete toolkit for your job search journey
                        </p>

                        <div className="flex justify-center gap-4 md:gap-6 overflow-hidden flex-wrap">
                            <CircularFeature
                                icon={FileText}
                                label="Resume Builder"
                                color="sky"
                            />
                            <CircularFeature
                                icon={BarChart3}
                                label="Resume Analyzer"
                                color="emerald"
                            />
                            <CircularFeature
                                icon={Briefcase}
                                label="Job Tracker"
                                color="amber"
                            />
                            <CircularFeature
                                icon={Bell}
                                label="Job Alerts"
                                color="violet"
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>

                {/* Community Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 mb-8"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Connect with <span className="text-secondary">Community</span>
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Join thousands of job seekers. Share tips, network, and grow together.
                    </p>
                </motion.div>

                <FeatureCard className="p-0 overflow-hidden" index={3}>
                    <div className="grid lg:grid-cols-5 gap-0">
                        {/* Left side - Channel list mockup */}
                        <div className="lg:col-span-2 bg-muted/30 border-r border-border p-4">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                                <Users className="w-5 h-5 text-secondary" />
                                <span className="text-foreground font-medium">Community Hub</span>
                            </div>
                            <CommunityChannelList />
                        </div>

                        {/* Right side - Chat preview */}
                        <div className="lg:col-span-3 p-4">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground font-medium">interview-prep</span>
                                <span className="text-xs text-muted-foreground ml-auto">32 online</span>
                            </div>
                            <CommunityChatPreview />
                        </div>
                    </div>
                </FeatureCard>
            </div>
        </section>
    );
}

// Feature Card with decorative corners
function FeatureCard({ children, className, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative rounded-none bg-card border border-border shadow-xl shadow-primary/5",
                className
            )}
        >
            <CardDecorator />
            {children}
        </motion.div>
    );
}

// Decorative corner elements
function CardDecorator() {
    return (
        <>
            <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-primary" />
            <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-primary" />
            <span className="absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-primary" />
            <span className="absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-primary" />
        </>
    );
}

// Card Header component
function CardHeader({ icon: Icon, title, description }) {
    return (
        <div className="p-6 pb-3">
            <div className="p-4">
                <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4 text-primary" />
                    {title}
                </span>
                <p className="mt-4 text-lg md:text-xl font-semibold text-foreground">{description}</p>
            </div>
        </div>
    );
}

// Interview Mockup Visual - DEPRECATED (Use InterviewSimulatorCard component instead)
// Community Channel List Mockup - DEPRECATED (Use FellowshipChallengesCard component instead)
// Community Chat Preview Mockup - DEPRECATED (Use FellowshipChallengesCard component instead)

// Circular Feature indicator
function CircularFeature({ icon: Icon, label, color, className }) {
    const colorClasses = {
        sky: "border-sky-500/50 bg-sky-500/10 text-sky-600 dark:text-sky-400",
        emerald: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        amber: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        violet: "border-violet-500/50 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={className}
        >
            <div className="bg-gradient-to-b from-border to-transparent p-px rounded-2xl">
                <div className="bg-card relative flex aspect-square w-fit items-center justify-center rounded-[15px] p-5">
                    <div className={cn(
                        "size-10 md:size-12 rounded-full border-2 flex items-center justify-center",
                        colorClasses[color]
                    )}>
                        <Icon className="size-5 md:size-6" />
                    </div>
                </div>
            </div>
            <span className="text-muted-foreground mt-2 block text-center text-xs md:text-sm font-medium">{label}</span>
        </motion.div>
    );
}

// Community Channel List Mockup
function CommunityChannelList() {
    const channels = [
        { name: "general", icon: "💬", members: 128, active: false },
        { name: "interview-prep", icon: "🎯", members: 89, active: true },
        { name: "resume-tips", icon: "📄", members: 67, active: false },
        { name: "networking", icon: "🤝", members: 45, active: false },
    ];

    return (
        <div className="space-y-1">
            {channels.map((channel, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                        channel.active
                            ? "bg-secondary/20 border border-secondary/30"
                            : "hover:bg-muted"
                    )}
                >
                    <Hash className={cn("w-4 h-4", channel.active ? "text-secondary" : "text-muted-foreground")} />
                    <span className={cn("text-sm flex-1 font-medium", channel.active ? "text-foreground" : "text-muted-foreground")}>
                        {channel.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{channel.members}</span>
                </motion.div>
            ))}
        </div>
    );
}

// Community Chat Preview Mockup
function CommunityChatPreview() {
    const messages = [
        {
            user: "Sarah K.",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
            message: "Just got an offer from Google! 🎉 Thanks everyone for the interview tips!",
            time: "2m ago",
        },
        {
            user: "Alex M.",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            message: "Congrats Sarah! 🙌 Can you share which resources helped most?",
            time: "1m ago",
        },
        {
            user: "Jordan P.",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            message: "The mock interview practice here was so helpful for system design rounds",
            time: "Just now",
        },
    ];

    return (
        <div className="space-y-3">
            {messages.map((msg, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.15 }}
                    className="flex items-start gap-3"
                >
                    <img
                        src={msg.image}
                        alt={msg.user}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground font-semibold">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{msg.message}</p>
                    </div>
                </motion.div>
            ))}

            {/* Message input mockup */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border"
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none pl-2"
                    disabled
                />
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center border border-secondary/30">
                    <Send className="w-4 h-4 text-secondary" />
                </div>
            </motion.div>
        </div>
    );
}