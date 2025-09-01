# Architecture Decision Records (ADR)

## ADR-001: Next.js as Primary Framework
**Date:** January 2025  
**Status:** Accepted  

### Context
Need to choose a React framework for building a modern web application with server-side rendering capabilities and good developer experience.

### Decision
Use Next.js 15+ with App Router for the primary framework.

### Consequences
- **Positive:** Excellent developer experience, built-in optimizations, strong ecosystem, Vercel deployment integration
- **Positive:** App Router provides modern React patterns with Server Components
- **Negative:** Framework lock-in, learning curve for App Router patterns

## ADR-002: Supabase for Backend Services
**Date:** January 2025  
**Status:** Accepted  

### Context
Need a backend solution that provides database, authentication, and real-time capabilities without complex infrastructure management.

### Decision
Use Supabase as the primary backend service for database, authentication, and real-time features.

### Consequences
- **Positive:** Integrated auth, real-time subscriptions, PostgreSQL database, good TypeScript support
- **Positive:** Reduces backend complexity and infrastructure management
- **Negative:** Vendor lock-in, potential limitations for complex backend logic

## ADR-003: Tailwind CSS v4 + shadcn/ui for Styling
**Date:** January 2025  
**Status:** Accepted  

### Context
Need a styling solution that provides consistency, maintainability, and rapid development capabilities.

### Decision
Use Tailwind CSS v4 with shadcn/ui component library for styling and UI components.

### Consequences
- **Positive:** Consistent design system, pre-built accessible components, excellent developer experience
- **Positive:** Tailwind v4 provides improved performance and developer experience
- **Negative:** Learning curve for Tailwind utility classes, potential for large HTML class lists

## ADR-004: Geist Font Family
**Date:** January 2025  
**Status:** Accepted  

### Context
Need a modern, readable font family that works well for both interface and code display.

### Decision
Use Geist Sans for UI text and Geist Mono for code/monospace needs.

### Consequences
- **Positive:** Modern, clean appearance, optimized for digital interfaces
- **Positive:** Consistent with Vercel ecosystem
- **Negative:** Additional font loading overhead

## ADR-005: Structured Documentation Approach
**Date:** January 2025  
**Status:** Accepted  

### Context
Need to maintain clear documentation and architectural decisions as the project grows to ensure maintainability.

### Decision
Implement structured documentation with PRD, ADR, PROJECT_STRUCTURE, and WORKFLOW files.

### Consequences
- **Positive:** Clear decision tracking, improved maintainability, better onboarding
- **Positive:** Forces thoughtful architectural decisions
- **Negative:** Additional overhead for documentation maintenance

## ADR-006: Lead Scoring System Architecture
**Date:** January 2025  
**Status:** Accepted  

### Context
Need a sophisticated lead scoring system to evaluate prospect quality for cold and warm outreach campaigns across multiple industries (Real Estate, Agencies, Coaches, Local Services, Financial Services).

### Decision
Implement a dual scoring system with different algorithms for cold and warm leads:
- **Cold Lead Scoring:** Website Activity (25%), Reviews (25%), Business Stability (20%), Revenue Proxies (20%), Fit (10%)
- **Warm Lead Scoring:** Behavior (60%), Urgency (30%), Profitability (10%)

### Consequences
- **Positive:** Accurate lead qualification, industry-specific targeting, data-driven outreach prioritization
- **Positive:** Flexible scoring allows for different outreach strategies
- **Negative:** Complex data collection requirements, potential for incomplete scoring data

## ADR-007: Database Field Naming Convention
**Date:** January 2025  
**Status:** Accepted  

### Context
Encountered mismatches between TypeScript interfaces (camelCase) and PostgreSQL database fields, causing scoring calculation failures.

### Decision
Standardize on snake_case for all database field names to align with PostgreSQL conventions and ensure consistency across the application.

### Consequences
- **Positive:** Eliminates field name mismatches, consistent with PostgreSQL best practices
- **Positive:** Reduces debugging overhead and data mapping errors
- **Negative:** Required refactoring of existing TypeScript interfaces and API endpoints

## ADR-008: Numeric vs Integer for Scoring Fields
**Date:** January 2025  
**Status:** Accepted  

### Context
Database insert errors occurred when trying to store decimal scoring values (e.g., "9.9") in integer fields, limiting scoring precision.

### Decision
Use PostgreSQL `numeric` type for all scoring fields instead of `integer` to allow decimal precision in scoring calculations.

### Consequences
- **Positive:** Enables precise scoring with decimal values, eliminates database insert errors
- **Positive:** More accurate lead qualification with granular scoring
- **Negative:** Slightly increased storage overhead for numeric vs integer fields

## ADR-009: CSV Import with Real-time Scoring
**Date:** January 2025  
**Status:** Accepted  

### Context
Need bulk lead import functionality that can handle comprehensive scoring data and calculate lead scores during import process.

### Decision
Implement CSV import functionality with real-time scoring calculation during the import process, including validation and error handling for scoring data fields.

### Consequences
- **Positive:** Efficient bulk lead processing, immediate score availability, comprehensive data validation
- **Positive:** Reduces manual scoring overhead for large lead lists
- **Negative:** Increased import processing time, complex error handling for malformed data

## ADR-010: Removal of Campaign Management
**Date:** January 2025  
**Status:** Accepted  

### Context
Campaign management functionality was complex, error-prone, and not essential for the core lead generation and scoring use case.

### Decision
Remove all campaign management features to focus on lead generation, scoring, and analytics as core competencies.

### Consequences
- **Positive:** Simplified application architecture, reduced maintenance overhead, focused feature set
- **Positive:** Eliminates problematic campaign creation errors and complex email template management
- **Negative:** Users must use external tools for campaign execution, reduced feature completeness

