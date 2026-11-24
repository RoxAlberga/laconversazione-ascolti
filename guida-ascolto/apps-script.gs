/**
 * Iscrizioni alla guida all'ascolto live di Otello (Prima della Scala 2026).
 *
 * Va incollato in un Foglio Google: Estensioni → Apps Script.
 * Ogni iscrizione diventa una riga del foglio "Iscrizioni":
 *   Data iscrizione | Email | Giorno preferito
 * Il foglio si scarica in Excel da File → Scarica → Microsoft Excel (.xlsx).
 *
 * La pagina pubblica riceve solo i conteggi per giorno, mai gli indirizzi.
 */

const MAX_POSTI = 50;
const NOME_FOGLIO = 'Iscrizioni';
const GIORNI = {
  lun: 'Lunedì 30 novembre, ore 18',
  mar: 'Martedì 1 dicembre, ore 18',
  mer: 'Mercoledì 2 dicembre, ore 18',
};

function foglio_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NOME_FOGLIO);
  if (!sh) {
    sh = ss.insertSheet(NOME_FOGLIO);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Data iscrizione', 'Email', 'Giorno preferito']);
    sh.setFrozenRows(1);
    sh.getRange('A1:C1').setFontWeight('bold');
  }
  return sh;
}

function righe_(sh) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  return sh.getRange(2, 1, n, 3).getValues();
}

function conteggi_(righe) {
  const voti = { lun: 0, mar: 0, mer: 0 };
  const etichette = Object.fromEntries(Object.entries(GIORNI).map(([k, v]) => [v, k]));
  righe.forEach(r => {
    const k = etichette[r[2]];
    if (k) voti[k]++;
  });
  return { iscritti: righe.length, posti: MAX_POSTI, voti: voti };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET: solo i conteggi, per la barra della maggioranza e i posti rimasti.
function doGet() {
  return json_({ ok: true, ...conteggi_(righe_(foglio_())) });
}

// POST: nuova iscrizione (corpo JSON: {email, giorno}).
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    let dati = {};
    try { dati = JSON.parse(e.postData.contents); } catch (err) {}
    const email = String(dati.email || '').trim().toLowerCase();
    const giorno = String(dati.giorno || '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return json_({ ok: false, errore: 'email' });
    }
    if (!GIORNI[giorno]) {
      return json_({ ok: false, errore: 'giorno' });
    }

    const sh = foglio_();
    const righe = righe_(sh);
    const i = righe.findIndex(r => String(r[1]).trim().toLowerCase() === email);

    let esito;
    if (i >= 0) {
      // Già iscritto: aggiorno solo il giorno preferito.
      sh.getRange(i + 2, 3).setValue(GIORNI[giorno]);
      righe[i][2] = GIORNI[giorno];
      esito = 'aggiornato';
    } else if (righe.length >= MAX_POSTI) {
      return json_({ ok: false, errore: 'esaurito', ...conteggi_(righe) });
    } else {
      const riga = [new Date(), email, GIORNI[giorno]];
      sh.appendRow(riga);
      righe.push(riga);
      esito = 'iscritto';
    }
    return json_({ ok: true, esito: esito, ...conteggi_(righe) });
  } finally {
    lock.releaseLock();
  }
}
