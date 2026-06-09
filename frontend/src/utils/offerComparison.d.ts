export type WorkArrangement = 'remote' | 'hybrid' | 'onsite'

export interface OfferDraft {
  id: string
  companyName: string
  baseSalary: string
  bonus: string
  stockEquity: string
  benefits: string
  location: string
  costOfLivingAdjustment: string
  workArrangement: WorkArrangement
}

export interface ValidatedOffer {
  id: string
  companyName: string
  location: string
  baseSalary: number
  bonus: number
  stockEquity: number
  benefits: number
  costOfLivingAdjustment: number
  workArrangement: WorkArrangement
}

export interface OfferScore extends ValidatedOffer {
  totalAnnualCompensation: number
  adjustedAnnualValue: number
  upsideValue: number
  overallScore: number
  breakdown: Record<string, number>
}

export interface OfferComparisonResult {
  offers: OfferScore[]
  bestOfferId: string | null
  bestScore: number
  scoreSpread: number
  averageScore: number
}

export interface ValidationResult {
  offers: ValidatedOffer[]
  errors: Record<string, Partial<Record<keyof OfferDraft, string>>>
  isValid: boolean
}

export declare const ARRANGEMENT_OPTIONS: Array<{ value: WorkArrangement; label: string }>
export declare function createOfferDraft(): OfferDraft
export declare function validateOfferDrafts(drafts: OfferDraft[]): ValidationResult
export declare function compareOffers(offers: ValidatedOffer[]): OfferComparisonResult
