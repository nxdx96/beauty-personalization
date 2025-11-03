import { useEffect, useMemo, useState } from 'react'

import type {
  Recommendation,
  RecommendationRequest,
  TraitOption,
  UserProfile,
} from '@beauty-personalization/shared'

import { fetchTraitOptions, requestRecommendations } from './api/client'
import { ModalWizard } from './components/ModalWizard'
import { ProfileForm } from './components/ProfileForm'
import { RecommendationCard } from './components/RecommendationCard'

const steps = [
  { id: 'skin', label: 'Skin profile' },
  { id: 'hair', label: 'Hair profile' },
  { id: 'summary', label: 'Review & confirm' },
] as const

type StepId = (typeof steps)[number]['id']

const initialProfile: UserProfile = {
  skinConcerns: [],
  hairConcerns: [],
  preferences: [],
}

function App() {
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [traitOptions, setTraitOptions] = useState<TraitOption[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoadingOptions(true)
      try {
        const traits = await fetchTraitOptions()
        setTraitOptions(traits)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoadingOptions(false)
      }
    }
    void load()
  }, [])

  const currentStep = useMemo(() => steps[stepIndex], [stepIndex])

  const resetWizard = () => {
    setStepIndex(0)
    setProfile(initialProfile)
  }

  const handleClose = () => {
    setOpen(false)
    resetWizard()
  }

  const handleBack = () => {
    setStepIndex((index) => Math.max(0, index - 1))
  }

  const profileIsReady = (): boolean => {
    if (!traitOptions.length) return false
    if (currentStep.id === 'skin') {
      return Boolean(profile.skinType)
    }
    return true
  }

  const submitProfile = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const request: RecommendationRequest = {
        profile: {
          ...profile,
          skinConcerns: profile.skinConcerns?.filter(Boolean),
          hairConcerns: profile.hairConcerns?.filter(Boolean),
        },
      }
      const results = await requestRecommendations(request)
      setRecommendations(results)
      setOpen(false)
      resetWizard()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrimary = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((index) => index + 1)
      return
    }
    void submitProfile()
  }

  return (
    <main className="main-layout">
      <section className="hero">
        <h1>Beauty Personalization Tool</h1>
        <p>
          Craft a tailored skincare and haircare regimen by sharing your skin
          texture, concerns, and styling goals. Our recommendation engine blends
          deterministic filters with LLM insights to surface the best matches
          from Sephora and Ulta.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={loadingOptions}
        >
          {loadingOptions ? 'Loading options...' : 'Start personalization'}
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </section>

      {recommendations.length ? (
        <section className="recommendations" aria-live="polite">
          {recommendations.map((item) => (
            <RecommendationCard key={item.product.id} recommendation={item} />
          ))}
        </section>
      ) : (
        <p className="empty-state">
          Launch the wizard to receive your first set of personalized products.
        </p>
      )}

      <ModalWizard
        open={open}
        title="Profile your needs"
        stepLabel={currentStep.label}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onClose={handleClose}
        onBack={stepIndex === 0 ? undefined : handleBack}
        onPrimary={handlePrimary}
        primaryLabel={
          stepIndex === steps.length - 1 ? 'Generate recommendations' : 'Next'
        }
        primaryDisabled={!profileIsReady() || submitting}
        isPrimaryLoading={submitting}
      >
        <ProfileForm
          step={currentStep.id as StepId}
          profile={profile}
          traitOptions={traitOptions}
          onProfileChange={setProfile}
        />
      </ModalWizard>
    </main>
  )
}

export default App
