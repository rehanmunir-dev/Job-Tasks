const PRODUCTS_API_URL = 'https://fakestoreapi.com/products'

export async function fetchProducts({ timeoutMs = 6000 } = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  let response

  try {
    response = await fetch(PRODUCTS_API_URL, { signal: controller.signal })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('API timeout. Showing mock items instead.')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`)
  }

  const products = await response.json()

  if (!Array.isArray(products)) {
    throw new Error('Invalid API response')
  }

  return products
}
