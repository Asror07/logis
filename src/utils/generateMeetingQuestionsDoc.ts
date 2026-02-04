import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import { meetingQuestionsData, Question } from '@/data/meetingQuestions';

const createTableRow = (cells: string[], isHeader: boolean = false): TableRow => {
  return new TableRow({
    children: cells.map(cell => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({
          text: cell,
          bold: isHeader,
          size: isHeader ? 22 : 20
        })],
        alignment: AlignmentType.LEFT
      })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
      },
      shading: isHeader ? { fill: "2563EB" } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 }
    }))
  });
};

const createQuestionTable = (questions: Question[]): Table => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(["ID", "Question", "Priority", "Options"], true),
      ...questions.map(q => createTableRow([
        q.id,
        q.question,
        q.priority,
        q.options?.join(" | ") || "-"
      ]))
    ]
  });
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Critical': return 'DC2626';
    case 'High': return 'EA580C';
    case 'Medium': return 'CA8A04';
    case 'Low': return '16A34A';
    default: return '6B7280';
  }
};

const createDetailedQuestionSection = (question: Question): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: `${question.id}: `, bold: true, size: 24 }),
        new TextRun({ text: question.question, size: 24 })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Priority: ", bold: true, size: 20 }),
        new TextRun({ text: question.priority, size: 20, color: getPriorityColor(question.priority) })
      ],
      spacing: { after: 50 }
    })
  ];

  if (question.context) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({ text: "Context: ", bold: true, size: 20 }),
        new TextRun({ text: question.context, size: 20, italics: true })
      ],
      spacing: { after: 50 }
    }));
  }

  if (question.options && question.options.length > 0) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: "Options:", bold: true, size: 20 })],
      spacing: { after: 50 }
    }));
    question.options.forEach(option => {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: `  □  ${option}`, size: 20 })],
        spacing: { after: 30 }
      }));
    });
  }

  paragraphs.push(new Paragraph({
    children: [
      new TextRun({ text: "Answer/Notes: ", bold: true, size: 20 }),
      new TextRun({ text: "________________________________________", size: 20, color: "CCCCCC" })
    ],
    spacing: { after: 200 }
  }));

  return paragraphs;
};

