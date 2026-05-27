import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Disease, DiseaseComparison } from '../models/models';
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

  getCategories() {
    return this.http.get<string[]>(`${this.api}/diseases/categories`);
  }

  getByCategory(category: string) {
    return this.http.get<Disease[]>(`${this.api}/diseases/by-category`, { params: { category } });
  }

  compare(idA: number, idB: number) {
    return this.http.get<DiseaseComparison>(`${this.api}/diseases/compare`, {
      params: { a: idA, b: idB }
    });
  }
}
