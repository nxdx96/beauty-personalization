import type { Recommendation } from '@beauty-personalization/shared'

interface Props {
  recommendation: Recommendation
}

export const RecommendationCard = ({ recommendation }: Props) => {
  const { product, score, reasons } = recommendation
  return (
    <article className="recommendation-card">
      <header>
        <h3>{product.name}</h3>
        <p className="brand">{product.brand}</p>
      </header>
      <dl>
        <div>
          <dt>Category</dt>
          <dd>{product.category}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>${product.price.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{product.rating.toFixed(1)} / 5</dd>
        </div>
        <div>
          <dt>Score</dt>
          <dd>{score.toFixed(1)}</dd>
        </div>
      </dl>
      <ul className="reasons">
        {reasons.slice(0, 3).map((reason) => (
          <li key={reason}>{reason.replace(/_/g, ' ')}</li>
        ))}
      </ul>
      <footer>
        <a href={product.url} target="_blank" rel="noreferrer">
          View product
        </a>
      </footer>
    </article>
  )
}
