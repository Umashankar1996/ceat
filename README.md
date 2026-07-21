# CEAT Truck Entry & Exit Processing System (TouchPoint)

A production-ready Vite + React 18 + TypeScript application for managing truck entry, inspection, weighment, and exit operations with comprehensive role-based access control.

## Features

✅ **Complete Truck Flow Management** - 7-step sequential process enforcement  
✅ **Role-Based Access Control** - 5 distinct user roles with granular permissions  
✅ **Beautiful UI** - Tailwind CSS + shadcn/ui with responsive design  
✅ **Real-time State Management** - Zustand for auth, trucks, and permissions  
✅ **Mock Data** - Pre-populated with 10+ trucks in various stages  
✅ **Dashboard** - Role-specific dashboards with KPI stats and quick actions  
✅ **Protected Routes** - Authentication & authorization on all pages  
✅ **Toast Notifications** - Sonner for user feedback  
✅ **Data Tables** - Sortable, searchable, paginated tables  
✅ **LocalStorage Persistence** - All data persists across sessions  

## Tech Stack

- **Vite** 5.0 - Lightning-fast build tool
- **React** 18 - UI framework
- **TypeScript** 5.3 - Type safety
- **React Router** v6 - Client-side routing
- **Zustand** 4.4 - Global state management
- **Tailwind CSS** 3.4 - Utility-first CSS
- **Lucide React** - Beautiful SVG icons
- **sonner** - Toast notifications
- **date-fns** - Date formatting utilities

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── AppLayout.tsx
│   ├── PageHeader.tsx
│   ├── StatsCard.tsx
│   ├── DataTable.tsx
│   ├── TruckStepper.tsx
│   ├── StatusBadge.tsx
│   ├── ConfirmDialog.tsx
│   ├── ProtectedRoute.tsx
│   └── LoadingSpinner.tsx
├── pages/               # Route pages
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── AllTrucksPage.tsx
│   ├── TruckDetailPage.tsx
│   ├── SecurityInspectionPage.tsx
│   ├── SAPEntryPage.tsx
│   ├── StoreApprovalPage.tsx
│   ├── WeighmentPage.tsx
│   ├── StoreAcknowledgementPage.tsx
│   ├── UserManagementPage.tsx
│   ├── RoleManagementPage.tsx
│   ├── PermissionManagerPage.tsx
│   └── NotFoundPage.tsx
├── data/                # Mock JSON data
│   ├── users.json
│   ├── trucks.json
│   ├── roles.json
│   └── permissions.json
├── store/               # Zustand stores
│   ├── authStore.ts
│   ├── truckStore.ts
│   └── permissionStore.ts
├── lib/                 # Utilities & types
│   ├── types.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── nav-config.ts
├── App.tsx              # Main routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone or extract the project
cd truck-ceat

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at `http://localhost:5173` automatically.

### Build for Production

```bash
npm run build      # Creates optimized dist/ folder
npm run preview    # Preview production build locally
```

## Demo Credentials

Use these **quick-fill chips** on the login page, or enter manually:

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | admin@ceat.com | admin123 |
| **Security Guard** | rajesh@ceat.com | guard123 |
| **Data Entry** | priya@ceat.com | data123 |
| **Store Team** | vikram@ceat.com | store123 |
| **Weighbridge Op** | meera@ceat.com | weigh123 |

## Truck Flow (7 Steps)

All trucks follow this **strict sequential flow**:

```
1. Security Inspection (Security Guard)
   ↓
2. SAP Entry (Data Entry Operator)
   ↓
3. Store Approval (Store Team)
   ↓
4. Vehicle Check-In (Gate Security)
   ↓
5. Weighment (Weighbridge Operator)
   ↓
6. Store Acknowledgement (Store Team)
   ↓
7. Vehicle Check-Out (Gate)
```

## User Roles & Access

### SuperAdmin
- **Access**: All pages and operations
- **Permissions**: Full CRUD on users, roles, and permissions
- **Dashboard**: System overview with all KPIs

### Security Guard
- **Access**: Inspection form, truck list, details
- **Key Action**: Complete vehicle security inspection
- **Navigation**: Dashboard → Operations

### Data Entry Operator
- **Access**: SAP entry queue, truck list
- **Key Action**: Enter vehicle data in SAP system
- **Navigation**: Dashboard → Operations

### Store Team
- **Access**: Approval queue, acknowledgement, truck list
- **Key Actions**: Approve trucks, acknowledge weights
- **Navigation**: Dashboard → Operations

### Weighbridge Operator
- **Access**: Weighment queue, truck list
- **Key Action**: Complete weighment and validation
- **Navigation**: Dashboard → Operations

## Key Pages

