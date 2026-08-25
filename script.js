/* =========================================
   ELEMENTS
========================================= */

const yesButton =
    document.getElementById("yesButton");

const noButton =
    document.getElementById("noButton");

const introCaption =
    document.getElementById("introCaption");

const readyButton =
    document.getElementById("readyButton");

const intro =
    document.getElementById("intro");

const journey =
    document.getElementById("journey");

const finalScreen =
    document.getElementById("finalScreen");

const canvas =
    document.getElementById("confettiCanvas");

const ctx =
    canvas.getContext("2d");

const starCanvas =
    document.getElementById("starCanvas");

const starCtx =
    starCanvas.getContext("2d");

const bgMusic =
    document.getElementById("bgMusic");

const muteButton =
    document.getElementById("muteButton");

const balloonButtons =
    document.querySelectorAll(".balloon-btn");

const balloonCompleteMsg =
    document.getElementById("balloonCompleteMsg");

const candleReadyButton =
    document.getElementById("candleReadyButton");

const candleFallbackButton =
    document.getElementById("candleFallbackButton");

const candleCountdown =
    document.getElementById("candleCountdown");

const candleInstructions =
    document.getElementById("candleInstructions");

const candleSuccessMsg =
    document.getElementById("candleSuccessMsg");

const flame =
    document.getElementById("flame");

const meterEmoji =
    document.getElementById("meterEmoji");

const meterLabel =
    document.getElementById("meterLabel");

const meterFill =
    document.getElementById("meterFill");

const meterSlider =
    document.getElementById("meterSlider");

const meterCaption =
    document.getElementById("meterCaption");

const meterWrap =
    document.querySelector(".meter-wrap");

let stars = [];

const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* =========================================
   CONFETTI SETTINGS
========================================= */

let confetti = [];

let animationRunning = false;


/* =========================================
   RESIZE CANVAS
========================================= */

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    starCanvas.width =
        window.innerWidth;

    starCanvas.height =
        document.documentElement.scrollHeight;

    createStars();
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   AMBIENT STARFIELD

   A quiet layer of twinkling stars that runs
   the full scrollable height of the page, tying
   the whole journey together visually. Kept
   subtle on purpose — this isn't meant to be
   the star of the show (the photos and the
   message are), just atmosphere.
========================================= */

function createStars() {

    stars = [];

    const area =
        starCanvas.width * starCanvas.height;

    const amount =
        Math.min(
            220,
            Math.floor(area / 9000)
        );

    for (let i = 0; i < amount; i++) {

        stars.push({

            x: Math.random() * starCanvas.width,

            y: Math.random() * starCanvas.height,

            size: 0.6 + Math.random() * 1.6,

            baseOpacity: 0.25 + Math.random() * 0.55,

            twinkleSpeed: 0.005 + Math.random() * 0.015,

            twinklePhase: Math.random() * Math.PI * 2

        });

    }

}

function drawStars(time) {

    starCtx.clearRect(
        0,
        0,
        starCanvas.width,
        starCanvas.height
    );

    stars.forEach(star => {

        const twinkle =
            reduceMotion
                ? 0
                : Math.sin(
                    time * star.twinkleSpeed +
                    star.twinklePhase
                ) * 0.35;

        starCtx.globalAlpha =
            Math.max(
                0,
                Math.min(
                    1,
                    star.baseOpacity + twinkle
                )
            );

        starCtx.fillStyle = "#f5f0ff";

        starCtx.beginPath();

        starCtx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        starCtx.fill();

    });

    starCtx.globalAlpha = 1;

    if (!reduceMotion) {

        requestAnimationFrame(drawStars);

    }

}

createStars();

requestAnimationFrame(drawStars);


/* =========================================
   SCROLL REVEAL

   Each section fades and rises into place as
   it enters the viewport, giving the journey a
   gentle sense of momentum as she scrolls.
========================================= */

const revealTargets =
    document.querySelectorAll(
        ".section, .photo-section, .transition-section, .almost-end, .rotate-section"
    );

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "in-view"
                    );

                }

            });

        },
        { threshold: 0.2 }
    );

