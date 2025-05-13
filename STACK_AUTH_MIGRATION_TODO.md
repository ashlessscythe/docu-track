# Stack Auth Migration TODO

This document outlines the steps needed to migrate from NextAuth to Stack Auth.

## Setup Tasks

- [x] Install Stack Auth package: `npm install @stackframe/stack`
- [x] Create Stack Auth configuration file (`stack.ts`)
- [x] Set up environment variables in `.env.local`
- [ ] Create Stack Auth project in the [Stack Auth dashboard](https://app.stack-auth.com/projects)
- [ ] Update environment variables with actual API keys

## Implementation Tasks

- [x] Create Stack Auth handler:

  - [x] Create `app/handler/[...stack]/page.tsx` file for auth pages

- [x] Update Root Layout:

  - [x] Update `app/layout.tsx` to use `StackProvider` and `StackTheme`
  - [x] Create `app/loading.tsx` for Suspense boundary

- [x] Update Auth Context:

  - [x] Replace `src/context/auth-context.tsx` with Stack Auth context

- [x] Update Auth Pages:

  - [x] Update Sign In page (`src/app/(auth)/signin/page.tsx`)
  - [x] Update Register page (`src/app/(auth)/register/page.tsx`)
  - [x] Update Sign Out page (`src/app/(auth)/signout/page.tsx`)
  - [x] Update Forgot Password page (`src/app/(auth)/forgot-password/page.tsx`)
  - [x] Update Reset Password page (`src/app/(auth)/reset-password/page.tsx`)

- [x] Update Middleware:

  - [x] Replace NextAuth middleware with Stack Auth middleware (`src/middleware.ts`)

- [x] Update Authenticated Layout:

  - [x] Update `src/app/(authenticated)/layout.tsx` to use Stack Auth

- [x] Update Components:
  - [x] Update Header component (`src/components/Header.tsx`) to use Stack Auth

## Data Migration Tasks

- [ ] Create migration script for existing users:
  - [ ] Export users from the database
  - [ ] Import users to Stack Auth using the REST API
  - [ ] Map user roles to Stack Auth permissions

## Role and Permission Setup

- [ ] Set up roles and permissions in Stack Auth:
  - [ ] Create ADMIN role with appropriate permissions
  - [ ] Create APPROVER role with appropriate permissions
  - [ ] Create SUBMITTER role with appropriate permissions
  - [ ] Create PENDING role with appropriate permissions
  - [ ] Create REPORTER role with appropriate permissions

## Testing Tasks

- [ ] Test authentication flow:
  - [ ] Test sign in
  - [ ] Test registration
  - [ ] Test sign out
  - [ ] Test password reset
  - [ ] Test role-based access control

## Cleanup Tasks

- [ ] Remove NextAuth dependencies:
  - [ ] Remove NextAuth from `package.json`
  - [ ] Remove NextAuth API routes
  - [ ] Clean up unused NextAuth code and files
