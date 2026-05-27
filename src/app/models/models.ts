// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface UserLoginRequest {
  username: string; // backend field — accepts email OR username
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  username: string;
  email: string;
  verified: boolean;
}

// ─── Disease (Lexikon) ───────────────────────────────────────────────────────

export interface Disease {
  id: number;
  name: string;
  description?: string;
  icdCode?: string;
  dangerLevel?: number;
  // Lexikon-Detailfelder (vom Backend als volle Entity zurückgegeben)
  overview?: string;
  symptoms?: string;
  causes?: string;
  diagnosis?: string;
  treatment?: string;
  progression?: string;
  whenToSeeDoctor?: string;
  sources?: string;
  category?: string;
}

// ─── Disease Comparison ──────────────────────────────────────────────────────

export interface DifferentiatorDto {
  symptomId:   number;
  symptomName: string;
  symptomKey:  string;
  probA:       number;
  probB:       number;
  delta:       number;
  favorsA:     boolean;
}

export interface DiseaseComparison {
  diseaseAId:         number;
  diseaseAName:       string;
  diseaseACategory:   string;
  diseaseADangerLevel: number;
  diseaseBId:         number;
  diseaseBName:       string;
  diseaseBCategory:   string;
  diseaseBDangerLevel: number;
  differentiators:    DifferentiatorDto[];
}

// ─── Anamnesis / Session ─────────────────────────────────────────────────────

/** Matches backend NextQuestionDto exactly */
export interface NextQuestionDto {
  symptomId: number;       // used as questionId when sending answer
  frageText: string;       // the question text shown to the user
  körperRegion?: string;   // access via ['körperRegion'] in templates (non-ASCII)
  kategorie?: string;
  currentQuestion: number; // e.g. 5
  maxQuestions: number;    // always 17
  isEmergency: boolean;    // true → show 144 warning
}

/** Matches backend SessionStartResponse exactly */
export interface SessionStartResponse {
  sessionId: number;
  status: string;
  startedAt: string;
  question: NextQuestionDto; // first question included in start response
}

/** Matches backend AnswerResultDto exactly */
export interface AnswerResultDto {
  finished: boolean;
  nextQuestion?: NextQuestionDto;     // null when finished=true
  top3Results?: DiagnosisResultDto[]; // null when finished=false
}

/** Matches backend DiagnosisResultDto exactly (flat, no nested disease object) */
export interface DiagnosisResultDto {
  diseaseId: number;
  diseaseName: string;
  description?: string;
  probability: number;  // e.g. 0.87 = 87%
  dangerLevel: number;  // 1=low, 2=medium, 3=high
}

/** Matches backend SessionStatusResponse exactly */
export interface SessionStatusResponse {
  sessionId: number;
  status: string;      // AKTIV | PAUSIERT | ABGESCHLOSSEN
  answeredCount: number;
  startedAt: string;
  completedAt?: string;
  top3Results?: DiagnosisResultDto[];
}
