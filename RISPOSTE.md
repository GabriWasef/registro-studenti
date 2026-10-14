# Risposte – Servizi: il registro degli studenti

**1. Che cos'è `app.routes.ts` e che cosa contiene in questo progetto?**
`app.routes.ts` è il file in cui si dichiara la tabella delle route: un array `Routes` che associa ogni URL al componente da mostrare dentro `<router-outlet />`. Viene passato al router con `provideRouter(routes)` in `app.config.ts`. In questo progetto contiene:

| URL | Componente / azione |
|---|---|
| `/` (vuoto) | redirect a `/home` (con `pathMatch: 'full'`) |
| `/home` | `Home` |
| `/elenco` | `Elenco` |
| `/elenco/:id` | `DettaglioStudente` (`:id` è un parametro) |
| `/inserimento` | `Inserimento` |
| `/modifica/:id` | `ModificaStudente` (Prova tu livello 3) |
| `**` (qualsiasi altro URL) | redirect a `/home` |

La wildcard `**` va messa per ultima, perché le route vengono controllate nell'ordine in cui sono scritte.

**2. Che cos'è un service e perché lo si usa? Perché gli studenti stanno in `StudentiService` e non nel componente `Elenco`?**
Un service è una classe (qui decorata con `@Service()`) di cui Angular crea una sola istanza condivisa, che i componenti ottengono con `inject()`. Si usa per tenere dati e logica che non appartengono a una singola schermata. Gli studenti servono a più pagine (home, elenco, inserimento, dettaglio, modifica): se stessero in `Elenco`, le altre pagine non potrebbero leggerli. Inoltre un componente viene distrutto quando si cambia pagina e i suoi dati andrebbero persi, mentre il servizio vive finché vive l'applicazione. Così, se elimino uno studente dall'elenco, la home mostra subito il numero aggiornato perché legge lo stesso signal.

**3. Come si legge l'`id` dello studente dall'URL? Perché va convertito con `Number`?**
Si inietta `ActivatedRoute` e si legge `route.paramMap` (con `.subscribe`) chiamando `parametri.get('id')`. I parametri dell'URL arrivano sempre come **stringhe** (`'2'`, non `2`). `trova` confronta con `s.id === id`, e `'2' === 2` è `false`: senza `Number(...)` non troverebbe mai nessuno studente e il dettaglio rimanderebbe sempre all'elenco.

**4. Perché il signal `dati` è privato e i componenti leggono `studenti`? Che cosa potrebbe succedere se `Elenco` potesse chiamare `set` sul signal?**
`dati` è privato così solo il servizio può modificare i dati, passando dai suoi metodi (`aggiungi`, `rimuovi`, `aggiorna`), che applicano le regole (per esempio l'id automatico). `studenti` è `dati.asReadonly()`: stessa fonte, quindi la tabella si aggiorna da sola, ma senza `set` né `update`. Se `Elenco` potesse chiamare `set`, qualunque componente potrebbe sostituire la lista direttamente: id duplicati, studenti con dati non validi, lista svuotata per errore, e sarebbe difficilissimo capire quale parte del codice ha rotto i dati.

**5. Come viene calcolato l'id di un nuovo studente? Perché "numero di studenti + 1" sarebbe sbagliato?**
Il servizio prende l'id più grande tra quelli esistenti e aggiunge uno: `Math.max(0, ...ids) + 1` (lo `0` serve a far funzionare anche la lista vuota). Esempio: ho gli id 1, 2, 3, 4, 5 ed elimino lo studente 2; restano 4 studenti (1, 3, 4, 5). Con "numero + 1" il nuovo studente avrebbe id 4 + 1 = **5**, che esiste già (Paolo Russo): due studenti con lo stesso id, e `trova(5)`, `track s.id` e i link al dettaglio si confonderebbero. Con "massimo + 1" il nuovo id è 5 + 1 = **6**, sempre libero.

**6. Che cosa succede, passo per passo, quando scrivo una lettera nel campo del filtro?**
1. A ogni tasto premuto `[(ngModel)]` aggiorna il signal `filtroClasse` con il testo scritto.
2. `filtrati` è un `computed` che legge `filtroClasse()`: Angular lo segna come da ricalcolare.
3. Il template legge `filtrati()`, quindi il valore viene ricalcolato: `trim()` e `toUpperCase()` sul testo, poi `filter` sugli studenti della classe uguale (se il filtro è vuoto restituisce tutti).
4. Il template si aggiorna: la tabella mostra solo gli studenti filtrati, oppure compare l'avviso giallo se non ce ne sono.

**7. A che cosa servono `#modulo="ngForm"` e `[disabled]="modulo.invalid"`? Quali condizioni rendono il form non valido?**
`#modulo="ngForm"` crea una variabile di template che punta all'oggetto `NgForm` con cui Angular controlla il form (non all'elemento `<form>`). `[disabled]="modulo.invalid"` disabilita il pulsante Salva finché il form non è valido. Il form è non valido se almeno un campo viola le sue regole: nome vuoto (`required`), classe vuota (`required`), media vuota (`required`) oppure media fuori dall'intervallo ammesso, cioè minore di 1 o maggiore di 10 (`min`/`max`).

**8. Perché dopo il salvataggio si usa `router.navigate(['/elenco'])` invece di un link?**
Perché la navigazione è la conseguenza di un'azione: deve avvenire *dopo* che il codice di `salva()` ha aggiunto lo studente, e solo se il salvataggio è andato a buon fine. Un link (`routerLink`) naviga appena viene cliccato, senza eseguire codice prima, e non può dipendere dal risultato di un'operazione. `navigate()` permette di decidere dal codice quando e dove andare.

**9. Quali input e quale output ha `StudenteCard`? Perché la card non chiama direttamente il servizio per rimuovere lo studente?**
Input: `studente` (obbligatorio, `input.required<Studente>()`) e `azioni` (facoltativo, vale `true` se il padre non lo passa, decide se mostrare il pulsante). Output: `rimosso`, che emette lo `Studente` quando si preme "Rimuovi dal registro". La card non chiama il servizio perché è un componente riutilizzabile che deve solo mostrare e avvisare: non sa che cosa il padre vuole fare. Nella home viene usata senza pulsante; nel dettaglio il padre risponde all'evento rimuovendo lo studente dal servizio e poi tornando all'elenco. Così la stessa card funziona in pagine diverse con comportamenti diversi.

**10. Perché "Studente successivo" funziona solo con `paramMap.subscribe`? Che cosa vedrei con lo snapshot?**
Passando da `/elenco/2` a `/elenco/3` la route è la stessa, quindi Angular **riusa** lo stesso componente: `ngOnInit` non viene eseguito di nuovo. `paramMap` è un Observable che emette un nuovo valore a ogni cambio di parametro, quindi con `subscribe` il codice viene richiamato, trova il nuovo studente e aggiorna il signal. Con lo snapshot (`this.route.snapshot.paramMap.get('id')`) l'id verrebbe letto una volta sola all'apertura: l'URL cambierebbe (`/elenco/3`) ma la scheda resterebbe ferma sullo studente di prima.

---

## Prova tu – nota sul livello 3 (modifica)
In `ModificaStudente` lo snapshot va bene perché da `/modifica/2` non si passa mai a `/modifica/3` restando nello stesso componente: dopo "Salva" si naviga al dettaglio (`/elenco/:id`), cioè a un'altra route, quindi il componente viene distrutto e ricreato la volta successiva. L'id letto in `ngOnInit` non può cambiare mentre il componente è vivo.
