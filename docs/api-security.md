# API Security Guidelines

## Authentication

- Use `requireSession()` for any authenticated endpoint
- Use `requireRole([...])` or `requireAdmin()` for role-gated endpoints
- Use `requireSiteAccess(session, resource.siteId)` before reading or mutating site-scoped resources

## Validation

- All POST/PATCH/PUT bodies must be validated with Zod schemas from `src/lib/schemas/`
- Enums (`DocumentStatus`, `UserRole`, `FeedbackStatus`) must use `z.nativeEnum()`

## Site scoping

- Admins are scoped to their assigned `siteId` unless a super-admin model is introduced
- All Prisma queries for users, documents, departments, templates, and feedback must filter by `siteId`

## File uploads

- Allowed MIME types are defined in `ALLOWED_MIME_TYPES`
- Max size: 1.5MB
- Filenames must be sanitized with `sanitizeFilename()` before storage and download headers

## HTTP status codes

- `401` — not authenticated
- `403` — authenticated but wrong role or cross-site access
- `400` — validation failure

## Proxy vs route handlers

- `src/proxy.ts` provides optimistic routing guards (auth redirect, PENDING blocking, role paths)
- Route handlers must still enforce authorization — proxy is not a sole security boundary

## Database operations

- Backups exclude password hashes
- Restore requires `confirmToken: "RESTORE_DATABASE"` and is site-scoped
