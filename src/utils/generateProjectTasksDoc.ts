import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType, PageBreak, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { projectTasksData, Task, epicsData, criticalPathData } from '@/data/projectTasks';

// Helper to get priority color
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Critical': return 'dc2626';
    case 'High': return 'ea580c';
    case 'Medium': return 'ca8a04';
    case 'Low': return '16a34a';
    default: return '6b7280';
  }
};

// Create a styled table row
const createTableRow = (cells: string[], isHeader = false, isCriticalPath = false) => {
  return new TableRow({
    children: cells.map((cell, index) => 
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ 
            text: cell, 
            bold: isHeader || isCriticalPath, 
            size: isHeader ? 22 : 20,
            color: isCriticalPath && !isHeader ? 'dc2626' : undefined
          })],
        })],
        shading: isHeader ? { fill: "1a365d", type: ShadingType.SOLID, color: "1a365d" } : 
                 isCriticalPath ? { fill: "fee2e2", type: ShadingType.SOLID, color: "fee2e2" } : undefined,
      })
    ),
  });
};

// Create epic summary table
const createEpicSummaryTable = () => {
  const rows = epicsData.map(epic => {
    const feCount = projectTasksData.frontendTasks.filter(t => t.epicId === epic.id).length;
    const beCount = projectTasksData.backendTasks.filter(t => t.epicId === epic.id).length;
    const feHours = projectTasksData.frontendTasks.filter(t => t.epicId === epic.id).reduce((sum, t) => sum + t.estimatedHours, 0);
    const beHours = projectTasksData.backendTasks.filter(t => t.epicId === epic.id).reduce((sum, t) => sum + t.estimatedHours, 0);
    
    return [
      `Epic ${epic.id}`,
      epic.name,
      `${epic.startDate} - ${epic.endDate}`,
      `${feCount + beCount}`,
      `${feHours + beHours}h`
    ];
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      createTableRow(["Epic #", "Name", "Date Range", "Tasks", "Hours"], true),
      ...rows.map(row => createTableRow(row)),
    ],
  });
};

// Create critical path visualization
const createCriticalPathSection = () => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      text: "Critical Path Tasks",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ 
        text: criticalPathData.description,
        italics: true 
      })],
      spacing: { after: 200 },
    })
  );

  // Create visual path
  criticalPathData.tasks.forEach((taskId, index) => {
    const task = [...projectTasksData.frontendTasks, ...projectTasksData.backendTasks].find(t => t.id === taskId);
    if (task) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true, color: 'dc2626' }),
            new TextRun({ text: `${task.id}: ${task.title}`, bold: true }),
            new TextRun({ text: ` (${task.startDate} → ${task.endDate})` }),
          ],
          spacing: { after: 50 },
          indent: { left: 200 },
        })
      );
      
      if (index < criticalPathData.tasks.length - 1) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "    ↓", color: 'dc2626', bold: true })],
            spacing: { after: 50 },
            indent: { left: 200 },
          })
        );
      }
    }
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "\nTotal Critical Path Duration: ", bold: true }),
        new TextRun({ text: criticalPathData.totalDuration, color: 'dc2626', bold: true }),
      ],
      spacing: { before: 200, after: 200 },
    })
  );

  return paragraphs;
};

