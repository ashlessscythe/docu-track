# **TODO List with Tollgates**

---

## **Milestone 1: Project Initialization**

- [x] **Set up Next.js project**
- [x] **Install shadcn UI components**
- [x] **Deployment pipeline setup**
- [x] **Automated testing configuration**

**Description:**

- Initialize the project with the necessary UI components.
- Set up the deployment pipeline to enable continuous integration.
- Configure automated testing to ensure code quality from the start.

**Deploy and Test:** After setting up the initial project structure, deployment pipeline, and testing framework, deploy to a staging environment to ensure everything is configured correctly.

---

## **Milestone 2: Database and Authentication Setup**

- [x] **Integrate Prisma with Neon.tech PostgreSQL database**
- [x] **Design database schema**
  - [x] Users table with roles (submitter, approver, admin)
  - [x] Documents table with fields: name, type, description, department, status
  - [x] Add departments and document types tables
  - [x] Update schema for PENDING users with null departments
- [x] **Implement local authentication system**
  - [x] Set up user registration and login
  - [x] Implement RBAC (Role-Based Access Control)
  - [x] Create landing page with proper navigation
  - [x] Implement role-based dashboard access
  - [x] Add pending state for new registrations
  - [x] Set up proper auth layouts and routing
  - [x] Add back navigation for auth pages
  - [x] Add GitHub repository link
  - [x] Add MIT license
  - [x] Configure environment variables
  - [x] Fix hydration issues with app name

**Description:**

- Connect the application to the database using Prisma.
- Design and migrate the initial database schema.
- Implement authentication and role-based access control.

**Deploy and Test:** Once users can register, log in, and roles are assigned, deploy to allow for testing of authentication and basic data interactions.

---

## **Milestone 2.5: Database Seeding**

- [x] **Create seed.ts script with faker data**
  - [x] Implement --use-faker flag for generating realistic data
  - [x] Add --count flag for specifying number of records
  - [x] Add --clear flag for clearing existing data (false by default)
  - [x] Generate users with different roles
  - [x] Generate documents with various statuses
  - [x] Ensure proper relationships between users and documents
  - [x] Add support for PENDING users with null departments
  - [x] Add departments and document types seeding

**Description:**

- Create a flexible seeding system using faker.js
- Allow for easy testing with different data volumes
- Support development and testing scenarios
- Maintain referential integrity in generated data

**Test:** Verify seeding works with different flag combinations and generates valid data that can be used in the application.

---

## **Milestone 3: Document Submission Feature**

- [x] **Develop document submission feature**
  - [x] Form for submitters to upload documents
  - [x] Validation for document fields
  - [x] File upload and storage implementation
  - [x] Document management features
    - [x] View document details
    - [x] Download documents
    - [x] Delete documents
    - [x] Replace/update documents
  - [x] Real-time document list updates
  - [x] Loading states and error handling
  - [x] Support for PENDING users submitting without department
  - [x] Dynamic department and document type selection

**Description:**

- Build the form for document submission.
- Ensure all input fields are validated.
- Enable file upload and storage.
- Implement comprehensive document management.

**Deploy and Test:** Deploy after the submission feature is functional to test document uploads and data validation.

---

## **Milestone 4: Approver Dashboard**

- [x] **Implement approver dashboard**
  - [x] View submissions for their department
  - [x] Approve or request follow-up on documents
  - [x] Admin access to all documents
  - [x] Proper dialog management and UI consistency

**Description:**

- Create a dashboard for approvers to manage submissions.
- Implement functionality to approve or request follow-up.
- Ensure consistent UI/UX with submitter dashboard.

**Deploy and Test:** Deploy to test the approver's ability to view and manage submissions relevant to their department.

---

## **Milestone 5: Submitter Dashboard**

- [x] **Create submitter dashboard**
  - [x] View their own submissions and statuses

**Description:**

- Develop a dashboard for submitters to track their document statuses.
- Display feedback or comments from approvers.

**Deploy and Test:** Deploy to ensure submitters can effectively track and view the status of their submissions.

---

## **Milestone 6: Templates**

- [x] **Add template Manager**
- [x] admin panel to upload templates for download
- [x] templates page for all authenticated and authorized users to download templates

## **Milestone 7: Access Control Enforcement**

- [x] **Implement access control**
  - [x] Ensure submitters only see their submissions
  - [x] Ensure approvers only see their department's submissions

**Description:**

- Fine-tune the access control mechanisms.
- Test all user roles to ensure proper data isolation and security.

**Deploy and Test:** Deploy to rigorously test role-based permissions and data access restrictions.

---

## **Milestone 8: Admin Panel Development**

- [x] **Develop admin panel**
  - [x] User management (CRUD operations)
  - [x] Department Management
  - [x] Document Types management
  - [x] Database operations (backup, restore)
  - [x] Reporting tools

**Description:**

- Build an interface for admins to manage users and perform database operations.
- Implement reporting tools for insights into app usage.

**Deploy and Test:** Deploy to test administrative functions and ensure the security of sensitive operations.

---

## **Milestone 9: UI/UX Enhancements**

- [ ] **Apply corporate styling**
  - [ ] Light and dark modes
  - [ ] Sleek and stylish UI/UX

**Description:**

- Refine the application's appearance to match corporate branding.
- Implement theme toggling between light and dark modes.
- Enhance overall user experience and interface responsiveness.

**Deploy and Test:** Deploy to gather feedback on the UI/UX and make adjustments as needed.

---

## **Milestone 10: Final Testing and Deployment**

- [ ] **Comprehensive testing**
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] End-to-end tests
- [ ] **Final deployment to production environment**

**Description:**

- Conduct thorough testing across all components.
- Ensure the application is stable, secure, and performs well under load.
- Prepare for the production deployment.

**Deploy and Test:** After passing all tests, deploy the application to the production environment.

---

# **Notes**

- **Continuous Deployment and Testing:** Each milestone concludes with a deployment and testing phase. This approach ensures that any issues are identified early and makes debugging easier.
- **Adjustments Between Milestones:** Based on testing feedback, you may need to iterate on previous milestones. Be prepared to make necessary adjustments.
- **Documentation:** Keep documentation up-to-date at each tollgate to facilitate onboarding and maintenance.

---
