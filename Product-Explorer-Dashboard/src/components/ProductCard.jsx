import { HiStar, HiOutlineStar } from 'react-icons/hi'
import './ProductCard.css'

function ProductCard({ product, index = 0 }) {
  const rating = product.rating || { rate: 0, count: 0 }
  const fullStars = Math.floor(rating.rate)
  const hasHalfStar = rating.rate - fullStars >= 0.5

  return (
    <article
      className="product-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="card-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="card-image"
          loading="lazy"
        />
        <span className="card-price-tag">${product.price.toFixed(2)}</span>
      </div>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title" title={product.title}>
          {product.title}
        </h3>

        <div className="card-footer">
          <div className="card-stars" aria-label={`Rating: ${rating.rate} out of 5`}>
            {[1, 2, 3, 4, 5].map((star) => {
              if (star <= fullStars) {
                return <HiStar key={star} className="star filled" />
              }
              if (star === fullStars + 1 && hasHalfStar) {
                return <HiStar key={star} className="star half" />
              }
              return <HiOutlineStar key={star} className="star empty" />
            })}
            <span className="star-count">({rating.count})</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
