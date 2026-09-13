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
const commands = ['panel --status','proxy --check','node --list','scan --all','auth --verify','enc --test','db --sync','log --tail'];
let cmdIdx = 0, charIdx = 0, deleting = false;
const terminalCmd = document.getElementById('terminalCmd');
function typeTerminal() {
    const cmd = commands[cmdIdx];
    if (!deleting) {
        terminalCmd.textContent = cmd.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === cmd.length) { setTimeout(() => { deleting = true; typeTerminal(); }, 2000); return; }
        setTimeout(typeTerminal, 60 + Math.random() * 40);
    } else {
        terminalCmd.textContent = cmd.substring(0, charIdx);
        charIdx--;
        if (charIdx < 0) { deleting = false; charIdx = 0; cmdIdx = (cmdIdx + 1) % commands.length; setTimeout(typeTerminal, 500); return; }
        setTimeout(typeTerminal, 30);
    }
}
typeTerminal();

// Stats counter animation
let scans = 1200, users = 892;
setInterval(() => { scans += Math.floor(Math.random() * 3); document.getElementById('totalScans').textContent = scans.toLocaleString(); }, 5000);
setInterval(() => { users += Math.random() > 0.5 ? 1 : -1; document.getElementById('activeUsers').textContent = users.toLocaleString(); }, 8000);

