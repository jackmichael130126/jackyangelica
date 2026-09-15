const flowersContainer =
    document.getElementById("flowers");

const instruction =
    document.getElementById("instruction");

const finalSunflower =
    document.getElementById("finalSunflower");

const bigPetals =
    document.getElementById("bigPetals");


/* ========================================
   CREAR PÉTALOS
======================================== */

function crearPetalos(contenedor, cantidad, clase) {

    for (let i = 0; i < cantidad; i++) {

        const petalo =
            document.createElement("div");

        petalo.className = clase;

        const angulo =
            (360 / cantidad) * i;

        petalo.style.transform = `
            translate(-50%, -100%)
            rotate(${angulo}deg)
        `;

        contenedor.appendChild(petalo);
    }
}


/* GIRASOL FINAL */

crearPetalos(
    bigPetals,
    22,
    "big-petal"
);


/* ========================================
   DATOS DE GIRASOLES
======================================== */

const flowers = [];

const cantidad = 58;


/* ========================================
   CREAR GIRASOL
======================================== */

function crearFlor() {

    const flor =
        document.createElement("div");

    flor.className = "flower";


    const head =
        document.createElement("div");

    head.className = "head";


    /* PÉTALOS */

    for (let i = 0; i < 18; i++) {

        const petal =
            document.createElement("div");

        petal.className = "petal";

        const angulo =
            i * 20;

        petal.style.transform = `
            translate(-50%, -100%)
            rotate(${angulo}deg)
        `;

        head.appendChild(petal);
    }


    const center =
        document.createElement("div");

    center.className =
        "flower-center";

    head.appendChild(center);


    /* TALLO */

    const stem =
        document.createElement("div");

    stem.className = "stem";


    /* HOJAS */

    const hoja1 =
        document.createElement("div");

    hoja1.className =
        "leaf leaf-left";


    const hoja2 =
        document.createElement("div");

    hoja2.className =
        "leaf leaf-right";


    flor.appendChild(stem);

    flor.appendChild(hoja1);

    flor.appendChild(hoja2);

    flor.appendChild(head);

    flowersContainer.appendChild(flor);


    return flor;
}


/* ========================================
   CREAR CAMPO
======================================== */

for (let i = 0; i < cantidad; i++) {

    const element =
        crearFlor();


    /*
        depth:
        0 = horizonte
        1 = cámara
    */

    const depth =
        Math.pow(
            Math.random(),
            1.5
        );


    const side =
        Math.random() < .5
            ? -1
            : 1;


    /*
       Flores cercanas quedan
       más separadas del centro.
    */

    const spread =
        7 +
        depth * 43;


    const randomOffset =
        Math.random() *
        (
            8 +
            depth * 18
        );


    const baseX =
        50 +
        side *
        (
            spread +
            randomOffset
        );


    flowers.push({

        element,

        depth,

        side,

        baseX,

        sway:
            Math.random() *
            Math.PI * 2,

        swaySpeed:
            .5 +
            Math.random(),

        sizeVariation:
            .82 +
            Math.random() * .32
    });

}


/* ========================================
   LIMITAR VALOR
======================================== */

function clamp(
    value,
    minimum,
    maximum
) {

    return Math.min(
        maximum,
        Math.max(
            minimum,
            value
        )
    );

}


/* ========================================
   INTERPOLACIÓN
======================================== */

function lerp(
    inicio,
    final,
    cantidad
) {

    return inicio +
        (final - inicio) *
        cantidad;

}


/* ========================================
   SCROLL
======================================== */

function obtenerProgreso() {

    const maxScroll =
        document.documentElement
            .scrollHeight -
        window.innerHeight;

    if (maxScroll <= 0)
        return 0;

    return clamp(
        window.scrollY /
        maxScroll,
        0,
        1
    );

}


/* ========================================
   ANIMACIÓN
======================================== */

function animate(time) {

    const progress =
        obtenerProgreso();


    /*
        Parte de caminar:
        aproximadamente primeros 75%.
    */

    const walkProgress =
        clamp(
            progress / .76,
            0,
            1
        );


    flowers.forEach(
        (flower, index) => {

            /*
                Conforme avanzamos,
                la profundidad aumenta.
            */

            let depth =
                flower.depth +
                walkProgress * .93;


            /*
                Cuando pasa la cámara,
                vuelve al horizonte.
            */

            depth =
                depth % 1.12;


            /*
                Perspectiva no lineal.
            */

            const perspective =
                Math.pow(
                    depth,
                    1.8
                );


            /*
                Y:
                horizonte hacia abajo.
            */

            const y =
                lerp(
                    47,
                    103,
                    perspective
                );


            /*
                X:
                desde centro hacia lados.
            */

            const distanceFromCenter =
                Math.abs(
                    flower.baseX - 50
                );


            const x =
                50 +
                flower.side *
                lerp(
                    distanceFromCenter * .18,
                    distanceFromCenter * 1.35,
                    perspective
                );


            /*
                Tamaño.
            */

            const size =
                lerp(
                    22,
                    185,
                    Math.pow(
                        depth,
                        1.72
                    )
                ) *
                flower.sizeVariation;


            /*
                Movimiento suave por viento.
            */

            const sway =
                Math.sin(
                    time * .001 *
                    flower.swaySpeed +
                    flower.sway
                ) *
                (
                    1.5 +
                    depth * 2
                );


            flower.element.style.setProperty(
                "--size",
                `${size}px`
            );


            flower.element.style.left =
                `${x}%`;


            flower.element.style.top =
                `${y}%`;


            flower.element.style.zIndex =
                Math.floor(
                    20 +
                    depth * 130
                );


            flower.element.style.opacity =
                depth < .025
                    ? 0
                    : 1;


            flower.element.style.transform = `
                translate(-50%, -100%)
                rotate(${sway}deg)
            `;

        }
    );


    /* ====================================
       INSTRUCCIÓN
    ==================================== */

    const instructionOpacity =
        clamp(
            1 - progress * 9,
            0,
            1
        );

    instruction.style.opacity =
        instructionOpacity;


    /* ====================================
       GIRASOL FINAL
    ==================================== */

    const finalStart = .68;

    const finalProgress =
        clamp(
            (
                progress -
                finalStart
            ) /
            (
                1 -
                finalStart
            ),
            0,
            1
        );


    /*
        Curva suave.
    */

    const eased =
        1 -
        Math.pow(
            1 - finalProgress,
            3
        );


    const scale =
        lerp(
            .08,
            1,
            eased
        );


    const finalY =
        lerp(
            56,
            50,
            eased
        );


    finalSunflower.style.opacity =
        finalProgress;


    finalSunflower.style.transform = `
        translate(-50%, -${finalY}%)
        scale(${scale})
    `;


    requestAnimationFrame(
        animate
    );

}


/* INICIAR */

requestAnimationFrame(
    animate
);