import { motion } from "framer-motion";

export default function ResumeAnalysisSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Top Score Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* ATS Score Card */}
                <div className="bg-background/50 border border-border rounded-2xl p-6 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full bg-muted animate-pulse mb-6" />

                    <div className="space-y-3 w-full flex flex-col items-center">
                        <div className="h-5 w-40 bg-muted rounded-lg animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="lg:col-span-2 bg-background/50 border border-border rounded-2xl p-6">
                    <div className="h-6 w-48 bg-muted rounded-lg animate-pulse mb-6" />

                    <div className="space-y-5">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                                </div>

                                <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-background/50 border border-border rounded-2xl p-6">
                <div className="h-6 w-52 bg-muted rounded-lg animate-pulse mb-4" />

                <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-11/12 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-9/12 animate-pulse" />
                </div>
            </div>

            {/* Strengths + Keywords */}
            <div className="grid lg:grid-cols-2 gap-6">
                {[1, 2].map((card) => (
                    <div
                        key={card}
                        className="bg-background/50 border border-border rounded-2xl p-6"
                    >
                        <div className="h-6 w-40 bg-muted rounded-lg animate-pulse mb-5" />

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-4 bg-muted rounded animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Improvements */}
            <div className="bg-background/50 border border-border rounded-2xl p-6">
                <div className="h-6 w-56 bg-muted rounded-lg animate-pulse mb-6" />

                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="border border-border rounded-xl p-4 space-y-3"
                        >
                            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-10/12 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