// Toast system
function showToast(type, title, msg) {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-xmark-circle', info: 'fa-info-circle', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon ${type}"><i class="fas ${icons[type]}"></i></div><div class="toast-text"><span class="toast-title">${title}</span><span class="toast-msg">${msg}</span></div><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-xmark"></i></button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Add activity to feed
function addActivity(color, action, detail) {
    const feed = document.getElementById('activityFeed');
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.animation = 'logFade 0.3s ease';
    item.innerHTML = `<div class="activity-dot ${color}"></div><div class="activity-info"><span class="activity-action">${action}</span><span class="activity-detail">${detail}</span></div><span class="activity-time">Just now</span>`;
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

const whatsappNumber = '923174130091';
let currentTarget = '';
let currentValue = '';

// Helpers
function rand() { return Math.floor(Math.random()*255); }
function r(a,b) { return Math.floor(Math.random()*(b-a)+a); }
function hex(len) { const c='0123456789abcdef'; let t=''; for(let i=0;i<len;i++) t+=c[Math.floor(Math.random()*c.length)]; return t; }
function token() { let t=''; const c='abcdef0123456789'; for(let i=0;i<32;i++){if(i>0&&i%8===0) t+='-'; t+=c[Math.floor(Math.random()*c.length)];} return t; }
function mac() { return Array.from({length:6},()=>hex(2)).join(':'); }

// Realistic scan logs
function getLogs(target, value) {
    const isPhone = /^[\d+\-\s()]{7,15}$/.test(value);
    const ip = `${rand()}.${rand()}.${rand()}.${rand()}`;
    const port1 = r(80,65535);
    const socialMedia = ['Facebook','Instagram','Snapchat','TikTok'];
    const phoneAccess = ['Phone Hack','Gallery Hack','Contact List','Live Location'];
    const numberSearch = ['WhatsApp','WhatsApp Ban','WhatsApp Unban','UK WhatsApp OTP','SIM Database'];
    const advanced = ['IMEI Tracking','Fake Account Ban','Fake Account Details','Family Tree','CNIC Copy'];

    let L = [];
    const hr = (t='') => L.push({text:t, type:''});
    const hi = (t) => L.push({text:t, type:'info'});
    const hs = (t) => L.push({text:t, type:'success'});
    const hw = (t) => L.push({text:t, type:'warning'});
    const sep = (t) => { L.push({text:`═══════════════════════════════════════════════`, type:t||''}); };

    // PHASE 1
    sep('info'); hi(`  PHASE 1: INITIALIZATION`); sep('info');
    hr(`[INIT] Loading module "${target}"...`);
    hs(`[INIT] Module loaded — v${r(2,5)}.${r(0,9)}.${r(0,9)}`);
    hi(`[INIT] Target: ${value}`);
    hr(`[INIT] Type: ${isPhone ? 'Phone Number' : /@/.test(value) ? 'Email' : 'Username'}`);
    hr(`[INIT] Session: ${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}`);
    hr(`[INIT] Operator: ${user} | Level 5`);
    hr(`[INIT] Time: ${new Date().toISOString()}`);
    hr();

    // PHASE 2
    sep(); hr(`  PHASE 2: SECURE CONNECTION`); sep();
    hr(`[CONN] Initializing secure tunnel...`);
    hr(`[CONN] Proxy: proxy-${r(1,20)}.anonnetwork.io:${port1}`);
    hs(`[CONN] TLS 1.3 handshake... OK`);
    hs(`[CONN] Connected — Node: US-East-${r(1,5)}`);
    hr(`[CONN] Latency: ${r(12,85)}ms | Jitter: ${r(1,12)}ms`);
    hr(`[CONN] Routing through ${r(2,6)} TOR nodes...`);
    hr(`[CONN] Exit: ${ip}`);
    hs(`[CONN] VPN — AES-256-GCM`);
    hr(`[CONN] MAC: ${mac()}`);
    hr();

    // PHASE 3
    sep('warning'); hw(`  PHASE 3: TARGET SCANNING`); sep('warning');
    if (socialMedia.includes(target)) {
        hr(`[SCAN] Querying ${target} API...`);
        hr(`[SCAN] Resolving: ${value}`);
        hr(`[SCAN] DNS: ${value.toLowerCase().replace(/\s/g,'')}.${target.toLowerCase()}.com`);
        hr(`[SCAN] IP: ${ip}`);
        hr(`[SCAN] Server: ${target.toLowerCase()}-ws-${r(1,30)}.net`);
        hr(`[SCAN] Ports — ${r(8,25)} open`);
        hr(`[SCAN]   ├─ 443 (HTTPS) — Open`);
        hr(`[SCAN]   ├─ 8443 (API) — Open`);
        hr(`[SCAN]   └─ 8080 (GraphQL) — Open`);
        hr(`[SCAN] Fingerprint: ${target.toLowerCase()}-server/${r(1,3)}.${r(0,9)}`);
        hr(`[SCAN] Rate limit: ${r(100,500)}req/min`);
        hr(`[SCAN] 2FA: ${r(0,4)===0?'Enabled':'Disabled'}`);
        hs(`[SCAN] Profile — ${r(10,500)} posts, ${r(100,99999)} followers`);
    } else if (numberSearch.includes(target)) {
        hr(`[SCAN] Carrier database query...`);
        hr(`[SCAN] Number validated — E.164`);
        hr(`[SCAN] HLR query sent...`);
        hr(`[SCAN] MCC/MNC: ${r(200,999)}/${r(10,99)}`);
        hr(`[SCAN] Carrier: ${['Jazz','Telenor','Zong','Ufone'][r(0,4)]} Pakistan`);
        hr(`[SCAN] IMSI: ${r(400,499)}${hex(10)}`);
        hr(`[SCAN] IMEI: ${r(10,59)}/${r(10,59)}:${r(100,999)}`);
        hr(`[SCAN] Ports — ${r(5,18)} open`);
        hs(`[SCAN] Status: Active`);
    } else if (phoneAccess.includes(target)) {
        hr(`[SCAN] Device fingerprint...`);
        hr(`[SCAN] IP: ${ip}`);
        hr(`[SCAN] Model: ${['Samsung Galaxy S24','iPhone 15 Pro','Pixel 8','OnePlus 12'][r(0,4)]}`);
        hr(`[SCAN] OS: Android ${r(12,15)}.${r(0,9)}`);
        hr(`[SCAN] Battery: ${r(5,98)}% | WiFi: ${r(0,2)===0?'On':'Off'}`);
        hr(`[SCAN] Last active: ${r(1,59)} min ago`);
        hr(`[SCAN] Root: ${r(0,3)===0?'Detected':'No'}`);
        hs(`[SCAN] Device acquired`);
    } else if (advanced.includes(target)) {
        hr(`[SCAN] Intelligence DB query...`);
        hr(`[SCAN] Cross-ref ${r(3,12)} sources...`);
        hr(`[SCAN] DB: db-master-${r(1,10)}.anondb.io:${r(3000,9999)}`);
        hr(`[SCAN] Query: SELECT * FROM records WHERE id='${hex(8)}'`);
        hr(`[SCAN] Matches: ${r(1,20)} records`);
        hr(`[SCAN] Confidence: ${r(85,99)}.${r(0,9)}%`);
        hs(`[SCAN] Intelligence compiled`);
    } else {
        hr(`[SCAN] Resolving: ${value}`);
        hr(`[SCAN] IP: ${ip}`);
        hr(`[SCAN] Ports — ${r(10,60)} open`);
        hs(`[SCAN] Resolved`);
    }
    hr();

    // PHASE 4
    sep('warning'); hw(`  PHASE 4: VULNERABILITY ANALYSIS`); sep('warning');
    hr(`[VULN] Scanner — ${r(50,200)} vectors`);
    hr(`[VULN] CVE: ${r(180000,210000)} entries`);
    hr(`[VULN] SQL injection... ${r(0,2)===0?'Vulnerable':'Protected'}`);
    hr(`[VULN] XSS... ${r(0,2)===0?'Vulnerable':'Protected'}`);
    hr(`[VULN] CSRF... ${r(0,3)===0?'Weak':'Strong'}`);
    hr(`[VULN] Rate limits... ${r(0,2)===0?'Bypassable':'Active'}`);
    hr(`[VULN] Sessions... ${r(0,2)===0?'Predictable':'Randomized'}`);
    hw(`[VULN] ${r(3,12)} vulns — ${r(1,4)} critical`);
    hr(`[VULN] Surface: ${r(60,95)}/100`);
    hr();

    // PHASE 5
    sep(); hr(`  PHASE 5: EXPLOITATION`); sep();
    hr(`[EXP] Loading exploits...`);
    hr(`[EXP] Payload: ${hex(16)}`);
    hr(`[EXP] Encoding (polymorphic)...`);
    hr(`[EXP] 1/5 — WAF bypass...`);
    hr(`[EXP]   ├─ CloudFlare: ${r(0,2)===0?'Bypassed':'N/A'}`);
    hr(`[EXP]   └─ Akamai: ${r(0,2)===0?'Bypassed':'N/A'}`);
    hr(`[EXP] 2/5 — Token forge: ${token()}`);
    hr(`[EXP] 3/5 — Session hijack: ${hex(32)}`);
    hr(`[EXP] 4/5 — Privesc → ${r(0,2)===0?'Admin':'Root'}`);
    hs(`[EXP] 5/5 — Delivery OK`);
    hs(`[EXP] Exploitation successful`);
    hr();

    // PHASE 6
    sep('success'); hw(`  PHASE 6: DATA EXTRACTION`); sep('success');
    hr(`[DATA] Encrypted channel established`);
    hr(`[DATA] Channel: ${hex(8)}-tunnel-${r(1,50)}`);
    hr(`[DATA] Encryption: AES-256-CBC`);
    hr(`[DATA] Extracting...`);

    let ds = [];
    if (socialMedia.includes(target)) ds=['Messages: 2.4 MB','Photos: 48.7 MB','Videos: 156.2 MB','Profile: 128 KB','Stories: 8.1 MB'];
    else if (numberSearch.includes(target)) ds=['Calls: 1.2 MB','Messages: 3.8 MB','Contacts: 256 KB','Media: 12.4 MB'];
    else if (phoneAccess.includes(target)) ds=['Photos: 234.1 MB','Videos: 1.8 GB','Messages: 5.6 MB','Contacts: 512 KB','Location: 1.1 MB'];
    else ds=['Records: 4.2 MB','Docs: 12.8 MB','Media: 34.1 MB','Meta: 890 KB'];
    ds.forEach(d => hr(`[DATA]   ├─ ${d}`));

    const totalMB = r(50,900);
    hs(`[DATA] Total: ${totalMB}.${r(0,9)} MB`);
    hr(`[DATA] Speed: ${r(10,150)} MB/s`);
    hs(`[DATA] SHA-256 verified`);
    hr();

    // PHASE 7
    sep(); hr(`  PHASE 7: PROCESSING`); sep();
    hr(`[PROC] Decrypting payload...`);
    hr(`[PROC] Key: ${token()}`);
    hr(`[PROC] Processing ${r(10,200)} files...`);
    hr(`[PROC] Categorizing...`);
    hr(`[PROC] Generating report...`);
    hr(`[PROC] Hash: sha256:${hex(64)}`);
    hr(`[PROC] Report: RPT-${hex(8).toUpperCase()}`);
    hr();

    // PHASE 8
    sep('success'); hs(`  ✅ OPERATION COMPLETE`); sep('success');
    hs(`[DONE] ✓ Complete for "${value}"`);
    hs(`[DONE] Target: ${target}`);
    hs(`[DONE] Data: ${totalMB}.${r(0,9)} MB`);
    hs(`[DONE] Duration: ${r(8,25)}.${r(0,9)}s`);
    hr(`[DONE] Click "View Result" to download`);

    return L;
}

// Card click - focus input
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.classList.contains('card-btn')) return;
        const field = this.querySelector('.card-field');
        if (field) field.focus();
    });
});

