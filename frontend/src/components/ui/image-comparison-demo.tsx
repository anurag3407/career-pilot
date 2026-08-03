import { ImageComparison } from "@/components/ui/image-comparison-slider";

export function ImageComparisonDemo() {
  return (
    <div className="w-full bg-gray-900 rounded-[40px] flex flex-col items-center justify-center font-sans p-8 md:p-12 mt-12 mb-12 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black pointer-events-none" />
        <div className="w-full text-center mb-10 relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Resume Before & After</h1>
            <p className="text-lg text-gray-400">Drag the slider to see how AI transforms your resume.</p>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto ring-1 ring-white/10 rounded-xl overflow-hidden shadow-2xl">
            <ImageComparison
                beforeImage="https://placehold.co/1200x1600/f1f5f9/64748b?text=Anurag+Mishra\n(Standard+Resume)"
                afterImage="https://placehold.co/1200x1600/3b82f6/ffffff?text=Anurag+Mishra\n(AI+Optimized+Resume)"
                altBefore="Anurag Mishra standard resume layout"
                altAfter="Anurag Mishra optimized and structured resume layout"
            />
        </div>
    </div>
  )
}
