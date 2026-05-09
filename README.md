# Movie Information Provider – Client

Angular 21 web application for searching movies from external APIs (OMDb, TMDb) with real-time autocomplete suggestions and infinite-scroll pagination.

## Table of Contents

- Overview
- Main Goals
- Technologies
- API Contract
- Features
- Architecture
- Getting Started
- Configuration
- Autocomplete & Search Flow
- Troubleshooting
- Future Enhancements

## Overview

Movie Information Provider Client is a modern, scalable Angular frontend that communicates with a REST API backend for movie search and autocomplete functionality.

**Key pages:**

- Landing page: Entry point with navigation
- Movie page: Search with provider selection, tabular results, and pagination
- Smart autocomplete: Type-ahead suggestions with infinite scrolling

## Main Goals

**1. Responsive Search Experience**

- Debounced input to reduce API calls
- Immediate result display with pagination
- Clear loading and error states

**2. Smart Autocomplete**

- Quick suggestions as user types (1000ms debounce)
- Infinite-scroll pagination on suggestion list
- Cancel previous requests when new input arrives

**3. Maintainable Architecture**

- Clean separation of concerns (UI/State/Service)
- NgRx for predictable state management
- Lazy-loaded features and routes
- Type-safe components

## Technologies

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| Angular 21           | Standalone component framework  |
| NgRx Store + Effects | State management & side effects |
| RxJS                 | Reactive streams                |
| Angular Material     | UI components                   |
| Tailwind CSS v4      | Styling & utilities             |
| TypeScript 5.9       | Type safety                     |
| Angular Router       | Lazy loading & navigation       |

## API Contract

### Search Movies

**Endpoint:** `GET /movies/{movieTitle}`

Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| api | string | Yes | - | API provider: `omdb` or `tmdb` |
| page | integer | No | 1 | Page number (1-based) |
| pageSize | integer | No | 10 | Results per page |

**Response:**

```json
{
  "movies": [{ "title": "string", "year": "string", "director": ["string"] }],
  "currentPage": 1,
  "pageSize": 10,
  "totalResults": 150,
  "totalPages": 15
}
```

### Autocomplete

**Endpoint:** `GET /movies/autocomplete`

Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | string | Yes | - | Search term |
| limit | integer | No | 10 | Max suggestions (1-50) |

**Response:** `string[]` (array of suggestions)

## Features

**🔍 Core Search**

- Search movies by title across two external APIs
- Provider selection (OMDb, TMDb)
- Paginated result table with title, year, and director(s)

**✨ Autocomplete**

- Type-ahead suggestions as you type
- Debounced requests (1000ms) to reduce API load
- Infinite-scroll pagination on suggestion list
- Automatic request cancellation on new input

**⚙️ State Management**

- NgRx for centralized state
- Separate concerns: movie search vs autocomplete
- Loading and error states per feature

**📱 UX Polish**

- Search button shows spinner during loading
- Result table dims with overlay while fetching
- Paginator disabled during requests
- Responsive Material Design layout

## Architecture

```
src/app/
  home/                    # Landing page
    home.ts
    home.html
  movie/                   # Feature module (lazy-loaded)
    +state/
      movie.actions.ts     # NgRx actions
      movie.effects.ts     # Side effects & API calls
      movie.reducer.ts     # State mutations
      movie.selectors.ts   # State queries
    movie.ts               # Component
    movie.html             # Template
    movie.css              # Styles
  models/
    movie-api-provider.enum.ts
    movie-search-response.dto.ts
    movie.dto.ts
  services/
    movie.service.ts       # HTTP communication
  app.routes.ts            # Route definitions
  app.config.ts            # Global providers
```

**Design Patterns:**

- **Feature-based structure**: Scalable organization
- **Smart/Dumb components**: Movie component handles state, Material components are presentational
- **Action-driven flow**: UI → Actions → Effects → Reducer → State → Signals
- **SwitchMap for requests**: Cancels in-flight requests when new input arrives

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running backend API at `https://localhost:44376`

### Installation

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:4200)
npm start

# Build for production
npm run build

# Run unit tests
npm test
```

## Configuration

### Backend URL

Update in [src/app/services/movie.service.ts](src/app/services/movie.service.ts):

```typescript
private readonly baseUrl: string = 'https://localhost:44376';
```

### Autocomplete Debounce

Update in [src/app/movie/+state/movie.effects.ts](src/app/movie/+state/movie.effects.ts):

```typescript
debounceTime(1000); // Change milliseconds as needed
```

### Autocomplete Initial Limit

Update in [src/app/movie/+state/movie.effects.ts](src/app/movie/+state/movie.effects.ts):

```typescript
const AUTOCOMPLETE_INITIAL_LIMIT = 10; // Default suggestions count
```

## Autocomplete & Search Flow

### Search Movies

1. User enters query and selects provider
2. Component dispatches `searchMovies` action
3. Effect calls `movieService.searchMovies(query, provider, page, pageSize)`
4. Backend response updates store
5. Component reads movies via selector signal
6. Table renders with pagination controls

### Autocomplete with Infinite Scroll

1. User types in search input
2. Input change triggers `autocompleteQueryChanged` action
3. Effect debounces (1000ms) and filters duplicates
4. If query is empty, suggestions are cleared
5. Otherwise, `loadAutocompleteSuggestions` is dispatched with initial limit (10)
6. Backend returns array of suggestions
7. User sees dropdown with suggestions
8. When dropdown is opened, scroll listener is attached
9. When user scrolls near bottom, new `loadAutocompleteSuggestions` is dispatched with increased limit
10. New results merge into state
11. When user selects a suggestion, it fills the input and triggers search

**Key behaviors:**

- Request cancellation: `switchMap` in effects cancels previous requests
- Debounce: Prevents excessive API calls while typing
- Infinite scroll: Smooth UX for large suggestion lists
- State management: All data flows through NgRx store

## Troubleshooting

**Q: Autocomplete shows no suggestions**

- Verify backend is running at `https://localhost:44376`
- Check backend supports `query` and `limit` query parameters
- Inspect browser Network tab for failed requests
- Check CORS policy on backend

**Q: Suggestions don't load on scroll**

- Ensure autocomplete panel is actually scrollable (many suggestions needed)
- Check browser DevTools → Network for scroll-triggered requests
- Verify backend response size matches requested limit

**Q: HTTPS certificate error**

- Accept developer certificate for local backend
- Ensure frontend and backend protocols match

**Q: Search results don't paginate**

- Verify backend supports `page` and `pageSize` parameters
- Check total results count is greater than page size
- Ensure paginator is enabled (not loading)

## Future Enhancements

- Offset/page-based autocomplete pagination
- URL query parameter state persistence
- Search result caching strategy
- Unified error handling from backend
- Unit tests for reducer and effects
- Component integration tests
- Sort by title or year
- Keyboard navigation in autocomplete dropdown
