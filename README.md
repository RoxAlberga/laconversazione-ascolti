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

La cartella [guida-ascolto/](guida-ascolto/) contiene il modulo di iscrizione alla diretta su Otello (30 novembre, 1 o 2 dicembre, ore 18), da pubblicare sul proprio sito:

- [snippet-da-incollare.html](guida-ascolto/snippet-da-incollare.html): il blocco da incollare in un elemento "HTML personalizzato" di una pagina esistente (WordPress, Wix, Squarespace…);
- [pagina-completa.html](guida-ascolto/pagina-completa.html): lo stesso modulo come pagina a sé, da caricare via FTP o dal pannello dell'hosting;
- [apps-script.gs](guida-ascolto/apps-script.gs): il codice che salva le iscrizioni in un Foglio Google.

Il modulo mostra la maggioranza in tempo reale, assegna i primi 50 posti e poi mette gli iscritti in lista d'attesa. Chiede il consenso privacy (obbligatorio) e l'iscrizione alla newsletter (facoltativa), e rimanda al gruppo Telegram. La pagina riceve solo i conteggi, mai gli indirizzi.

Attivazione (una volta sola, circa 5 minuti):

1. Crea un Foglio Google vuoto su [sheets.new](https://sheets.new).
2. Nel foglio: **Estensioni → Apps Script**. Cancella il contenuto, incolla tutto `apps-script.gs` e salva.
3. **Esegui il deployment → Nuovo deployment →** tipo **App web**. "Esegui come": *Me*; "Chi ha accesso": *Chiunque*. Autorizza quando richiesto.
4. Copia l'URL dell'app web (finisce con `/exec`) e incollalo nel blocco HTML, nella riga `var ENDPOINT = "";`.
5. Nel blocco HTML sostituisci `[EMAIL DI CONTATTO]` (informativa privacy) con l'indirizzo a cui ricevere le richieste sui dati.

Gli iscritti compaiono nel foglio "Iscrizioni": data, email, giorno preferito, stato (Confermato / Lista d'attesa), newsletter (Sì/No), data del consenso. Per l'Excel: **File → Scarica → Microsoft Excel (.xlsx)**. Chi si iscrive due volte con la stessa email aggiorna la propria scelta senza contare un doppio voto.
