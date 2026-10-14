import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentiService } from '../services/studenti-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-elenco',
  styleUrl: './elenco.css',
  templateUrl: './elenco.html',
})
export class Elenco {
  private readonly studentiService = inject(StudentiService);
  readonly filtroClasse = signal('');
  readonly filtrati = computed(() => {
    const filtro = this.filtroClasse().trim().toUpperCase();
    const tutti = this.studentiService.studenti();
    if (filtro === '') {
      return tutti;
    }
    return tutti.filter(s => s.classe.toUpperCase() === filtro);
  });

  // Media dei voti degli studenti filtrati (0 se la lista è vuota: niente divisione per zero)
  readonly mediaClasse = computed(() => {
    const lista = this.filtrati();
    if (lista.length === 0) {
      return 0;
    }
    return lista.reduce((somma, s) => somma + s.mediaVoti, 0) / lista.length;
  });

  rimuovi(id: number): void {
    this.studentiService.rimuovi(id);
  }
}
