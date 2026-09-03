// Auth Check
if (!sessionStorage.getItem('loggedIn')) {
    window.location.href = 'index.html';
}

const user = sessionStorage.getItem('user') || 'Operator';
document.getElementById('userName').textContent = user;
document.getElementById('navUser').textContent = user.toUpperCase();

// Session Timer
let sessionTime = 1800;
const timerEl = document.getElementById('sessionTimer');
setInterval(() => {
    if (sessionTime <= 0) return;
    sessionTime--;
    const m = Math.floor(sessionTime / 60).toString().padStart(2, '0');
    const s = (sessionTime % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}, 1000);

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
});

// Mobile Menu
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Modal
const modal = document.getElementById('scanModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scanLog = document.getElementById('scanLog');
const viewResultBtn = document.getElementById('viewResultBtn');

// CHANGE THIS TO CLIENT'S WHATSAPP NUMBER
const whatsappNumber = '923174130091';

function getLogs(target) {
    return [
        { text: `[INFO] Module "${target}" initialized`, type: 'info' },
        { text: `[CONN] Connecting to secure proxy...`, type: '' },
        { text: `[CONN] Connected — Node: US-East-1`, type: 'success' },
        { text: `[SCAN] Resolving target DNS...`, type: '' },
        { text: `[SCAN] IP: ${rand()}.${rand()}.${rand()}.${rand()}`, type: '' },
        { text: `[AUTH] Handshake authentication...`, type: '' },
        { text: `[AUTH] Token: ${token()}`, type: 'info' },
        { text: `[SCAN] Port scan — ${r(10,60)} open services`, type: '' },
        { text: `[VULN] Analyzing attack vectors...`, type: 'warning' },
        { text: `[VULN] ${r(2,10)} vulnerabilities found`, type: 'warning' },
        { text: `[EXP] Deploying exploit module...`, type: '' },
        { text: `[EXP] Bypass security 1/3...`, type: '' },
        { text: `[EXP] Bypass security 2/3...`, type: '' },
        { text: `[EXP] Bypass security 3/3 — OK`, type: 'success' },
        { text: `[DATA] Establishing encrypted channel...`, type: '' },
        { text: `[DATA] Intercepted — ${r(100,600)} MB data`, type: 'success' },
        { text: `[PROC] Processing extracted data...`, type: '' },
        { text: `[PROC] Decrypting payload...`, type: '' },
        { text: `[DONE] Operation completed`, type: 'success' },
        { text: `[DONE] Results ready for review`, type: 'success' },
    ];
}

function rand() { return Math.floor(Math.random()*255); }
function r(a,b) { return Math.floor(Math.random()*(b-a)+a); }
function token() {
    const c = 'abcdef0123456789';
    let t = '';
    for (let i = 0; i < 32; i++) {
        if (i > 0 && i % 8 === 0) t += '-';
        t += c[Math.floor(Math.random()*c.length)];
    }
    return t;
}

let currentTarget = '';

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        currentTarget = this.dataset.target;
        modalTitle.textContent = `Searching ${currentTarget}...`;
        modalSubtitle.textContent = 'Executing search — please wait';
        openModal();
    });
});

document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.card').click();
    });
});

function openModal() {
    modal.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    scanLog.innerHTML = '';
    viewResultBtn.style.display = 'none';

    const logs = getLogs(currentTarget);
    let idx = 0;
    let progress = 0;

    const logInt = setInterval(() => {
        if (idx < logs.length) {
            const el = document.createElement('div');
            el.className = `log-entry ${logs[idx].type}`;
            el.textContent = logs[idx].text;
            scanLog.appendChild(el);
            scanLog.scrollTop = scanLog.scrollHeight;
            idx++;
        }
    }, 550);

    const progInt = setInterval(() => {
        progress += Math.random() * 7 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progInt);
            clearInterval(logInt);
            progressFill.style.width = '100%';
            progressText.textContent = '100%';
            modalTitle.textContent = 'Operation Complete';
            modalSubtitle.textContent = `${currentTarget} — data successfully extracted`;
            setTimeout(() => { viewResultBtn.style.display = 'inline-flex'; }, 400);
        } else {
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }
    }, 300);
}

// View Result → WhatsApp
viewResultBtn.addEventListener('click', () => {
    const msg = encodeURIComponent(`Hi, I need assistance with ${currentTarget}. I have completed the scan and need the results.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
});

// Close Modal
function closeModal() { modal.classList.remove('active'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });