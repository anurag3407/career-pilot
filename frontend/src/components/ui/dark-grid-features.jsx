import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Briefcase, BarChart3, Users, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";

const items = [
    {
        title: "Advanced Search",
        icon: Search,
        desc: "Filter by salary, location, company size, and more. Find your perfect role with precision targeting.",
    },
    {
        title: "Application Tracking",
        icon: Briefcase,
        desc: "Track every application status in one dashboard. Never lose sight of your opportunities.",
    },
    {
        title: "Analytics & Insights",
        icon: BarChart3,
        desc: "Visualize your job search progress and patterns. Make data-driven decisions for your career.",
    },
    {
        title: "Community",
        icon: Users,
        desc: "Connect with other job seekers and share tips. Learn from success stories and grow together.",
    },
    {
        title: "Multiple Resumes",
        icon: FileText,
        desc: "Create role-specific resume versions. Tailor your experience for every opportunity.",
    },
    {
        title: "Quick Apply",
        icon: Zap,
        badge: "New",
        desc: "Apply to multiple jobs with one click. Maximize your reach with minimal effort.",
    },
];

export default function AdditionalFeatures() {
    return (
        <div className="w-full bg-transparent">
            <div className="mx-auto max-w-7xl px-4 py-20">
                <p className="text-xs font-black tracking-[0.2em] text-primary uppercase mb-4 opacity-70">[ Capabilities ]</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-12">
                    Tools that fit your needs
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ title, icon: Icon, desc, badge }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card
                                className="group relative overflow-hidden border-border bg-card/50 backdrop-blur-sm p-0 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 rounded-[2rem]"
                            >
                                <CardHeader className="relative z-10 flex flex-row items-start gap-4 p-8">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/50 text-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-2xl font-black text-foreground">{title}</CardTitle>
                                            {badge && (
                                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                                                    {badge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 px-8 pb-8 text-base text-muted-foreground font-medium leading-relaxed">
                                    {desc}
                                </CardContent>
                                
                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}