# Product Explorer — React Mini Dashboard

A responsive product listing dashboard built with **React + Vite** that fetches real data from a public API, displays it in a card grid, and lets users search, sort, filter, and paginate through products.

---

## Live Preview

```bash
npm run dev
# Opens at http://localhost:5173/
```

---

## What This Project Does

- Fetches **real product data** from [FakeStoreAPI](https://fakestoreapi.com/products)
- Displays products in a **responsive card grid** (4 columns → 2 columns → 1 column on mobile)
- Each card shows the product **image, title, price, category, and star rating**
- Users can **search by name** (with debounced input — waits 350ms before filtering)
- Users can **sort** by Name (A→Z / Z→A) or Price (Low→High / High→Low)
- Users can **filter by category** from the sidebar
- Handles **loading state** with animated skeleton cards
- Handles **error state** with a retry button and warning messages
- Has **pagination** with numbered page buttons

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library (functional components) |
| **Vite** | Build tool / dev server (fast HMR) |
| **Vanilla CSS** | All styling — no Tailwind or Bootstrap |
| **FakeStoreAPI** | Public REST API for product data |
| **react-icons** | Icons for sidebar, toolbar, and cards |

---

## Project Structure

```
src/
├── context/
│   └── ProductContext.jsx     # Global state using Context API
│
├── components/
│   ├── ProductCard.jsx        # Single product card component
│   ├── ProductCard.css
│   ├── Toolbar.jsx            # Search bar + Sort dropdown
│   ├── Toolbar.css
│   ├── Pagination.jsx         # Page navigation (Prev, 1, 2, 3, Next)
│   ├── Pagination.css
│   ├── Sidebar.jsx            # Stats panel + Category filter
│   └── Sidebar.css
│
├── hooks/
│   └── useDebouncedValue.js   # Custom hook for debounced search
│
├── services/
│   └── productApi.js          # API fetch function with error handling
│
├── data/
│   └── mockProducts.js        # Fallback data if API fails
│
├── App.jsx                    # Main dashboard layout
├── App.css                    # Dashboard layout styles
├── main.jsx                   # Entry point (wraps app with Provider)
└── index.css                  # Global design system (colors, fonts, animations)
```

---

## React Concepts Used

### 1. Functional Components
Every component is a **function** — no class components. This is the modern React approach.

```jsx
function ProductCard({ product }) {
  return <article>...</article>
}
```

### 2. useState
Used to manage local state like search text, sort option, current page, loading/error flags.

```jsx
const [search, setSearch] = useState('')
const [isLoading, setIsLoading] = useState(true)
```

### 3. useEffect
Used to **fetch data on component mount** (runs once when app loads). Has cleanup to prevent memory leaks.

```jsx
useEffect(() => {
  let isMounted = true

  async function loadProducts() {
    const data = await fetchProducts()
    if (isMounted) setProducts(data)
  }

  loadProducts()
  return () => { isMounted = false }  // cleanup
}, [])
```

### 4. useMemo
Used to **avoid recalculating** filtered/sorted products on every render. Only recalculates when dependencies change.

```jsx
const filteredProducts = useMemo(() => {
  return products
    .filter(p => p.title.toLowerCase().includes(search))
    .sort(...)
}, [products, search, sortBy])
```

### 5. useContext (Context API)
Used to **share state globally** without passing props through every component. The `ProductContext` holds all product data, search, sort, pagination state.

```jsx
// In main.jsx — wrapping the app
<ProductProvider>
  <App />
</ProductProvider>

// In any component — accessing state
const { search, setSearch, products } = useProducts()
```

### 6. Custom Hook (useDebouncedValue)
A reusable hook that **delays updating a value** by 350ms. This prevents the search from filtering on every keystroke — it waits until the user stops typing.

```jsx
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // cancel if user types again
  }, [value, delay])

  return debounced
}
```

---

## API Handling

The API call is in `services/productApi.js`. Here's what it does:

1. **Fetches** from `https://fakestoreapi.com/products`
2. **AbortController** — cancels the request if it takes longer than 8 seconds
3. **Status check** — if the response is not OK (like 404 or 500), it throws an error
4. **Validation** — checks that the response is actually an array
5. **Fallback** — if the API fails, the app still works by showing mock data from `mockProducts.js`

```jsx
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 8000)

const response = await fetch(url, { signal: controller.signal })

if (!response.ok) throw new Error(`Failed (${response.status})`)

const data = await response.json()
if (!Array.isArray(data)) throw new Error('Invalid response')
```

---

## Features Breakdown

### Search (with Debounce)
- User types in the search box
- Input updates immediately (for UI responsiveness)
- But the actual filtering happens **350ms after the user stops typing**
- This avoids unnecessary re-renders on every keystroke
- The search also **resets pagination to page 1**

### Sort
- 4 sort options: Name A→Z, Name Z→A, Price Low→High, Price High→Low
- Uses `Array.sort()` with `localeCompare()` for names and simple subtraction for prices
- Sorting also resets pagination to page 1

### Category Filter (Sidebar)
- Categories are **dynamically extracted** from the product data using `new Set()`
- Clicking a category filters the grid instantly
- Shows item count next to each category

### Pagination
- Shows 8 products per page
- Displays numbered page buttons with ellipsis (`…`) for large ranges
- Prev/Next buttons with disabled state on first/last page
- Scrolls to top when changing pages

### Loading State
- Shows **8 skeleton cards** with a shimmer animation while data is loading
- No layout shift — skeletons match the exact size of real cards

### Error State
- If API completely fails → shows an error card with message + "Try Again" button
- If API fails but mock data exists → shows a warning banner + mock products
- If API is slow → shows "Refreshing..." banner while still showing existing data

---

## Responsive Design

| Screen Size | Layout |
|---|---|
| **Desktop (>1024px)** | Sidebar + 4-column grid |
| **Tablet (768–1024px)** | No sidebar, 3-column grid |
| **Mobile (480–768px)** | No sidebar, 2-column grid, stacked toolbar |
| **Small mobile (<480px)** | 2-column grid with smaller cards |

Done using **CSS media queries** and `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`.

---

## Viva / Interview Q&A

### Q: Why did you use Context API instead of prop drilling?
**A:** The search, sort, and filter state needs to be accessed by multiple components (Toolbar, Sidebar, App, Pagination). Instead of passing props through 3-4 levels, Context API lets any component access shared state directly using `useProducts()`.

### Q: Why useMemo for filtering and sorting?
**A:** Filtering and sorting arrays is an expensive operation. `useMemo` caches the result and only recalculates when the actual dependencies change (products, search text, sort option). Without it, the filtering would run on every single re-render.

### Q: What is debouncing and why did you use it?
**A:** Debouncing means waiting a short time before acting on user input. If the user types "jacket", without debouncing the filter runs 6 times (j, ja, jac, jack, jacke, jacket). With debouncing, it only runs once — 350ms after the user stops typing. This improves performance.

### Q: How do you handle API errors?
**A:** Three layers: (1) AbortController timeout for slow responses, (2) HTTP status code checking, (3) Fallback to mock data so the app never shows a blank screen. The user always sees something useful.

### Q: Why functional components instead of class components?
**A:** Functional components are the modern React standard. They are simpler, shorter, and hooks (useState, useEffect) give us all the same capabilities as class lifecycle methods but in a more composable way.

### Q: How is your code structured?
**A:** Separation of concerns — API logic is in `services/`, shared state in `context/`, reusable hooks in `hooks/`, UI components in `components/`, and mock data in `data/`. Each file has one responsibility.

### Q: How did you make it responsive?
**A:** CSS Grid with `auto-fill` and `minmax()` for the product grid, CSS media queries at 1024px, 768px, and 480px breakpoints, and the sidebar hides on smaller screens using `display: none`.

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-icons": "^5.x"
}
```

Dev dependencies: Vite, ESLint, React plugins.
