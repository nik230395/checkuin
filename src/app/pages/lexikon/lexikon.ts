import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lexikon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lexikon.html',
  styleUrl: './lexikon.css'
})
export class Lexikon{
  // Die Datenliste
  diseases = [
    { name: "Influenza (Grippe)", category: "Infektionen", symptoms: "Fieber, Husten, Gliederschmerzen", detail: "Die Influenza unterscheidet sich deutlich von einem normalen grippalen Infekt..." },
    { name: "Migräne", category: "Neurologie", symptoms: "Einseitiger Kopfschmerz, Lichtempfindlichkeit", detail: "Migräne ist eine komplexe neurologische Erkrankung..." },
    { name: "Diabetes Typ 2", category: "Stoffwechsel", symptoms: "Durst, häufiges Wasserlassen", detail: "Diabetes mellitus Typ 2 ist eine chronische Stoffwechselerkrankung..." },
    { name: "Asthma Bronchiale", category: "Atemwege", symptoms: "Atemnot, Pfeifen beim Atmen", detail: "Asthma ist eine chronisch-entzündliche Erkrankung der Atemwege..." },
    { name: "Bluthochdruck", category: "Herz-Kreislauf", symptoms: "Kopfschmerzen, Schwindel", detail: "Hypertonie ist ein Zustand, bei dem der Druck in den Blutgefäßen dauerhaft erhöht ist..." },
    { name: "Gastritis", category: "Magen-Darm", symptoms: "Magenschmerzen, Völlegefühl", detail: "Unter einer Gastritis versteht man eine Entzündung der Magenschleimhaut..." }
  ];

  selectedDisease: any = null;

  selectDisease(disease: any) {
    this.selectedDisease = disease;
    window.scrollTo(0, 0);
  }

  closeDetail() {
    this.selectedDisease = null;
  }
}