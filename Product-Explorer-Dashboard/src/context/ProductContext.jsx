import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mockProducts } from '../data/mockProducts'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { fetchProducts } from '../services/productApi'

const ProductContext = createContext(null)

const ITEMS_PER_PAGE = 8

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(mockProducts)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [category, setCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedValue(search)

  // Fetch products on mount
  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      setIsLoading(true)
      setError('')

      try {
        const data = await fetchProducts({ timeoutMs: 8000 })

        if (isMounted) {
          // Merge API data with mock products, add rating to mock items
          setProducts([...data, ...mockProducts])
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || 'Unable to fetch products. Showing offline items.',
          )
          setProducts(mockProducts)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, sortBy, category])

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(cats).sort()]
  }, [products])

  // Filter + Sort
  const filteredAndSortedProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    let filtered = products.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearch),
    )

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category)
    }

    const sorted = [...filtered]

    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    return sorted
  }, [products, debouncedSearch, sortBy, category])

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE),
  )

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  // Stats for sidebar
  const stats = useMemo(() => {
    const prices = products.map((p) => p.price)
    return {
      totalProducts: products.length,
      avgPrice: prices.length
        ? (prices.reduce((s, p) => s + p, 0) / prices.length).toFixed(2)
        : 0,
      maxPrice: prices.length ? Math.max(...prices).toFixed(2) : 0,
      minPrice: prices.length ? Math.min(...prices).toFixed(2) : 0,
      totalCategories: new Set(products.map((p) => p.category)).size,
      filteredCount: filteredAndSortedProducts.length,
    }
  }, [products, filteredAndSortedProducts])

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return
    setCurrentPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const value = {
    products,
    visibleProducts,
    filteredAndSortedProducts,
    search,
    setSearch,
    sortBy,
    setSortBy,
    category,
    setCategory,
    categories,
    isLoading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    stats,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
