# Development Workflow

## Documentation-First Development
This project follows a structured approach where documentation drives development decisions and maintains project clarity.

## Required Documentation Updates
Every code change MUST include corresponding documentation updates:

### Before Making Changes
1. **Review existing docs** - Check PRD.md, ADR.md, and PROJECT_STRUCTURE.md
2. **Plan the change** - Understand how it fits into current architecture
3. **Document decisions** - Add ADR entries for any architectural choices

### After Making Changes
1. **Update PRD.md** - Add/modify features, user stories, or requirements
2. **Update ADR.md** - Document any architectural decisions made
3. **Update PROJECT_STRUCTURE.md** - Reflect any file/folder changes
4. **Update WORKFLOW.md** - Modify process if needed

## Development Checklist
For every feature or change, ensure:

- [ ] **PRD Updated**: Feature requirements and user stories documented
- [ ] **ADR Updated**: Architectural decisions recorded with context and consequences
- [ ] **Structure Updated**: PROJECT_STRUCTURE.md reflects current file organization
- [ ] **Code Quality**: Follows established patterns and conventions
- [ ] **Supabase Integration**: Migrations in `/supabase/migrations/`, policies in `/supabase/policies.sql`
- [ ] **Testing**: Functionality verified in development environment

## Supabase Development Guidelines

### Database Changes
- **Migrations**: All schema changes go in `supabase/migrations/`
- **Policies**: Row Level Security policies in `supabase/policies.sql`
- **Functions**: Edge functions in `supabase/functions/`

### Integration Pattern
1. Check integration status with GetOrRequestIntegration
2. Create/update database schema via migrations
3. Implement application logic
4. Update documentation

## Code Organization Principles

### Component Structure
- Keep components focused and single-purpose
- Use composition over inheritance
- Prefer server components when possible
- Client components only when interactivity is needed

### File Organization
- Group related functionality together
- Use consistent naming conventions
- Keep the project structure flat when possible
- Separate concerns (UI, logic, data)

## Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Accessibility**: WCAG AA compliance for all UI components
- **Performance**: Optimize for Core Web Vitals
- **Security**: Follow Supabase RLS best practices

## Review Process
Before considering any change complete:
1. All documentation is updated
2. Code follows established patterns
3. Integration tests pass
4. Security considerations addressed

---
*This workflow ensures maintainable, well-documented code that scales with the project.*
