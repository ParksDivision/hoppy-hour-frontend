# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Commands:**

- `npm run dev` - Start development server with nodemon auto-restart and open browser at localhost:3000
- `npm run build` - Build Next.js application for production
- `npm run start` - Start production server with built application
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

### Technology Stack

**Framework & Core:**

- Next.js 15.1.6 with App Router architecture
- React 19.0.0 with TypeScript
- Tailwind CSS with shadcn/ui components
- Axios for HTTP client with comprehensive error handling

**Key Dependencies:**

- Radix UI primitives for accessible components
- Lucide React for icons
- Class Variance Authority (CVA) for component variants
- Nodemon for development auto-restart

### Backend Integration Architecture

**API Client System:**

- `api/client.ts` - Enhanced Axios instance with interceptors, retry logic, and detailed error handling
- `api/services/businessApi.ts` - Typed service layer for all business-related API calls
- Automatic API proxy configuration via Next.js rewrites to `localhost:3001`
- Built-in retry mechanism with exponential backoff for failed requests
- Comprehensive error categorization (network, timeout, authentication, server errors)

**API Integration Patterns:**

- Environment-based base URL configuration (`NEXT_PUBLIC_API_URL`)
- Authentication token handling via localStorage
- Request/response logging in development mode
- Health check utilities for backend connectivity monitoring
- Graceful degradation with empty arrays/null responses on API failures

### Component Architecture

**Layout System:**

- `app/layout.tsx` - Root layout with Geist font loading
- `pages/DashboardPage.tsx` - Main dashboard composition
- Component hierarchy: Header → MenuBar → VenueList → Footer

**Business Logic Components:**

- `VenueCard.tsx` - Complex business card with photo management, rating display, and deal information
- `VenueList.tsx` - Infinite scroll implementation with pagination, filtering, and state management
- Advanced image loading with CDN fallbacks and error handling
- Real-time deal display based on current day of week

**Image Management System:**
Multi-tier image loading strategy in VenueCard:

1. CDN URLs (medium → small → thumbnail → large → original)
2. Fallback to external URLs
3. S3 direct URL construction
4. Placeholder image as final fallback

### Data Flow & State Management

**Business Data Pipeline:**

- API responses typed with comprehensive Business interface
- Photo metadata includes S3 variants and CDN URLs
- Deal information with time-based filtering for current day
- Pagination with infinite scroll using Intersection Observer API

**Error Handling Strategy:**

- API client throws typed ApiError instances with status codes
- Component-level error boundaries with retry mechanisms
- Graceful degradation for missing images or API failures
- User-friendly error messages with actionable retry buttons

### UI/UX Patterns

**Design System:**

- Custom color palette focused on green/teal theme (#9DC7AC, #527C6B, #2A5A45, #1B365D)
- Responsive grid layout (1-4 columns based on screen size)
- Tailwind with CSS variables for theming support
- Consistent loading states with animated spinners

**Interactive Features:**

- Infinite scroll with loading indicators
- Photo-only filtering toggle
- Hover effects and transitions
- Error state handling with retry options

### Configuration & Environment

**Next.js Configuration:**

- Image optimization for external domains (Google, Unsplash, Pexels, S3)
- API proxy rewrites to backend on port 3001
- AWS S3 bucket hostname configuration via environment variables

**Development Setup:**

- TypeScript strict mode with comprehensive type coverage
- Tailwind with shadcn/ui integration
- PostCSS configuration for CSS processing
- ESLint with Next.js recommended rules

### Key Development Patterns

**API Integration:**

- Always use `businessApi` service layer instead of direct axios calls
- Implement loading states for all async operations
- Handle errors gracefully with user feedback
- Use pagination patterns for large datasets

**Component Development:**

- Follow existing component patterns in `components/ui/`
- Use TypeScript interfaces for props and data structures
- Implement proper image loading strategies for external content
- Include proper accessibility attributes (alt text, ARIA labels)

**State Management:**

- Use React hooks for component state
- Implement loading, error, and success states for async operations
- Use useEffect for data fetching with proper dependency arrays
- Implement intersection observer for infinite scroll patterns

### Current Implementation Notes

**Mock Data:**

- `lib/data.ts` contains comprehensive mock business data for development
- Mock data includes full business schema with photos, deals, and ratings

**Development Server:**

- Configured to auto-open browser on startup
- Watches pages, components, and lib directories for changes
- Assumes backend running on localhost:3001

**Image Handling:**

- Complex multi-variant image system supporting CDN and S3 storage
- Automatic fallback chains for image loading failures
- Responsive image sizing with Next.js Image component optimization