// Unlock button
document.querySelectorAll('.btn-locked').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.card');
        const moduleName = card.dataset.target;
        showToast('warning', 'Premium Module', `"${moduleName}" requires upgrade.`);
        setTimeout(() => {
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want to unlock "${moduleName}". Send me the upgrade plan.`)}`, '_blank');
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
            showToast('error', 'Input Required', 'Enter a username or number first.');
            setTimeout(() => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
                field.style.animation = '';
                const t = card.dataset.target;
                if (t==='Phone Hack') field.placeholder='Gmail ya Number Add';
                else if (t==='Gallery Hack') field.placeholder='Mobile On Number Add';
                else if (t==='Contact List') field.placeholder='SIM Active Number Add';
                else if (t==='Live Location') field.placeholder='Number Add';
                else if (t==='IMEI Tracking') field.placeholder='IMEI Number Add';
                else if (t==='Fake Account Ban'||t==='Fake Account Details') field.placeholder='Profile Link Add';
                else if (card.querySelector('h3').textContent.includes('WhatsApp')||card.querySelector('h3').textContent.includes('SIM')) field.placeholder='Enter Number';
                else field.placeholder='Enter Username';
            }, 2000);
            return;
        }

        currentTarget = card.dataset.target;
        currentValue = value;
        modalTitle.textContent = `Searching ${currentTarget}...`;
        modalSubtitle.textContent = `Target: ${value}`;
        openModal();
        showToast('info', 'Scan Started', `Scanning ${currentTarget} for "${value}"`);
        addActivity('green', 'Scan started', `${currentTarget} — ${value}`);
    });
});

