import type {
  Recommendation,
  RecommendationRequest,
  TraitOption,
} from '@beauty-personalization/shared'

const API_BASE = import.meta.env?.VITE_API_BASE ?? 'http://localhost:3001'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export const fetchTraitOptions = async (): Promise<TraitOption[]> => {
  const res = await fetch(`${API_BASE}/intake/options`)
  const data = await handleResponse(res)
  return data.traits ?? []
}

export const requestRecommendations = async (
  payload: RecommendationRequest
): Promise<Recommendation[]> => {
  const res = await fetch(`${API_BASE}/products/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await handleResponse(res)
  return data.recommendations ?? []
}
