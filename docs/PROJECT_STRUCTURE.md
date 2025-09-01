# Project Structure

## Current Directory Structure
\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with fonts and analytics
│   └── globals.css         # Tailwind CSS v4 configuration and design tokens
├── components/
│   ├── theme-provider.tsx  # Theme context provider
│   └── ui/                 # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       └── ... (other shadcn/ui components)
├── docs/                   # Project documentation
│   ├── PRD.md             # Product Requirements Document
│   ├── ADR.md             # Architecture Decision Records
│   ├── PROJECT_STRUCTURE.md # This file
│   └── WORKFLOW.md        # Development workflow guidelines
├── hooks/
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notification hook
├── lib/
│   └── utils.ts           # Utility functions (includes cn for class names)
├── supabase/              # Supabase configuration (planned)
│   ├── migrations/        # Database migrations (planned)
│   ├── policies.sql       # Row Level Security policies (planned)
│   └── functions/         # Edge functions (planned)
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
\`\`\`

## Key Files and Their Purpose

### Application Core
- **app/layout.tsx**: Root layout component with font configuration and analytics
- **app/globals.css**: Global styles with Tailwind CSS v4 and design system tokens
- **next.config.mjs**: Next.js configuration file

### Components
- **components/ui/**: shadcn/ui component library for consistent UI elements
- **components/theme-provider.tsx**: Handles theme switching functionality

### Utilities
- **lib/utils.ts**: Common utility functions including the `cn` function for conditional class names
- **hooks/**: Custom React hooks for common functionality

### Documentation
- **docs/**: All project documentation following structured approach

### Planned Additions
- **supabase/**: Will contain database migrations, RLS policies, and edge functions
- **app/page.tsx**: Main application pages (to be added)

## Naming Conventions
- **Files**: kebab-case for component files (e.g., `user-profile.tsx`)
- **Components**: PascalCase for React components
- **Hooks**: camelCase starting with "use" (e.g., `useAuth`)
- **Utilities**: camelCase for functions and variables

---
*This structure will be updated as the project evolves.*