// Create task card with full details
const createDetailedTaskSection = (task: Task) => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: task.isCriticalPath ? "⭐ " : "" }),
        new TextRun({ text: `${task.id}: ${task.title}`, bold: true, size: 24 }),
      ],
      spacing: { before: 300, after: 100 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: task.isCriticalPath ? "dc2626" : "cccccc" }
      }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Epic: ", bold: true }),
        new TextRun({ text: `${task.epicId}. ${task.epicName}` }),
        new TextRun({ text: "  |  Function: ", bold: true }),
        new TextRun({ text: `${task.functionId} ${task.functionName}` }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "📅 Start: ", bold: true }),
        new TextRun({ text: task.startDate }),
        new TextRun({ text: "  →  End: ", bold: true }),
        new TextRun({ text: task.endDate }),
        new TextRun({ text: "  |  Hours: ", bold: true }),
        new TextRun({ text: `${task.estimatedHours}h` }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Assignee: ", bold: true }),
        new TextRun({ text: task.assignee }),
        new TextRun({ text: "  |  Priority: ", bold: true }),
        new TextRun({ text: task.priority, bold: true, color: getPriorityColor(task.priority) }),
        task.isCriticalPath ? new TextRun({ text: "  |  ⭐ CRITICAL PATH", bold: true, color: 'dc2626' }) : new TextRun({ text: "" }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Description:", bold: true })],
      spacing: { before: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: task.description })],
      spacing: { after: 100 },
    }),
  ];

  if (task.dependencies.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Dependencies: ", bold: true }),
          new TextRun({ text: task.dependencies.join(", ") }),
        ],
        spacing: { after: 100 },
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Acceptance Criteria:", bold: true })],
      spacing: { before: 100 },
    })
  );

  task.acceptanceCriteria.forEach(criteria => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: `✓ ${criteria}` })],
        indent: { left: 400 },
      })
    );
  });

  if (task.technicalNotes) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Technical Notes: ", bold: true }),
          new TextRun({ text: task.technicalNotes, italics: true }),
        ],
        spacing: { before: 100, after: 200 },
      })
    );
  }

  return paragraphs;
};