revealTargets.forEach(target => {

    revealObserver.observe(target);

});


/* =========================================
   CREATE CONFETTI
========================================= */

function createConfetti() {

    confetti = [];

    const amount = 180;

    for (let i = 0; i < amount; i++) {

        const fromLeft =
            i < amount / 2;

        confetti.push({

            x: fromLeft
                ? -20
                : canvas.width + 20,

            y:
                canvas.height *
                (0.25 + Math.random() * 0.5),

            size:
                5 + Math.random() * 8,

            speedX:
                fromLeft
                    ? 5 + Math.random() * 9
                    : -5 - Math.random() * 9,

            speedY:
                -6 + Math.random() * 12,

            gravity:
                0.12 + Math.random() * 0.08,

            rotation:
                Math.random() * Math.PI,

            rotationSpeed:
                -0.15 + Math.random() * 0.3,

            life:
                100 + Math.random() * 80,

            opacity: 1

        });
    }

    animationRunning = true;

    animateConfetti();
}


/* =========================================
   DRAW CONFETTI
========================================= */

function animateConfetti() {

    if (!animationRunning) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    let alive = false;


    confetti.forEach(piece => {

        if (piece.life <= 0) {
            return;
        }

        alive = true;


        piece.x += piece.speedX;

        piece.y += piece.speedY;

        piece.speedY += piece.gravity;

        piece.rotation +=
            piece.rotationSpeed;

        piece.life -= 1;

        piece.opacity =
            Math.max(
                0,
                piece.life / 100
            );


        ctx.save();


        ctx.translate(
            piece.x,
            piece.y
        );

        ctx.rotate(
            piece.rotation
        );


        ctx.globalAlpha =
            piece.opacity;


        ctx.fillStyle =
            `hsl(${Math.random() * 360}, 90%, 65%)`;


        ctx.fillRect(
            -piece.size / 2,
            -piece.size / 2,
            piece.size,
            piece.size * 1.7
        );


        ctx.restore();

    });


    if (alive) {

        requestAnimationFrame(
            animateConfetti
        );

    } else {

        animationRunning = false;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}


/* =========================================
   BACKGROUND MUSIC

   Browsers block audio with sound from
   autoplaying until the user has interacted
   with the page, so we start it right on the
   Start button click (that counts as a valid
   user interaction) and fade the volume in
   gently instead of starting at full blast.
========================================= */

let musicMuted = false;

function startMusic() {

    bgMusic.volume = 0;

    const playPromise =
        bgMusic.play();

    /*
        play() can reject if the file is
        missing or the browser still blocks it.
        We just fail quietly instead of
        breaking the rest of the journey.
    */

    if (playPromise) {

        playPromise
            .then(() => {

                muteButton.classList.remove(
                    "hidden"
                );

                fadeMusicIn();

            })
            .catch(() => {

                // Autoplay blocked or file
                // missing — that's fine, the
                // journey still works without it.

            });

    }

}

function fadeMusicIn() {

    const targetVolume = 0.35;

    const step = 0.02;

    const fadeInterval =
        setInterval(() => {

            if (bgMusic.volume < targetVolume - step) {

                bgMusic.volume += step;

            } else {

                bgMusic.volume = targetVolume;

                clearInterval(fadeInterval);

            }

        }, 100);

}

muteButton.addEventListener(
    "click",
    () => {

        musicMuted = !musicMuted;

        bgMusic.muted = musicMuted;

        muteButton.textContent =
            musicMuted ? "🔇" : "🔊";

    }
);


/* =========================================
   YES / NO GAME

   "No" dodges away every time she tries to
   get near it — on desktop it jumps on
   hover, on touch devices it jumps right
   after being tapped. The caption teases her
   a little more with each attempt. "Yes"
   grows slightly each time too, just to be
   extra encouraging about the right choice.
========================================= */

const noCaptions = [
    "Do you want to open your surprise?",
    "Are you sure?",
    "Really really sure?",
    "Hmm, come on...",
    "You know you want to 👀",
    "Okay last chance!",
    "Fine, I'll just wait here forever 🥲"
];

let noAttempts = 0;

function moveNoButton() {

    if (!noButton.classList.contains("roaming")) {

        const rect =
            noButton.getBoundingClientRect();

        noButton.style.left =
            rect.left + "px";

        noButton.style.top =
            rect.top + "px";

        noButton.classList.add("roaming");
    }

    const buttonWidth =
        noButton.offsetWidth;

    const buttonHeight =
        noButton.offsetHeight;

    const margin = 24;

    const maxLeft =
        window.innerWidth - buttonWidth - margin;

    const maxTop =
        window.innerHeight - buttonHeight - margin;

    const randomLeft =
        margin + Math.random() * Math.max(0, maxLeft - margin);

    const randomTop =
        margin + Math.random() * Math.max(0, maxTop - margin);

    noButton.style.left =
        randomLeft + "px";

    noButton.style.top =
        randomTop + "px";

}

function teaseNo() {

    noAttempts += 1;

    moveNoButton();

    noButton.classList.remove("dodging");

    // Force reflow so the animation can replay
    void noButton.offsetWidth;

    noButton.classList.add("dodging");

    const captionIndex =
        Math.min(
            noAttempts,
            noCaptions.length - 1
        );

    introCaption.style.opacity = "0";

    setTimeout(() => {

        introCaption.textContent =
            noCaptions[captionIndex];

        introCaption.style.opacity = "1";

    }, 200);

    const growth =
        Math.min(noAttempts, 5);

    yesButton.style.fontSize =
        (15 + growth * 1.6) + "px";

    yesButton.style.padding =
        (17 + growth * 1.6) + "px " + (32 + growth * 3) + "px";

}

noButton.addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        teaseNo();

    }
);

