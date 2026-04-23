export interface AuthResponse {
  token: string;
}

export interface UserLoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Disease {
  id: number;
  name: string;
  description?: string;
  icdCode?: string;
}

export interface NextQuestionDto {
  questionId: number;
  text: string;
  isEmergency?: boolean;
}

export interface SessionStartResponse {
  sessionId: number;
  status: string;
  startedAt: string;
  question: NextQuestionDto;
}

export interface AnswerResultDto {
  sessionFinished: boolean;
  isEmergency: boolean;
  nextQuestion?: NextQuestionDto;
}

export interface DiagnosisResult {
  disease: Disease;
  probability: number;
}

export interface SessionStatusResponse {
  sessionId: number;
  status: string;
  startedAt: string;
  finishedAt?: string;
  diagnosedDiseases?: DiagnosisResult[];
  geminiExplanation?: string;
}
