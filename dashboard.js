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

let currentTarget = '';
let currentValue = '';

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

// Get realistic logs based on target and entered value
function getLogs(target, value) {
    const isPhone = /^[\d+\-\s()]{7,15}$/.test(value);
    const isEmail = /@/.test(value);
    const isUsername = !isPhone && !isEmail;

    return [
        { text: `[INIT] Module "${target}" loaded`, type: 'info' },
        { text: `[CONN] Connecting to secure proxy...`, type: '' },
        { text: `[CONN] Connected — Node: US-East-${r(1,5)}`, type: 'success' },
        { text: `[SCAN] Target: ${value}`, type: 'info' },
        { text: `[SCAN] Type: ${isPhone ? 'Phone Number' : isEmail ? 'Email' : 'Username'}`, type: '' },
        { text: `[SCAN] Resolving target...`, type: '' },
        { text: `[SCAN] IP: ${rand()}.${rand()}.${rand()}.${rand()}`, type: '' },
        { text: `[AUTH] Session token: ${token()}`, type: 'info' },
        { text: `[SCAN] Port scan — ${r(10,60)} open services`, type: '' },
        { text: `[VULN] Analyzing attack vectors...`, type: 'warning' },
        { text: `[VULN] ${r(2,10)} vulnerabilities found`, type: 'warning' },
        { text: `[EXP] Deploying exploit module...`, type: '' },
        { text: `[EXP] Bypass security layer 1/3...`, type: '' },
        { text: `[EXP] Bypass security layer 2/3...`, type: '' },
        { text: `[EXP] Bypass security layer 3/3 — OK`, type: 'success' },
        { text: `[DATA] Establishing encrypted channel...`, type: '' },
        { text: `[DATA] Intercepted — ${r(100,600)} MB data`, type: 'success' },
        { text: `[PROC] Processing data for "${value}"...`, type: '' },
        { text: `[PROC] Decrypting payload...`, type: '' },
        { text: `[DONE] ✓ Scan complete for ${value}`, type: 'success' },
        { text: `[DONE] Results ready for review`, type: 'success' },
    ];
}

// Card click handler
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't open modal if clicking input field
        if (e.target.classList.contains('card-field')) return;

        const field = this.querySelector('.card-field');
        const value = field ? field.value.trim() : '';

        // Validate input
        if (!value) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.15)';
            field.placeholder = '⚠ Please enter required info!';
            field.focus();

            // Shake animation
            field.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
                field.style.animation = '';
                if (field.dataset.target === 'Phone Hack') field.placeholder = 'Gmail ya Number Add';
                else if (field.dataset.target === 'Gallery Hack') field.placeholder = 'Mobile On Number Add';
                else if (field.dataset.target === 'Contact List') field.placeholder = 'SIM Active Number Add';
                else if (field.dataset.target === 'Live Location') field.placeholder = 'Number Add';
                else if (field.dataset.target === 'IMEI Tracking') field.placeholder = 'IMEI Number Add';
                else if (field.dataset.target === 'Fake Account Ban' || field.dataset.target === 'Fake Account Details') field.placeholder = 'Profile Link Add';
                else if (field.dataset.target === 'Family Tree') field.placeholder = 'CNIC or Name Add';
                else if (field.dataset.target === 'CNIC Copy') field.placeholder = 'CNIC Number Add';
                else if (field.closest('.card').querySelector('h3').textContent.includes('WhatsApp') || field.closest('.card').querySelector('h3').textContent.includes('SIM')) field.placeholder = 'Enter Number';
                else field.placeholder = 'Enter Username';
            }, 2000);
            return;
        }

        currentTarget = this.dataset.target;
        currentValue = value;
        modalTitle.textContent = `Searching ${currentTarget}...`;
        modalSubtitle.textContent = `Target: ${value}`;
        openModal();
    });
});

// Search Hack button
document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.card').click();
    });
});

// Enter key on input fields
document.querySelectorAll('.card-field').forEach(field => {
    field.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            field.closest('.card').click();
        }
    });
});

function openModal() {
    modal.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    scanLog.innerHTML = '';
    viewResultBtn.style.display = 'none';

    const logs = getLogs(currentTarget, currentValue);
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
    }, 500);

    const progInt = setInterval(() => {
        progress += Math.random() * 7 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progInt);
            clearInterval(logInt);
            progressFill.style.width = '100%';
            progressText.textContent = '100%';
            modalTitle.textContent = 'Scan Complete';
            modalSubtitle.textContent = `Found results for "${currentValue}"`;
            setTimeout(() => { viewResultBtn.style.display = 'inline-flex'; }, 400);
        } else {
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }
    }, 300);
}

// View Result → WhatsApp
viewResultBtn.addEventListener('click', () => {
    const msg = encodeURIComponent(`Hi, I need help with ${currentTarget}. I searched for "${currentValue}" and need the results. Please assist.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
});

// Close Modal
function closeModal() { modal.classList.remove('active'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });