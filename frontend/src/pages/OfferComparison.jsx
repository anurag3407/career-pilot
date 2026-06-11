import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, BadgeCheck, Building2, ChevronDown, CircleDollarSign, Globe2, Plus, RefreshCw, Trash2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import Card from '../components/Card'
import Select from '../components/Select'
import { Input } from '../components/ui/input'
import { ARRANGEMENT_OPTIONS, compareOffers, createOfferDraft, validateOfferDrafts } from '../utils/offerComparison'

const Motion = motion

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

function formatCurrencyCompact(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

function getArrangementLabel(value) {
  return ARRANGEMENT_OPTIONS.find((option) => option.value === value)?.label ?? 'Remote'
}

function getScoreTone(score) {
  if (score >= 85) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  if (score >= 70) return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
  if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
}

function createInitialOffers() {
  return [createOfferDraft(), createOfferDraft()]
}

export default function OfferComparison() {
  const [offers, setOffers] = useState(createInitialOffers)
  const [fieldErrors, setFieldErrors] = useState({})
  const [comparison, setComparison] = useState(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const hasVisibleComparison = Boolean(comparison?.offers?.length)

  const bestOffer = useMemo(() => {
    if (!comparison?.offers?.length) return null
    return comparison.offers.find((offer) => offer.id === comparison.bestOfferId) ?? comparison.offers[0]
  }, [comparison])

  const updateOffer = (id, field, value) => {
    setOffers((current) => current.map((offer) => (offer.id === id ? { ...offer, [field]: value } : offer)))
    setComparison(null)

    setFieldErrors((current) => {
      const nextErrors = { ...current }
      if (!nextErrors[id]) return current

      const updatedRowErrors = { ...nextErrors[id] }
      delete updatedRowErrors[field]

      if (Object.keys(updatedRowErrors).length === 0) {
        delete nextErrors[id]
      } else {
        nextErrors[id] = updatedRowErrors
      }

      return nextErrors
    })
  }

  const addOffer = () => {
    setOffers((current) => [...current, createOfferDraft()])
    setComparison(null)
  }

  const removeOffer = (id) => {
    setOffers((current) => (current.length > 2 ? current.filter((offer) => offer.id !== id) : current))
    setComparison(null)
    setFieldErrors((current) => {
      if (!current[id]) return current
      const nextErrors = { ...current }
      delete nextErrors[id]
      return nextErrors
    })
  }

  const handleReset = () => {
    setOffers(createInitialOffers())
    setFieldErrors({})
    setComparison(null)
    setSubmitAttempted(false)
  }

  const handleCompare = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (offers.length < 2) {
      toast.error('Add at least two offers to compare.')
      return
    }

    const validation = validateOfferDrafts(offers)
    setFieldErrors(validation.errors)

    if (!validation.isValid) {
      setComparison(null)
      toast.error('Please fix the highlighted fields before comparing.')
      return
    }

    const nextComparison = compareOffers(validation.offers)
    setComparison(nextComparison)

    if (nextComparison.bestOfferId) {
      const best = nextComparison.offers.find((offer) => offer.id === nextComparison.bestOfferId)
      if (best) {
        toast.success(`${best.companyName} is the current best offer.`)
      }
    }
  }

  const rowCountText = offers.length === 1 ? '1 offer ready' : `${offers.length} offers ready`

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <BarChart3 className="w-4 h-4" />
            Job Offer Comparison Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Compare offers with one scorecard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter compensation, benefits, location, and work arrangement details to see which offer delivers the strongest overall value.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
          >
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Offer details</h2>
                  <p className="text-sm text-muted-foreground">Fill in at least two complete offers to generate a comparison.</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  {rowCountText}
                </div>
              </div>

              <form onSubmit={handleCompare} className="space-y-5">
                {offers.map((offer, index) => {
                  const rowErrors = fieldErrors[offer.id] || {}
                  const hasRowErrors = Object.keys(rowErrors).length > 0

                  return (
                    <div
                      key={offer.id}
                      className={`rounded-3xl border p-5 sm:p-6 transition-colors ${hasRowErrors ? 'border-rose-500/40 bg-rose-500/5' : 'border-border bg-card/60'}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Offer {index + 1}</p>
                          <h3 className="text-lg font-semibold text-foreground">{offer.companyName.trim() || 'New offer'}</h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeOffer(offer.id)}
                          disabled={offers.length <= 2}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Company Name
                          </label>
                          <Input
                            value={offer.companyName}
                            onChange={(event) => updateOffer(offer.id, 'companyName', event.target.value)}
                            placeholder="Acme Inc."
                            className={rowErrors.companyName ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.companyName && <p className="text-sm text-rose-500">{rowErrors.companyName}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Base Salary</label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={offer.baseSalary}
                            onChange={(event) => updateOffer(offer.id, 'baseSalary', event.target.value)}
                            placeholder="150000"
                            className={rowErrors.baseSalary ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.baseSalary && <p className="text-sm text-rose-500">{rowErrors.baseSalary}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Bonus</label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={offer.bonus}
                            onChange={(event) => updateOffer(offer.id, 'bonus', event.target.value)}
                            placeholder="15000"
                            className={rowErrors.bonus ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.bonus && <p className="text-sm text-rose-500">{rowErrors.bonus}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Stock / Equity</label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={offer.stockEquity}
                            onChange={(event) => updateOffer(offer.id, 'stockEquity', event.target.value)}
                            placeholder="25000"
                            className={rowErrors.stockEquity ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.stockEquity && <p className="text-sm text-rose-500">{rowErrors.stockEquity}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Benefits</label>
                          <Input
                            type="number"
                            min="0"
                            step="500"
                            value={offer.benefits}
                            onChange={(event) => updateOffer(offer.id, 'benefits', event.target.value)}
                            placeholder="12000"
                            className={rowErrors.benefits ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.benefits && <p className="text-sm text-rose-500">{rowErrors.benefits}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-primary" />
                            Location
                          </label>
                          <Input
                            value={offer.location}
                            onChange={(event) => updateOffer(offer.id, 'location', event.target.value)}
                            placeholder="New York, NY"
                            className={rowErrors.location ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          {rowErrors.location && <p className="text-sm text-rose-500">{rowErrors.location}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Cost of Living Adjustment (%)</label>
                          <Input
                            type="number"
                            step="1"
                            value={offer.costOfLivingAdjustment}
                            onChange={(event) => updateOffer(offer.id, 'costOfLivingAdjustment', event.target.value)}
                            placeholder="12"
                            className={rowErrors.costOfLivingAdjustment ? 'border-rose-500 focus-visible:ring-rose-500/30' : ''}
                          />
                          <p className="text-xs text-muted-foreground">Positive values mean a higher cost of living. Negative values mean a cheaper market.</p>
                          {rowErrors.costOfLivingAdjustment && <p className="text-sm text-rose-500">{rowErrors.costOfLivingAdjustment}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <CircleDollarSign className="w-4 h-4 text-primary" />
                            Remote / Hybrid / Onsite
                          </label>
                          <Select
                            value={offer.workArrangement}
                            onChange={(value) => updateOffer(offer.id, 'workArrangement', value)}
                            options={ARRANGEMENT_OPTIONS}
                            className={rowErrors.workArrangement ? 'border-rose-500' : ''}
                          />
                          {rowErrors.workArrangement && <p className="text-sm text-rose-500">{rowErrors.workArrangement}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="button" variant="secondary" size="default" onClick={addOffer} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Add Another Offer
                  </Button>
                  <Button type="button" variant="outline" size="default" onClick={handleReset} className="w-full sm:w-auto">
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button type="submit" variant="primary" size="default" className="w-full sm:ml-auto sm:w-auto">
                    <TrendingUp className="w-4 h-4" />
                    Compare Offers
                  </Button>
                </div>

                {submitAttempted && offers.length < 2 && (
                  <p className="text-sm text-rose-500">You need at least two offers to run a comparison.</p>
                )}
              </form>
            </Card>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.14 }}
            className="space-y-6"
          >
            {!hasVisibleComparison ? (
              <Card className="p-8 h-full flex items-center justify-center text-center min-h-[520px]">
                <div className="max-w-sm space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BadgeCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Ready to compare</h2>
                  <p className="text-muted-foreground">
                    Submit two or more valid offers to see a ranked breakdown with the best offer highlighted automatically.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Best offer</p>
                      <h2 className="text-2xl font-bold text-foreground">{bestOffer?.companyName}</h2>
                      <p className="text-sm text-muted-foreground">{bestOffer?.location} · {getArrangementLabel(bestOffer?.workArrangement)}</p>
                    </div>
                    <div className={`rounded-2xl border px-4 py-2 text-right ${getScoreTone(bestOffer?.overallScore || 0)}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide">Overall score</p>
                      <p className="text-3xl font-black">{bestOffer?.overallScore ?? 0}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Best adjusted value</p>
                      <p className="text-lg font-bold text-foreground">{formatCurrencyCompact(bestOffer?.adjustedAnnualValue ?? 0)}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Score spread</p>
                      <p className="text-lg font-bold text-foreground">{comparison.scoreSpread} pts</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Average score</p>
                      <p className="text-lg font-bold text-foreground">{comparison.averageScore}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground">Comparison table</h2>
                    <p className="text-sm text-muted-foreground">Ranked by overall score, with the best offer highlighted.</p>
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Offer</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Comp</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Upside</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Benefits</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Location</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Arrangement</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Adjusted Value</th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                        {comparison.offers.map((offer, index) => {
                          const isBest = offer.id === comparison.bestOfferId
                          return (
                            <tr key={offer.id} className={isBest ? 'bg-primary/5' : ''}>
                              <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${isBest ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground flex items-center gap-2">
                                      {offer.companyName}
                                      {isBest && <BadgeCheck className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div className="text-muted-foreground">{offer.location}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 align-top font-medium text-foreground">{formatCurrency(offer.baseSalary)}</td>
                              <td className="px-4 py-4 align-top text-foreground">{formatCurrency(offer.bonus + offer.stockEquity)}</td>
                              <td className="px-4 py-4 align-top text-foreground">{formatCurrency(offer.benefits)}</td>
                              <td className="px-4 py-4 align-top text-foreground">{offer.location}</td>
                              <td className="px-4 py-4 align-top text-foreground">{getArrangementLabel(offer.workArrangement)}</td>
                              <td className="px-4 py-4 align-top font-semibold text-foreground">{formatCurrency(offer.adjustedAnnualValue)}</td>
                              <td className="px-4 py-4 align-top">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold ${getScoreTone(offer.overallScore)}`}>
                                  {isBest ? <BadgeCheck className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                  {offer.overallScore}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden">
                    {comparison.offers.map((offer, index) => {
                      const isBest = offer.id === comparison.bestOfferId
                      return (
                        <div
                          key={offer.id}
                          className={`rounded-3xl border p-5 ${isBest ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Rank #{index + 1}</p>
                              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                {offer.companyName}
                                {isBest && <BadgeCheck className="w-4 h-4 text-primary" />}
                              </h3>
                              <p className="text-sm text-muted-foreground">{offer.location}</p>
                            </div>
                            <div className={`rounded-2xl border px-3 py-2 text-right ${getScoreTone(offer.overallScore)}`}>
                              <p className="text-[11px] uppercase tracking-wide">Score</p>
                              <p className="text-2xl font-black">{offer.overallScore}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-muted-foreground">Base</p>
                              <p className="font-semibold text-foreground">{formatCurrencyCompact(offer.baseSalary)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-muted-foreground">Upside</p>
                              <p className="font-semibold text-foreground">{formatCurrencyCompact(offer.bonus + offer.stockEquity)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-muted-foreground">Benefits</p>
                              <p className="font-semibold text-foreground">{formatCurrencyCompact(offer.benefits)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-muted-foreground">Arrangement</p>
                              <p className="font-semibold text-foreground">{getArrangementLabel(offer.workArrangement)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3 col-span-2">
                              <p className="text-muted-foreground">Adjusted annual value</p>
                              <p className="font-semibold text-foreground">{formatCurrencyCompact(offer.adjustedAnnualValue)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </>
            )}
          </Motion.div>
        </div>
      </div>
    </div>
  )
}
