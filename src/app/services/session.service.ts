import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AnswerResultDto,
  NextQuestionDto,
  SessionStartResponse,
  SessionStatusResponse,
  UserProfile
} from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api    = `${environment.apiUrl}/anamnesis`;
  private readonly exportApi = `${environment.apiUrl}/export`;
  private readonly userApi   = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // ── Session-Lifecycle ─────────────────────────────────────────────────────

  start() {
    return this.http.post<SessionStartResponse>(`${this.api}/start`, {});
  }

  answer(sessionId: number, questionId: number, answer: boolean) {
    return this.http.post<AnswerResultDto>(`${this.api}/${sessionId}/answer`, { questionId, answer });
  }

  pause(sessionId: number) {
    return this.http.post<{ message: string }>(`${this.api}/${sessionId}/pause`, {});
  }

  resume(sessionId: number) {
    return this.http.get<SessionStartResponse>(`${this.api}/${sessionId}/resume`);
  }

  finish(sessionId: number) {
    return this.http.post<any>(`${this.api}/${sessionId}/finish`, {});
  }

  // ── History & Status ──────────────────────────────────────────────────────

  getStatus(sessionId: number) {
    return this.http.get<SessionStatusResponse>(`${this.api}/${sessionId}`);
  }

  getHistory() {
    return this.http.get<SessionStatusResponse[]>(`${this.api}/history`);
  }

  // ── Export ────────────────────────────────────────────────────────────────

  exportPdf(sessionId: number) {
    return this.http.get(`${this.exportApi}/pdf/${sessionId}`, { responseType: 'blob' });
  }

  // ── User ─────────────────────────────────────────────────────────────────

  getMe() {
    return this.http.get<UserProfile>(`${this.userApi}/me`);
  }

  deleteAccount() {
    return this.http.delete<{ message: string }>(`${this.userApi}/me`);
  }
}
