import type { ChangeEvent, ReactNode } from 'react'

import type { TraitOption, UserProfile } from '@beauty-personalization/shared'

type StepId = 'skin' | 'hair' | 'summary'

interface ProfileFormProps {
  step: StepId
  profile: UserProfile
  traitOptions: TraitOption[]
  onProfileChange: (next: UserProfile) => void
}

const findValues = (options: TraitOption[], key: TraitOption['key']) =>
  options.find((option) => option.key === key)?.values ?? []

const toggleValue = (
  current: string[] | undefined,
  value: string
): string[] => {
  const set = new Set(current ?? [])
  if (set.has(value)) {
    set.delete(value)
  } else {
    set.add(value)
  }
  return Array.from(set)
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section className="form-section">
    <h3>{title}</h3>
    {children}
  </section>
)

export const ProfileForm = ({
  step,
  profile,
  traitOptions,
  onProfileChange,
}: ProfileFormProps) => {
  const skinTypes = findValues(traitOptions, 'skinTypes')
  const skinConcerns = findValues(traitOptions, 'skinConcerns')
  const hairTextures = findValues(traitOptions, 'hairTextures')
  const hairConcerns = findValues(traitOptions, 'hairConcerns')

  const handleInput =
    (key: keyof UserProfile) =>
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      onProfileChange({ ...profile, [key]: event.target.value || undefined })
    }

  const handleMultiSelect = (key: keyof UserProfile) => (value: string) =>
    onProfileChange({
      ...profile,
      [key]: toggleValue((profile[key] as string[] | undefined) ?? [], value),
    })

  if (step === 'summary') {
    return (
      <div className="summary">
        <p>Review your profile before generating recommendations:</p>
        <ul>
          <li>Skin type: {profile.skinType ?? 'Not specified'}</li>
          <li>
            Skin concerns:{' '}
            {profile.skinConcerns && profile.skinConcerns.length
              ? profile.skinConcerns.join(', ')
              : 'Not specified'}
          </li>
          <li>Hair texture: {profile.hairTexture ?? 'Not specified'}</li>
          <li>
            Hair concerns:{' '}
            {profile.hairConcerns && profile.hairConcerns.length
              ? profile.hairConcerns.join(', ')
              : 'Not specified'}
          </li>
        </ul>
        <p>You can adjust these selections at any time.</p>
      </div>
    )
  }

  if (step === 'skin') {
    return (
      <>
        <Section title="Skin Type">
          <select
            value={profile.skinType ?? ''}
            onChange={handleInput('skinType')}
          >
            <option value="">Select skin type</option>
            {skinTypes.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </Section>
        <Section title="Skin Concerns">
          <div className="option-grid">
            {skinConcerns.map((concern) => {
              const isChecked = profile.skinConcerns?.includes(concern) ?? false
              return (
                <label key={concern} className={isChecked ? 'checked' : ''}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleMultiSelect('skinConcerns')(concern)}
                  />
                  <span>{concern.replace(/_/g, ' ')}</span>
                </label>
              )
            })}
          </div>
        </Section>
      </>
    )
  }

  return (
    <>
      <Section title="Hair Texture">
        <select
          value={profile.hairTexture ?? ''}
          onChange={handleInput('hairTexture')}
        >
          <option value="">Select hair texture</option>
          {hairTextures.map((texture) => (
            <option key={texture} value={texture}>
              {texture.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </Section>
      <Section title="Hair Concerns">
        <div className="option-grid">
          {hairConcerns.map((concern) => {
            const isChecked = profile.hairConcerns?.includes(concern) ?? false
            return (
              <label key={concern} className={isChecked ? 'checked' : ''}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleMultiSelect('hairConcerns')(concern)}
                />
                <span>{concern.replace(/_/g, ' ')}</span>
              </label>
            )
          })}
        </div>
      </Section>
    </>
  )
}