## ADR-011: Password Reset Implementation
**Date:** January 2025  
**Status:** Accepted  

### Context
Users need the ability to reset their passwords when they forget them, requiring a secure and user-friendly password recovery flow.

### Decision
Implement password reset functionality using Supabase's built-in authentication methods with email verification and secure token-based reset flow.

### Consequences
- **Positive:** Secure password recovery using industry-standard practices, seamless integration with existing auth system
- **Positive:** Reduces support overhead for locked-out users, improves user experience
- **Negative:** Additional email configuration requirements, potential for email delivery issues

## ADR-012: Dark Mode Implementation
**Date:** January 2025  
**Status:** Accepted  

### Context
Modern applications require dark mode support for user preference and accessibility, especially for applications used extensively throughout the day.

### Decision
Implement dark mode using Next.js themes with a toggle switch in the dashboard header, utilizing CSS custom properties for theme-aware styling.

### Consequences
- **Positive:** Improved user experience and accessibility, reduced eye strain for extended use
- **Positive:** Modern UI expectation met, professional appearance
- **Negative:** Additional CSS maintenance overhead, need to test all components in both themes

## ADR-013: User Settings Management
**Date:** January 2025  
**Status:** Accepted  

### Context
Users need the ability to manage their account settings, including changing email addresses and passwords without requiring admin intervention.

### Decision
Create a dedicated settings page with forms for email and password changes, using Supabase's user management APIs with proper validation and error handling.

### Consequences
- **Positive:** User autonomy for account management, reduced admin overhead, improved security practices
- **Positive:** Centralized location for user preferences and account settings
- **Negative:** Additional security considerations for sensitive operations, complex validation requirements

## ADR-014: Real Data Analytics Implementation
**Date:** January 2025  
**Status:** Accepted  

### Context
Analytics dashboard was displaying static mock data instead of actual lead performance metrics, reducing its value for business decision-making.

### Decision
Replace all mock data in analytics components with real database queries, calculating actual lead distributions, score analytics, and industry insights from existing lead data.

### Consequences
- **Positive:** Accurate business intelligence, real-time insights into lead quality and performance
- **Positive:** Data-driven decision making capabilities, proper ROI measurement
- **Negative:** Increased database query complexity, potential performance considerations for large datasets

## Development Session Summary - January 2025

### Overview
This session involved building a complete lead generation and outreach platform from scratch, implementing a sophisticated dual lead scoring system, and resolving multiple architectural challenges through iterative problem-solving.

### Key Accomplishments
1. **Complete Platform Build:** Implemented full-stack Next.js application with Supabase integration, including authentication, lead management, scoring engine, and analytics dashboard
2. **Dual Scoring System:** Built comprehensive cold/warm lead scoring with industry-specific weighting and detailed criteria matching business requirements
3. **Data Architecture:** Created robust database schema supporting complex scoring data with proper field types and constraints
4. **Import System:** Developed CSV import functionality with real-time scoring calculation and comprehensive error handling

### Critical Pitfalls Encountered and Resolved

#### 1. Field Name Mismatch Crisis
**Problem:** TypeScript interfaces used camelCase (`websiteQuality`) while database used snake_case (`website_quality`), causing complete scoring system failure.
**Resolution:** Standardized on snake_case throughout the application (ADR-007).
**Lesson:** Establish naming conventions early and maintain consistency across all layers.

#### 2. Data Type Precision Issues
**Problem:** Database insert errors when storing decimal scoring values (e.g., "9.9") in integer fields.
**Resolution:** Converted scoring fields from integer to numeric type (ADR-008).
**Lesson:** Consider data precision requirements during schema design, not after implementation.

#### 3. Hardcoded Default Scores
**Problem:** Import API was hardcoding all leads to score 5/10 instead of calculating actual scores.
**Resolution:** Implemented real-time scoring calculation during import process.
**Lesson:** Avoid placeholder values in production code; implement proper calculations from the start.

#### 4. Campaign Management Complexity
**Problem:** Campaign functionality was error-prone and overly complex for the core use case.
**Resolution:** Removed campaign features entirely to focus on core lead scoring competency (ADR-010).
**Lesson:** Sometimes removing features improves product focus and reliability.

#### 5. Database Schema Evolution Challenges
**Problem:** Multiple schema changes required careful migration planning to avoid data loss.
**Resolution:** Created incremental migration scripts with proper rollback considerations.
**Lesson:** Plan database evolution strategy early; avoid major schema rewrites.

### Technical Debt and Future Considerations
- **Form Validation:** Current forms have basic validation; consider implementing comprehensive client-side and server-side validation
- **Error Handling:** While improved, error handling could be more granular with user-friendly messages
- **Performance:** Large CSV imports may need optimization for better user experience
- **Testing:** No automated tests implemented; consider adding unit tests for scoring algorithms

### Architecture Strengths Achieved
- **Modular Scoring Engine:** Clean separation of scoring logic allows for easy algorithm updates
- **Type Safety:** Strong TypeScript integration reduces runtime errors
- **Database Constraints:** Proper constraints prevent invalid data entry
- **Real-time Calculations:** Immediate feedback improves user experience

### Recommendations for Future Development
1. **Implement comprehensive testing** for scoring algorithms before making changes
2. **Add database indexes** on frequently queried scoring fields for performance
3. **Consider caching** for expensive scoring calculations
4. **Implement audit logging** for scoring changes and data imports
5. **Add data export functionality** to complement import capabilities

This session demonstrates the importance of iterative problem-solving, consistent architectural decisions, and the willingness to remove complexity when it doesn't serve the core product vision.

---
*New ADRs will be added as architectural decisions are made.*
