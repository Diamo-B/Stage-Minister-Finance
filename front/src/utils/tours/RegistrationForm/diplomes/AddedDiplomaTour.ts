import "intro.js/introjs.css";
import introJs from "intro.js";

const AddedDiploma = introJs().setOptions({
    steps: [
        {
            title: "Diplôme ajouté",
            intro: "Le diplôme a été ajouté avec succès! Vous pouvez choisir une des options suivantes:",
            scrollTo: "tooltip",
        },
        {
            element: "#success",
            title: "Passer vers l'étape suivante",
            intro: "Vous pouvez soit passer vers la dernière étape du formulaire",
            position: "left",
        },
        {
            element: "#tab2",
            title: "Consulter les diplômes ajoutés",
            intro: "Ou Vous pouvez consulter la liste des diplômes en cliquant ci-dessus 👆",
            position: "bottom",
        },
    ],
    exitOnEsc: true,
    exitOnOverlayClick: false,
    prevLabel: "Précédent",
    nextLabel: "Suivant",
    doneLabel: "Terminer",
});

export default AddedDiploma;
