// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Stop observing once animation has triggered
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Select all elements to animate
const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
animatedElements.forEach(el => observer.observe(el));

// Add slight delay for hero elements on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#beranda .fade-in-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);
});

/* ===== TRIAL SECTION LOGIC ===== */
let trialTime = 13 * 60 + 30; // 13:30 in minutes
let trialCoins = 5;
let cpuTime = 13 * 60 + 30;
let cpuCoins = 5;
const MAX_TIME = 18 * 60; // 18:00

const btnSpin = document.getElementById('btn-spin');
const timeDisplay = document.getElementById('trial-time');
const coinsDisplay = document.getElementById('trial-coins');
const cpuTimeDisplay = document.getElementById('cpu-time');
const cpuCoinsDisplay = document.getElementById('cpu-coins');
const trialLog = document.getElementById('trial-log');
const modalOverlay = document.getElementById('game-modal');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');

function formatTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function updateStats(coinChange = 0, timeChange = 0) {
    trialCoins += coinChange;
    trialTime += timeChange;
    if (trialTime > MAX_TIME) trialTime = MAX_TIME;

    coinsDisplay.textContent = trialCoins;
    timeDisplay.textContent = formatTime(trialTime);
    
    const progress = Math.min(((trialTime - 810) / 270) * 100, 100);
    const timelineChar = document.getElementById('timeline-character');
    if(timelineChar) {
        // Adjust the left position so it doesn't overflow completely on the right
        timelineChar.style.left = `calc(${progress}% - ${progress * 0.7}px)`;
    }

    if (trialTime >= MAX_TIME) {
        btnSpin.disabled = true;
        btnSpin.textContent = "Waktu Habis!";
        trialLog.innerHTML = `<strong>Permainan Selesai!</strong> Kamu berhasil mengumpulkan ${trialCoins} koin.<br><a href="https://linktr.ee/menanti.senja" target="_blank" style="color:#ff7e5f; font-weight:bold; text-decoration:underline;">Beli Versi Fisiknya Sekarang!</a>`;
        trialLog.className = 'trial-log';
    }
}

function updateCpuStats(coinChange = 0, timeChange = 0) {
    cpuCoins += coinChange;
    cpuTime += timeChange;
    if (cpuTime > MAX_TIME) cpuTime = MAX_TIME;
    
    if(cpuCoinsDisplay) cpuCoinsDisplay.textContent = cpuCoins;
    if(cpuTimeDisplay) cpuTimeDisplay.textContent = formatTime(cpuTime);
    
    const progress = Math.min(((cpuTime - 810) / 270) * 100, 100);
    const cpuChar = document.getElementById('timeline-cpu');
    if(cpuChar) {
        cpuChar.style.left = `calc(${progress}% - ${progress * 0.7}px)`;
    }
}

function doCpuTurn() {
    if (cpuTime >= MAX_TIME) return;
    setTimeout(() => {
        const steps = [10, 20, 30][Math.floor(Math.random() * 3)];
        updateCpuStats(0, steps);
        if (cpuTime < MAX_TIME) {
            const r = Math.random();
            if (r < 0.3) updateCpuStats(1, 0);
            else if (r < 0.6) updateCpuStats(-1, 0);
            else updateCpuStats(2, 0);
        }
    }, 1000);
}

function showModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

btnSpin.addEventListener('click', () => {
    if (trialTime >= MAX_TIME) return;

    // Spin RNG
    const steps = [10, 20, 30][Math.floor(Math.random() * 3)];
    updateStats(0, steps);

    if (trialTime >= MAX_TIME) return;

    // Random tile
    const tileType = Math.random();
    if (tileType < 0.3) {
        const events = [
            { text: "Wow, Ada Kupu-Kupu! (Kamu +2 Koin)", action: () => { updateStats(2, 0); } },
            { text: "Ada Pelangi! (Semua pemain maju 10 menit)", action: () => { updateStats(0, 10); updateCpuStats(0, 10); } },
            { text: "Yuk Beli Es Krim! (Semua pemain -2 Koin)", action: () => { updateStats(-2, 0); updateCpuStats(-2, 0); } },
            { text: "Berlindung! Ada Petir! (Tukar koin dengan CPU)", action: () => { 
                let temp = trialCoins; updateStats(cpuCoins - trialCoins, 0); updateCpuStats(temp - cpuCoins, 0); 
            } }
        ];
        const ev = events[Math.floor(Math.random()*events.length)];
        trialLog.className = 'trial-log log-event';
        trialLog.innerHTML = `<strong>Kotak Merah (Event)</strong><br>${ev.text}`;
        ev.action();
        doCpuTurn();
    } else if (tileType < 0.6) {
        const specials = [
            { text: "Sepeda (Kamu maju 10 menit, CPU +1 koin)", action: () => { updateStats(0, 10); updateCpuStats(1, 0); } },
            { text: "Sandal Jepit (CPU mundur 10 menit, Kamu +1 Koin)", action: () => { updateStats(1, 0); updateCpuStats(0, -10); } }
        ];
        const sp = specials[Math.floor(Math.random()*specials.length)];
        trialLog.className = 'trial-log log-special';
        trialLog.innerHTML = `<strong>Kotak Ungu (Special)</strong><br>${sp.text}`;
        sp.action();
        doCpuTurn();
    } else {
        trialLog.className = 'trial-log log-minigame';
        trialLog.innerHTML = `<strong>Kotak Hijau (Mini Game)</strong><br>Bersiaplah bermain...`;
        playRandomMinigame();
    }
});

