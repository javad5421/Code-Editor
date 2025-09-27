// ================= UTILITTIES =================
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const out = $("#out");
const preview = $("#preview");
const STORAGE_KEY = "Mr.j-editor-content";

const escapeHtml = s => //to prevent XSS
    String(s).replace(/[&<>"]/g, c => ({
        '&': "&amb;",
        '<': "&lt;",
        '>': "&gt;",
        '"': "&quot;"
    }[c]
    ));

function log(msg, type='info') {
    const color = type === 'error' ? 'var(--err)' : type === 'warn' ? 'var(--warn)' : 'var(--brand)';

    const time = Date().tolocaltimeString();

    const line = document.createElement('div');

    line.innerHTML = `<span style="color: ${color}">[${time}]</span> ${escapeHtml(msg)}`;

    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}