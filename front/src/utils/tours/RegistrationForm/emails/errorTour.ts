import "intro.js/introjs.css";
import introJs from "intro.js";

const mailErrorTour = introJs().setOptions({
    steps: [
        {
            element: "#codeForm",
            title: "Echec de vérification",
            intro: "Le code de vérification entré est incorrect! Veuillez réessayer 😭",
            position: "left",
        },
    ],
    exitOnEsc: true,
    showBullets: false,
    showButtons: false,
});

export default mailErrorTour;
