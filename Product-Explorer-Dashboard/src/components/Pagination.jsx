import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi'
import './Pagination.css'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Generate array of page numbers to display
  function getPageNumbers() {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    // Always show first page
    pages.push(1)

    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if at the edges
    if (currentPage <= 3) {
      end = 4
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3
    }

    if (start > 2) pages.push('...')

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) pages.push('...')

    // Always show last page
    pages.push(totalPages)

    return pages
  }

  return (
    <nav className="pagination" aria-label="Products pagination">
      <button
        type="button"
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <HiOutlineChevronLeft />
        <span className="nav-text">Prev</span>
      </button>

      <div className="page-numbers">
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="page-dots">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`page-btn num-btn${page === currentPage ? ' active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className="nav-text">Next</span>
        <HiOutlineChevronRight />
      </button>
    </nav>
  )
}

export default Pagination
