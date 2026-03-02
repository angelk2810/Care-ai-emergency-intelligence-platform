export interface TriageReport {
  id: string;
  urgency_level: 'Critical' | 'Urgent' | 'Non-Urgent';
  confidence_score: number;
  primary_concern: string;
  reasoning: string;
  follow_up_questions: string[];
  red_flags: string[];
  immediate_actions: string[];
  risk_factors: string[];
  doctor_summary: string;
  timeline: {
    onset: string;
    duration: string;
    severity: string;
    pattern: string;
  };
  createdAt: string;
}

export interface AppStats {
  total: number;
  urgencyDistribution: {
    Critical: number;
    Urgent: number;
    "Non-Urgent": number;
  };
  avgConfidence: number;
}
