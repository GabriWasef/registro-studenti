# registro-studenti

Laboratorio **Modulo 03 · Angular – Servizi: il registro degli studenti** (Quarta Informatica).

Un piccolo registro scritto in Angular: una home con qualche numero, l'elenco degli studenti in una tabella filtrabile e ordinabile, un form di inserimento con validazione, il dettaglio con parametro nell'URL e la modifica. Tutte le pagine lavorano sugli stessi dati, custoditi da un servizio (`StudentiService`, con un signal privato esposto in sola lettura).

Il progetto Angular è nella cartella [`registro-studenti/`](registro-studenti/). Le risposte alle dieci domande sono in [`RISPOSTE.md`](RISPOSTE.md).

## Come si avvia

Servono Node.js recente (Angular 22 richiede Node 22.22.3 o superiore) e l'Angular CLI.

```bash
cd registro-studenti
npm install
npx ng serve
```

Poi aprire http://localhost:4200.

## Struttura (`src/app`)

| Cartella / file | Contenuto |
|---|---|
| `modelli/studente.ts` | interfaccia `Studente` |
| `services/studenti-service.ts` | `StudentiService`: signal privato `dati`, `studenti` in sola lettura, `numero`, `migliore`, metodi `aggiungi`, `rimuovi`, `trova`, `successivo`, `aggiorna` |
| `home/` | home con numero studenti e scheda della media più alta |
| `elenco/` | tabella con filtro per classe, ordinamento e media della classe |
| `inserimento/` | form con validazione e `router.navigate()` dopo il salvataggio |
| `studente-card/` | componente riusabile con `input` e `output` |
| `dettaglio-studente/` | scheda con parametro `:id` letto con `paramMap` |
| `modifica-studente/` | modifica di uno studente (Prova tu, livello 3) |

I dati sono tenuti in memoria: ricaricando la pagina gli studenti aggiunti spariscono (comportamento previsto).