// Enter key
document.querySelectorAll('.card-field').forEach(field => {
    field.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); field.closest('.card').querySelector('.card-btn').click(); }
    });
});

function openModal() {
    modal.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    scanLog.innerHTML = '';
    viewResultBtn.style.display = 'none';

    const logs = getLogs(currentTarget, currentValue);
    let idx = 0, progress = 0;

    const logInt = setInterval(() => {
        if (idx < logs.length) {
            const el = document.createElement('div');
            el.className = `log-entry ${logs[idx].type}`;
            el.textContent = logs[idx].text;
            scanLog.appendChild(el);
            scanLog.scrollTop = scanLog.scrollHeight;
            idx++;
            const p = logs[idx-1]?.text || '';
            if (p.includes('PHASE 1')) modalSubtitle.textContent='Initializing modules...';
            else if (p.includes('PHASE 2')) modalSubtitle.textContent='Establishing secure connection...';
            else if (p.includes('PHASE 3')) modalSubtitle.textContent='Scanning target...';
            else if (p.includes('PHASE 4')) modalSubtitle.textContent='Analyzing vulnerabilities...';
            else if (p.includes('PHASE 5')) modalSubtitle.textContent='Deploying exploits...';
            else if (p.includes('PHASE 6')) modalSubtitle.textContent='Extracting data...';
            else if (p.includes('PHASE 7')) modalSubtitle.textContent='Processing results...';
            else if (p.includes('OPERATION COMPLETE')) modalSubtitle.textContent='All phases completed';
        }
    }, 350);

    const progInt = setInterval(() => {
        progress += Math.random() * 3 + 0.5;
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
    }, 400);
}

// View Result → WhatsApp
viewResultBtn.addEventListener('click', () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I need help with ${currentTarget}. I searched for "${currentValue}" and need the results.`)}`, '_blank');
});

// Close Modal
function closeModal() { modal.classList.remove('active'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// Welcome toast
setTimeout(() => { showToast('success', 'System Online', 'All modules loaded and ready.'); }, 1000);