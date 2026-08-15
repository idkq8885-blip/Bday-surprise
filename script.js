/* =========================================
   ELEMENTS
========================================= */

const startButton =
    document.getElementById("startButton");

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
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


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
   START JOURNEY
========================================= */

startButton.addEventListener(
    "click",
    () => {

        createConfetti();


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

        }, 700);

    }
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

        showFinalSurprise();

    }
);


/* =========================================
   DEVICE ORIENTATION
========================================= */

window.addEventListener(
    "orientationchange",
    () => {

        /*
            orientation === 90 or -90
            usually means landscape.
        */

        if (
            Math.abs(
                window.orientation
            ) === 90
        ) {

            showFinalSurprise();

        }

    }
);


/* =========================================
   SCREEN SIZE FALLBACK
========================================= */

window.addEventListener(
    "resize",
    () => {

        /*
            If the device becomes
            wider than it is tall,
            consider it landscape.
        */

        if (
            window.innerWidth >
            window.innerHeight
        ) {

            /*
                Only trigger this on
                smaller devices.
            */

            if (
                window.innerWidth <
                1200
            ) {

                /*
                    Don't automatically trigger
                    while developing on desktop.
                */

                if (
                    window.innerWidth >
                    500
                ) {

                    // We intentionally leave
                    // this empty for desktop.
                }

            }

        }

    }
);