noButton.addEventListener(
    "mouseenter",
    () => {

        // Only dodge on real hover-capable
        // devices, so touch taps above still
        // register as a click first.

        if (window.matchMedia("(hover: hover)").matches) {

            teaseNo();

        }

    }
);


/* =========================================
   TAP-FUN BURSTS

   A tiny, silly reward for tapping certain
   decorative elements around the site.
========================================= */

const burstEmojis = ["✦", "❤", "✧", "💫", "🌸"];

function spawnBurst(x, y) {

    const count = 6;

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className = "burst-particle";

        particle.textContent =
            burstEmojis[
                Math.floor(Math.random() * burstEmojis.length)
            ];

        const angle =
            (Math.PI * 2 * i) / count +
            Math.random() * 0.5;

        const distance =
            40 + Math.random() * 30;

        particle.style.left = x + "px";
        particle.style.top = y + "px";

        particle.style.setProperty(
            "--burst-x",
            Math.cos(angle) * distance + "px"
        );

        particle.style.setProperty(
            "--burst-y",
            Math.sin(angle) * distance + "px"
        );

        document.body.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 800);

    }

}

document.querySelectorAll(".tap-fun").forEach(el => {

    el.addEventListener("click", (e) => {

        spawnBurst(e.clientX, e.clientY);

    });

});

// Photo cards get a little wiggle when tapped,
// on top of the sparkle burst.

document.querySelectorAll(
    ".photo-card, .modern-photo"
).forEach(el => {

    el.addEventListener("click", (e) => {

        spawnBurst(e.clientX, e.clientY);

        el.classList.remove("wiggle");

        void el.offsetWidth;

        el.classList.add("wiggle");

    });

});


/* =========================================
   BEGIN JOURNEY

   Runs once she actually says yes.
========================================= */

function beginJourney() {

    createConfetti();

    startMusic();


    intro.style.opacity = "0";


    setTimeout(() => {

        intro.classList.add(
            "hidden"
        );

        journey.classList.remove(
            "hidden"
        );

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        /*
            The page just grew a lot taller now
            that the journey content is visible,
            so the starfield needs to stretch to
            match the new scroll height.
        */

        resizeCanvas();

        initBalloonDrift();

    }, 700);

}

yesButton.addEventListener(
    "click",
    beginJourney
);


/* =========================================
   ROTATE PHONE
========================================= */

