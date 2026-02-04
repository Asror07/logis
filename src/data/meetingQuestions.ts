export interface Question {
  id: string;
  question: string;
  context?: string;
  options?: string[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface QuestionCategory {
  category: string;
  description: string;
  questions: Question[];
}

export interface MeetingQuestionsData {
  title: string;
  subtitle: string;
  date: string;
  categories: QuestionCategory[];
}

export const meetingQuestionsData: MeetingQuestionsData = {
  title: "ProStatus Logistics",
  subtitle: "Project Clarification Questions",
  date: "Owner Meeting",
  categories: [
    // 1. Authentication & User Roles
    {
      category: "Authentication & User Roles",
      description: "Questions about user authentication, authorization, and role-based access control",
      questions: [
        {
          id: "AUTH-01",
          question: "What SSO providers should be supported?",
          context: "The project scope mentions authentication but doesn't specify SSO requirements",
          options: ["Google", "Microsoft/Azure AD", "Okta", "None - email/password only"],
          priority: "High"
        },
        {
          id: "AUTH-02",
          question: "What is the JWT token expiration policy?",
          context: "Need to define security vs user experience balance",
          options: ["Access: 15min, Refresh: 7d", "Access: 1hr, Refresh: 30d", "Access: 24hr, Refresh: 90d"],
          priority: "High"
        },
        {
          id: "AUTH-03",
          question: "Should users be able to have multiple active sessions?",
          context: "User might need to access from desktop and mobile simultaneously",
          options: ["Yes - unlimited sessions", "Yes - max 3 sessions", "No - single session only"],
          priority: "Medium"
        },
        {
          id: "AUTH-04",
          question: "What is the password policy?",
          context: "Balance between security and usability",
          options: ["Min 8 chars, 1 uppercase, 1 number", "Min 12 chars, complex requirements", "Passphrase allowed"],
          priority: "Medium"
        },
        {
          id: "AUTH-05",
          question: "How should account lockout work after failed login attempts?",
          context: "Prevent brute force attacks while not locking out legitimate users",
          options: ["Lock after 5 attempts for 15min", "Lock after 3 attempts for 30min", "Progressive delay only"],
          priority: "Medium"
        },
        {
          id: "AUTH-06",
          question: "Clarify the role hierarchy: projectScope.ts shows Admin/Dispatcher/Driver, but Preferences.tsx mentions Shipper/Broker/Carrier. Which is correct?",
          context: "Critical discrepancy between data files that needs resolution",
          options: ["Admin > Dispatcher > Driver", "Admin > Shipper/Broker/Carrier > Driver", "Both systems combined"],
          priority: "Critical"
        },
        {
          id: "AUTH-07",
          question: "Can one user have multiple roles simultaneously?",
          context: "A person might be both a dispatcher and admin",
          options: ["Yes - multiple roles allowed", "No - single role per user", "Primary + secondary role"],
          priority: "High"
        },
        {
          id: "AUTH-08",
          question: "Should there be team/organization-level access control?",
          context: "Multi-tenant architecture consideration",
          options: ["Single organization", "Multi-tenant with isolation", "Teams within organization"],
          priority: "Medium"
        }
      ]
    },
    // 2. Load Tracking & GPS
    {
      category: "Load Tracking & GPS",
      description: "Questions about real-time tracking, GPS integration, and location services",
      questions: [
        {
          id: "GPS-01",
          question: "What is the primary GPS data source for driver location?",
          context: "This fundamentally affects the architecture and mobile app requirements",
          options: ["ELD devices (Samsara, KeepTruckin)", "Custom mobile app we build", "Both integrated", "Third-party fleet tracking API"],
          priority: "Critical"
        },
        {
          id: "GPS-02",
          question: "If using ELD devices, which specific ELD providers should we integrate with?",
          context: "Each provider has different APIs and data formats",
          options: ["Samsara", "KeepTruckin/Motive", "Omnitracs", "Multiple providers"],
          priority: "Critical"
        },
        {
          id: "GPS-03",
          question: "If building a mobile app, should it be a separate deliverable or embedded in this project?",
          context: "Affects timeline, budget, and team composition",
          options: ["Build iOS/Android app", "Progressive Web App (PWA)", "Use existing third-party app", "Out of scope"],
          priority: "Critical"
        },
        {
          id: "GPS-04",
          question: "What is the required GPS update frequency?",
          context: "More frequent updates = better tracking but higher costs and battery usage",
          options: ["Every 30 seconds", "Every 1 minute", "Every 5 minutes", "Event-based only"],
          priority: "High"
        },
        {
          id: "GPS-05",
          question: "What is the acceptable GPS accuracy tolerance?",
          context: "Affects geofencing precision and exception detection",
          options: ["10 meters", "50 meters", "100 meters", "500 meters"],
          priority: "Medium"
        },
        {
          id: "GPS-06",
          question: "How should the system behave when GPS signal is lost?",
          context: "Tunnels, rural areas, or device issues can cause signal loss",
          options: ["Show last known location with timestamp", "Trigger exception after X minutes", "Extrapolate based on route", "All of the above"],
          priority: "High"
        },
        {
          id: "GPS-07",
          question: "What geofence radius should trigger pickup/delivery arrival events?",
          context: "Too small = missed events, too large = false positives",
          options: ["100 meters", "250 meters", "500 meters", "1 kilometer", "Configurable per location"],
          priority: "High"
        },
        {
          id: "GPS-08",
          question: "Should we track driver speed and generate speeding alerts?",
          context: "Safety feature but adds complexity and potential driver pushback",
          options: ["Yes - with configurable thresholds", "Yes - using posted speed limits", "No - not required"],
          priority: "Medium"
        },
        {
          id: "GPS-09",
          question: "How long should GPS history/breadcrumb trail be retained?",
          context: "Affects storage costs and compliance requirements",
          options: ["30 days", "90 days", "1 year", "7 years (compliance)"],
          priority: "Medium"
        },
        {
          id: "GPS-10",
          question: "Should drivers be able to disable tracking during off-duty hours?",
          context: "Privacy consideration vs operational needs",
          options: ["Yes - manual toggle", "Automatic based on HOS status", "No - always tracked", "Tracking optional during personal conveyance"],
          priority: "Medium"
        }
      ]
    },
    // 3. Super Dispatch Integration
    {
      category: "Super Dispatch Integration",
      description: "Questions about integration with Super Dispatch TMS",
      questions: [
        {
          id: "SD-01",
          question: "Do you have an existing Super Dispatch account and API access?",
          context: "Required to proceed with integration development",
          options: ["Yes - have credentials", "Yes - need to get API access", "No - need to sign up", "Different TMS - not Super Dispatch"],
          priority: "Critical"
        },
        {
          id: "SD-02",
          question: "What Super Dispatch API version should we target?",
          context: "Different versions have different capabilities",
          options: ["Latest stable API (v2)", "Legacy API (v1) for compatibility", "Check documentation together"],
          priority: "High"
        },
        {
          id: "SD-03",
          question: "Should load creation originate from Super Dispatch only, or also from our system?",
          context: "Determines data flow direction and sync complexity",
          options: ["Super Dispatch is source of truth (one-way)", "Bi-directional sync", "Either system can create loads"],
          priority: "High"
        },
        {
          id: "SD-04",
          question: "How should we handle load status updates - two-way sync or one-way?",
          context: "Sync conflicts can cause data integrity issues",
          options: ["Our system updates Super Dispatch", "Super Dispatch updates our system", "Two-way with conflict resolution"],
          priority: "High"
        },
        {
          id: "SD-05",
          question: "What Super Dispatch webhooks/events should we subscribe to?",
          context: "Determines real-time vs polling approach",
          options: ["Load created/updated/deleted", "Status changes", "All available events", "Need to review available webhooks"],
          priority: "Medium"
        },
        {
          id: "SD-06",
          question: "Should we support multiple Super Dispatch accounts (multi-carrier)?",
          context: "For brokers managing multiple carriers",
          options: ["Single account", "Multiple accounts with switching", "Account per organization/team"],
          priority: "Medium"
        }
      ]
    },
    // 4. Communication (RingCentral/Resend)
    {
      category: "Communication (RingCentral/Resend)",
      description: "Questions about SMS, email, and voice communication features",
      questions: [
        {
          id: "COMM-01",
          question: "Should notifications be automatic (system-triggered) or manually triggered by dispatchers?",
          context: "Affects workflow and automation level",
          options: ["Fully automatic", "Manual only", "Automatic with manual override", "Configurable per event type"],
          priority: "Critical"
        },
        {
          id: "COMM-02",
          question: "What specific events should trigger automatic SMS notifications?",
          context: "Need to define the automation rules",
          options: ["Load assigned", "Approaching pickup/delivery", "Status changes", "Exceptions", "All of the above"],
          priority: "High"
        },
        {
          id: "COMM-03",
          question: "What specific events should trigger automatic email notifications?",
          context: "Emails are better for detailed information",
          options: ["Daily summary", "Exception reports", "Load completion", "Document attachments", "All of the above"],
          priority: "High"
        },
        {
          id: "COMM-04",
          question: "Should we support two-way SMS (driver can reply to messages)?",
          context: "Requires webhook handling and conversation threading",
          options: ["Yes - full two-way", "Yes - simple replies only", "No - one-way notifications only"],
          priority: "High"
        },
        {
          id: "COMM-05",
          question: "What is the expected monthly SMS volume for cost estimation?",
          context: "Affects pricing tier and budget planning",
          options: ["Under 1,000", "1,000 - 5,000", "5,000 - 20,000", "Over 20,000"],
          priority: "Medium"
        },
        {
          id: "COMM-06",
          question: "What is the expected monthly email volume?",
          context: "Affects Resend pricing tier selection",
          options: ["Under 10,000", "10,000 - 50,000", "50,000 - 100,000", "Over 100,000"],
          priority: "Medium"
        },
        {
          id: "COMM-07",
          question: "Should we support automated voice calls for critical alerts?",
          context: "RingCentral supports voice but adds complexity",
          options: ["Yes - for critical exceptions", "Yes - for all urgent items", "No - SMS and email sufficient"],
          priority: "Medium"
        },
        {
          id: "COMM-08",
          question: "What is the notification retry policy if initial delivery fails?",
          context: "Ensure important messages are delivered",
          options: ["Retry 3 times with exponential backoff", "Retry once then escalate", "No retry - log failure", "Fallback to different channel"],
          priority: "Medium"
        },
        {
          id: "COMM-09",
          question: "Should communication history be visible to drivers or only to admins/dispatchers?",
          context: "Privacy and UX consideration",
          options: ["Visible to all parties", "Visible to dispatchers only", "Visible to admins only", "Configurable per message type"],
          priority: "Medium"
        },
        {
          id: "COMM-10",
          question: "Do we need multi-language support for notifications?",
          context: "Driver workforce may be multilingual",
          options: ["English only", "English and Spanish", "Multiple languages based on user preference", "Not required"],
          priority: "Medium"
        }
      ]
    },
    // 5. Exception Management
    {
      category: "Exception Management",
      description: "Questions about exception detection, alerting, and resolution workflows",
      questions: [
        {
          id: "EXC-01",
          question: "What is the threshold for 'driver offline too long' exception?",
          context: "Balance between false positives and catching real issues",
          options: ["15 minutes", "30 minutes", "1 hour", "Configurable per driver/route"],
          priority: "High"
        },
        {
          id: "EXC-02",
          question: "What is the threshold for 'late pickup' exception?",
          context: "When should system flag a pickup as late",
          options: ["30 minutes after scheduled", "1 hour after scheduled", "2 hours after scheduled", "Configurable per shipper"],
          priority: "High"
        },
        {
          id: "EXC-03",
          question: "What is the threshold for 'late delivery' exception?",
          context: "When should system flag a delivery as late",
          options: ["30 minutes after scheduled", "1 hour after scheduled", "2 hours after scheduled", "Configurable per customer"],
          priority: "High"
        },
        {
          id: "EXC-04",
          question: "Should exceptions auto-escalate if not resolved within X time?",
          context: "Ensure critical issues get attention",
          options: ["Yes - escalate to manager after 30min", "Yes - escalate after 1 hour", "No - manual escalation only", "Configurable per exception type"],
          priority: "High"
        },
        {
          id: "EXC-05",
          question: "Who should receive exception notifications by default?",
          context: "Define the notification hierarchy",
          options: ["Assigned dispatcher only", "All dispatchers on duty", "Dispatcher + manager", "Configurable escalation chain"],
          priority: "High"
        },
        {
          id: "EXC-06",
          question: "What exception severity levels do we need?",
          context: "Categorization for prioritization",
          options: ["Critical/High/Medium/Low (4 levels)", "High/Medium/Low (3 levels)", "Urgent/Normal (2 levels)"],
          priority: "Medium"
        },
        {
          id: "EXC-07",
          question: "Should we track exception resolution time for performance metrics?",
          context: "KPI for dispatcher performance",
          options: ["Yes - track all exceptions", "Yes - track critical only", "No - not required"],
          priority: "Medium"
        },
        {
          id: "EXC-08",
          question: "Can exceptions be marked as 'false positive' and excluded from reports?",
          context: "Maintain report accuracy for known issues",
          options: ["Yes - with reason required", "Yes - simple dismiss", "No - all exceptions counted"],
          priority: "Medium"
        }
      ]
    },
    // 6. Driver Management
    {
      category: "Driver Management",
      description: "Questions about driver onboarding, data management, and compliance",
      questions: [
        {
          id: "DRV-01",
          question: "Should driver data sync from an external system or be manually entered?",
          context: "Data source and maintenance approach",
          options: ["Sync from Super Dispatch", "Sync from HR/payroll system", "Manual entry in our system", "Hybrid approach"],
          priority: "High"
        },
        {
          id: "DRV-02",
          question: "Should we track Hours of Service (HOS) compliance?",
          context: "FMCSA compliance requirement for commercial drivers",
          options: ["Yes - integrate with ELD data", "Yes - manual entry", "No - use separate HOS system", "Display only (no enforcement)"],
          priority: "High"
        },
        {
          id: "DRV-03",
          question: "What driver documents need to be stored in the system?",
          context: "Document management requirements",
          options: ["CDL", "Insurance", "Medical card", "Vehicle registration", "All of the above", "None - external system"],
          priority: "Medium"
        },
        {
          id: "DRV-04",
          question: "Should we track document expiration dates and send reminder alerts?",
          context: "Compliance management feature",
          options: ["Yes - 30 days before expiration", "Yes - 60 days before", "Yes - configurable", "No - not required"],
          priority: "Medium"
        },
        {
          id: "DRV-05",
          question: "What driver statuses are needed beyond Active/Inactive?",
          context: "Workflow states for driver management",
          options: ["Active, Inactive only", "Add: On Leave, Suspended", "Add: Training, Probation", "Custom statuses allowed"],
          priority: "Medium"
        },
        {
          id: "DRV-06",
          question: "Should drivers have access to a portal or app to view their assigned loads?",
          context: "Driver self-service capability",
          options: ["Yes - full mobile app", "Yes - web portal only", "Yes - both app and web", "No - dispatcher communicates directly"],
          priority: "High"
        },
        {
          id: "DRV-07",
          question: "How should driver assignment to loads work?",
          context: "Assignment workflow",
          options: ["Manual dispatcher assignment", "Auto-suggest based on location", "Auto-assign with approval", "Driver self-selection from available loads"],
          priority: "Medium"
        }
      ]
    },
    // 7. Notification System
    {
      category: "Notification System",
      description: "Questions about in-app notifications and user preferences",
      questions: [
        {
          id: "NOT-01",
          question: "Should users be able to customize their notification preferences?",
          context: "User control over notification volume",
          options: ["Yes - full control per event type", "Yes - simple on/off per channel", "No - system defaults only"],
          priority: "Medium"
        },
        {
          id: "NOT-02",
          question: "What in-app notification types are needed?",
          context: "UI notification mechanisms",
          options: ["Toast messages", "Badge counts", "Sound alerts", "Desktop notifications", "All of the above"],
          priority: "Low"
        },
        {
          id: "NOT-03",
          question: "Should notifications be grouped or shown individually?",
          context: "Notification UX for high-volume scenarios",
          options: ["Individual notifications", "Grouped by type", "Grouped by load", "Smart grouping"],
          priority: "Low"
        },
        {
          id: "NOT-04",
          question: "How long should in-app notifications be retained?",
          context: "Notification history storage",
          options: ["7 days", "30 days", "90 days", "Unlimited"],
          priority: "Low"
        },
        {
          id: "NOT-05",
          question: "Should there be a 'Do Not Disturb' mode for users?",
          context: "Allow users to pause notifications",
          options: ["Yes - with schedule option", "Yes - manual toggle only", "No - not required"],
          priority: "Low"
        }
      ]
    },
    // 8. Analytics & Reporting
    {
      category: "Analytics & Reporting",
      description: "Questions about dashboards, KPIs, and report generation",
      questions: [
        {
          id: "RPT-01",
          question: "What are the key KPIs that MUST be shown on the main dashboard?",
          context: "Priority metrics for at-a-glance view",
          options: ["On-time delivery rate", "Active loads count", "Exception count", "Communication response time", "All of the above"],
          priority: "High"
        },
        {
          id: "RPT-02",
          question: "What report export formats are needed?",
          context: "Report delivery format",
          options: ["PDF only", "Excel only", "Both PDF and Excel", "CSV for data export", "All formats"],
          priority: "Medium"
        },
        {
          id: "RPT-03",
          question: "Should reports be schedulable for automatic delivery?",
          context: "Automated reporting feature",
          options: ["Yes - daily, weekly, monthly options", "Yes - custom schedule", "No - on-demand only"],
          priority: "Medium"
        },
        {
          id: "RPT-04",
          question: "What date range should analytics support?",
          context: "Historical data analysis capability",
          options: ["Last 30 days", "Last 90 days", "Last 1 year", "Custom range up to 2 years"],
          priority: "Medium"
        },
        {
          id: "RPT-05",
          question: "Should we track ROI metrics like time saved and cost reduction?",
          context: "Business value demonstration",
          options: ["Yes - with baseline comparison", "Yes - simple tracking", "No - not required", "Phase 2 feature"],
          priority: "Medium"
        },
        {
          id: "RPT-06",
          question: "Who should have access to analytics dashboards?",
          context: "Analytics access control",
          options: ["Admin only", "Admin and managers", "All users with role-based views", "Configurable per dashboard"],
          priority: "Medium"
        }
      ]
    },
    // 9. Data & Storage
    {
      category: "Data & Storage",
      description: "Questions about data retention, compliance, and backup policies",
      questions: [
        {
          id: "DATA-01",
          question: "What is the data retention policy for completed loads?",
          context: "Storage costs vs compliance requirements",
          options: ["1 year", "3 years", "5 years", "7 years (common compliance)", "Indefinite"],
          priority: "High"
        },
        {
          id: "DATA-02",
          question: "Should we support data export for compliance/audit purposes?",
          context: "Regulatory and audit requirements",
          options: ["Yes - full data export", "Yes - filtered export", "No - not required"],
          priority: "Medium"
        },
        {
          id: "DATA-03",
          question: "Do we need to comply with any specific regulations?",
          context: "Compliance requirements affect architecture",
          options: ["FMCSA regulations", "GDPR (if EU data)", "CCPA (California)", "SOC 2", "None specific"],
          priority: "High"
        },
        {
          id: "DATA-04",
          question: "Should soft delete or hard delete be used for records?",
          context: "Data recovery vs storage optimization",
          options: ["Soft delete (recoverable)", "Hard delete after 30 days", "Hard delete immediately", "Configurable per data type"],
          priority: "Medium"
        },
        {
          id: "DATA-05",
          question: "What backup frequency and retention is required?",
          context: "Disaster recovery planning",
          options: ["Daily backups, 30-day retention", "Hourly backups, 7-day retention", "Real-time replication", "Standard cloud provider defaults"],
          priority: "Medium"
        }
      ]
    },
    // 10. Infrastructure & Deployment
    {
      category: "Infrastructure & Deployment",
      description: "Questions about hosting, environments, and CI/CD",
      questions: [
        {
          id: "INF-01",
          question: "What is the target cloud provider for hosting?",
          context: "Affects technology choices and costs",
          options: ["AWS", "Google Cloud (GCP)", "Microsoft Azure", "On-premises servers", "Flexible - your recommendation"],
          priority: "High"
        },
        {
          id: "INF-02",
          question: "What environments are needed beyond production?",
          context: "Development and testing infrastructure",
          options: ["Dev + Prod only", "Dev + Staging + Prod", "Dev + QA + Staging + Prod", "Per-developer environments"],
          priority: "High"
        },
        {
          id: "INF-03",
          question: "What is the expected user concurrency at peak?",
          context: "Capacity planning for infrastructure",
          options: ["1-10 simultaneous users", "10-50 simultaneous users", "50-100 simultaneous users", "100+ simultaneous users"],
          priority: "Medium"
        },
        {
          id: "INF-04",
          question: "What is the target uptime SLA?",
          context: "Affects architecture complexity and costs",
          options: ["99% (3.65 days downtime/year)", "99.9% (8.76 hours downtime/year)", "99.99% (52 min downtime/year)"],
          priority: "Medium"
        },
        {
          id: "INF-05",
          question: "Is there an existing CI/CD pipeline or should we set one up?",
          context: "Deployment automation",
          options: ["Existing pipeline - integrate", "Need to set up new pipeline", "Manual deployments acceptable initially"],
          priority: "Medium"
        }
      ]
    },
    // 11. Testing & QA
    {
      category: "Testing & QA",
      description: "Questions about testing strategy and quality assurance",
      questions: [
        {
          id: "QA-01",
          question: "Is there a dedicated QA team or will developers handle testing?",
          context: "Testing responsibility and process",
          options: ["Dedicated QA team", "Developers + QA", "Developers only", "External QA contractor"],
          priority: "Medium"
        },
        {
          id: "QA-02",
          question: "What browsers and devices must be supported?",
          context: "Browser compatibility requirements",
          options: ["Chrome only", "Chrome + Firefox + Safari", "All modern browsers + IE11", "Mobile browsers required"],
          priority: "Medium"
        },
        {
          id: "QA-03",
          question: "Should we set up automated testing from the start?",
          context: "Test automation investment",
          options: ["Yes - unit + integration + e2e", "Yes - unit tests only", "Manual testing initially", "Add automation in Phase 2"],
          priority: "Medium"
        },
        {
          id: "QA-04",
          question: "Is there a staging environment for user acceptance testing (UAT)?",
          context: "Pre-production testing environment",
          options: ["Yes - existing", "Need to create", "Use dev environment", "Not required"],
          priority: "Medium"
        }
      ]
    },
    // 12. Timeline & Priorities
    {
      category: "Timeline & Priorities",
      description: "Questions about project timeline, milestones, and feature prioritization",
      questions: [
        {
          id: "TIME-01",
          question: "What is the target go-live date for production?",
          context: "Critical for planning sprints and resources",
          options: ["As soon as possible", "Specific date (please specify)", "Flexible - quality over speed", "Phased rollout dates"],
          priority: "Critical"
        },
        {
          id: "TIME-02",
          question: "Is there an MVP scope for earlier launch?",
          context: "Identify minimum viable feature set",
          options: ["Yes - need to define MVP", "No - full scope required", "Already defined MVP", "Open to discussion"],
          priority: "High"
        },
        {
          id: "TIME-03",
          question: "What features are absolute 'must-have' vs 'nice-to-have'?",
          context: "Feature prioritization for timeline constraints",
          options: ["Need to review together", "Already prioritized in backlog", "All features are must-have", "Flexible based on timeline"],
          priority: "High"
        },
        {
          id: "TIME-04",
          question: "Are there any hard deadlines tied to contracts or business events?",
          context: "External constraints affecting timeline",
          options: ["Yes - contract deadline", "Yes - business event", "No hard deadlines", "Prefer not to disclose"],
          priority: "High"
        },
        {
          id: "TIME-05",
          question: "Should we plan for phased rollout or big-bang launch?",
          context: "Deployment strategy",
          options: ["Phased - start with pilot users", "Phased - by feature module", "Big-bang - all at once", "Depends on testing results"],
          priority: "Medium"
        }
      ]
    },
    // 13. Business Logic
    {
      category: "Business Logic",
      description: "Questions about specific business rules and operational workflows",
      questions: [
        {
          id: "BIZ-01",
          question: "How many loads are processed daily on average?",
          context: "Scale estimation for system design",
          options: ["1-10 loads/day", "10-50 loads/day", "50-200 loads/day", "200+ loads/day"],
          priority: "High"
        },
        {
          id: "BIZ-02",
          question: "How many active drivers will use the system?",
          context: "User base size for capacity planning",
          options: ["1-10 drivers", "10-50 drivers", "50-200 drivers", "200+ drivers"],
          priority: "High"
        },
        {
          id: "BIZ-03",
          question: "Is there a billing/invoicing component needed in this system?",
          context: "Financial features scope",
          options: ["Yes - full invoicing", "Yes - basic billing", "No - separate system", "Phase 2 feature"],
          priority: "Medium"
        },
        {
          id: "BIZ-04",
          question: "Should loads be editable after they are marked as completed?",
          context: "Data integrity vs operational flexibility",
          options: ["Yes - with audit trail", "Yes - admin only", "No - locked after completion", "Within 24 hours only"],
          priority: "Medium"
        },
        {
          id: "BIZ-05",
          question: "What happens to a load when a driver is reassigned mid-route?",
          context: "Driver reassignment workflow",
          options: ["Transfer load to new driver", "Cancel and create new load", "Split load at current location", "Not allowed - complete first"],
          priority: "Medium"
        },
        {
          id: "BIZ-06",
          question: "Can a single load have multiple pickup and/or delivery points?",
          context: "Multi-stop load support",
          options: ["Yes - multiple pickups and deliveries", "Yes - one pickup, multiple deliveries", "No - single pickup and delivery only", "Configurable per customer"],
          priority: "High"
        }
      ]
    }
  ]
};
