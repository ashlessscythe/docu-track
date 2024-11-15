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
- [x] **Implement local authentication system**
  - [x] Set up user registration and login
  - [x] Implement RBAC (Role-Based Access Control)

**Description:**

- Connect the application to the database using Prisma.
- Design and migrate the initial database schema.
- Implement authentication and role-based access control.

**Deploy and Test:** Once users can register, log in, and roles are assigned, deploy to allow for testing of authentication and basic data interactions.

---

## **Milestone 2.5: Database Seeding**

- [ ] **Create seed.ts script with faker data**
  - [ ] Implement --use-faker flag for generating realistic data
  - [ ] Add --count flag for specifying number of records
  - [ ] Add --clear flag for clearing existing data (false by default)
  - [ ] Generate users with different roles
  - [ ] Generate documents with various statuses
  - [ ] Ensure proper relationships between users and documents

**Description:**

- Create a flexible seeding system using faker.js
- Allow for easy testing with different data volumes
- Support development and testing scenarios
- Maintain referential integrity in generated data

**Test:** Verify seeding works with different flag combinations and generates valid data that can be used in the application.

---

## **Milestone 3: Document Submission Feature**

- [ ] **Develop document submission feature**
  - [ ] Form for submitters to upload documents
  - [ ] Validation for document fields

**Description:**

- Build the form for document submission.
- Ensure all input fields are validated.
- Enable file upload and storage.

**Deploy and Test:** Deploy after the submission feature is functional to test document uploads and data validation.

---

## **Milestone 4: Approver Dashboard**

- [ ] **Implement approver dashboard**
  - [ ] View submissions for their department
  - [ ] Approve or request follow-up on documents

**Description:**

- Create a dashboard for approvers to manage submissions.
- Implement functionality to approve or request follow-up.

**Deploy and Test:** Deploy to test the approver's ability to view and manage submissions relevant to their department.

---

## **Milestone 5: Submitter Dashboard**

- [ ] **Create submitter dashboard**
  - [ ] View their own submissions and statuses

**Description:**

- Develop a dashboard for submitters to track their document statuses.
- Display feedback or comments from approvers.

**Deploy and Test:** Deploy to ensure submitters can effectively track and view the status of their submissions.

---

## **Milestone 6: Access Control Enforcement**

- [ ] **Implement access control**
  - [ ] Ensure submitters only see their submissions
  - [ ] Ensure approvers only see their department's submissions

**Description:**

- Fine-tune the access control mechanisms.
- Test all user roles to ensure proper data isolation and security.

**Deploy and Test:** Deploy to rigorously test role-based permissions and data access restrictions.

---

## **Milestone 7: Admin Panel Development**

- [ ] **Develop admin panel**
  - [ ] User management (CRUD operations)
  - [ ] Database operations (backup, restore)
  - [ ] Reporting tools

**Description:**

- Build an interface for admins to manage users and perform database operations.
- Implement reporting tools for insights into app usage.

**Deploy and Test:** Deploy to test administrative functions and ensure the security of sensitive operations.

---

## **Milestone 8: UI/UX Enhancements**

- [ ] **Apply corporate styling**
  - [ ] Light and dark modes
  - [ ] Sleek and stylish UI/UX

**Description:**

- Refine the application's appearance to match corporate branding.
- Implement theme toggling between light and dark modes.
- Enhance overall user experience and interface responsiveness.

**Deploy and Test:** Deploy to gather feedback on the UI/UX and make adjustments as needed.

---

## **Milestone 9: Final Testing and Deployment**

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
