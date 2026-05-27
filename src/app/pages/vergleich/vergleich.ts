import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DiseaseService } from '../../services/disease.service';
import { Disease, DiseaseComparison } from '../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vergleich',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vergleich.html',
  styleUrl: './vergleich.css'
})
export class Vergleich implements OnInit {
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private diseaseService = inject(DiseaseService);

  diseases    = signal<Disease[]>([]);
  selectedA   = signal<Disease | null>(null);
  selectedB   = signal<Disease | null>(null);
  comparison  = signal<DiseaseComparison | null>(null);
  loading     = signal(false);
  error       = signal('');

  ngOnInit() {
    // Alle Krankheiten laden für die Auswahl-Dropdowns
    this.diseaseService.getAll().subscribe({
      next: d => {
        this.diseases.set(d);
        // Query-Params auswerten (z.B. von Lexikon-"Vergleichen"-Button)
        const params = this.route.snapshot.queryParams;
        if (params['a'] && params['b']) {
          const a = d.find(x => x.id === +params['a']);
          const b = d.find(x => x.id === +params['b']);
          if (a) this.selectedA.set(a);
          if (b) this.selectedB.set(b);
          if (a && b) this.loadComparison(a.id, b.id);
        }
      }
    });
  }

  selectA(id: string) {
    const d = this.diseases().find(x => x.id === +id) ?? null;
    this.selectedA.set(d);
    this.comparison.set(null);
  }

  selectB(id: string) {
    const d = this.diseases().find(x => x.id === +id) ?? null;
    this.selectedB.set(d);
    this.comparison.set(null);
  }

  compare() {
    const a = this.selectedA();
    const b = this.selectedB();
    if (!a || !b || a.id === b.id) return;
    this.loadComparison(a.id, b.id);
  }

  private loadComparison(idA: number, idB: number) {
    this.loading.set(true);
    this.error.set('');
    this.diseaseService.compare(idA, idB).subscribe({
      next: result => {
        this.comparison.set(result);
        this.loading.set(false);
        // URL aktualisieren für Direktlinks
        this.router.navigate([], {
          queryParams: { a: idA, b: idB },
          replaceUrl: true
        });
      },
      error: () => {
        this.error.set('Vergleich konnte nicht geladen werden.');
        this.loading.set(false);
      }
    });
  }

  barWidth(prob: number): string {
    return `${Math.round(prob * 100)}%`;
  }

  dangerLabel(level?: number): string {
    if (level === 3) return 'Hohes Risiko';
    if (level === 2) return 'Mittleres Risiko';
    return 'Niedriges Risiko';
  }

  canCompare(): boolean {
    const a = this.selectedA();
    const b = this.selectedB();
    return !!a && !!b && a.id !== b.id;
  }
}
