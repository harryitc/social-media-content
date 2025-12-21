# Project Knowledge Base

## 1. Project Overview
- SocialHub is a frontend-only Next.js application that centralizes social media management tasks (content planning, drafting, analytics) for Vietnamese-speaking users.
- Intended for operations teams managing Facebook pages: monitor performance, curate media libraries, generate AI-assisted content, and control scheduling workflows.
- Design philosophy emphasizes dashboard-driven UX, rapid prototyping with mock data, and reuse of a consistent layout plus shadcn/ui primitives for visual coherence.

## 2. Tech Stack
- **Languages**: TypeScript-first React components; Tailwind CSS for styling.
- **Frameworks**: Next.js App Router (React Server Components with "use client" overrides), shadcn/ui over Radix primitives for UI, next-themes for theming hooks (currently unused in layout).
- **Libraries**: lucide-react icons, recharts for analytics visualization, react-hook-form & zod scaffolding (not yet wired), date-fns utilities, embla for carousel (unused), custom toast system built on Radix toasts.
- **Infrastructure / tools**: pnpm/ npm for dependency management, PostCSS with @tailwindcss/postcss, Vercel Analytics, Analytics instrumentation in [app/layout.tsx](app/layout.tsx), TypeScript config with path alias `@/*`.

## 3. Architecture
- **Architectural pattern**: Feature-first modular frontend. Each route under `app/` loads a high-level content component from `components/**/` and wraps it with the shared [components/layout/dashboard-layout.tsx](components/layout/dashboard-layout.tsx).
- **Layer responsibilities**: `app/` defines routing + metadata; `components/layout` handles chrome; `components/<feature>` house UI and mock business logic; `components/ui` exposes reusable primitives; `hooks` and `lib` provide cross-cutting utilities.
- **Dependency direction**: Pages depend on feature components → feature components depend on UI primitives/hooks/lib utilities. No feature imports another feature directly; shared behavior must live in `components/ui`, `hooks`, or `lib`.

