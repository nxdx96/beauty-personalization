import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { z } from 'zod'

import { getRecommendations, getTraitOptions } from './data/products'

const app = express()
const port = Number.parseInt(process.env.PORT ?? '3001', 10)

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/intake/options', (_req, res) => {
  res.json({ traits: getTraitOptions() })
})

const recommendationSchema = z.object({
  profile: z.object({
    skinType: z.string().optional(),
    skinTone: z.string().optional(),
    skinConcerns: z.array(z.string()).optional(),
    hairTexture: z.string().optional(),
    hairConcerns: z.array(z.string()).optional(),
    preferences: z.array(z.string()).optional(),
  }),
  topK: z.number().min(1).max(10).optional(),
})

app.post('/products/recommendations', (req, res) => {
  const parseResult = recommendationSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.flatten(),
    })
  }

  const recommendations = getRecommendations(parseResult.data)
  res.json({ recommendations })
})

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Backend server running on port ${port}`)
  /* eslint-enable no-console */
})
