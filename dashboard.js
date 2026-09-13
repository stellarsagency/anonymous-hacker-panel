// Auth Check
if (!sessionStorage.getItem('loggedIn')) {
    window.location.href = 'index.html';
}

const user = sessionStorage.getItem('user') || 'Operator';
document.getElementById('userName').textContent = user;
document.getElementById('navUser').textContent = user.toUpperCase();
document.getElementById('udName').textContent = user;

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
function doLogout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
document.getElementById('logoutBtn').addEventListener('click', doLogout);
document.getElementById('udLogout').addEventListener('click', (e) => { e.preventDefault(); doLogout(); });

// Mobile Menu
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
document.getElementById('menuToggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// User Dropdown
const userMenu = document.getElementById('userMenu');
const userDropdown = document.getElementById('userDropdown');
userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
    document.getElementById('notifDropdown').classList.remove('active');
});

// Notification Dropdown
const notifBtn = document.getElementById('notifBtn');
const notifDropdown = document.getElementById('notifDropdown');
notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('active');
    userDropdown.classList.remove('active');
});

// Clear notifications
document.getElementById('notifClear').addEventListener('click', () => {
    document.getElementById('notifList').innerHTML = '<div class="notif-item" style="text-align:center;padding:30px;color:var(--text-light);"><p>No notifications</p></div>';
    document.querySelector('.notif-dot').style.display = 'none';
});

// Close dropdowns on outside click
document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
    notifDropdown.classList.remove('active');
});

// Sidebar Menu Active
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Search Filter
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const sections = document.querySelectorAll('.section[data-section]');
    let totalVisible = 0;

    sections.forEach(section => {
        const cards = section.querySelectorAll('.card');
        let sectionVisible = 0;
        cards.forEach(card => {
            const name = card.dataset.target.toLowerCase();
            const h3 = card.querySelector('h3').textContent.toLowerCase();
            const match = !query || name.includes(query) || h3.includes(query);
            card.classList.toggle('hidden', !match);
            if (match) sectionVisible++;
        });
        section.classList.toggle('hidden', sectionVisible === 0);
        totalVisible += sectionVisible;
    });

    noResults.style.display = (query && totalVisible === 0) ? 'block' : 'none';
});

// Ctrl+K shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape') {
        searchInput.blur();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
});

// Terminal typing animation
const commands = [
    'panel --status',
    'proxy --check',
    'node --list',
    'scan --all',
    'auth --verify',
    'enc --test',
    'db --sync',
    'log --tail',
];
let cmdIdx = 0;
let charIdx = 0;
let deleting = false;
const terminalCmd = document.getElementById('terminalCmd');

function typeTerminal() {
    const cmd = commands[cmdIdx];
    if (!deleting) {
        terminalCmd.textContent = cmd.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === cmd.length) {
            setTimeout(() => { deleting = true; typeTerminal(); }, 2000);
            return;
        }
        setTimeout(typeTerminal, 60 + Math.random() * 40);
    } else {
        terminalCmd.textContent = cmd.substring(0, charIdx);
        charIdx--;
        if (charIdx < 0) {
            deleting = false;
            charIdx = 0;
            cmdIdx = (cmdIdx + 1) % commands.length;
            setTimeout(typeTerminal, 500);
            return;
        }
        setTimeout(typeTerminal, 30);
    }
}
typeTerminal();

// Stats counter animation
function animateStats() {
    const scanEl = document.getElementById('totalScans');
    const userEl = document.getElementById('activeUsers');
    let scans = 1200;
    let users = 892;

    setInterval(() => {
        scans += Math.floor(Math.random() * 3);
        scanEl.textContent = scans.toLocaleString();
    }, 5000);

    setInterval(() => {
        users += Math.random() > 0.5 ? 1 : -1;
        userEl.textContent = users.toLocaleString();
    }, 8000);
}
animateStats();

// Toast system
function showToast(type, title, msg) {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-xmark-circle', info: 'fa-info-circle', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon ${type}"><i class="fas ${icons[type]}"></i></div>
        <div class="toast-text">
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${msg}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-xmark"></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Add activity to feed
function addActivity(color, action, detail) {
    const feed = document.getElementById('activityFeed');
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.animation = 'logFade 0.3s ease';
    item.innerHTML = `
        <div class="activity-dot ${color}"></div>
        <div class="activity-info">
            <span class="activity-action">${action}</span>
            <span class="activity-detail">${detail}</span>
        </div>
        <span class="activity-time">Just now</span>
    `;
    feed.insertBefore(item, feed.firstChild);
    if (feed.children.length > 8) feed.lastChild.remove();
}

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

function getLogs(target, value) {
    const isPhone = /^[\d+\-\s()]{7,15}$/.test(value);
    const isEmail = /@/.test(value);

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

// Card click - focus input
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.classList.contains('card-btn')) return;
        const field = this.querySelector('.card-field');
        if (field) field.focus();
    });
});

// Unlock button → WhatsApp
document.querySelectorAll('.btn-locked').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.card');
        const moduleName = card.dataset.target;
        showToast('warning', 'Premium Module', `"${moduleName}" requires upgrade. Redirecting to WhatsApp...`);
        setTimeout(() => {
            const msg = encodeURIComponent(`Hi! I want to unlock "${moduleName}" module. Please send me the upgrade plan.`);
            window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
        }, 1000);
    });
});

// Search Hack button
document.querySelectorAll('.card-btn').forEach(btn => {
    if (btn.classList.contains('btn-locked')) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.card');
        const field = card.querySelector('.card-field');
        const value = field ? field.value.trim() : '';

        if (!value) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.15)';
            field.placeholder = '⚠ Please enter required info!';
            field.focus();
            field.style.animation = 'shake 0.4s ease';
            showToast('error', 'Input Required', 'Please enter a username or number first.');
            setTimeout(() => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
                field.style.animation = '';
                const target = card.dataset.target;
                if (target === 'Phone Hack') field.placeholder = 'Gmail ya Number Add';
                else if (target === 'Gallery Hack') field.placeholder = 'Mobile On Number Add';
                else if (target === 'Contact List') field.placeholder = 'SIM Active Number Add';
                else if (target === 'Live Location') field.placeholder = 'Number Add';
                else if (target === 'IMEI Tracking') field.placeholder = 'IMEI Number Add';
                else if (target === 'Fake Account Ban' || target === 'Fake Account Details') field.placeholder = 'Profile Link Add';
                else if (card.querySelector('h3').textContent.includes('WhatsApp') || card.querySelector('h3').textContent.includes('SIM')) field.placeholder = 'Enter Number';
                else field.placeholder = 'Enter Username';
            }, 2000);
            return;
        }

        currentTarget = card.dataset.target;
        currentValue = value;
        modalTitle.textContent = `Searching ${currentTarget}...`;
        modalSubtitle.textContent = `Target: ${value}`;
        openModal();

        // Toast + activity
        showToast('info', 'Scan Started', `Scanning ${currentTarget} for "${value}"`);
        addActivity('green', 'Scan started', `${currentTarget} — ${value}`);
    });
});

// Enter key on inputs
document.querySelectorAll('.card-field').forEach(field => {
    field.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            field.closest('.card').querySelector('.card-btn').click();
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
            showToast('success', 'Scan Complete', `Data extracted for "${currentValue}"`);
            addActivity('green', 'Scan completed', `${currentTarget} — ${currentValue}`);
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

// Welcome toast on load
setTimeout(() => {
    showToast('success', 'System Online', 'All modules loaded and ready.');
}, 1000);