function showFinalSurprise() {

    finalScreen.classList.remove(
        "hidden"
    );


    /*
        Give the final screen a tiny delay
        before starting the cinematic effect.
    */

    setTimeout(() => {

        document.body.style.overflow =
            "hidden";

    }, 100);

}


/* =========================================
   READY BUTTON
========================================= */

readyButton.addEventListener(
    "click",
    () => {

        finalSurpriseShown = true;

        showFinalSurprise();

    }
);


/* =========================================
   DEVICE ORIENTATION

   The old code relied on `orientationchange`
   plus `window.orientation`, but window.orientation
   is deprecated/removed on most modern phones
   (including current iOS Safari), so this event
   often never fires the way it used to. We use the
   `matchMedia("(orientation: landscape)")` API
   instead, which is the reliable, modern way to
   detect landscape mode, and it also works as our
   resize fallback since it fires on resize too.
========================================= */

let finalSurpriseShown = false;

const landscapeQuery =
    window.matchMedia("(orientation: landscape)");

function handleOrientationChange(e) {

    /*
        Only auto-trigger once, and only once the
        user has actually reached the rotate section
        (so we don't accidentally skip ahead if their
        phone happens to already be in landscape mode
        at some earlier point, e.g. on page load).
    */

    if (finalSurpriseShown) {
        return;
    }

    const rotateSection =
        document.getElementById("rotateSection");

    const rect =
        rotateSection.getBoundingClientRect();

    const rotateSectionVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

    if (!rotateSectionVisible) {
        return;
    }

    /*
        Only trigger on small/mobile-ish screens,
        so this doesn't fire unexpectedly while
        resizing a desktop browser window.
    */

    const isLandscape =
        e.matches;

    const isSmallDevice =
        Math.min(
            window.innerWidth,
            window.innerHeight
        ) < 600;

    if (isLandscape && isSmallDevice) {

        finalSurpriseShown = true;

        showFinalSurprise();

    }

}

landscapeQuery.addEventListener(
    "change",
    handleOrientationChange
);


/* =========================================
   MINI GAME — POP THE BALLOONS

   Each balloon hides a little message. Tap
   one and it pops with a sparkle burst and
   floats its message up before fading. Once
   every balloon has been popped, a small
   congrats note appears — and only then does
   the page let her scroll on to the candle.
   Balloons drift freely and bounce gently
   around inside the field the whole time.
========================================= */

let balloonsPopped = 0;
let balloonsComplete = false;

const totalBalloons =
    balloonButtons.length;

const balloonField =
    document.getElementById("balloonField");

const balloonLockHint =
    document.getElementById("balloonLockHint");

const balloonSection =
    document.getElementById("balloonSection");

const candleSection =
    document.getElementById("candleSection");

function showBalloonMessage(text, x, y) {

    const message =
        document.createElement("div");

    message.className = "balloon-message";

    message.textContent = text;

    message.style.left = x + "px";
    message.style.top = y + "px";

    document.body.appendChild(message);

    setTimeout(() => {

        message.remove();

    }, 1600);

}

balloonButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        if (btn.classList.contains("popped")) {
            return;
        }

        btn.classList.add("popped");

        const rect =
            btn.getBoundingClientRect();

        const x =
            rect.left + rect.width / 2;

        const y =
            rect.top + rect.height / 2;

        spawnBurst(x, y);

        showBalloonMessage(
            btn.dataset.message || "🎈",
            x,
            y
        );

        balloonsPopped += 1;

        if (balloonsPopped === totalBalloons) {

            balloonsComplete = true;

            balloonLockHint.classList.add("hidden");

            balloonCompleteMsg.classList.remove(
                "hidden"
            );

            requestAnimationFrame(() => {

                balloonCompleteMsg.classList.add(
                    "visible"
                );

            });

            balloonGateObserver.disconnect();

        }

    });

});


/* =========================================
   BALLOON DRIFT

   Each balloon gets its own gentle random
   velocity and quietly bounces around inside
   the field, occasionally nudged off course
   so the movement never feels mechanical.
   Runs independently of the small CSS bob/
   rotate animation already on each balloon,
   which layers on top of this.
========================================= */

