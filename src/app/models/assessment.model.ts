export type QuestionType = 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer' | 'Essay';
export interface AssessmentQuestion {
  id: number; prompt: string; questionType: QuestionType; options: string[] | null;
  correctAnswer?: string | null; points: number; sortOrder: number;
}
export interface Assessment {
  id: number; title: string; description: string; maxScore: number; weight: number;
  courseId: number; opensAt: string | null; closesAt: string | null;
  durationMinutes: number; maxAttempts: number; status: string; questions?: AssessmentQuestion[];
}
export interface AssessmentDraft {
  courseId?: number; title: string; description: string; maxScore: number; weight: number;
  opensAt: string | null; closesAt: string | null; durationMinutes: number; maxAttempts: number;
}
export interface AssessmentAttempt {
  id: number; attemptNumber: number; startedAt: string; status: string;
}
export interface StudentQuestion {
  id: number; prompt: string; questionType: QuestionType; options: string[] | null;
  points: number; sortOrder: number;
}
export interface StudentAssessment extends Omit<Assessment, 'questions'> { questions: StudentQuestion[]; }
export interface AssessmentSubmission {
  id: number; attemptId: number; submittedAt: string; score: number | null;
  gradingStatus: string; feedback: string | null; studentId: number; studentName: string;
  attemptNumber: number;
  answers: { questionId: number; prompt: string; questionType: string; answerText: string;
    correctAnswer: string | null; points: number; awardedPoints: number | null; }[];
}