// Group tasks by function
const groupTasksByFunction = (tasks: Task[]) => {
  const grouped: { [key: string]: Task[] } = {};
  tasks.forEach(task => {
    const key = `${task.functionId} ${task.functionName}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(task);
  });
  return grouped;
};

// Group tasks by epic
const groupTasksByEpic = (tasks: Task[]) => {
  const grouped: { [key: number]: Task[] } = {};
  tasks.forEach(task => {
    if (!grouped[task.epicId]) {
      grouped[task.epicId] = [];
    }
    grouped[task.epicId].push(task);
  });
  return grouped;
};

// Create function overview table
const createFunctionTaskTable = (tasks: Task[]) => {
  const headers = ["ID", "Title", "Start", "End", "Hours", "Priority", "CP"];
  const rows = tasks.map(task => [
    task.id,
    task.title.substring(0, 40) + (task.title.length > 40 ? "..." : ""),
    task.startDate.split('-').slice(1).join('/'),
    task.endDate.split('-').slice(1).join('/'),
    `${task.estimatedHours}h`,
    task.priority,
    task.isCriticalPath ? "⭐" : ""
  ]);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      createTableRow(headers, true),
      ...rows.map(row => {
        const isCritical = row[6] === "⭐";
        return createTableRow(row, false, isCritical);
      }),
    ],
  });
};

// Create timeline gantt-style representation
const createTimelineSection = () => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      text: "Timeline Overview",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  // Week-by-week breakdown
  const weeks = [
    { week: "Week 1-2", dates: "Jan 13 - Jan 24", focus: "Foundation & Infrastructure", epics: [1] },
    { week: "Week 3-4", dates: "Jan 27 - Feb 7", focus: "Driver & Template Management", epics: [2] },
    { week: "Week 5-6", dates: "Feb 10 - Feb 21", focus: "Load & User Management, Exceptions", epics: [2] },
    { week: "Week 7-8", dates: "Feb 24 - Mar 7", focus: "Mapbox GPS & WebSocket Setup", epics: [3] },
    { week: "Week 9-10", dates: "Mar 10 - Mar 21", focus: "WebSocket Real-time & AI Logs Chat", epics: [3, 4] },
    { week: "Week 11-12", dates: "Mar 24 - Apr 4", focus: "Communication Engine & Dashboard", epics: [4, 5] },
    { week: "Week 13-14", dates: "Apr 7 - Apr 18", focus: "Analytics & Reports, UI Polish", epics: [5, 6] },
    { week: "Week 15-16", dates: "Apr 21 - May 2", focus: "Testing Suite & Bug Fixes", epics: [6] },
  ];

  weeks.forEach(({ week, dates, focus, epics }) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${week} `, bold: true, size: 24 }),
          new TextRun({ text: `(${dates})`, size: 22 }),
        ],
        spacing: { before: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Focus: ${focus}`, italics: true }),
          new TextRun({ text: ` — Epics: ${epics.join(", ")}` }),
        ],
        spacing: { after: 100 },
        indent: { left: 300 },
      })
    );
  });

  return paragraphs;
};

export const generateProjectTasksDocument = async () => {
  const totalFrontendHours = projectTasksData.frontendTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const totalBackendHours = projectTasksData.backendTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const frontendByEpic = groupTasksByEpic(projectTasksData.frontendTasks);
  const backendByEpic = groupTasksByEpic(projectTasksData.backendTasks);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // ==================== COVER PAGE ====================
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
        new Paragraph({
          text: projectTasksData.projectInfo.name,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Project Epics, Functions & Critical Path",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `📅 Project Duration: ${projectTasksData.projectInfo.startDate} → ${projectTasksData.projectInfo.endDate}`, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `⏱️ ${projectTasksData.projectInfo.duration}`, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Total Tasks: ${projectTasksData.frontendTasks.length + projectTasksData.backendTasks.length}`, size: 28, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Frontend: ${projectTasksData.frontendTasks.length} tasks (${totalFrontendHours}h) | Backend: ${projectTasksData.backendTasks.length} tasks (${totalBackendHours}h)`, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "⭐ Critical Path tasks are highlighted in red", size: 22, color: 'dc2626' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Document restructured for Product Management import", italics: true, size: 22 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== TABLE OF CONTENTS ====================
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({ text: "1. Executive Summary", spacing: { after: 50 } }),
        new Paragraph({ text: "2. Epics Overview", spacing: { after: 50 } }),
        new Paragraph({ text: "3. Critical Path Analysis", spacing: { after: 50 } }),
        new Paragraph({ text: "4. Timeline Overview", spacing: { after: 50 } }),
        new Paragraph({ text: "5. Frontend Tasks by Epic & Function", spacing: { after: 50 } }),
        new Paragraph({ text: "6. Backend Tasks by Epic & Function", spacing: { after: 50 } }),
        new Paragraph({ text: "7. Frontend Tasks - Detailed", spacing: { after: 50 } }),
        new Paragraph({ text: "8. Backend Tasks - Detailed", spacing: { after: 50 } }),
        new Paragraph({ text: "9. Integration Checklist", spacing: { after: 200 } }),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== EXECUTIVE SUMMARY ====================
        new Paragraph({
          text: "1. Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: `This document contains the complete task breakdown for ${projectTasksData.projectInfo.name}, organized into ${epicsData.length} Epics with multiple Functions each. The project spans from ${projectTasksData.projectInfo.startDate} to ${projectTasksData.projectInfo.endDate} (${projectTasksData.projectInfo.duration}).`,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Team Composition:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 1 Middle Frontend Developer (React, TypeScript, Tailwind CSS) - Full Time" }),
        new Paragraph({ text: "• 1 Middle Backend Developer (Python, Django, PostgreSQL) - Full Time" }),
        new Paragraph({ text: "• 1 Senior Frontend Developer - Part Time (~20h/week)" }),
        new Paragraph({ text: "• 1 Senior Backend Developer - Part Time (~20h/week)" }),
        new Paragraph({ text: "• 1 Senior Project Manager - Full Time", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Key Highlights:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 6 Epics covering Foundation, CRUD, Integrations, Communication, Analytics, and Testing" }),
        new Paragraph({ text: "• Critical path identified with 10 blocking tasks" }),
        new Paragraph({ text: "• New AI Logs Chat Interface added to Epic 3 (Real-time & Integrations)" }),
        new Paragraph({ text: "• All tasks have specific start and end dates", spacing: { after: 200 } }),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== EPICS OVERVIEW ====================
        new Paragraph({
          text: "2. Epics Overview",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createEpicSummaryTable(),
        new Paragraph({ text: "", spacing: { after: 200 } }),
        
        // Epic details
        ...epicsData.flatMap(epic => [
          new Paragraph({
            children: [
              new TextRun({ text: `Epic ${epic.id}: ${epic.name}`, bold: true, size: 26 }),
            ],
            spacing: { before: 200, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `📅 ${epic.startDate} → ${epic.endDate}`, size: 22 }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [new TextRun({ text: epic.description, italics: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Functions:", bold: true })],
            spacing: { after: 50 },
          }),
          ...epic.functions.map(func => 
            new Paragraph({
              children: [
                new TextRun({ text: `  • ${func.id} ${func.name}`, bold: true }),
                new TextRun({ text: ` (${func.startDate} → ${func.endDate})` }),
              ],
              spacing: { after: 30 },
            })
          ),
        ]),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== CRITICAL PATH ====================
        new Paragraph({
          text: "3. Critical Path Analysis",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        ...createCriticalPathSection(),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== TIMELINE ====================
        ...createTimelineSection(),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== FRONTEND TASKS BY EPIC/FUNCTION ====================
        new Paragraph({
          text: "5. Frontend Tasks by Epic & Function",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Total Frontend Tasks: ${projectTasksData.frontendTasks.length}`, bold: true }),
            new TextRun({ text: `  |  Total Hours: ${totalFrontendHours}h` }),
          ],
          spacing: { after: 200 },
        }),
        ...Object.entries(frontendByEpic).flatMap(([epicId, tasks]) => {
          const epic = epicsData.find(e => e.id === parseInt(epicId));
          const byFunction = groupTasksByFunction(tasks);
          
          return [
            new Paragraph({
              text: `Epic ${epicId}: ${epic?.name || 'Unknown'}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...Object.entries(byFunction).flatMap(([funcName, funcTasks]) => [
              new Paragraph({
                text: `Function ${funcName}`,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 150, after: 100 },
              }),
              createFunctionTaskTable(funcTasks),
              new Paragraph({ text: "", spacing: { after: 100 } }),
            ]),
          ];
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== BACKEND TASKS BY EPIC/FUNCTION ====================
        new Paragraph({
          text: "6. Backend Tasks by Epic & Function",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Total Backend Tasks: ${projectTasksData.backendTasks.length}`, bold: true }),
            new TextRun({ text: `  |  Total Hours: ${totalBackendHours}h` }),
          ],
          spacing: { after: 200 },
        }),
        ...Object.entries(backendByEpic).flatMap(([epicId, tasks]) => {
          const epic = epicsData.find(e => e.id === parseInt(epicId));
          const byFunction = groupTasksByFunction(tasks);
          
          return [
            new Paragraph({
              text: `Epic ${epicId}: ${epic?.name || 'Unknown'}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...Object.entries(byFunction).flatMap(([funcName, funcTasks]) => [
              new Paragraph({
                text: `Function ${funcName}`,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 150, after: 100 },
              }),
              createFunctionTaskTable(funcTasks),
              new Paragraph({ text: "", spacing: { after: 100 } }),
            ]),
          ];
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== FRONTEND TASKS DETAILED ====================
        new Paragraph({
          text: "7. Frontend Tasks - Detailed",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        ...projectTasksData.frontendTasks.flatMap(task => createDetailedTaskSection(task)),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== BACKEND TASKS DETAILED ====================
        new Paragraph({
          text: "8. Backend Tasks - Detailed",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        ...projectTasksData.backendTasks.flatMap(task => createDetailedTaskSection(task)),
        new Paragraph({ children: [new PageBreak()] }),

        // ==================== INTEGRATION CHECKLIST ====================
        new Paragraph({
          text: "9. Integration Checklist",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "This checklist shows how frontend and backend tasks connect for each integration area.",
          spacing: { after: 200 },
        }),
        ...projectTasksData.integrationChecklist.flatMap(item => [
          new Paragraph({
            text: item.area,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Frontend Tasks: ", bold: true }),
              new TextRun({ text: item.frontendTask }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Backend Tasks: ", bold: true }),
              new TextRun({ text: item.backendTask }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Description: ", bold: true }),
              new TextRun({ text: item.description }),
            ],
            spacing: { after: 100 },
          }),
        ]),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ProStatus_Logistics_Epics_Functions_Critical_Path.docx");
};
