import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Disease } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiseaseService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Disease[]>(`${this.api}/diseases`);
  }

  getById(id: number) {
    return this.http.get<Disease>(`${this.api}/diseases/${id}`);
  }

  search(query: string) {
    return this.http.get<Disease[]>(`${this.api}/diseases/search`, { params: { query } });
  }
}
