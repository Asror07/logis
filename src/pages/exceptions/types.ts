export interface Exception {
  id: string;
  loadId: string;
  type: 'delay' | 'breakdown' | 'offline' | 'weather' | 'deviation';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  detectedAt: string;
  location: string;
  driver: string;
  carrier: string;
  affectedEta: string;
  suggestedActions: string[];
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo: string | null;
}

export interface ActionDetail {
  description: string;
  steps: string[];
  estimatedTime: string;
}

export type ExceptionType = Exception['type'];
export type ExceptionSeverity = Exception['severity'];
export type ExceptionStatus = Exception['status'];