### Login Page
- Split layout on desktop, overlap on mobile
- **Role quick-fill chips** for demo purposes
- Beautiful CEAT branding with orange (#F58634) theme

### Dashboard (Role-Specific)
- KPI stats cards (total, in-progress, pending by stage)
- Quick action cards linking to role-specific queues
- Recent trucks timeline

### All Trucks
- Searchable data table with sorting
- Filter by stage and status
- Click rows to view detailed truck history

### Truck Detail
- Visual truck flow stepper showing current stage
- Complete truck information
- Inspection, SAP, weight, and acknowledgement data
- Full history timeline

### Role-Specific Pages
- **Security Inspection**: List of pending trucks with complete buttons
- **SAP Entry**: Queue with quick SAP entry buttons
- **Store Approval**: Approval queue with approve/reject actions
- **Weighment**: Weighment queue with completion actions
- **Store Acknowledgement**: Weight validation and acknowledgement

### Admin Pages (SuperAdmin only)
- **User Management**: CRUD users with role assignment
- **Role Management**: View and edit roles
- **Permission Manager**: Grid-based role-permission matrix

## Authentication & Persistence

- **Login**: Email + password validation against `users.json`
- **Session**: Stored in `localStorage` as JSON
- **Auto-login**: Checks localStorage on app load
- **Logout**: Clears session and redirects to login

## State Management

### authStore (Zustand)
- `user`: Current logged-in user
- `isLoggedIn`: Boolean flag
- Methods: `login()`, `logout()`, `checkAuth()`

### truckStore (Zustand)
- `trucks`: Array of all trucks
- Methods: `getTrucks()`, `updateTruck()`, `advanceTruckStage()`, etc.
- Persistence: Updates saved to localStorage

### permissionStore (Zustand)
- `permissions`: Role-page permission matrix
- `users`: All system users
- `roles`: All system roles
- Methods: `canAccessPage()`, `setPermission()`, etc.

## Styling

- **Primary Color**: `#F58634` (CEAT orange)
- **Primary Light**: `#FFE5D2` (light orange background)
- **Tailwind CSS**: Fully configured with custom color tokens
- **Responsive**: Mobile-first design with `md:` and `lg:` breakpoints
- **Components**: shadcn-ui-inspired with custom Tailwind implementation

## Data Persistence

All data is stored in browser `localStorage`:
- `auth` - Current user session
- `trucks` - Truck list and status
- `users` - User accounts
- `roles` - Role definitions
- `permissions` - Role-permission matrix

**Note**: Data resets when localStorage is cleared.

## Features Demo

### Advance a Truck Stage
On any truck detail page, click action buttons to advance the truck through stages. Each stage updates:
- Current stage
- Status (in_progress → completed)
- History timeline
- Related data (weights, inspections, etc.)

### Search & Filter
- Data tables support text search by key field
- Stage and status filters on all trucks page
- Pagination with configurable page size

### Overstay Alerts
- Trucks exceeding 5-hour threshold get `overstayAlert` flag
- Marked in dashboard stats and truck details
- Visible in truck list

### Responsive Design
- **Mobile**: Single column, hamburger menu, drawer sidebar
- **Tablet**: Two-column grid, visible sidebar
- **Desktop**: Full layout with collapsible sidebar

## Extending the App

### Add a New Role
1. Add to `PORTAL_NAV` in `lib/nav-config.ts`
2. Add permissions in `data/permissions.json`
3. Create role-specific pages in `src/pages/`
4. Add routes in `src/App.tsx`

### Add a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx` with `<ProtectedRoute>`
3. Add to navigation in `lib/nav-config.ts` and `data/permissions.json`

### Customize Colors
Edit `tailwind.config.ts` and `src/index.css`:
```ts
// tailwind.config.ts
colors: {
  primary: '#YOUR_COLOR',
  primary-light: '#YOUR_LIGHT_COLOR',
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **Code Splitting**: Route-based lazy loading ready
- **Bundle Size**: ~150KB gzipped (Vite optimized)
- **LocalStorage**: Efficient JSON serialization
- **Renders**: React 18 strict mode enabled

## Future Enhancements

- 🔧 Backend API integration
- 📊 Advanced analytics dashboard
- 📱 Mobile app with React Native
- 🔔 Real-time notifications via WebSocket
- 📸 Image upload for vehicle photos
- 📄 PDF report generation
- 🔐 OAuth2/SSO integration
- 🌙 Dark mode toggle

## Troubleshooting

**Issue**: Blank page after login  
**Solution**: Check browser console for errors. Ensure cookies/localStorage are enabled.

**Issue**: Routes not working  
**Solution**: Verify React Router setup in `App.tsx`. Check browser history support.

**Issue**: Styling looks wrong  
**Solution**: Clear `.next` folder (if present) and rebuild. Run `npm run dev` fresh.

**Issue**: Data not persisting  
**Solution**: Check browser storage quota. Clear localStorage if corrupted: `localStorage.clear()`

## Support & Feedback

For issues or improvements, check the console for detailed error messages and refer to component prop types in TypeScript.

---

**Built with ❤️ for CEAT Truck Operations**  
**Version**: 1.0.0 | **Last Updated**: April 2026
