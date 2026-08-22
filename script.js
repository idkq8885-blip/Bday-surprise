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