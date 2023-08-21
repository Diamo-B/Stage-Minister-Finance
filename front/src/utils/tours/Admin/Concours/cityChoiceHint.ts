import "intro.js/introjs.css";
import introJs from "intro.js";

const cityChoiceHint = introJs().setOptions({
    hints: [
        {
            element: "#cityChoiceTitle",
            hint: "Veuillez glisser les villes souhaitées depuis les villes disponibles, et déposer-les dans l'espace des villes sélectionnés",
            hintPosition: "middle-left",
        },
    ],
});

export default cityChoiceHint;
