(function () {
    const bootTextEl = document.getElementById('retroBootText');
    const startBtn = document.getElementById('retroStartBtn');
    const bootScreen = document.getElementById('retroBoot');
    const deskScreen = document.getElementById('retroDesk');
    const deskModel = document.getElementById('retroDeskModel');
    const clickHint = document.querySelector('.retro-click-hint');
    const zoomFade = document.getElementById('retroZoomFade');
    const skipLink = document.getElementById('retroSkip');
    const titleBar = document.getElementById('retroTitleBar');
    const taskbar = document.getElementById('retroTaskbar');
    const clockEl = document.getElementById('retroClock');
    const body = document.body;

    const typingSound = document.getElementById('retroTypingSound');
    const officeSound = document.getElementById('retroOfficeSound');
    const clickSound = document.getElementById('retroClickSound');
    typingSound.volume = 0.5;
    officeSound.volume = 0.35;
    clickSound.volume = 0.5;

    const bootLines = [
        'MINA CHOI                Released: 08/2026',
        'Marketing Portfolio      MC BIOS (C)2026 Mina Creative Inc.,',
        '',
        'Performance & Growth Marketing — Showcase 2026',
        '',
        'Checking modem... OK',
        'Loading case studies... OK',
        '',
        'Click START to begin_'
    ];

    let revealed = false;

    // ---------- Boot typing ----------
    function typeBoot() {
        let lineIndex = 0, charIndex = 0;
        typingSound.currentTime = 0;
        typingSound.play().catch(() => {});

        function step() {
            if (lineIndex >= bootLines.length) {
                typingSound.pause();
                typingSound.currentTime = 0;
                startBtn.classList.add('show');
                return;
            }
            const line = bootLines[lineIndex];
            if (charIndex < line.length) {
                bootTextEl.textContent += line.charAt(charIndex);
                charIndex++;
                setTimeout(step, 12);
            } else {
                bootTextEl.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(step, 90);
            }
        }
        step();
    }

    // ---------- Boot -> Desk ----------
    startBtn.addEventListener('click', () => {
        bootScreen.classList.remove('is-active');
        deskScreen.classList.add('is-active');
        officeSound.play().catch(() => {});
        setTimeout(() => clickHint.style.opacity = 1, 300);
    });

    // ---------- Desk -> Zoom into monitor -> Reveal site ----------
    deskScreen.addEventListener('click', () => {
        if (revealed) return;

        // Zoom the camera in toward the monitor
        deskModel.cameraOrbit = '2deg 78deg 0.7m';
        deskModel.fieldOfView = '18deg';
        officeSound.pause();

        setTimeout(() => {
            zoomFade.classList.add('show');
        }, 700);

        setTimeout(revealSite, 1500);
    });

    function revealSite() {
        if (revealed) return;
        revealed = true;

        typingSound.pause();
        officeSound.pause();

        document.getElementById('retroIntro').style.display = 'none';
        skipLink.style.display = 'none';
        body.classList.remove('retro-hidden-body');
        body.classList.add('retro-framed');
        titleBar.classList.add('show');
        taskbar.classList.add('show');

        startClock();
        bindClickSound();

        setTimeout(() => zoomFade.classList.remove('show'), 50);
        setTimeout(() => { zoomFade.style.display = 'none'; }, 1000);
    }

    // ---------- Skip ----------
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        revealSite();
    });

    // ---------- Live taskbar clock ----------
    function startClock() {
        function tick() {
            const now = new Date();
            let h = now.getHours();
            const m = now.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            clockEl.textContent = `${h}:${m} ${ampm}`;
        }
        tick();
        setInterval(tick, 1000 * 15);
    }

    // ---------- Click sound across the revealed site ----------
    function bindClickSound() {
        document.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        });
    }

    typeBoot();
})();
