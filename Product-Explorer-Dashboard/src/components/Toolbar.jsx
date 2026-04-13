import { HiOutlineSearch, HiOutlineSortDescending } from 'react-icons/hi'
import { useProducts } from '../context/ProductContext'
import './Toolbar.css'

function Toolbar() {
  const { search, setSearch, sortBy, setSortBy, filteredAndSortedProducts } =
    useProducts()

  return (
    <section className="toolbar" aria-label="Product filters and sorting">
      <div className="toolbar-search">
        <HiOutlineSearch className="toolbar-icon" />
        <input
          id="search-input"
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        {search && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="toolbar-sort">
        <HiOutlineSortDescending className="toolbar-icon" />
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="price-asc">Price (Low → High)</option>
          <option value="price-desc">Price (High → Low)</option>
        </select>
      </div>

      <p className="toolbar-count">
        <strong>{filteredAndSortedProducts.length}</strong> items
      </p>
    </section>
  )
}

export default Toolbar
