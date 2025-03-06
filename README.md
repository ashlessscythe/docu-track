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
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Testing:** Jest & React Testing Library

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

   Fill in your environment variables in the `.env` file. Make sure to set the `JWT_VERSION` to control authentication versioning.

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
