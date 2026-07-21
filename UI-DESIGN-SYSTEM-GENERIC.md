# Multi-Role Dashboard — UI Design System

> **Stack:** Next.js 14 (App Router) · Tailwind CSS · shadcn/ui · Lucide Icons · Recharts  
> **Pattern:** Multi-portal, role-based SaaS dashboard with shared shell components

---

## Table of Contents

1. [Design Tokens & Color Palette](#1-design-tokens--color-palette)
2. [Global Layout Structure](#2-global-layout-structure)
3. [Header](#3-header)
4. [Sidebar](#4-sidebar)
5. [Login Page](#5-login-page)
6. [Page Header Component](#6-page-header-component)
7. [Stats Cards](#7-stats-cards)
8. [Data Table](#8-data-table)
9. [Charts](#9-charts)
10. [Shared UI Components](#10-shared-ui-components)
11. [Dashboard Page Pattern](#11-dashboard-page-pattern)
12. [List / CRUD Page Pattern](#12-list--crud-page-pattern)
13. [Form Pages](#13-form-pages)
14. [Role-Based Navigation Model](#14-role-based-navigation-model)
15. [Responsive Behavior](#15-responsive-behavior)
16. [Applying to a New Project — Checklist](#16-applying-to-a-new-project--checklist)

---

## 1. Design Tokens & Color Palette

Replace the values below with your brand colors. All references throughout the system use these tokens consistently.

| Token | Example Value | Usage |
|---|---|---|
| `--color-primary` | `#F58634` | Active nav, primary buttons, icons, chart fills, spinner border |
| `--color-primary-light` | `#FFE5D2` | Icon bg, avatar bg, active nav bg, hover highlights |
| `--color-bg-surface` | `#FFFFFF` | Header, sidebar, cards, modals |
| `--color-bg-canvas` | `#F4F7FA` | Main content area background |
| `--color-text-heading` | `#1E293B` (slate-800) | Dashboard section headings, stat values |
| `--color-text-body` | `#475569` (slate-600) | Body text, inactive nav links |
| `--color-text-muted` | `#94A3B8` (slate-400) | Labels, inactive icons, metadata |
| `--color-success` | shadcn `success` | Active / enabled status badges |
| `--color-danger` | `#DC2626` (red-600) | Destructive actions, logout, error text |
| `--color-border` | `#E2E8F0` (slate-200) | Card borders, dividers, table grid lines |

### Typography Scale

| Role | Tailwind Classes | Where Used |
|---|---|---|
| Brand / Logo secondary | `text-xs font-bold opacity-60` | Logo sub-line (e.g. product name) |
| Brand / Logo primary | `text-xl font-black leading-tight` | Logo main line (e.g. app name) |
| Page Title | `text-2xl font-semibold tracking-tight` | `PageHeader` title |
| Section Label | `text-sm font-semibold text-slate-800` | Dashboard grouped sections |
| Sidebar Section | `text-xs font-bold uppercase tracking-wider text-slate-400` | Sidebar section heading |
| Nav Link | `text-sm` | Sidebar nav items |
| Card Value | `text-lg sm:text-2xl font-bold` | Stats card metric |
| Card Label | `text-xs sm:text-sm font-semibold text-slate-500` | Stats card title |
| Caption / Meta | `text-[10px] text-muted-foreground` | Version text, descriptions |

---

## 2. Global Layout Structure

Every authenticated page uses a shared shell (`AppLayout`) that builds this composition:

```
┌─────────────────────────────────────────────────────────────┐
│                  HEADER  (h-16, sticky, z-50)               │
├──────────────────┬──────────────────────────────────────────┤
│  SIDEBAR         │                                          │
│  (Desktop only)  │   MAIN CONTENT AREA                      │
│  w-64 expanded   │   bg: --color-bg-canvas                  │
│  w-[88px] collapsed   max-w-7xl  px-4/6/8  py-6            │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

**Key measurements:**
- Full shell height: `h-screen overflow-hidden`
- Header height: `h-16` (64 px)
- Content area: `calc(100vh - 64px)` with `overflow-auto`
- Content max width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` with `py-6`
- Sidebar on mobile: replaced by a slide-in **drawer overlay**

**State managed at** `AppLayout` level:
- `isMobileMenuOpen: boolean` — controls mobile drawer
- `isSidebarCollapsed: boolean` — controls desktop sidebar width

---

## 3. Header

### Desktop Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ [LOGO AREA — matches sidebar width]  │ [NAV TABS]  │ [USER DROPDOWN] │
└──────────────────────────────────────────────────────────────────────┘
```

#### Logo Area (`hidden md:flex`, width syncs to sidebar)

| State | Width | Content |
|---|---|---|
| Expanded | `w-64 px-6` | Two-line brand text (sub-label + main name) |
| Collapsed | `w-[88px] justify-center` | Icon only (e.g. `Grip`) in `--color-primary-light` rounded box |

#### Navigation Tabs (center, `hidden md:flex flex-1`)

- Container: `bg-slate-100/80 dark:bg-slate-900 border p-1 rounded-xl flex items-center gap-1`
- Each tab links to the **first item** of that nav section
- **Active:** `bg-[--color-primary] text-white shadow-sm` · icons invert to white
- **Inactive:** `text-slate-600 hover:text-slate-900`
- Tab has: icon + section title label

> **Design intent:** Tabs switch top-level *sections*. The sidebar then shows sub-items of the active section only.

#### User Profile Dropdown (`ml-auto pr-6`)

- Avatar: `h-8 w-8 rounded-full bg-[--color-primary-light] text-[--color-primary] font-bold text-sm` — first letter of name
- Desktop label: first name + `ChevronDown`
- Dropdown items: Full name · Role (styled in primary color) · Separator · **Log out** (red)

#### Logout Loading Overlay

```css
fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm
→ centered: spinner (border-[--color-primary] border-t-transparent) + "Logging out…"
```

### Mobile Structure

```
┌───────────────────────────────────────┐
│  [☰/✕]        flex-1       [Avatar]  │  h-16
├───────────────────────────────────────┤
│  scrollable pill chips (border-t)     │  section nav
└───────────────────────────────────────┘
```

- Hamburger/X: `p-4 text-foreground/60`
- Pills: `rounded-full px-3 py-1.5 text-sm font-medium mr-2`
  - Active: `bg-[--color-primary] text-white`
  - Inactive: `text-muted-foreground hover:bg-muted`

---

## 4. Sidebar

> **Core rule:** The sidebar shows **only the sub-items of the currently active section**. Section switching happens via header tabs. When the active section is the "Dashboard", the sidebar is hidden and the content takes full width.

### Expanded State (`w-64`)

```
┌────────────────────────────┐
│  SECTION TITLE       [◁]  │  ← pt-6 px-6, text-xs uppercase slate-400
├────────────────────────────┤
│  Nav Item Label  [• icon]  │  ← active: border-l-4 primary, bg-primary-light, font-bold
│  Nav Item Label  [  icon]  │  ← inactive: border-transparent, text-slate-600
│  …                         │
├────────────────────────────┤
│  v1.0.0                    │  ← p-6 border-t text-[10px] slate-400
│  Powered by Company Name   │
└────────────────────────────┘
```

**Active link:**
- `border-l-4 border-[--color-primary] bg-[--color-primary-light] rounded-r-full font-bold`
- Icon wrapper: `bg-[--color-primary] text-white p-1 rounded-full shadow-sm`

**Inactive link:**
- `border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900`
- Icon: `text-slate-400 w-5 h-5`

**Collapse toggle:**
- Position: top-right of section header row
- Style: `bg-white border border-slate-200 rounded p-1 shadow-sm`
- Icon: `PanelLeftClose` — rotates 180° when collapsed (`transition-transform duration-300`)

### Collapsed State (`w-[88px]`)

```
┌──────────┐
│  [→◁]   │  ← centered toggle
├──────────┤
│  [icon]  │  ← p-3 mx-2 my-1 rounded-xl
│  [icon]  │    active: bg-primary-light text-primary shadow-sm
│  [icon]  │    inactive: text-slate-400 hover:bg-slate-100
├──────────┤
│   v1.x   │  ← text-[10px] uppercase bold
└──────────┘
```

- Tooltip (`title` attribute) shows label on hover
- Transition: `transition-all duration-300` on sidebar width

### Mobile Drawer

- `fixed` overlay, `z-[60]`, opens at `top: 65px` (below header)
- Backdrop: `bg-black/50`, click closes
- Panel: `w-64 bg-white shadow-2xl` — always expanded mode
- Closed by any nav link click

---

## 5. Login Page

### Layout Pattern

```
Desktop (lg+):
┌─────────────────────┬────────────────────────────────────┐
│                     │                                    │
│  IMAGE / BRAND      │  FORM AREA                         │
│  PANEL              │  flex items-center justify-center  │
│  w-1/2 xl:w-[45%]  │  px-12 py-10                       │
│  h-screen cover     │  max-w-md form                     │
│                     │                                    │
└─────────────────────┴────────────────────────────────────┘

Mobile:
┌─────────────────────────┐
│  Image / brand panel    │  h-[35vh], gradient overlay
│  (object-cover top)     │  from dark/20 to dark/90
├─────────────────────────┤
│  Form panel             │  -mt-4 overlap, rounded-t-[1.5rem]
│  (overlaps image)       │  bg-white z-20
└─────────────────────────┘
```

### Form Anatomy

- Wrapper: `w-full max-w-md`
- Title: `text-2xl lg:text-3xl font-extrabold tracking-tight`

**Tab states (driven by React state, not URL):**

| State | Title | Fields |
|---|---|---|
| `login` | e.g. "Welcome back!" | Identifier (ID/email) + Password + Submit |
| `forgot` | e.g. "Forgot password?" | Email/ID + Send Link |
| `reset` | e.g. "Reset your password" | Token + New password + Confirm |

**Form controls convention:**
- `Input` for text fields
- `SecureInput` (custom, masked) for passwords
- Full-width `Button` with `Loader2` spinner during async

**Feedback patterns:**
- Error: `AlertCircle` icon + `text-red-600` inline message
- Success: `CheckCircle2` icon + green message
- Loading: spinner replaces button icon, button disabled

**Optional: Role quick-fill chips** (for demo/dev environments)
- Horizontal row of chips per role
- Click pre-fills credentials
- Each chip has a role icon + label

---

## 6. Page Header Component

Used at the top of every list, CRUD, or form page.

```
┌──────────────────────────────────────────────────────────┐
│  Page Title (text-2xl font-semibold)   [Action Button →] │
│  Description text (text-sm muted)                        │
└──────────────────────────────────────────────────────────┘
```

**Props interface:**
```ts
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;   // e.g. <Button>Add New</Button>
}
```

**Layout:**
- `flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between`
- Title: `text-2xl font-semibold tracking-tight text-foreground`
- Description: `text-sm text-muted-foreground`
- Actions: `flex items-center gap-2` (right-aligned sm+)

---

## 7. Stats Cards

Displays a single KPI metric. Used in grids on dashboards.

```
┌──────────────────────────────────────────────┐
│  [🟧 icon bg]  Title                 [value] │
│               Description (optional)         │
└──────────────────────────────────────────────┘
```

**Props interface:**
```ts
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}
```

**Styles:**
- Card: `border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden`
- Padding: `p-3 sm:p-4`
- Icon box: `h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[--color-primary-light]`
- Icon: `h-4 w-4 sm:h-[18px] sm:w-[18px] text-[--color-primary]`
- Title: `text-xs sm:text-sm font-semibold text-slate-500 truncate`
- Description: `text-[10px] text-muted-foreground truncate`
- Value: `text-lg sm:text-2xl font-bold text-slate-800 shrink-0`

**Common grid layouts:**

| Columns | Tailwind | Use when |
|---|---|---|
| 3 stats | `sm:grid-cols-2 lg:grid-cols-3` | Small overview rows |
| 4 stats | `sm:grid-cols-2 lg:grid-cols-4` | Infrastructure-type counts |
| 5 stats | `grid-cols-1 sm:grid-cols-3 lg:grid-cols-5` | Operational summary |

> Wrap multiple stats sections in `<div className="flex flex-col gap-6">` with a `<h3>` section label above each grid.

---

## 8. Data Table

Full-featured client-side table component. Drop-in for any list page.

### Visual Anatomy

```
┌──────────────────────────────────────────────┐
│  [🔍 Search]                 [Actions slot]  │  ← toolbar row
├──────────────────────────────────────────────┤
│  Column A ↕  │  Column B  │  Column C  │ …  │  ← thead
├──────────────┼────────────┼────────────┼────┤
│  row data    │            │            │    │
│  row data    │            │            │    │
├──────────────────────────────────────────────┤
│  ≪  ‹  Showing 1-10 of 45  ›  ≫   [10 ▾]  │  ← pagination
└──────────────────────────────────────────────┘
```

**Column definition:**
```ts
interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  hiddenOnMobile?: boolean;    // hide on small screens, show in expand row
  render?: (item: T) => ReactNode;
}
```

**Features:**
- Client-side text search on one field (`searchKey` prop)
- Click column header to sort asc/desc (icons: `ArrowUpDown` / `ArrowUp` / `ArrowDown`)
- `hiddenOnMobile` columns collapse; expandable row reveals them
- Pagination: first / prev / next / last + per-page select (10 / 25 / 50)
- Optional `onRowClick` handler — adds hover + pointer cursor to rows

**Wrapped in:** `Card > CardContent`

---

## 9. Charts

Use for data visualization on dashboards. All charts use `recharts` with `ResponsiveContainer`.

### Chart Card Template

```
Card (border-slate-200 shadow-sm rounded-xl bg-white)
└── CardHeader pb-2
    └── CardTitle text-sm font-semibold text-slate-700
        ├── Icon box h-6 w-6 bg-[--color-primary-light] rounded-md
        │   └── Icon h-4 w-4 text-[--color-primary]
        └── Title string
└── CardContent
    └── div h-[250px] w-full mt-4
        └── ResponsiveContainer width="100%" height="100%"
```

### Available Chart Types

| Type | Component | When to use |
|---|---|---|
| Bar Chart | `BarChart` | Daily/weekly counts, comparisons |
| Pie / Donut | `PieChart` | Distribution / breakdown by category |
| Line / Trend | `LineChart` | Growth over time, monthly trends |

### Shared Chart Styling

```js
// Grid
<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

// Axes — no lines/ticks, slate-500 labels
axisLine={false} tickLine={false}
tick={{ fontSize: 12, fill: "#64748B" }}

// Tooltip
contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
itemStyle={{ color: "--color-primary", fontWeight: 600 }}

// Bar shape
fill="--color-primary"  radius={[4, 4, 0, 0]}  barSize={24}
```

**Two-chart dashboard row:**
```html
<div class="grid gap-4 sm:grid-cols-2">
  <BarChartCard />
  <PieChartCard />
</div>
```

---

## 10. Shared UI Components

### StatusBadge

Indicates active/inactive state on list rows.

```tsx
<StatusBadge active={true} />            // green "Active"
<StatusBadge active={false} />           // muted "Inactive"
<StatusBadge active={true} activeLabel="Enabled" inactiveLabel="Disabled" />
```

- Active: `bg-success text-success-foreground hover:bg-success/90`
- Inactive: `bg-muted text-muted-foreground`

### ConfirmDialog

Reusable confirmation modal for destructive or important actions.

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete Record?"
  description="This action cannot be undone."
  onConfirm={handleDelete}
  confirmLabel="Delete"
  destructive={true}
/>
```

- Uses `AlertDialog` (shadcn/ui)
- `destructive` prop adds `hover:bg-destructive/90` styling to confirm button

### LoadingSpinner

Full-area loading state — return from page component while data fetches:

```tsx
if (loading) return <LoadingSpinner />;
```

### InactivityGuard

Wrap portal layouts to auto-logout idle sessions:

```tsx
<InactivityGuard>
  <AppLayout>{children}</AppLayout>
</InactivityGuard>
```

Configure timeout threshold in the component itself.

### Toast Notifications

Uses `sonner`. Place `<Toaster position="top-right" richColors />` in each portal layout.

```ts
toast.success("Record saved.");
toast.error("Something went wrong.");
```

---

## 11. Dashboard Page Pattern

All role dashboards follow the same visual rhythm:

```
<div className="flex flex-col gap-6">

  <h3 className="mb-3 text-sm font-semibold text-slate-800">Group Label A</h3>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-N">
    <StatsCard ... />
    ...
  </div>

  <h3 className="mb-3 text-sm font-semibold text-slate-800">Group Label B</h3>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-N">
    <StatsCard ... />
  </div>

  {/* Conditional charts */}
  {hasData && (
    <div className="grid gap-4 sm:grid-cols-2">
      <BarChartCard />
      <PieChartCard />
    </div>
  )}

</div>
```

**Quick Action Cards** pattern (for end-user dashboards):

```
<Link href="/action-route">
  <Card className="group cursor-pointer border-primary/20 transition-all hover:border-primary hover:shadow-md">
    <CardContent className="flex items-center gap-3 p-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary
                      group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold">Action Label</p>
        <p className="text-xs text-muted-foreground">Short description</p>
      </div>
    </CardContent>
  </Card>
</Link>
```

Grid: `grid grid-cols-1 gap-3 sm:grid-cols-3`

---

## 12. List / CRUD Page Pattern

Standard pattern for all entity list pages:

```tsx
// Page structure
<div className="flex flex-col gap-6">
  <PageHeader
    title="Records"
    description="Manage your records."
    actions={<Button onClick={openCreateDialog}>Add New</Button>}
  />

  {/* Optional info banner */}
  <Card>
    <CardContent className="flex items-start gap-3 p-4 text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-xs">Informational note about this list.</p>
    </CardContent>
  </Card>

  <DataTable
    columns={columns}
    data={data}
    searchKey="name"
    searchPlaceholder="Search by name..."
    pageSize={10}
    actions={<Button variant="outline">Export</Button>}
  />
</div>
```

**Column patterns in use:**

| Field Type | Render Pattern |
|---|---|
| Code / ID | `<span className="font-mono text-sm">{value}</span>` |
| Status | `<StatusBadge active={row.isActive} />` |
| Date | `format(new Date(value), "MMM d, yyyy")` via `date-fns` |
| Badge / Tag | `<Badge variant="outline">{value}</Badge>` |
| Action buttons | `<Button size="sm" variant="ghost"><Pencil /></Button>` |

**CRUD dialogs:** Use shadcn `Dialog` with `DialogContent > DialogHeader + DialogBody + DialogFooter`.

---

## 13. Form Pages

For multi-step or complex booking/creation flows:

```
<Card>
  <CardContent className="p-6">
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-2">
        <Label htmlFor="field-id">Field Label</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>
            {options.map(o => <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Cascade: selection A filters options in selection B */}

      <Button className="w-full" disabled={!isValid || loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Submit
      </Button>

    </div>
  </CardContent>
</Card>
```

**Post-submit result:** Show in a `Dialog` (e.g. QR code, confirmation, generated values).

---

## 14. Role-Based Navigation Model

### Data Structure

```ts
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  featureFlag?: string;     // show only if flag is enabled
}

interface SidebarSection {
  title: string;
  icon?: ReactNode;         // used in header tab
  items: NavItem[];
}

// Keyed by role string
const PORTAL_NAV: Record<string, SidebarSection[]> = {
  superadmin: [ ... ],
  admin:      [ ... ],
  employee:   [ ... ],
  vendor:     [ ... ],
};
```

### Section Structure Rules

1. **First section** = Dashboard (for that role) → sidebar hidden when active
2. **Remaining sections** = feature areas (Infrastructure, People, Operations, etc.)
3. Header renders **all sections as tabs**
4. Sidebar renders **sub-items of active section only**
5. Active section = closest prefix match against current `pathname`

### Feature Flags

- Nav items with `featureFlag` are only shown when the flag is `true` from `/api/feature-flags`
- Fetch once on mount, keyed by role
- Items hidden but routes still exist (guard at API level too)

### Role → Portal Mapping Template

```
Role Name         URL Prefix    Nav Sections
─────────────     ──────────    ─────────────────────────────────────────
Super Admin       /superadmin   Dashboard · People · Operations · Settings
Admin             /admin        Dashboard · [Domain A] · [Domain B] · …
End User          /user         Dashboard · [Primary Actions]
Operator/Vendor   /operator     Dashboard · [Work Actions]
```

> **Tip:** If two backend roles share the same UI, map them to the same nav key (e.g., `canteenManager → "vendor"`).

### Portal Layout Template

```tsx
// app/(portals)/[role]/layout.tsx
export default function RoleLayout({ children }) {
  return (
    <AuthProvider>
      <FeatureFlagsProvider>       {/* optional */}
        <InactivityGuard>
          <AppLayout>{children}</AppLayout>
        </InactivityGuard>
        <Toaster position="top-right" richColors />
      </FeatureFlagsProvider>
    </AuthProvider>
  );
}
```

---

## 15. Responsive Behavior

| Breakpoint | Header | Sidebar | Content |
|---|---|---|---|
| **Mobile** (`< md 768px`) | Hamburger + Avatar only; section tabs as scrollable pill strip below header | Full-screen drawer overlay from left, opens at `top: 65px` | Full width, `px-4` |
| **Tablet** (`md 768px+`) | Full header with tabs | Visible sidebar (expanded or collapsed) | Flex row layout |
| **Desktop** (`lg 1024px+`) | Full header + user first name visible | `w-64` expanded / `w-[88px]` collapsed | `max-w-7xl` constrained |

**Sidebar collapse:**
- Toggle button inside sidebar (desktop only)
- Collapsed = icons only + tooltip
- Expanded = icon + label
- Transition: `transition-all duration-300`

**Tables:**
- Columns with `hiddenOnMobile: true` hide on `< md`
- Rows expand to show hidden column values on mobile

**Charts:**
- `ResponsiveContainer width="100%"` adapts to container
- Two-chart grid collapses to single column on mobile (`sm:grid-cols-2`)

---

## 16. Applying to a New Project — Checklist

Use this checklist when adapting this design system to a new project:

### 1. Brand & Colors
- [ ] Replace `#F58634` (primary orange) with your brand primary color
- [ ] Replace `#FFE5D2` (primary light) with a tinted version of your primary (10–15% opacity on white)
- [ ] Update logo text in `header.tsx` (two lines: sub-label + main name)
- [ ] Replace `/image.png` on login page with your brand illustration/photo

### 2. Navigation Setup
- [ ] Define your roles and URL prefixes in `lib/nav-config.tsx`
- [ ] Create a `SidebarSection[]` per role with icons from Lucide
- [ ] Add feature flags for any gated nav items
- [ ] Create `/app/(portals)/[role]/layout.tsx` per role using `AppLayout`

### 3. Dashboard Pages
- [ ] Identify 3–8 KPI stats per role → `StatsCard`
- [ ] Group stats under labelled sections
- [ ] Add 1–2 charts per dashboard (bar for trends, pie for breakdown)
- [ ] Add Quick Action cards for end-user roles

### 4. List Pages
- [ ] Use `DataTable` with typed `Column[]` definition
- [ ] Add `PageHeader` with title + description + action button
- [ ] Use `StatusBadge` for active/inactive fields
- [ ] Mark low-priority columns as `hiddenOnMobile: true`

### 5. Infrastructure
- [ ] Set up `AuthProvider` with `user.role` and `user.name`
- [ ] Expose `/api/feature-flags` endpoint returning `{ flags: Record<string, boolean> }`
- [ ] Place `<Toaster position="top-right" richColors />` in each portal layout
- [ ] Configure `InactivityGuard` timeout to match security requirements

### 6. Login
- [ ] Replace role quick-fill chips with your roles (or remove for production)
- [ ] Hook up `/api/auth/login` · `/api/auth/forgot-password` · `/api/auth/reset-password`
- [ ] Redirect after login based on `user.role` to the correct portal prefix

### 7. Dark Mode (optional)
- [ ] Components use `dark:` variants throughout — enable by adding `class="dark"` to `<html>`
- [ ] Canvas becomes `dark:bg-slate-900/50`, sidebar `dark:bg-slate-950`, header `dark:bg-slate-950`

---

*This document is a generic extract of a working production UI system.*  
*Adapt tokens, navigation structure, and page content to your domain.*