export const generateMeetingQuestionsDocument = async (): Promise<void> => {
  const allQuestions = meetingQuestionsData.categories.flatMap(c => c.questions);
  const criticalQuestions = allQuestions.filter(q => q.priority === 'Critical');
  const highQuestions = allQuestions.filter(q => q.priority === 'High');
  const mediumQuestions = allQuestions.filter(q => q.priority === 'Medium');
  const lowQuestions = allQuestions.filter(q => q.priority === 'Low');

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Cover Page
        new Paragraph({
          children: [new TextRun({ text: meetingQuestionsData.title, bold: true, size: 56, color: "2563EB" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1000, after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: meetingQuestionsData.subtitle, size: 36 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: meetingQuestionsData.date, size: 28, italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Prepared by: Development Team", size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString()}`, size: 20 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 }
        }),

        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `This document contains ${allQuestions.length} questions across ${meetingQuestionsData.categories.length} categories that need to be discussed and clarified before or during development.`,
            size: 22
          })],
          spacing: { after: 200 }
        }),

        // Summary Stats Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createTableRow(["Priority Level", "Count", "Percentage"], true),
            createTableRow(["Critical", criticalQuestions.length.toString(), `${Math.round(criticalQuestions.length / allQuestions.length * 100)}%`]),
            createTableRow(["High", highQuestions.length.toString(), `${Math.round(highQuestions.length / allQuestions.length * 100)}%`]),
            createTableRow(["Medium", mediumQuestions.length.toString(), `${Math.round(mediumQuestions.length / allQuestions.length * 100)}%`]),
            createTableRow(["Low", lowQuestions.length.toString(), `${Math.round(lowQuestions.length / allQuestions.length * 100)}%`]),
            createTableRow(["TOTAL", allQuestions.length.toString(), "100%"])
          ]
        }),

        new Paragraph({ children: [], spacing: { after: 400 } }),

        // Critical Questions Highlight
        new Paragraph({
          text: "⚠️ Critical Priority Questions (Must Answer First)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        ...criticalQuestions.map(q => new Paragraph({
          children: [
            new TextRun({ text: `• ${q.id}: `, bold: true, size: 22 }),
            new TextRun({ text: q.question, size: 22 })
          ],
          spacing: { after: 100 }
        })),

        // Table of Contents
        new Paragraph({
          children: [new PageBreak()]
        }),
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        ...meetingQuestionsData.categories.map((cat, i) => new Paragraph({
          children: [new TextRun({ 
            text: `${i + 1}. ${cat.category} (${cat.questions.length} questions)`, 
            size: 22 
          })],
          spacing: { after: 100 }
        })),

        // Detailed Sections
        ...meetingQuestionsData.categories.flatMap((category, catIndex) => [
          new Paragraph({
            children: [new PageBreak()]
          }),
          new Paragraph({
            text: `Section ${catIndex + 1}: ${category.category}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: category.description, size: 22, italics: true })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: `Total Questions: ${category.questions.length}`, size: 20, bold: true })],
            spacing: { after: 300 }
          }),
          // Questions Table for quick reference
          createQuestionTable(category.questions),
          new Paragraph({ children: [], spacing: { after: 400 } }),
          // Detailed questions with answer space
          new Paragraph({
            text: "Detailed Questions with Answer Space",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          }),
          ...category.questions.flatMap(q => createDetailedQuestionSection(q))
        ]),

        // Priority Summary Section
        new Paragraph({
          children: [new PageBreak()]
        }),
        new Paragraph({
          text: "Appendix: Questions Grouped by Priority",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        // Critical
        new Paragraph({
          text: "🔴 Critical Priority (Block Development)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 }
        }),
        ...criticalQuestions.map(q => new Paragraph({
          children: [
            new TextRun({ text: `${q.id}: `, bold: true, size: 20 }),
            new TextRun({ text: q.question, size: 20 })
          ],
          spacing: { after: 80 }
        })),

        // High
        new Paragraph({
          text: "🟠 High Priority (Needed Soon)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 }
        }),
        ...highQuestions.map(q => new Paragraph({
          children: [
            new TextRun({ text: `${q.id}: `, bold: true, size: 20 }),
            new TextRun({ text: q.question, size: 20 })
          ],
          spacing: { after: 80 }
        })),

        // Medium
        new Paragraph({
          text: "🟡 Medium Priority (Can Wait)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 }
        }),
        ...mediumQuestions.map(q => new Paragraph({
          children: [
            new TextRun({ text: `${q.id}: `, bold: true, size: 20 }),
            new TextRun({ text: q.question, size: 20 })
          ],
          spacing: { after: 80 }
        })),

        // Low
        new Paragraph({
          text: "🟢 Low Priority (Nice to Know)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 }
        }),
        ...lowQuestions.map(q => new Paragraph({
          children: [
            new TextRun({ text: `${q.id}: `, bold: true, size: 20 }),
            new TextRun({ text: q.question, size: 20 })
          ],
          spacing: { after: 80 }
        })),

        // Meeting Notes Section
        new Paragraph({
          children: [new PageBreak()]
        }),
        new Paragraph({
          text: "Meeting Notes",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Date: ____________________", size: 22 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Attendees: ____________________", size: 22 })],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Key Decisions:", size: 22, bold: true })],
          spacing: { after: 100 }
        }),
        ...Array(10).fill(null).map(() => new Paragraph({
          children: [new TextRun({ text: "• _______________________________________________", size: 20, color: "CCCCCC" })],
          spacing: { after: 100 }
        })),
        new Paragraph({
          children: [new TextRun({ text: "Action Items:", size: 22, bold: true })],
          spacing: { before: 300, after: 100 }
        }),
        ...Array(8).fill(null).map(() => new Paragraph({
          children: [new TextRun({ text: "□ _______________________________________________", size: 20, color: "CCCCCC" })],
          spacing: { after: 100 }
        })),
        new Paragraph({
          children: [new TextRun({ text: "Follow-up Required:", size: 22, bold: true })],
          spacing: { before: 300, after: 100 }
        }),
        ...Array(5).fill(null).map(() => new Paragraph({
          children: [new TextRun({ text: "_______________________________________________", size: 20, color: "CCCCCC" })],
          spacing: { after: 100 }
        }))
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ProStatus_Logistics_Meeting_Questions.docx");
};
