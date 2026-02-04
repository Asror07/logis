export const projectScopeData = {
  title: "ProStatus Logistics - Project Scope",
  
  objectives: {
    main: "Create a real-time load tracking, automated communication, and exception management platform.",
    smart: [
      { goal: "Real-time load tracking", measure: "100% load visibility" },
      { goal: "Automated notifications", measure: "SMS, Email, Call channels" },
      { goal: "Exception detection", measure: "AI-powered anomaly detection" },
      { goal: "Driver management", measure: "Manage all drivers" },
      { goal: "Analytics & Reporting", measure: "Real-time reports" },
    ]
  },

  deliverables: {
    frontend: [
      { module: "Admin Dashboard", description: "Main statistics and KPIs" },
      { module: "Load Monitoring", description: "Real-time map and load tracking" },
      { module: "Driver Management", description: "Driver list and profiles" },
      { module: "Exception Management", description: "Issue detection and management" },
      { module: "Analytics Dashboard", description: "Charts and reports" },
      { module: "Templates", description: "SMS, Email, Call templates" },
      { module: "User Preferences", description: "User settings" },
      { module: "Notifications", description: "Notification center" },
      { module: "Interaction Logs", description: "Communication history" },
      { module: "Reports", description: "Report generation" },
      { module: "Settings", description: "System settings" },
    ],
    backend: [
      { service: "Authentication API", description: "JWT token, role-based access" },
      { service: "User Management API", description: "Users CRUD" },
      { service: "Load Management API", description: "Loads CRUD and status" },
      { service: "Driver Management API", description: "Drivers CRUD" },
      { service: "Real-time GPS API", description: "GPS data via WebSocket" },
      { service: "RingCentral SMS API", description: "SMS sending and receiving" },
      { service: "Resend Email API", description: "Email sending" },
      { service: "Voice Call API", description: "Calls via RingCentral" },
      { service: "Exception Detection API", description: "Anomaly detection" },
      { service: "Analytics API", description: "Statistics and reports" },
      { service: "Webhook Endpoints", description: "External integrations" },
      { service: "WebSocket Server", description: "Real-time updates" },
    ],
    documentation: [
      { document: "API Documentation", description: "Swagger/OpenAPI spec" },
      { document: "User Guide", description: "User manual" },
      { document: "Admin Guide", description: "Administrator manual" },
      { document: "Integration Guide", description: "External systems integration" },
    ]
  },

  technicalRequirements: {
    frontend: [
      { technology: "React", version: "^18.3.1", purpose: "UI Framework" },
      { technology: "TypeScript", version: "Latest", purpose: "Type Safety" },
      { technology: "Tailwind CSS", version: "Latest", purpose: "Styling" },
      { technology: "Vite", version: "Latest", purpose: "Build Tool" },
      { technology: "React Router", version: "^6.30.1", purpose: "Routing" },
      { technology: "TanStack Query", version: "^5.83.0", purpose: "Data Fetching" },
      { technology: "Recharts", version: "^2.15.4", purpose: "Charts" },
      { technology: "Mapbox GL", version: "^3.17.0", purpose: "Maps" },
      { technology: "Radix UI", version: "Latest", purpose: "UI Components" },
    ],
    backend: [
      { technology: "Python", version: "3.11+", purpose: "Backend Language" },
      { technology: "Django", version: "4.2+", purpose: "Web Framework" },
      { technology: "Django REST Framework", version: "3.14+", purpose: "REST API" },
      { technology: "Django Channels", version: "4.0+", purpose: "WebSocket" },
      { technology: "PostgreSQL", version: "15+", purpose: "Database" },
      { technology: "Redis", version: "7+", purpose: "Cache & WebSocket" },
      { technology: "Celery", version: "5+", purpose: "Background Tasks" },
    ],
    integrations: [
      { service: "Mapbox", purpose: "Maps" },
      { service: "RingCentral", purpose: "SMS + Voice Call" },
      { service: "Resend", purpose: "Email" },
      { service: "Redis Cloud", purpose: "Cache" },
    ]
  },

  userRoles: [
    { role: "Admin", permissions: "Full access, settings, user management" },
    { role: "Dispatcher", permissions: "Loads, drivers, notifications management" },
    { role: "Driver", permissions: "View own loads and profile only" },
    { role: "Updater", permissions: "Load status updates, basic data entry" },
  ],

  systemArchitecture: `
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                  React + TypeScript + Tailwind                  │
│                         (Lovable)                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API + WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PYTHON BACKEND                             │
│              Django + Django REST Framework                     │
│                    + Django Channels                            │
├─────────────────────────────────────────────────────────────────┤
│  Auth API │ Load API │ Driver API │ Analytics │ WebSocket       │
└─────┬─────────────┬─────────────┬─────────────┬─────────────────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│PostgreSQL │ │   Redis   │ │RingCentral│ │  Resend   │
│ Database  │ │Cache/WS   │ │ SMS/Call  │ │   Email   │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
`,

  teamComposition: [
    { role: "Frontend Developer", level: "Middle", workTime: "Full-time", responsibilities: "Daily UI development, API integration, bug fixing, component development" },
    { role: "Backend Developer", level: "Middle", workTime: "Full-time", responsibilities: "API endpoints development, CRUD operations, unit testing, documentation" },
    { role: "Frontend Developer", level: "Senior", workTime: "Part-time (~20 hrs/week)", responsibilities: "Architecture and code review, complex components (Mapbox, WebSocket), performance optimization, mentoring" },
    { role: "Backend Developer", level: "Senior", workTime: "Part-time (~20 hrs/week)", responsibilities: "Django architecture design, database schema and optimization, WebSocket and real-time features, third-party integrations (RingCentral, Resend), mentoring" },
    { role: "Project Manager", level: "Senior", workTime: "Full-time", responsibilities: "Sprint planning and tracking, stakeholder communication, risk management, quality assurance" },
  ],

  milestones: [
    {
      phase: "Phase 1: Foundation",
      duration: "2 weeks",
      tasks: [
        { task: "Django project setup", assignee: "Sr. Backend + Mid Backend", duration: "2 days" },
        { task: "PostgreSQL database design", assignee: "Sr. Backend", duration: "3 days" },
        { task: "User authentication (JWT)", assignee: "Mid Backend", duration: "3 days" },
        { task: "Role-based access control", assignee: "Mid Backend", duration: "2 days" },
        { task: "Redis setup", assignee: "Sr. Backend", duration: "1 day" },
        { task: "Frontend API client setup", assignee: "Sr. Frontend", duration: "1 day" },
        { task: "Authentication UI integration", assignee: "Mid Frontend", duration: "2 days" },
      ]
    },
    {
      phase: "Phase 2: Core APIs",
      duration: "3 weeks",
      tasks: [
        { task: "Load Management API", assignee: "Mid Backend", duration: "5 days" },
        { task: "Driver Management API", assignee: "Mid Backend", duration: "4 days" },
        { task: "User Management API", assignee: "Mid Backend", duration: "3 days" },
        { task: "Exception Management API", assignee: "Mid Backend", duration: "3 days" },
        { task: "API Testing & Documentation", assignee: "Mid Backend", duration: "3 days" },
      ]
    },
    {
      phase: "Phase 3: Frontend Integration",
      duration: "3 weeks",
      tasks: [
        { task: "Dashboard API integration", assignee: "Mid Frontend", duration: "3 days" },
        { task: "Load Monitoring integration", assignee: "Mid Frontend + Sr. Frontend", duration: "4 days" },
        { task: "Driver Management integration", assignee: "Mid Frontend", duration: "3 days" },
        { task: "Exception panel integration", assignee: "Mid Frontend", duration: "2 days" },
        { task: "Settings & Preferences integration", assignee: "Mid Frontend", duration: "2 days" },
        { task: "Analytics integration", assignee: "Mid Frontend", duration: "3 days" },
      ]
    },
    {
      phase: "Phase 4: Communication Engine",
      duration: "2.5 weeks",
      tasks: [
        { task: "RingCentral SMS integration", assignee: "Sr. Backend", duration: "3 days" },
        { task: "RingCentral Voice integration", assignee: "Sr. Backend", duration: "3 days" },
        { task: "Resend Email integration", assignee: "Mid Backend", duration: "2 days" },
        { task: "Template engine", assignee: "Mid Backend", duration: "3 days" },
        { task: "Communication logs API", assignee: "Mid Backend", duration: "2 days" },
        { task: "Frontend notification center", assignee: "Mid Frontend", duration: "2 days" },
      ]
    },
    {
      phase: "Phase 5: Real-time Features",
      duration: "2 weeks",
      tasks: [
        { task: "Django Channels setup", assignee: "Sr. Backend", duration: "2 days" },
        { task: "WebSocket endpoints", assignee: "Sr. Backend + Mid Backend", duration: "3 days" },
        { task: "Real-time load tracking", assignee: "Sr. Frontend + Mid Frontend", duration: "3 days" },
        { task: "Live notifications", assignee: "Mid Frontend", duration: "2 days" },
        { task: "WebSocket testing", assignee: "Mid Backend", duration: "2 days" },
      ]
    },
    {
      phase: "Phase 6: Analytics & Reports",
      duration: "2 weeks",
      tasks: [
        { task: "Analytics API endpoints", assignee: "Mid Backend", duration: "4 days" },
        { task: "Report generation (PDF/Excel)", assignee: "Mid Backend", duration: "3 days" },
        { task: "Analytics dashboard finalization", assignee: "Mid Frontend", duration: "3 days" },
        { task: "Export functionality", assignee: "Mid Frontend", duration: "2 days" },
      ]
    },
    {
      phase: "Phase 7: Testing & Polish",
      duration: "2 weeks",
      tasks: [
        { task: "Unit tests (Backend)", assignee: "Mid Backend", duration: "3 days" },
        { task: "Integration tests", assignee: "Sr. Backend + Sr. Frontend", duration: "2 days" },
        { task: "Performance optimization", assignee: "Sr. Frontend + Sr. Backend", duration: "2 days" },
        { task: "Bug fixing", assignee: "All Developers", duration: "3 days" },
        { task: "Final documentation", assignee: "PM + All", duration: "2 days" },
      ]
    },
  ],

  timelineSummary: [
    { phase: "Phase 1: Foundation", duration: "2 weeks", cumulative: "2 weeks" },
    { phase: "Phase 2: Core APIs", duration: "3 weeks", cumulative: "5 weeks" },
    { phase: "Phase 3: Frontend Integration", duration: "3 weeks", cumulative: "8 weeks" },
    { phase: "Phase 4: Communication Engine", duration: "2.5 weeks", cumulative: "10.5 weeks" },
    { phase: "Phase 5: Real-time Features", duration: "2 weeks", cumulative: "12.5 weeks" },
    { phase: "Phase 6: Analytics & Reports", duration: "2 weeks", cumulative: "14.5 weeks" },
    { phase: "Phase 7: Testing & Polish", duration: "2 weeks", cumulative: "16.5 weeks" },
  ],

  apiEndpoints: {
    authentication: [
      "POST   /api/auth/login/",
      "POST   /api/auth/logout/",
      "POST   /api/auth/refresh/",
      "GET    /api/auth/me/",
    ],
    users: [
      "GET    /api/users/",
      "POST   /api/users/",
      "GET    /api/users/{id}/",
      "PUT    /api/users/{id}/",
      "DELETE /api/users/{id}/",
      "GET    /api/users/{id}/roles/",
    ],
    loads: [
      "GET    /api/loads/",
      "POST   /api/loads/",
      "GET    /api/loads/{id}/",
      "PUT    /api/loads/{id}/",
      "DELETE /api/loads/{id}/",
      "PATCH  /api/loads/{id}/status/",
      "GET    /api/loads/{id}/history/",
      "GET    /api/loads/{id}/communications/",
    ],
    drivers: [
      "GET    /api/drivers/",
      "POST   /api/drivers/",
      "GET    /api/drivers/{id}/",
      "PUT    /api/drivers/{id}/",
      "DELETE /api/drivers/{id}/",
      "GET    /api/drivers/{id}/loads/",
      "GET    /api/drivers/{id}/location/",
    ],
    communications: [
      "POST   /api/communications/sms/",
      "POST   /api/communications/email/",
      "POST   /api/communications/call/",
      "GET    /api/communications/logs/",
      "GET    /api/templates/",
      "POST   /api/templates/",
    ],
    analytics: [
      "GET    /api/analytics/overview/",
      "GET    /api/analytics/loads/",
      "GET    /api/analytics/drivers/",
      "GET    /api/analytics/communications/",
      "GET    /api/reports/",
      "POST   /api/reports/generate/",
    ],
    websocket: [
      "WS     /ws/loads/",
      "WS     /ws/notifications/",
      "WS     /ws/tracking/{driver_id}/",
    ]
  },

  databaseSchema: {
    users: ["id (UUID)", "email", "password_hash", "first_name", "last_name", "phone", "created_at", "updated_at"],
    user_roles: ["id (UUID)", "user_id (FK → users)", "role (ENUM: admin, dispatcher, driver, updater)"],
    drivers: ["id (UUID)", "user_id (FK → users)", "license_number", "truck_number", "current_location", "status", "..."],
    loads: ["id (UUID)", "load_number", "driver_id (FK → drivers)", "shipper_id (FK → shippers)", "receiver_id (FK → receivers)", "status", "pickup_date", "delivery_date", "current_location", "..."],
    communications: ["id (UUID)", "load_id (FK → loads)", "type (SMS/Email/Call)", "template_id (FK → templates)", "status", "sent_at", "..."],
    templates: ["id (UUID)", "name", "type (SMS/Email/Call)", "content", "variables", "..."],
    exceptions: ["id (UUID)", "load_id (FK → loads)", "type", "severity", "status", "resolved_at", "..."],
  },

  nextSteps: [
    { step: "Technical requirements defined (Django, PostgreSQL, WebSocket)", completed: true },
    { step: "User roles defined (Admin, Dispatcher, Driver, Updater)", completed: true },
    { step: "Third-party services defined (RingCentral, Resend)", completed: true },
    { step: "Team composition defined", completed: true },
    { step: "Estimated timelines set (~4 months)", completed: true },
    { step: "GPS data source needs to be determined", completed: false },
    { step: "Start Django backend development", completed: false },
    { step: "Add Frontend API client", completed: false },
  ]
};