function initBalloonDrift() {

    const maxSpeed = 0.55;

    const balloonState =
        Array.from(balloonButtons).map(btn => ({

            el: btn,

            x: Math.random() * 200,

            y: Math.random() * 200,

            vx: (Math.random() - 0.5) * maxSpeed,

            vy: (Math.random() - 0.5) * maxSpeed

        }));

    // Spread them out inside the field as soon
    // as it actually has real dimensions (it's
    // inside the hidden journey until she says
    // yes, so this runs right after that reveal).

    const fieldRect =
        balloonField.getBoundingClientRect();

    balloonState.forEach(b => {

        const bw =
            b.el.offsetWidth || 58;

        const bh =
            b.el.offsetHeight || 72;

        b.x =
            Math.random() * Math.max(0, fieldRect.width - bw);

        b.y =
            Math.random() * Math.max(0, fieldRect.height - bh);

        b.el.style.left = b.x + "px";
        b.el.style.top = b.y + "px";

    });

    function step() {

        if (balloonsPopped >= totalBalloons) {

            // Everything's popped — nothing
            // left to animate.

            return;

        }

        const rect =
            balloonField.getBoundingClientRect();

        const width =
            rect.width;

        const height =
            rect.height;

        balloonState.forEach(b => {

            if (b.el.classList.contains("popped")) {
                return;
            }

            // Occasional gentle nudge so paths
            // don't look like a robotic bounce.

            if (Math.random() < 0.01) {

                b.vx += (Math.random() - 0.5) * 0.25;

                b.vy += (Math.random() - 0.5) * 0.25;

                b.vx = Math.max(-maxSpeed, Math.min(maxSpeed, b.vx));
                b.vy = Math.max(-maxSpeed, Math.min(maxSpeed, b.vy));

            }

            const bw =
                b.el.offsetWidth || 58;

            const bh =
                b.el.offsetHeight || 72;

            const maxX =
                Math.max(0, width - bw);

            const maxY =
                Math.max(0, height - bh);

            let nx = b.x + b.vx;
            let ny = b.y + b.vy;

            if (nx <= 0) {
                nx = 0;
                b.vx = Math.abs(b.vx);
            } else if (nx >= maxX) {
                nx = maxX;
                b.vx = -Math.abs(b.vx);
            }

            if (ny <= 0) {
                ny = 0;
                b.vy = Math.abs(b.vy);
            } else if (ny >= maxY) {
                ny = maxY;
                b.vy = -Math.abs(b.vy);
            }

            b.x = nx;
            b.y = ny;

            b.el.style.left = nx + "px";
            b.el.style.top = ny + "px";

        });

        requestAnimationFrame(step);

    }

    requestAnimationFrame(step);

}


/* =========================================
   BALLOON GATE

   She can't scroll into the candle section
   until every balloon has been popped — if
   she tries, we smoothly pull her back and
   give the hint a little shake.
========================================= */

const balloonGateObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting && !balloonsComplete) {

                    balloonSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    balloonField.classList.remove("shake");

                    void balloonField.offsetWidth;

                    balloonField.classList.add("shake");

                }

            });

        },
        { threshold: 0.05 }
    );

balloonGateObserver.observe(candleSection);


/* =========================================
   MINI GAME — BLOW OUT THE CANDLE

   Primary path: ask for the microphone,
   count down so she knows when to blow, then
   listen for a sustained burst of volume and
   extinguish the flame when it happens. The
   flame also flickers live in response to
   how loud she's blowing, for a bit of magic.

   Fallback path: if the mic is denied,
   unsupported, or she just doesn't want to
   use it, a "tap and hold" button appears
   that does the same thing without audio.
========================================= */

let candleOut = false;
let listeningStopped = false;

