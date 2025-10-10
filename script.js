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

function clearOut(){
    out.innerHTML = "";
}

$("#clearOut")?.addEventListener("click", clearOut);

function makeEditor(id, mode){
    const ed = ace.edit(id, {
        theme: "ace/theme/dracula",
        mode, tabsize: 2, useSoftTabs: true, showPrintMargine: false, wrap: true
    });

    ed.session.setUseWrapMode(true);

    ed.commands.addCommand({
        name: "run",
        bindKey: {
            win: 'Ctrl-Enter',
            mac: 'Command-Enter'
        },
        exec(){runWeb(false);}
    });

    ed.commands.addCommand({
        name: "save",
        bindKey: {
            win: 'Ctrl-S',
            mac: 'Command-S'
        },
        exec(){saveProject();}
    });

    return ed
}

const ed_html = makeEditor("ed_html", "ace/mode/html");
const ed_css = makeEditor("ed_css", "ace/mode/css");
const ed_js = makeEditor("ed_js", "ace/mode/javascript");

const TAB_ORDER = ["html", "css", "js"];

const wrap = Object.fromEntries($$("#webEditors .editor-wrap").map(w => [w.dataset.pane, w]));

const editors = {
    html: ed_html,
    css: ed_css,
    js: ed_js
};

function activePane(){
    const t = $("#webTabs .tab.active");
    return t ? t.dataset.pane : "html";
}

function showPane(name) {
    TAB_ORDER.forEach(k => {
        if (wraps[k]) {
            wraps[k].hidden = (k !== name);
        }})

        $$("#webTabs .tab").forEach(t => {
            const on = t.dataset.pane === name;
            t.classlist.toggle("active", on);
            t.setAttribute("aria-selected", on);
            t.tabIndex = on ? 0 : -1;
        });
}
