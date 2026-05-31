# Agent Instructions

## Project Overview

Next.js 15 App Router project for meat distribution branch reporting (Vaqueros, Arrachera y Algo Mas).

## Commands

```bash
npm run dev     # Development server (turbopack)
npm run lint    # Lint only (no typecheck or test commands configured)
```

## Architecture

- **App Router**: Pages in `app/` directory, layouts in `app/layout.tsx`
- **API clients**: Two axios instances:
  - `lib/axios.ts` → Sales/reports API (`NEXT_PUBLIC_API_URL`)
  - `lib/axios-inventory.ts` → Inventory API
- **State**: Zustand store (`store/use-branch-store.ts`) for selected branch
- **Sidebar nav**: `components/app-sidebar.tsx` (single-level, no sub-groups)

## UI Components

- shadcn/ui with Tailwind CSS v4 (style: "new-york")
- Icon library: `@tabler/icons-react` (NOT lucide for custom icons)
- All shadcn components aliased via `@/components/ui`
- Components added via `npx shadcn@latest add <component>`

## Key Patterns

- Use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` composition for page sections
- `Skeleton` for loading states
- `Badge` for status indicators
- Data tables use `@tanstack/react-table` with `data-table.tsx` and `columns.tsx` pattern
- Date inputs always pair `label htmlFor` with `Input id` for accessibility
- Paginate lists with 10 items per page; include search filter when list > 10 items

## Accessibility

- All interactive elements must have visible focus states
- Icons in buttons use `aria-label` or visible text
- Loading states use `Skeleton` components, not spinners or text
- `prefers-reduced-motion` respected via `tw-animate-css`

## Environment

- API URL via `NEXT_PUBLIC_API_URL` env variable (see `.env`)