import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { projectScopeData } from '@/data/projectScope';

const createTableRow = (cells: string[], isHeader = false) => {
  return new TableRow({
    children: cells.map(cell => 
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: cell, bold: isHeader })],
        })],
        shading: isHeader ? { fill: "E8E8E8" } : undefined,
      })
    ),
  });
};

const createSimpleTable = (headers: string[], rows: string[][]) => {
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
      ...rows.map(row => createTableRow(row)),
    ],
  });
};

export const generateProjectScopeDocument = async () => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: projectScopeData.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // 1. Project Objectives
        new Paragraph({ text: "1. Project Objectives", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "Main Goal", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        new Paragraph({ text: projectScopeData.objectives.main, spacing: { after: 200 } }),
        new Paragraph({ text: "SMART Objectives", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        createSimpleTable(
          ["Goal", "Measure"],
          projectScopeData.objectives.smart.map(o => [o.goal, o.measure])
        ),

        // 2. Deliverables
        new Paragraph({ text: "2. Deliverables", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "A. Frontend Application (React + TypeScript + Tailwind)", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        createSimpleTable(
          ["Module", "Description"],
          projectScopeData.deliverables.frontend.map(d => [d.module, d.description])
        ),
        new Paragraph({ text: "B. Backend Services (Django + PostgreSQL)", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
        createSimpleTable(
          ["Service", "Description"],
          projectScopeData.deliverables.backend.map(d => [d.service, d.description])
        ),
        new Paragraph({ text: "C. Documentation", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
        createSimpleTable(
          ["Document", "Description"],
          projectScopeData.deliverables.documentation.map(d => [d.document, d.description])
        ),

        // 3. Technical Requirements
        new Paragraph({ text: "3. Technical Requirements", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "Frontend Stack", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        createSimpleTable(
          ["Technology", "Version", "Purpose"],
          projectScopeData.technicalRequirements.frontend.map(t => [t.technology, t.version, t.purpose])
        ),
        new Paragraph({ text: "Backend Stack", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
        createSimpleTable(
          ["Technology", "Version", "Purpose"],
          projectScopeData.technicalRequirements.backend.map(t => [t.technology, t.version, t.purpose])
        ),
        new Paragraph({ text: "Third-party Integrations", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
        createSimpleTable(
          ["Service", "Purpose"],
          projectScopeData.technicalRequirements.integrations.map(t => [t.service, t.purpose])
        ),

        // 4. User Roles
        new Paragraph({ text: "4. User Roles", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        createSimpleTable(
          ["Role", "Permissions"],
          projectScopeData.userRoles.map(r => [r.role, r.permissions])
        ),

        // 5. System Architecture
        new Paragraph({ text: "5. System Architecture", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: projectScopeData.systemArchitecture, font: "Courier New" })],
          spacing: { after: 200 },
        }),

        // 6. Team Composition
        new Paragraph({ text: "6. Team Composition", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        createSimpleTable(
          ["Role", "Level", "Work Time", "Responsibilities"],
          projectScopeData.teamComposition.map(t => [t.role, t.level, t.workTime, t.responsibilities])
        ),

        // 7. Milestones
        new Paragraph({ text: "7. Milestones", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...projectScopeData.milestones.flatMap(milestone => [
          new Paragraph({ 
            text: `${milestone.phase} (${milestone.duration})`, 
            heading: HeadingLevel.HEADING_2, 
            spacing: { before: 300, after: 100 } 
          }),
          createSimpleTable(
            ["Task", "Assignee", "Duration"],
            milestone.tasks.map(t => [t.task, t.assignee, t.duration])
          ),
        ]),

        // 8. Timeline Summary
        new Paragraph({ text: "8. Timeline Summary", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        createSimpleTable(
          ["Phase", "Duration", "Cumulative"],
          projectScopeData.timelineSummary.map(t => [t.phase, t.duration, t.cumulative])
        ),
        new Paragraph({ 
          children: [new TextRun({ text: "TOTAL: ~17 weeks (~4 months)", bold: true })],
          spacing: { before: 200 },
        }),

        // 9. API Endpoints
        new Paragraph({ text: "9. API Endpoints", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...Object.entries(projectScopeData.apiEndpoints).flatMap(([category, endpoints]) => [
          new Paragraph({ 
            text: category.charAt(0).toUpperCase() + category.slice(1), 
            heading: HeadingLevel.HEADING_2, 
            spacing: { before: 200, after: 100 } 
          }),
          ...endpoints.map(endpoint => new Paragraph({
            children: [new TextRun({ text: endpoint, font: "Courier New" })],
          })),
        ]),

        // 10. Database Schema
        new Paragraph({ text: "10. Database Schema", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...Object.entries(projectScopeData.databaseSchema).flatMap(([table, fields]) => [
          new Paragraph({ 
            text: table, 
            heading: HeadingLevel.HEADING_2, 
            spacing: { before: 200, after: 100 } 
          }),
          ...fields.map(field => new Paragraph({
            children: [new TextRun({ text: `├── ${field}` })],
          })),
        ]),

        // 11. Next Steps
        new Paragraph({ text: "11. Next Steps", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...projectScopeData.nextSteps.map(step => new Paragraph({
          children: [new TextRun({ text: `${step.completed ? '✅' : '⏳'} ${step.step}` })],
        })),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ProStatus_Logistics_Project_Scope.docx");
};