/* ===== MINIGAMES ===== */
function playRandomMinigame() {
    const games = [playPetakUmpet, playCariJalan, playTembakKelereng, playGobakSodor, playTepukStik];
    const game = games[Math.floor(Math.random() * games.length)];
    game();
}

// 1. Petak Umpet Bola
function playPetakUmpet() {
    const cups = [
        '<div class="cup" onclick="selectCup(this, true)"><div class="ball"></div></div>',
        '<div class="cup" onclick="selectCup(this, false)"></div>',
        '<div class="cup" onclick="selectCup(this, false)"></div>'
    ];
    cups.sort(() => Math.random() - 0.5);

    const content = `
        <p>Tebak di gelas mana bola disembunyikan!</p>
        <div class="cups-container">${cups.join('')}</div>
    `;
    showModal('Petak Umpet Bola', content);

    window.selectCup = function (el, hasBall) {
        el.classList.add('lift');
        setTimeout(() => {
            if (hasBall) {
                alert("Benar! +1 Koin");
                updateStats(1, 0);
            } else {
                alert("Salah! Bola tidak ada di situ.");
            }
            closeModal();
            doCpuTurn();
        }, 1000);
    }
}

// 2. Cari Jalan Pulang
function playCariJalan() {
    const content = `
        <p>Pilih satu lubang target untuk kelerengmu.</p>
        <div style="display:flex; gap:1rem; justify-content:center; margin-top:2rem;">
            <button class="btn btn-primary" onclick="rollCariJalan()">Kiri</button>
            <button class="btn btn-primary" onclick="rollCariJalan()">Tengah</button>
            <button class="btn btn-primary" onclick="rollCariJalan()">Kanan</button>
        </div>
    `;
    showModal('Cari Jalan Pulang', content);

    window.rollCariJalan = function () {
        if (Math.random() > 0.5) {
            alert("Berhasil masuk target! +2 Koin");
            updateStats(2, 0);
        } else {
            alert("Gagal mencapai lubang! -1 Koin");
            updateStats(-1, 0);
        }
        closeModal();
        doCpuTurn();
    }
}

// 3. Tembak Kelereng (Slider)
function playTembakKelereng() {
    const content = `
        <p>Klik TEMBAK saat garis putih di area oranye!</p>
        <div class="slider-container">
            <div class="slider-target" style="left: 40%; width: 20%;"></div>
            <div id="slider-cursor" class="slider-cursor"></div>
        </div>
        <button class="btn btn-primary" onclick="stopKelereng()">TEMBAK!</button>
    `;
    showModal('Tembak Kelereng', content);

    let pos = 0;
    let dir = 1;
    const cursor = document.getElementById('slider-cursor');
    const interval = setInterval(() => {
        pos += dir * 2;
        if (pos > 95 || pos < 0) dir *= -1;
        if (cursor) cursor.style.left = pos + '%';
        else clearInterval(interval);
    }, 20);

    window.stopKelereng = function () {
        clearInterval(interval);
        if (pos >= 40 && pos <= 60) {
            alert("Tembakan jitu! +1 Koin");
            updateStats(1, 0);
        } else {
            alert("Meleset! -2 Koin");
            updateStats(-2, 0);
        }
        closeModal();
        doCpuTurn();
    }
}

