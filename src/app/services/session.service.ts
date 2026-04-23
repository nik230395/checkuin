import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AnswerResultDto,
  NextQuestionDto,
  SessionStartResponse,
  SessionStatusResponse
} from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api = `${environment.apiUrl}/anamnesis`;
  private readonly exportApi = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) {}

  start() {
    return this.http.post<SessionStartResponse>(`${this.api}/start`, {});
  }

  getNext(sessionId: number) {
    return this.http.get<NextQuestionDto>(`${this.api}/${sessionId}/next`);
  }

  answer(sessionId: number, questionId: number, answer: boolean) {
    return this.http.post<AnswerResultDto>(`${this.api}/${sessionId}/answer`, { questionId, answer });
  }

  finish(sessionId: number) {
    return this.http.post<any>(`${this.api}/${sessionId}/finish`, {});
  }

  getStatus(sessionId: number) {
    return this.http.get<SessionStatusResponse>(`${this.api}/${sessionId}`);
  }

  getHistory() {
    return this.http.get<SessionStatusResponse[]>(`${this.api}/history`);
  }

  exportPdf(sessionId: number) {
    return this.http.get(`${this.exportApi}/pdf/${sessionId}`, { responseType: 'blob' });
  }
}
