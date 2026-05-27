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
      title: "Kein Raten. Echte Mathematik.",
      description: "Unser Bayesscher Algorithmus berechnet auf Basis Ihrer Antworten Wahrscheinlichkeiten für 35 Erkrankungen – transparent, nachvollziehbar, Schritt für Schritt.",
      color: "#EDE9FD",
      image: "assets/pose_xray.png",
      imgClass: "mascot-img"
    },
    {
      title: "Ergebnisse, die Sie verstehen.",
      description: "Komplexe Diagnosen werden durch KI-Integration in klare, verständliche Sprache übersetzt – mit einem strukturierten PDF-Bericht für Ihren Arztbesuch.",
      color: "#F1F1F1",
      image: "assets/pose_reflex.png",
      imgClass: "mascot-img"
    },
    {
      title: "35 Erkrankungen. Geprüfte Quellen.",
      description: "Jeder Eintrag im Lexikon basiert auf medizinischer Fachliteratur von WHO, RKI und PubMed – kein generierter Content, sondern validierte Evidenz.",
      color: "#E9EDF5",
      image: "assets/pose_chameleon.png",
      imgClass: "mascot-img"
    }
  ];
}