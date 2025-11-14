# DocuTrack

A modern document tracking and approval system built with Next.js 14, Prisma, and PostgreSQL.

## Interface Overview

### Landing Page

A clean, modern landing page welcomes users with an intuitive interface for accessing the document management system.

![Landing Page](/public/images/landing.png)

### Document Submission

Our streamlined submission interface makes document uploading and processing efficient and user-friendly.

![Document Submission](/public/images/submit.png)

### Administrative Dashboard

A powerful admin dashboard provides comprehensive control over documents, users, and system settings.

![Admin Dashboard](/public/images/admin.png)

## Core Features

- 🔐 Role-based access control (Admin, Approver, Submitter)
- 📝 Document submission and tracking
- ✅ Approval workflow management
  - Department-specific document views
  - Admin access to all documents
  - Approve/Reject/Review actions
  - Document status tracking
- 🛡️ Cloudflare Turnstile protection on registration
  - Prevents automated bot registrations
  - Privacy-focused alternative to traditional CAPTCHAs
  - Seamless user experience with invisible or interactive challenges
  - Configurable via `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` environment variables
- 🔒 JWT versioning for secure deployments
  - Force re-authentication after system updates
  - Configurable via JWT_VERSION environment variable
- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark mode support (coming soon)
- 🔄 Real-time updates
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Neon.tech)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Bot Protection:** Cloudflare Turnstile
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Testing:** Jest & React Testing Library

## Security Features

### Cloudflare Turnstile

DocuTrack uses Cloudflare Turnstile to protect the registration endpoint from automated bot attacks. Turnstile is a privacy-focused alternative to traditional CAPTCHAs that:

- **Prevents bot registrations**: Automatically blocks automated signup attempts
- **Privacy-friendly**: No tracking cookies or personal data collection
- **User-friendly**: Provides a seamless experience with invisible challenges for most users
- **Free to use**: No cost for reasonable usage volumes

To enable Turnstile protection:

1. Sign up for a Cloudflare account (if you don't have one)
2. Navigate to [Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) in your Cloudflare dashboard
3. Create a new site and get your Site Key and Secret Key
4. Add them to your `.env` file:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key-here
   TURNSTILE_SECRET_KEY=your-secret-key-here
   ```

If Turnstile keys are not configured, the registration endpoint will work without bot protection. This allows for development and testing without requiring Cloudflare credentials.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ashlessscythe/docu-track.git
   cd docu-track
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in the `.env` file. Make sure to set:
   - `JWT_VERSION` to control authentication versioning
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for bot protection on registration
     - Get your keys from [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
     - Turnstile is optional - if keys are not provided, registration will work without bot protection

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional):

   ```bash
   # Basic seed
   npx prisma db seed

   # With faker data
   npx prisma db seed -- --use-faker --count 10
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
docu-track/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions and configurations
│   └── types/              # TypeScript type definitions
├── prisma/                  # Database schema and migrations
└── public/                 # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
