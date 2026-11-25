/**
 * Iscrizioni alla guida all'ascolto live di Otello (Prima della Scala 2026).
 *
 * Va incollato in un Foglio Google: Estensioni → Apps Script.
 * Ogni iscrizione diventa una riga del foglio "Iscrizioni":
 *   Data iscrizione | Email | Giorno preferito | Stato | Newsletter | Consenso privacy
 * Stato è "Confermato" per i primi 50, poi "Lista d'attesa".
 * Il foglio si scarica in Excel da File → Scarica → Microsoft Excel (.xlsx).
 *
 * La pagina pubblica riceve solo i conteggi, mai gli indirizzi.
 */

const MAX_POSTI = 50;
const NOME_FOGLIO = 'Iscrizioni';
const GIORNI = {
  lun: 'Lunedì 30 novembre, ore 18',
  mar: 'Martedì 1 dicembre, ore 18',
  mer: 'Mercoledì 2 dicembre, ore 18',
};
const CONFERMATO = 'Confermato';
const ATTESA = "Lista d'attesa";
const COLONNE = ['Data iscrizione', 'Email', 'Giorno preferito', 'Stato', 'Newsletter', 'Consenso privacy'];

function foglio_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NOME_FOGLIO);
  if (!sh) sh = ss.insertSheet(NOME_FOGLIO);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLONNE);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLONNE.length).setFontWeight('bold');
  }
  // Scheda "Per Substack": solo le email di chi ha chiesto la newsletter, pronte da copiare.
  if (!ss.getSheetByName('Per Substack')) {
    const ns = ss.insertSheet('Per Substack');
    ns.getRange('A1').setValue('email').setFontWeight('bold');
    ns.getRange('A2').setFormula('=IFERROR(FILTER(' + NOME_FOGLIO + '!B2:B, ' + NOME_FOGLIO + '!E2:E="Sì"), "")');
  }
  return sh;
}

function righe_(sh) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  return sh.getRange(2, 1, n, COLONNE.length).getValues();
}

function conteggi_(righe) {
  const voti = { lun: 0, mar: 0, mer: 0 };
  const chiavi = {};
  Object.keys(GIORNI).forEach(k => { chiavi[GIORNI[k]] = k; });
  let confermati = 0, attesa = 0;
  righe.forEach(r => {
    const k = chiavi[r[2]];
    if (k) voti[k]++;
    if (r[3] === ATTESA) attesa++; else confermati++;
  });
  return { iscritti: confermati, attesa: attesa, posti: MAX_POSTI, voti: voti };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET: solo i conteggi (maggioranza, posti rimasti, lista d'attesa).
function doGet() {
  return json_(Object.assign({ ok: true }, conteggi_(righe_(foglio_()))));
}

// POST: iscrizione. Corpo JSON: {email, giorno, privacy: true, newsletter: true|false}
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    let dati = {};
    try { dati = JSON.parse(e.postData.contents); } catch (err) {}
    const email = String(dati.email || '').trim().toLowerCase();
    const giorno = String(dati.giorno || '');
    const newsletter = dati.newsletter === true ? 'Sì' : 'No';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return json_({ ok: false, errore: 'email' });
    }
    if (!GIORNI[giorno]) return json_({ ok: false, errore: 'giorno' });
    if (dati.privacy !== true) return json_({ ok: false, errore: 'privacy' });

    const sh = foglio_();
    const righe = righe_(sh);
    const ora = new Date();
    const i = righe.findIndex(r => String(r[1]).trim().toLowerCase() === email);

    let esito, stato;
    if (i >= 0) {
      // Già iscritto: aggiorno giorno e newsletter, lo stato resta quello di prima.
      stato = righe[i][3] || CONFERMATO;
      sh.getRange(i + 2, 3).setValue(GIORNI[giorno]);
      sh.getRange(i + 2, 5, 1, 2).setValues([[newsletter, ora]]);
      righe[i][2] = GIORNI[giorno];
      esito = 'aggiornato';
    } else {
      const confermati = righe.filter(r => r[3] !== ATTESA).length;
      stato = confermati < MAX_POSTI ? CONFERMATO : ATTESA;
      const riga = [ora, email, GIORNI[giorno], stato, newsletter, ora];
      sh.appendRow(riga);
      righe.push(riga);
      esito = 'iscritto';
    }
    return json_(Object.assign({ ok: true, esito: esito, attesaPersonale: stato === ATTESA }, conteggi_(righe)));
  } finally {
    lock.releaseLock();
  }
}
