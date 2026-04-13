import { HiOutlineCube } from 'react-icons/hi'
import { IoWarningOutline } from 'react-icons/io5'
import { useProducts } from './context/ProductContext'
import Pagination from './components/Pagination'
import ProductCard from './components/ProductCard'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import './App.css'

function App() {
  const {
    visibleProducts,
    isLoading,
    error,
    products,
    currentPage,
    totalPages,
    handlePageChange,
    stats,
  } = useProducts()

  return (
    <div className="dashboard">
      {/* ─── Header ─── */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="header-logo">
            <HiOutlineCube />
          </div>
          <h1>
            Product Explorer
            <span>React Mini Dashboard</span>
          </h1>
        </div>
        <div className="header-badge">
          <span className="dot" />
          Live API Connected
        </div>
      </header>

      {/* ─── Sidebar ─── */}
      <Sidebar />

      {/* ─── Main Content ─── */}
      <main className="dashboard-main">
        <Toolbar />

        {/* Loading – full skeleton */}
        {isLoading && products.length === 0 && (
          <section className="skeleton-grid" aria-live="polite" aria-label="Loading products">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line price" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Loading – refreshing banner */}
        {isLoading && products.length > 0 && (
          <section className="state-warning" role="status" aria-live="polite">
            <IoWarningOutline className="warn-icon" />
            <p>Refreshing products from API…</p>
          </section>
        )}

        {/* Error – no fallback data */}
        {!isLoading && error && products.length === 0 && (
          <section className="state-card error" role="alert">
            <span className="state-icon">⚠️</span>
            <h2>Could not load products</h2>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </section>
        )}

        {/* Error – fallback data shown */}
        {!isLoading && error && products.length > 0 && (
          <section className="state-warning" role="status" aria-live="polite">
            <IoWarningOutline className="warn-icon" />
            <p>{error}</p>
          </section>
        )}

        {/* No results */}
        {!isLoading && visibleProducts.length === 0 && !error && (
          <section className="state-card" aria-live="polite">
            <span className="state-icon">🔍</span>
            <h2>No products found</h2>
            <p>Try adjusting your search or changing the category filter.</p>
          </section>
        )}

        {/* Product Grid */}
        {!isLoading && visibleProducts.length > 0 && (
          <>
            <section className="products-grid" aria-label="Product list">
              {visibleProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                />
              ))}
            </section>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
