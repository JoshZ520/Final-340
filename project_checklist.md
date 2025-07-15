# D&D Character Sharing Website: 3-Day Completion Checklist

## **Day 1: Database, Auth, and Core Structure**

### Database Design & Structure
- [ ] Review your current database schema (tables, columns, types)
- [ ] Ensure tables are normalized (no redundant data, proper relationships)
- [ ] Confirm all foreign keys are set up (e.g., user_id in characters, messages, etc.)
- [ ] Add/adjust migrations or SQL as needed
- [ ] Test relationships by creating and querying related records

### User Accounts & Authentication
- [ ] Test user registration, login, and logout flows
- [ ] Confirm roles exist in the database (admin, user, etc.)
- [ ] Implement or review role-based middleware for protected/admin routes
- [ ] Test access control (admin vs. user vs. guest)

### Dynamic Content Management
- [ ] Ensure admins can manage site content (approve characters, manage users)
- [ ] Confirm users see content based on their role (e.g., only approved characters for regular users)
- [ ] Test dynamic EJS rendering for different roles

### Code Quality Pass
- [ ] Refactor code for modularity (split controllers, routes, models)
- [ ] Remove unused code and files
- [ ] Add comments and documentation where needed

---

## **Day 2: User Interactions, Contact, and Workflow**

### User Interactions & Engagement
- [ ] Implement a user interaction system (reviews, comments, upvotes, etc.)
- [ ] Link user-generated content to user accounts in the database
- [ ] Add validation to prevent inappropriate or empty submissions
- [ ] Test interaction features as different users

### Contact Form
- [ ] Build a contact form page (EJS)
- [ ] Save submitted messages to the database
- [ ] Create an admin view to list and manage messages
- [ ] Test submitting and viewing messages

### Internal Task/Workflow System
- [ ] Implement a workflow system (e.g., content approval, support tickets)
- [ ] Allow users to submit requests/tickets
- [ ] Allow admins to view, update, and resolve requests
- [ ] Users can see the status/history of their requests

### Page Views & Server-Side Rendering
- [ ] Ensure all pages use EJS, layouts, and partials
- [ ] Add dynamic routes (e.g., `/character/:id`)
- [ ] Refactor repeated sections into partials (header, footer, etc.)

---

## **Day 3: Admin Dashboard, Polish, and Deployment**

### Admin/Management Dashboard
- [ ] Build a dashboard for managing users, content, and workflow items
- [ ] Add moderation tools (approve/flag/delete content)
- [ ] Add operational data (logs, activity if possible)
- [ ] Test dashboard features as admin

### Code Quality & Best Practices
- [ ] Refactor to ESM syntax (use `import`/`export`, no `require`)
- [ ] Add error handling (try/catch, error middleware)
- [ ] Ensure MVC structure and clean folder organization
- [ ] Remove any remaining inline CSS/JS

### Final Testing & Polish
- [ ] Test all features as different roles (admin, user, guest)
- [ ] Check for missing requirements
- [ ] Polish UI/UX, fix bugs, add comments

### Deployment
- [ ] Deploy to Render
- [ ] Connect PostgreSQL in production
- [ ] Test live site and database
- [ ] Do a final walkthrough of all requirements 