## 4. Folder Structure Explained
- **app/**: Next.js route segments (dashboard, posts, calendar, library, settings). Each page should only compose layouts and feature content; no heavy logic here.
- **components/layout/**: Application chrome components (currently only `dashboard-layout`). Keep navigation, theming, header logic here; avoid embedding feature-specific state.
- **components/dashboard | calendar | library | posts | settings/**: Feature modules containing client components, mock datasets, and workflow UI. Add new screens or sub-workflows inside the relevant feature directory; avoid cross-feature imports.
- **components/posts/** substructure: granular building blocks (editor, preview, AI helpers, tables, dialogs). Reuse them for any post-related route (list, create, analytics) instead of duplicating logic elsewhere.
- **components/ui/**: shadcn-derived primitives (button, card, dropdown, toast, etc.). Only place low-level, reusable UI atoms here. Avoid putting feature logic or business state inside this folder.
- **hooks/**: Global React hooks (`use-toast`, `use-mobile`). Only put hooks that are reused across features. Feature-specific hooks should stay near their feature.
- **lib/**: Utility helpers like [lib/utils.ts](lib/utils.ts) for `cn()`. Keep global helpers side-effect free and framework agnostic.
- **public/** & **styles/**: Static assets (images, icons) and legacy CSS. Use these folders for global styles and media only.

## 5. Core Modules & Responsibilities
- **Dashboard** ([components/dashboard/dashboard-content.tsx](components/dashboard/dashboard-content.tsx)): Renders KPIs, charts (recharts), recent posts, schedules, and quick actions.
- **Posts** ([components/posts/posts-content.tsx](components/posts/posts-content.tsx)): Provides filters, stats cards, export dialog, and delegates list rendering to [PostsTable](components/posts/posts-table.tsx).
- **Post Creation Suite** ([components/posts/create-post-content.tsx](components/posts/create-post-content.tsx)): Coordinates editor, preview, and action buttons for drafting/scheduling posts.
- **AI Assistants** ([components/posts/ai-content-generator.tsx](components/posts/ai-content-generator.tsx), [components/posts/ai-image-generator.tsx](components/posts/ai-image-generator.tsx)): Simulate AI workflows, manage loading states, and push generated content/images back to the editor via callbacks.
- **Calendar** ([components/calendar/calendar-content.tsx](components/calendar/calendar-content.tsx)): Implements mock scheduling grid plus side summaries for today/upcoming events.
- **Library** ([components/library/library-content.tsx](components/library/library-content.tsx)): Handles media/templates browsing with search, filters, grid/list toggles.
- **Settings** ([components/settings/settings-content.tsx](components/settings/settings-content.tsx)): Tabbed configuration for account, integrations, notifications, and appearance.
- **Layout** ([components/layout/dashboard-layout.tsx](components/layout/dashboard-layout.tsx)): Provides sidebar navigation, top bar actions, dark-mode toggle, notifications, and user menu.

## 6. Data Flow & Business Logic
- Data enters as mock arrays defined at the top of each feature file (e.g., `stats`, `mockPosts`, `mockEvents`). There's no backend; values are placeholders.
- User interactions (`useState`, `useEffect`) mutate local UI state (filters, active tabs, toggles). Generated content flows upward via callbacks (e.g., `AIContentGenerator.onContentGenerated` updates `PostEditor` state in [create-post-content.tsx](components/posts/create-post-content.tsx)).
- No persistence layer. Export actions, AI generations, and scheduling currently simulate asynchronous operations with `setTimeout`. When real services are added, replace these sections with API calls while preserving the callback contracts.
- Data is rendered back via shadcn components and recharts visualizations. Any future API responses should be normalized before passing into these presentational layers.

## 7. API / Services / Integrations
- **Internal APIs**: None beyond React props/state. Toast system exposes `useToast()` for notifications.
- **External APIs**: Placeholders for AI generation (comments in [ai-content-generator.tsx](components/posts/ai-content-generator.tsx)) and report export logging in [export-report-dialog.tsx](components/posts/export-report-dialog.tsx). Integrations tab references n8n/webhooks but no actual networking code.
- **Contracts & assumptions**: Callback props (`onContentGenerated`, `onImagesGenerated`) must remain synchronous and side-effect free besides state updates. Export dialog expects `open`/`onOpenChange` to control dialog state.

## 8. State Management / Data Access Pattern
- State is purely local via React `useState`. Complex shared state is avoided; cross-component communication happens through prop drilling from page → feature component → child.
- Business logic lives alongside the UI it powers (e.g., sorting/filter stub logic inside post content module). When adding real business logic, extract reusable pieces into `hooks/` or dedicated service modules to prevent bloated components.
- Persistence/data access is currently mocked. Any future data fetching should leverage Next.js `fetch`/server actions or dedicated client hooks; keep side effects out of UI primitives.

## 9. Coding Conventions & Patterns
- Naming favors PascalCase for components, camelCase for variables/state, uppercase for constant arrays (e.g., `const stats = [...]`).
- File organization: route-level pages import from `components/<feature>`. Shared helpers belong to `lib/` or `hooks/`. UI primitives live in `components/ui/`.
- Styling uses Tailwind utility classes with the `cn()` helper for conditional logic. Avoid inline styles.
- Error handling is minimal (mostly toast validations). Follow the toast pattern (see [hooks/use-toast.ts](hooks/use-toast.ts)) for user feedback rather than browser alerts.
- Validation: currently manual (e.g., check for empty idea before generating AI content). When adding forms, prefer `react-hook-form` + `zod` (already in deps).
- Reusability: break complex views into focused components (e.g., StatsCards, PostsTable, PostEditor). Favor prop-driven configuration instead of duplicating markup.

## 10. Existing Features
- **Dashboard analytics**: KPI cards, area/bar charts, recent posts, schedule summary ([components/dashboard/dashboard-content.tsx](components/dashboard/dashboard-content.tsx)).
- **Post management**: Filtering controls, table/grid views with contextual actions ([components/posts/posts-content.tsx](components/posts/posts-content.tsx)).
- **Post creation**: Rich editor with hashtag suggestions, image uploader with drag-and-drop reordering, AI assistants, preview with desktop/mobile toggle ([components/posts/post-editor.tsx](components/posts/post-editor.tsx), [components/posts/post-preview.tsx](components/posts/post-preview.tsx)).
- **Calendar planning**: Monthly grid, today/upcoming lists, scheduling stats ([components/calendar/calendar-content.tsx](components/calendar/calendar-content.tsx)).
- **Library management**: Image/template browsing with upload CTA, search, filters, view modes ([components/library/library-content.tsx](components/library/library-content.tsx)).
- **Reporting**: Export dialog to configure report type, metrics, format, timeframe ([components/posts/export-report-dialog.tsx](components/posts/export-report-dialog.tsx)).
- **Settings**: Account, security, integrations, notifications, appearance tabs ([components/settings/settings-content.tsx](components/settings/settings-content.tsx)).

## 11. Extension Rules (VERY IMPORTANT)
- New pages must live under `app/<route>/page.tsx` and should only compose `DashboardLayout` plus a feature component from `components/<feature>/`.
- Add new feature logic inside the relevant `components/<feature>/` directory. If multiple pages share logic, factor it into a dedicated component within that feature folder or a hook.
- Reuse `components/ui/` primitives; do not inline bespoke HTML for controls already available (Button, Input, Card, Tabs, etc.).
- Maintain prop-driven communication: parent components own state; child components receive callbacks for mutations.
- When introducing API calls, isolate them in hooks or service functions to keep UI components declarative. Provide loading/error UI consistent with existing patterns (Button disabled states, toasts).
- Respect the dark-mode toggling class strategy (class-based `document.documentElement.classList.toggle("dark")`). If migrating to `next-themes`, update layout + ThemeProvider consistently.

## 12. Things AI Must NOT Do
- Do not remove or bypass `DashboardLayout`; it anchors navigation and theming.
- Do not mix feature logic into `components/ui/` or mutate shared UI primitives for single-use behavior.
- Do not hardcode API keys, secrets, or real credentials inside the repo.
- Avoid introducing global mutable state or third-party state managers without architectural approval; stick to React hooks unless a clear cross-feature requirement exists.
- Do not delete mock data without replacing it with equivalent live data; many UI states depend on those placeholders.
- Do not alter metadata or routing in [app/layout.tsx](app/layout.tsx) without ensuring icons/analytics remain wired.

## 13. Examples of Correct Feature Implementation
1. **Adding Instagram Analytics Tab**: Create `components/posts/instagram-analytics.tsx` encapsulating charts + stats. Add a new tab inside [components/posts/posts-content.tsx](components/posts/posts-content.tsx) that conditionally renders the new component. Keep data arrays local to the component or fetch via a custom hook; reuse Card, Tabs, and Badge primitives.
2. **Scheduling API Integration**: Implement `hooks/use-schedule-post.ts` that wraps API calls (fetch, loading, error). In [components/posts/create-post-content.tsx](components/posts/create-post-content.tsx), call the hook when clicking "Lên lịch đăng", surface loading states via Button disabled prop, and show success/error toasts using `useToast()`.
