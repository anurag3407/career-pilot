import { Link } from "react-router-dom";
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
    Send,
    Laptop,
    Palette
} from "lucide-react";

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
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Interview Simulator Card */}
                    <FeatureCard index={0}>
                        <CardHeader
                            icon={Video}
                            title="AI Interview Simulator"
                            description="Practice with AI-powered mock interviews. Get real-time feedback on your answers, body language tips, and performance analytics."
                        />
                        <div className="relative mb-6 border-t border-dashed border-border sm:mb-0">
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/50 to-card" />
                            <div className="aspect-76/59 p-4 px-6">
                                <InterviewMockup />
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Fellowship Card */}
                    <FeatureCard index={1}>
                        <CardHeader
                            icon={Trophy}
                            title="Fellowship Challenges"
                            description="Students earn money solving real-world challenges. Companies find top talent and get work done."
                        />
                        <div className="p-6 pt-0">
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 bg-linear-to-r from-transparent via-transparent to-card dark:to-transparent" />
                                <FellowshipMockup />
                                <div className="px-6 pb-6">
                                    <Link to="/readme-generator" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                                    <FileText className="w-4 h-4" />
                                    Try AI README Generator →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

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

// Interview Mockup Visual
function InterviewMockup() {
    return (
        <div className="relative">
            {/* Video frame mockup */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-3">
                {/* Video area */}
                <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-card border-2 border-border flex items-center justify-center">
                            <Video className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    {/* AI indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-full"
                    >
                        <Brain className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-medium">AI Active</span>
                    </motion.div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-destructive" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Video className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-1 bg-linear-to-r from-primary to-secondary rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}

// Fellowship Mockup Visual
function FellowshipMockup() {
    const challenges = [
    { title: "Build AI Dashboard", company: "TechCorp", bounty: "$500", icon: "laptop", type: "Development" },
    { title: "Market Research Report", company: "StartupX", bounty: "$300", icon: "barchart", type: "Research" },
    { title: "UI Redesign", company: "DesignCo", bounty: "$400", icon: "palette", type: "Design" },
];

    return (
        <div className="space-y-2">
            {/* Role selector */}
            <div className="flex gap-2 mb-3">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30"
                >
                    <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Student</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/30"
                >
                    <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Corporate</span>
                </motion.div>
            </div>

            {/* Challenge cards */}
            {challenges.map((challenge, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors dark:bg-zinc-800/80"
                >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center border" style={{backgroundColor: 'rgba(56,189,248,0.15)', borderColor: 'rgba(56,189,248,0.4)', boxShadow: '0 0 8px rgba(56,189,248,0.3)'}}>
    {challenge.icon === "laptop" && <Laptop className="w-5 h-5" style={{color: '#38BDF8'}} />}
    {challenge.icon === "barchart" && <BarChart3 className="w-5 h-5" style={{color: '#38BDF8'}} />}
    {challenge.icon === "palette" && <Palette className="w-5 h-5" style={{color: '#38BDF8'}} />}
</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">{challenge.company} • {challenge.type}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{borderColor: 'rgba(250,204,21,0.5)', backgroundColor: 'rgba(250,204,21,0.15)', boxShadow: '0 0 8px rgba(250,204,21,0.4)'}}>
                         <DollarSign className="w-3 h-3" style={{color: '#FACC15'}} />
                        <span className="text-xs font-semibold" style={{color: '#FACC15'}}>{challenge.bounty}</span>
</div>

                </motion.div>
            ))}
        </div>
    );
}

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
            <div className="bg-linear-to-b from-border to-transparent p-px rounded-2xl">
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