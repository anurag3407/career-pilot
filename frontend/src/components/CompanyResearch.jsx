import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Briefcase, MapPin, DollarSign, Calendar,
  Globe, Users, Target, ShieldAlert, Sparkles,
  Award, Heart, Star, Newspaper, ChevronRight
} from 'lucide-react'
import { jobTrackerApi } from '../services/api'

export default function CompanyResearch({ companyName, industry = '', onClose }) {
  const [loading, setLoading] = useState(true)
  const [researchData, setResearchData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!companyName) return

    const loadResearch = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await jobTrackerApi.researchCompany(companyName, industry)
        if (response.success && response.data) {
          setResearchData(response.data)
        } else {
          throw new Error('Invalid response structure')
        }
      } catch (err) {
        console.error('Failed to load company research:', err)
        setError('Could not retrieve company details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadResearch()
  }, [companyName, industry])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Sidebar Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-lg h-full bg-background border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border bg-card/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{companyName}</h3>
                <p className="text-xs text-muted-foreground">{industry || 'Company Research'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Gathering intelligence on {companyName}...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Research Failed</p>
                  <p className="text-xs mt-0.5 opacity-80">{error}</p>
                </div>
              </div>
            ) : researchData ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* AI Overview */}
                <div className="bg-card/45 border border-border rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-3 right-3 text-primary/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> AI Company Overview
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{researchData.overview}</p>
                </div>

                {/* Company Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Size */}
                  <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-start gap-3">
                    <Users className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Employee Count</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{researchData.size}</p>
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-start gap-3">
                    <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Industry Sector</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-1">{researchData.industry}</p>
                    </div>
                  </div>

                  {/* Funding */}
                  <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-start gap-3 col-span-2">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Funding Status</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{researchData.funding}</p>
                    </div>
                  </div>
                </div>

                {/* Glassdoor Ratings */}
                <div className="bg-card/45 border border-border rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400" /> Employee &amp; Glassdoor Sentiment
                  </h4>
                  
                  {/* Overall score */}
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-border">
                    <div className="text-4xl font-extrabold text-foreground">{researchData.glassdoorRating}</div>
                    <div>
                      <div className="flex items-center gap-0.5 text-yellow-400 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(researchData.glassdoorRating) ? 'fill-current' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Average overall employer rating</p>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  {researchData.glassdoorBreakdown && (
                    <div className="space-y-3.5">
                      {/* Work Life Balance */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-muted-foreground">Work-Life Balance</span>
                          <span className="text-foreground">{researchData.glassdoorBreakdown.workLifeBalance} / 5.0</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(researchData.glassdoorBreakdown.workLifeBalance / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Culture & Values */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-muted-foreground">Culture &amp; Values</span>
                          <span className="text-foreground">{researchData.glassdoorBreakdown.cultureValues} / 5.0</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(researchData.glassdoorBreakdown.cultureValues / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Career Opportunities */}
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-muted-foreground">Career Opportunities</span>
                          <span className="text-foreground">{researchData.glassdoorBreakdown.careerOpportunities} / 5.0</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(researchData.glassdoorBreakdown.careerOpportunities / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Culture Insights */}
                <div className="bg-card/45 border border-border rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" /> Work Culture &amp; Environment
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 border border-border rounded-lg p-3">
                    {researchData.culture}
                  </p>
                </div>

                {/* Recent News */}
                {researchData.recentNews?.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Newspaper className="w-4 h-4 text-sky-400" /> Recent News &amp; Milestones
                    </h4>
                    <div className="space-y-3">
                      {researchData.recentNews.map((news, i) => (
                        <div
                          key={i}
                          className="group p-4 bg-muted/10 border border-border hover:border-primary/30 rounded-xl transition flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                              {news.source}
                            </span>
                            <span className="text-xs text-muted-foreground">{news.date}</span>
                          </div>
                          <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition line-clamp-2 leading-snug">
                            {news.title}
                          </h5>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{news.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
