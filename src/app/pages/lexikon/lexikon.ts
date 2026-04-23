import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DiseaseService } from '../../services/disease.service';
import { Disease } from '../../models/models';

@Component({
  selector: 'app-lexikon',
  standalone: true,
  imports: [],
  templateUrl: './lexikon.html',
  styleUrl: './lexikon.css'
})
export class Lexikon implements OnInit {
  private diseaseService = inject(DiseaseService);

  diseases = signal<Disease[]>([]);
  loading = signal(true);
  error = signal('');
  searchQuery = signal('');
  selectedDisease = signal<Disease | null>(null);

  filteredDiseases = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.diseases();
    return this.diseases().filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.diseaseService.getAll().subscribe({
      next: (data) => {
        this.diseases.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Krankheitsdaten konnten nicht geladen werden.');
        this.loading.set(false);
      }
    });
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  selectDisease(disease: Disease) {
    this.selectedDisease.set(disease);
    window.scrollTo(0, 0);
  }

  closeDetail() {
    this.selectedDisease.set(null);
  }
}
