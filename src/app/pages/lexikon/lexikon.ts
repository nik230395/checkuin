import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiseaseService } from '../../services/disease.service';
import { Disease } from '../../models/models';

@Component({
  selector: 'app-lexikon',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lexikon.html',
  styleUrl: './lexikon.css'
})
export class Lexikon implements OnInit {
  private diseaseService = inject(DiseaseService);

  diseases         = signal<Disease[]>([]);
  categories       = signal<string[]>([]);
  loading          = signal(true);
  detailLoading    = signal(false);
  error            = signal('');
  searchQuery      = signal('');
  selectedCategory = signal<string | null>(null);
  selectedDisease  = signal<Disease | null>(null);

  filteredDiseases = computed(() => {
    let list = this.diseases();

    // Kategorie-Filter
    const cat = this.selectedCategory();
    if (cat) list = list.filter(d => d.category === cat);

    // Textsuche
    const q = this.searchQuery().toLowerCase().trim();
    if (q) list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    );

    return list;
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

    this.diseaseService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
    // Kategorie-Filter beim Suchen aufheben damit Ergebnisse nicht eingeschränkt werden
    if (value.trim()) this.selectedCategory.set(null);
  }

  selectCategory(cat: string | null) {
    this.selectedCategory.set(cat);
    this.searchQuery.set('');
  }

  selectDisease(disease: Disease) {
    this.detailLoading.set(true);
    this.selectedDisease.set(disease);
    window.scrollTo(0, 0);
    this.diseaseService.getById(disease.id).subscribe({
      next: (full) => {
        this.selectedDisease.set(full);
        this.detailLoading.set(false);
      },
      error: () => this.detailLoading.set(false)
    });
  }

  closeDetail() {
    this.selectedDisease.set(null);
  }

  dangerLabel(level?: number): string {
    if (level === 3) return 'Hohes Risiko';
    if (level === 2) return 'Mittleres Risiko';
    return 'Niedriges Risiko';
  }

  private static readonly ICON_BASE =
    'https://raw.githubusercontent.com/resolvetosavelives/healthicons/main/public/icons/svg/outline/';

  private static readonly DISEASE_ICONS: Record<string, string> = {
    'Erkältung (Common Cold)':      'conditions/chills-fever.svg',
    'Grippe (Influenza)':           'conditions/chills.svg',
    'COVID-19':                     'conditions/viral-lung_infection.svg',
    'Pneumonie (Lungenentzündung)': 'conditions/pneumonia.svg',
    'Asthma bronchiale':            'specialties/respirology.svg',
    'Keuchhusten (Pertussis)':      'conditions/coughing-alt.svg',
    'Streptokokken-Angina':         'body/mouth.svg',
    'Gastroenteritis':              'conditions/diarrhea.svg',
    'Appendizitis':                 'body/intestine.svg',
    'Meningitis':                   'body/neurology.svg',
    'Migräne':                      'conditions/headache.svg',
    'Mononukleose':                 'body/lymph-nodes.svg',
    'Windpocken':                   'body/bacteria.svg',
    'Harnwegsinfektion (UTI)':      'body/bladder.svg',
    'Nierensteine (Urolithiasis)':  'body/kidneys.svg',
    'Hypertonie':                   'specialties/cardiology.svg',
    'Herzrhythmusstörung':          'body/heart-organ.svg',
    'Diabetes mellitus Typ 2':      'body/pancreas.svg',
    'Hyperthyreose':                'body/thyroid.svg',
    'BPPV (Benigner Lagerungsschwindel)': 'body/ear.svg',
  };

  diseaseIconUrl(name?: string): string | null {
    if (!name) return null;
    const path = Lexikon.DISEASE_ICONS[name];
    return path ? Lexikon.ICON_BASE + path : null;
  }

}