// 4. Gobak Sodor (Battleship 5x2)
function playGobakSodor() {
    let cellsHTML = '';
    for (let i = 0; i < 10; i++) {
        cellsHTML += `<div class="gobak-cell" id="gc-${i}" onclick="selectGobak(${i})"></div>`;
    }
    const content = `
        <p>Pilih 5 petak aman untuk karaktermu!</p>
        <div class="gobak-grid">${cellsHTML}</div>
        <button id="btn-gobak" class="btn btn-primary" style="display:none;" onclick="resolveGobak()">Mulai Lari!</button>
    `;
    showModal('Gobak Sodor', content);

    let selected = [];
    window.selectGobak = function (id) {
        if (selected.length >= 5 && !selected.includes(id)) return;
        const idx = selected.indexOf(id);
        const cell = document.getElementById('gc-' + id);
        if (idx > -1) {
            selected.splice(idx, 1);
            cell.classList.remove('player-selected');
        } else {
            selected.push(id);
            cell.classList.add('player-selected');
        }
        document.getElementById('btn-gobak').style.display = selected.length === 5 ? 'inline-block' : 'none';
    }

    window.resolveGobak = function () {
        document.getElementById('btn-gobak').style.display = 'none';
        const cpuPicks = [];
        while (cpuPicks.length < 5) {
            let r = Math.floor(Math.random() * 10);
            if (!cpuPicks.includes(r)) cpuPicks.push(r);
        }

        let overlaps = 0;
        cpuPicks.forEach(cp => {
            const cell = document.getElementById('gc-' + cp);
            if (selected.includes(cp)) {
                overlaps++;
                cell.classList.add('overlap');
            } else {
                cell.classList.add('cpu-selected');
            }
        });

        const safe = 5 - overlaps;
        setTimeout(() => {
            if (safe >= 3) {
                alert(`Lolos! ${safe} karakter aman. +2 Koin`);
                updateStats(2, 0);
            } else {
                alert(`Tertangkap! Hanya ${safe} yang aman. -20 Menit`);
                updateStats(0, 20);
            }
            closeModal();
            doCpuTurn();
        }, 1500);
    }
}

// 5. Tepuk Stik (Turn-based Slider)
function playTepukStik() {
    const content = `
        <p id="stik-msg">Giliranmu! Hentikan garis di area oranye.</p>
        <div class="stik-battle">
            <div id="stik-player" class="stik player-stik"></div>
            <div id="stik-cpu" class="stik cpu-stik" style="background:#555;"></div>
        </div>
        <div class="slider-container">
            <div class="slider-target" style="left: 45%; width: 10%;"></div>
            <div id="stik-cursor" class="slider-cursor"></div>
        </div>
        <button id="btn-stik" class="btn btn-primary" onclick="stopStik()">TEPUK!</button>
    `;
    showModal('Tepuk Stik', content);

    let pos = 0;
    let dir = 1;
    let interval;

    function startSlider() {
        interval = setInterval(() => {
            pos += dir * 3;
            if (pos > 95 || pos < 0) dir *= -1;
            const cursor = document.getElementById('stik-cursor');
            if (cursor) cursor.style.left = pos + '%';
            else clearInterval(interval);
        }, 20);
    }
    startSlider();

    window.stopStik = function () {
        clearInterval(interval);
        const msg = document.getElementById('stik-msg');
        const btn = document.getElementById('btn-stik');
        const sPlayer = document.getElementById('stik-player');

        if (pos >= 45 && pos <= 55) {
            sPlayer.classList.add('flip-win');
            msg.innerHTML = "Berhasil menimpa stik lawan! +2 Koin";
            btn.style.display = 'none';
            setTimeout(() => {
                updateStats(2, 0);
                closeModal();
                doCpuTurn();
            }, 2000);
        } else {
            sPlayer.classList.add('flip-lose');
            msg.innerHTML = "Gagal! Sekarang giliran CPU...";
            btn.style.display = 'none';

            setTimeout(() => {
                sPlayer.classList.remove('flip-lose');
                const sCpu = document.getElementById('stik-cpu');
                if (Math.random() < 0.5) {
                    sCpu.classList.add('flip-win');
                    msg.innerHTML = "CPU berhasil menimpa stikmu! -2 Koin";
                    setTimeout(() => {
                        updateStats(-2, 0);
                        closeModal();
                        doCpuTurn();
                    }, 2000);
                } else {
                    msg.innerHTML = "CPU gagal! Giliranmu lagi.";
                    sCpu.classList.add('flip-lose');
                    setTimeout(() => {
                        sCpu.classList.remove('flip-lose');
                        btn.style.display = 'inline-block';
                        startSlider();
                    }, 1500);
                }
            }, 1500);
        }
    }
}
