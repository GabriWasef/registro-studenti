import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentiService } from '../services/studenti-service';

@Component({
  imports: [FormsModule],
  selector: 'app-modifica-studente',
  styleUrl: './modifica-studente.css',
  templateUrl: './modifica-studente.html',
})
export class ModificaStudente implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentiService = inject(StudentiService);
  private id = 0;
  readonly nome = signal('');
  readonly classe = signal('');
  readonly media = signal(6);

  ngOnInit(): void {
    // Qui lo snapshot va bene: da /modifica/2 non si passa mai a /modifica/3 restando
    // nello stesso componente (si esce sempre verso un'altra pagina), quindi l'id letto
    // all'apertura non può cambiare mentre il componente è vivo.
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const studente = this.studentiService.trova(this.id);
    if (!studente) {
      this.router.navigate(['/elenco']);
      return;
    }
    this.nome.set(studente.nome);
    this.classe.set(studente.classe);
    this.media.set(studente.mediaVoti);
  }

  salva(): void {
    this.studentiService.aggiorna({
      id: this.id,
      nome: this.nome().trim(),
      classe: this.classe().trim().toUpperCase(),
      mediaVoti: Number(this.media()),
    });
    this.router.navigate(['/elenco', this.id]);
  }
}