function extinguishCandle() {

    if (candleOut) {
        return;
    }

    candleOut = true;
    listeningStopped = true;

    const rect =
        flame.getBoundingClientRect();

    const x =
        rect.left + rect.width / 2;

    const y =
        rect.top + rect.height / 2;

    /*
        The live listening loop sets inline
        transform/opacity on the flame for
        real-time feedback. Inline styles beat
        stylesheet rules, so those need to be
        cleared here or the flame-out class's
        fade-out transition would never actually
        take visual effect.
    */

    flame.style.transform = "";
    flame.style.opacity = "";

    flame.classList.add("flame-out");

    spawnSmoke(x, y);

    spawnBurst(x, y);

    candleCountdown.classList.add("hidden");

    candleReadyButton.classList.add("hidden");

    candleFallbackButton.classList.add("hidden");

    candleInstructions.style.opacity = "0";

    candleSuccessMsg.classList.remove("hidden");

    requestAnimationFrame(() => {

        candleSuccessMsg.classList.add("visible");

    });

}

function spawnSmoke(x, y) {

    for (let i = 0; i < 3; i++) {

        setTimeout(() => {

            const puff =
                document.createElement("span");

            puff.className = "smoke-puff";

            puff.style.left =
                (x + (Math.random() * 16 - 8)) + "px";

            puff.style.top =
                (y + (Math.random() * 10 - 5)) + "px";

            document.body.appendChild(puff);

            setTimeout(() => {

                puff.remove();

            }, 1300);

        }, i * 180);

    }

}

function runCountdown(callback) {

    candleCountdown.classList.remove("hidden");

    const steps = ["3", "2", "1", "Blow! 🌬️"];

    let i = 0;

    function nextStep() {

        candleCountdown.textContent = steps[i];

        candleCountdown.style.animation = "none";

        void candleCountdown.offsetWidth;

        candleCountdown.style.animation =
            "countPop 0.5s ease";

        i += 1;

        if (i < steps.length) {

            setTimeout(nextStep, 800);

        } else {

            setTimeout(callback, 700);

        }

    }

    nextStep();

}

function startMicListening() {

    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {

            candleInstructions.textContent =
                "Get close to your mic and blow on 1!";

            runCountdown(() => {

                listenForBlow(stream);

            });

        })
        .catch(() => {

            // Mic denied or unavailable — fall
            // back to the tap-and-hold button
            // instead of leaving her stuck.

            candleInstructions.textContent =
                "Couldn't access your mic — tap the button below instead.";

            candleReadyButton.classList.add("hidden");

            candleFallbackButton.classList.remove(
                "hidden"
            );

        });

}

function listenForBlow(stream) {

    candleInstructions.textContent =
        "Blow! 🌬️";

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    const audioCtx =
        new AudioContextClass();

    if (audioCtx.state === "suspended") {

        audioCtx.resume();

    }

    const source =
        audioCtx.createMediaStreamSource(stream);

    const analyser =
        audioCtx.createAnalyser();

    analyser.fftSize = 512;

    source.connect(analyser);

    const dataArray =
        new Uint8Array(analyser.frequencyBinCount);

    flame.classList.add("flame-listening");

    let loudFrames = 0;

    const requiredLoudFrames = 12;

    const volumeThreshold = 42;

    function checkVolume() {

        if (listeningStopped) {

            stream.getTracks().forEach(
                track => track.stop()
            );

            audioCtx.close();

            return;

        }

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;

        for (let i = 0; i < dataArray.length; i++) {

            sum += dataArray[i];

        }

        const average =
            sum / dataArray.length;

        /*
            Give the flame live feedback as she
            blows — leaning and shrinking with
            the volume, instead of just sitting
            there until the threshold is hit.
        */

        const lean =
            Math.min(average / volumeThreshold, 1.6);

        flame.style.transform =
            `translateX(-50%) rotate(${lean * 25}deg) scale(${1 - lean * 0.25}, ${1 + lean * 0.15})`;

        flame.style.opacity =
            String(Math.max(0.3, 1 - lean * 0.5));

        if (average > volumeThreshold) {

            loudFrames += 1;

        } else {

            loudFrames = Math.max(0, loudFrames - 1);

        }

        if (loudFrames >= requiredLoudFrames) {

            stream.getTracks().forEach(
                track => track.stop()
            );

            audioCtx.close();

            extinguishCandle();

            return;

        }

        requestAnimationFrame(checkVolume);

    }

    checkVolume();

    // Safety net — if she's quiet, on mute, or
    // the mic just isn't picking anything up,
    // offer the fallback after a while instead
    // of leaving her waiting forever.

    setTimeout(() => {

        if (!candleOut) {

            candleFallbackButton.classList.remove(
                "hidden"
            );

        }

    }, 9000);

}

