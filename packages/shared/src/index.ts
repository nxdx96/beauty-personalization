export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
}

export interface UserProfile {
  skinType: string
  skinTone: string
  concerns: string[]
  preferences: string[]
}