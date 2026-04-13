import {
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from 'react-icons/hi'
import { useProducts } from '../context/ProductContext'
import './Sidebar.css'

function Sidebar() {
  const { stats, categories, category, setCategory, products } = useProducts()

  // Count products per category
  function getCategoryCount(cat) {
    if (cat === 'all') return products.length
    return products.filter((p) => p.category === cat).length
  }

  return (
    <aside className="dashboard-sidebar">
      {/* Stats */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">Overview</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-icon">
              <HiOutlineShoppingBag style={{ color: '#6c63ff' }} />
            </span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">
              <HiOutlineTag style={{ color: '#00d4aa' }} />
            </span>
            <span className="stat-value">{stats.totalCategories}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">
              <HiOutlineTrendingUp style={{ color: '#ff9f43' }} />
            </span>
            <span className="stat-value">${stats.maxPrice}</span>
            <span className="stat-label">Highest</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">
              <HiOutlineTrendingDown style={{ color: '#f368e0' }} />
            </span>
            <span className="stat-value">${stats.minPrice}</span>
            <span className="stat-label">Lowest</span>
          </div>
        </div>
      </div>

      {/* Average price banner */}
      <div className="sidebar-section">
        <div className="avg-price-card">
          <span className="avg-label">Avg. Price</span>
          <span className="avg-value">${stats.avgPrice}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">Categories</h2>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-btn${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
              id={`category-${cat.replace(/\s+/g, '-')}`}
            >
              {cat === 'all' ? '🏷️ All Products' : cat}
              <span className="category-count">{getCategoryCount(cat)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Matching count */}
      <div className="sidebar-section sidebar-footer">
        <p className="filtered-info">
          Showing <strong>{stats.filteredCount}</strong> of{' '}
          <strong>{stats.totalProducts}</strong> products
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