candleReadyButton.addEventListener(
    "click",
    () => {

        candleReadyButton.classList.add("hidden");

        if (
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        ) {

            startMicListening();

        } else {

            candleInstructions.textContent =
                "Your browser can't use the mic here — tap below instead.";

            candleFallbackButton.classList.remove(
                "hidden"
            );

        }

    }
);

let holdTimer = null;

function startHold() {

    if (candleOut) {
        return;
    }

    candleFallbackButton.classList.add("holding");

    holdTimer = setTimeout(() => {

        extinguishCandle();

    }, 1100);

}

function cancelHold() {

    candleFallbackButton.classList.remove("holding");

    if (holdTimer) {

        clearTimeout(holdTimer);

        holdTimer = null;

    }

}

candleFallbackButton.addEventListener(
    "pointerdown",
    startHold
);

candleFallbackButton.addEventListener(
    "pointerup",
    cancelHold
);

candleFallbackButton.addEventListener(
    "pointerleave",
    cancelHold
);

if (!window.PointerEvent) {

    // Very old browsers without Pointer Events —
    // just extinguish on a plain click/tap rather
    // than leave the fallback unusable.

    candleFallbackButton.addEventListener(
        "click",
        extinguishCandle
    );

}


/* =========================================
   MINI GAME — FRIENDSHIP METER

   A slider that looks fully draggable, but
   no matter where she lets go, it gently
   springs the rest of the way to "besties
   forever" after a beat — the joke being
   that the meter "has a mind of its own."
   The label and emoji update live as she
   drags, so it still feels responsive right
   up until it makes its own decision.
========================================= */

const meterStages = [
    { max: 19, emoji: "😐", text: "meh" },
    { max: 39, emoji: "🙂", text: "you're alright" },
    { max: 64, emoji: "😊", text: "pretty great, ngl" },
    { max: 89, emoji: "💫", text: "somewhat speacial" },
    { max: 100, emoji: "❤️", text: "one of my favorites" }
];

function getMeterStage(value) {

    return (
        meterStages.find(stage => value <= stage.max) ||
        meterStages[meterStages.length - 1]
    );

}

function updateMeterDisplay(value) {

    meterFill.style.width = value + "%";

    const stage =
        getMeterStage(value);

    meterEmoji.textContent = stage.emoji;

    meterLabel.textContent = stage.text;

}

function lockMeterToMax() {

    meterSlider.value = "100";

    meterFill.classList.add("locking");

    updateMeterDisplay(100);

    meterWrap.classList.remove("locked-in");

    void meterWrap.offsetWidth;

    meterWrap.classList.add("locked-in");

    meterCaption.textContent =
        "Yeah... we both knew where this was going 💜";

    meterCaption.classList.add("visible");

    const rect =
        meterSlider.getBoundingClientRect();

    spawnBurst(
        rect.right - 16,
        rect.top + rect.height / 2
    );

    setTimeout(() => {

        meterFill.classList.remove("locking");

    }, 900);

}

let meterLockTimeout = null;

meterSlider.addEventListener("input", () => {

    // She's actively dragging again — cancel any
    // pending auto-lock from a previous release so
    // it doesn't jump the value out from under her.

    if (meterLockTimeout) {

        clearTimeout(meterLockTimeout);

        meterLockTimeout = null;

    }

    updateMeterDisplay(Number(meterSlider.value));

});

meterSlider.addEventListener("change", () => {

    const value =
        Number(meterSlider.value);

    if (value >= 100) {

        lockMeterToMax();

        return;

    }

    // A short beat before it "makes up its
    // mind" — long enough to feel intentional,
    // short enough to still feel snappy.

    meterLockTimeout = setTimeout(() => {

        meterLockTimeout = null;

        lockMeterToMax();

    }, 450);

});