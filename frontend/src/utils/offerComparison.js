const ARRANGEMENT_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' }
]

const ARRANGEMENT_SCORE = {
  remote: 100,
  hybrid: 72,
  onsite: 45
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `offer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function roundNumber(value) {
  return Math.round(value * 100) / 100
}

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null

  const nextValue = typeof value === 'string' ? Number(value.trim()) : Number(value)
  return Number.isFinite(nextValue) ? nextValue : null
}

function normalize(values, value) {
  if (!values.length) return 0

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) return 100

  return ((value - min) / (max - min)) * 100
}

/**
 * @typedef {Object} OfferDraft
 * @property {string} id
 * @property {string} companyName
 * @property {string} baseSalary
 * @property {string} bonus
 * @property {string} stockEquity
 * @property {string} benefits
 * @property {string} location
 * @property {string} costOfLivingAdjustment
 * @property {'remote' | 'hybrid' | 'onsite'} workArrangement
 */

/**
 * @typedef {Object} ValidatedOffer
 * @property {string} id
 * @property {string} companyName
 * @property {string} location
 * @property {number} baseSalary
 * @property {number} bonus
 * @property {number} stockEquity
 * @property {number} benefits
 * @property {number} costOfLivingAdjustment
 * @property {'remote' | 'hybrid' | 'onsite'} workArrangement
 */

/**
 * @typedef {Object} OfferScore
 * @property {string} id
 * @property {string} companyName
 * @property {string} location
 * @property {number} baseSalary
 * @property {number} bonus
 * @property {number} stockEquity
 * @property {number} benefits
 * @property {number} costOfLivingAdjustment
 * @property {'remote' | 'hybrid' | 'onsite'} workArrangement
 * @property {number} totalAnnualCompensation
 * @property {number} adjustedAnnualValue
 * @property {number} upsideValue
 * @property {number} overallScore
 * @property {Record<string, number>} breakdown
 */

/**
 * @typedef {Object} OfferComparisonResult
 * @property {OfferScore[]} offers
 * @property {string | null} bestOfferId
 * @property {number} bestScore
 * @property {number} scoreSpread
 * @property {number} averageScore
 */

function createOfferDraft() {
  return {
    id: createId(),
    companyName: '',
    baseSalary: '',
    bonus: '',
    stockEquity: '',
    benefits: '',
    location: '',
    costOfLivingAdjustment: '',
    workArrangement: 'remote'
  }
}

function validateOfferDrafts(drafts) {
  /** @type {Record<string, Partial<Record<keyof OfferDraft, string>>>} */
  const errors = {}
  /** @type {ValidatedOffer[]} */
  const offers = []

  drafts.forEach((draft) => {
    const rowErrors = {}

    const companyName = draft.companyName.trim()
    if (!companyName) rowErrors.companyName = 'Company name is required.'

    const location = draft.location.trim()
    if (!location) rowErrors.location = 'Location is required.'

    const baseSalary = toNumber(draft.baseSalary)
    if (baseSalary === null || baseSalary < 0) {
      rowErrors.baseSalary = 'Base salary must be 0 or greater.'
    }

    const bonus = toNumber(draft.bonus)
    if (bonus === null || bonus < 0) {
      rowErrors.bonus = 'Bonus must be 0 or greater.'
    }

    const stockEquity = toNumber(draft.stockEquity)
    if (stockEquity === null || stockEquity < 0) {
      rowErrors.stockEquity = 'Stock/equity must be 0 or greater.'
    }

    const benefits = toNumber(draft.benefits)
    if (benefits === null || benefits < 0) {
      rowErrors.benefits = 'Benefits value must be 0 or greater.'
    }

    const costOfLivingAdjustment = toNumber(draft.costOfLivingAdjustment)
    if (costOfLivingAdjustment === null || costOfLivingAdjustment < -90 || costOfLivingAdjustment > 300) {
      rowErrors.costOfLivingAdjustment = 'Enter a COL adjustment between -90 and 300.'
    }

    if (!Object.prototype.hasOwnProperty.call(ARRANGEMENT_SCORE, draft.workArrangement)) {
      rowErrors.workArrangement = 'Choose remote, hybrid, or onsite.'
    }

    if (Object.keys(rowErrors).length > 0) {
      errors[draft.id] = rowErrors
      return
    }

    offers.push({
      id: draft.id,
      companyName,
      location,
      baseSalary,
      bonus,
      stockEquity,
      benefits,
      costOfLivingAdjustment,
      workArrangement: draft.workArrangement
    })
  })

  return {
    offers,
    errors,
    isValid: offers.length === drafts.length && drafts.length >= 2
  }
}

function compareOffers(validOffers) {
  if (validOffers.length === 0) {
    return {
      offers: [],
      bestOfferId: null,
      bestScore: 0,
      scoreSpread: 0,
      averageScore: 0
    }
  }

  const totalAnnualValues = validOffers.map((offer) => offer.baseSalary + offer.bonus + offer.stockEquity + offer.benefits)
  const upsideValues = validOffers.map((offer) => offer.bonus + offer.stockEquity)
  const baseValues = validOffers.map((offer) => offer.baseSalary)
  const benefitsValues = validOffers.map((offer) => offer.benefits)
  const flexibilityValues = validOffers.map((offer) => ARRANGEMENT_SCORE[offer.workArrangement] ?? 50)
  const adjustedValues = validOffers.map((offer) => {
    const colFactor = 1 + (offer.costOfLivingAdjustment / 100)
    const safeFactor = colFactor <= 0 ? 0.1 : colFactor
    return (offer.baseSalary + offer.bonus + offer.stockEquity + offer.benefits) / safeFactor
  })

  /** @type {OfferScore[]} */
  const scoredOffers = validOffers.map((offer, index) => {
    const totalAnnualCompensation = totalAnnualValues[index]
    const adjustedAnnualValue = adjustedValues[index]
    const upsideValue = upsideValues[index]

    const compensationScore = normalize(adjustedValues, adjustedAnnualValue)
    const upsideScore = normalize(upsideValues, upsideValue)
    const baseScore = normalize(baseValues, offer.baseSalary)
    const benefitsScore = normalize(benefitsValues, offer.benefits)
    const flexibilityScore = normalize(flexibilityValues, ARRANGEMENT_SCORE[offer.workArrangement] ?? 50)

    const overallScore = roundNumber(
      compensationScore * 0.45 +
        upsideScore * 0.2 +
        baseScore * 0.15 +
        benefitsScore * 0.1 +
        flexibilityScore * 0.1,
    )

    return {
      ...offer,
      totalAnnualCompensation,
      adjustedAnnualValue: roundNumber(adjustedAnnualValue),
      upsideValue,
      overallScore,
      breakdown: {
        compensationScore: roundNumber(compensationScore),
        upsideScore: roundNumber(upsideScore),
        baseScore: roundNumber(baseScore),
        benefitsScore: roundNumber(benefitsScore),
        flexibilityScore: roundNumber(flexibilityScore)
      }
    }
  })

  const bestOffer = scoredOffers.reduce((currentBest, offer) => {
    if (!currentBest) return offer

    if (offer.overallScore > currentBest.overallScore) return offer
    if (offer.overallScore < currentBest.overallScore) return currentBest
    return offer.adjustedAnnualValue > currentBest.adjustedAnnualValue ? offer : currentBest
  }, null)

  const rankedOffers = [...scoredOffers].sort((left, right) => {
    if (right.overallScore !== left.overallScore) {
      return right.overallScore - left.overallScore
    }

    return right.adjustedAnnualValue - left.adjustedAnnualValue
  })

  const bestScore = rankedOffers[0]?.overallScore ?? 0
  const worstScore = rankedOffers[rankedOffers.length - 1]?.overallScore ?? 0
  const averageScore = roundNumber(rankedOffers.reduce((sum, offer) => sum + offer.overallScore, 0) / rankedOffers.length)

  return {
    offers: rankedOffers,
    bestOfferId: bestOffer?.id ?? null,
    bestScore,
    scoreSpread: roundNumber(bestScore - worstScore),
    averageScore
  }
}

export {
  ARRANGEMENT_OPTIONS,
  compareOffers,
  createOfferDraft,
  validateOfferDrafts
}
