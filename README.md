# La ConversAzione — Archivio degli ascolti

Archivio consultabile dei brani proposti alla community **La ConversAzione** di Rox Alberga: 141 brani, dal 14 dicembre 2025 al 30 luglio 2026, organizzati in 20 playlist tematiche.

La community si trova su Telegram: [t.me/conversazioneroxalberga](https://t.me/conversazioneroxalberga). La pagina è realizzata con [Claude Code](https://claude.com/claude-code) in base agli ascolti proposti alla community.

La pagina è un unico file statico ([index.html](index.html)) senza dipendenze esterne:

- elenco cronologico per settimana a tema, con data, interprete e link diretto all'esecuzione su YouTube;
- ricerca istantanea per compositore, brano o interprete;
- segnalazione dei video non più disponibili;
- tema chiaro/scuro automatico.

## Pubblicazione

Il sito è pensato per GitHub Pages: basta pubblicare il repository e attivare Pages sul branch `main` (cartella root).

## Iscrizioni alla guida all'ascolto di Otello

La pagina [guida-ascolto/](guida-ascolto/index.html) raccoglie email e giorno preferito per la diretta (30 novembre, 1 o 2 dicembre, ore 18), mostra la maggioranza in tempo reale e chiude le iscrizioni a 50 posti. Gli indirizzi finiscono in un Foglio Google, scaricabile in Excel. La pagina pubblica riceve solo i conteggi, mai gli indirizzi.

Attivazione (una volta sola, circa 5 minuti):

1. Crea un Foglio Google vuoto su [sheets.new](https://sheets.new).
2. Nel foglio: **Estensioni → Apps Script**. Cancella il contenuto, incolla tutto [guida-ascolto/apps-script.gs](guida-ascolto/apps-script.gs) e salva.
3. **Esegui il deployment → Nuovo deployment →** tipo **App web**. "Esegui come": *Me*; "Chi ha accesso": *Chiunque*. Autorizza quando richiesto.
4. Copia l'URL dell'app web (finisce con `/exec`) e incollalo in `guida-ascolto/index.html`, nella riga `const ENDPOINT = "";`.

Gli iscritti compaiono nel foglio "Iscrizioni" (data, email, giorno preferito). Per l'Excel: **File → Scarica → Microsoft Excel (.xlsx)**. Se qualcuno si iscrive due volte con la stessa email, viene aggiornata la sua preferenza senza contare un doppio voto.
