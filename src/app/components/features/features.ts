import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html', // Achte darauf, dass der Dateiname stimmt!
  styleUrl: './features.css'
})
export class Features{
  // Das ist das Array, das im HTML mit @for (feature of features) aufgerufen wird
  features = [
    {
      title: "Bayes'sche Logik",
      description: "Mathematisch fundierter Kern, der Wahrscheinlichkeiten präzise berechnet – ohne Black-Box-Effekt.",
      color: "#E8E4FB",
      image: "assets/mockup-1.png"
    },
    {
      title: "KI-gestützte Erklärungen",
      description: "Verständliche Aufbereitung komplexer Ergebnisse durch modernste Google Gemini Integration.",
      color: "#F1F1F1",
      image: "assets/mockup-2.png"
    },
    {
      title: "Evidenzbasierte Basis",
      description: "Umfassendes Krankheitslexikon mit über 20 häufigen Erkrankungen auf Basis medizinischer Literatur.",
      color: "#E9EDF5",
      image: "assets/mockup-3.png"
    }
  ];
}