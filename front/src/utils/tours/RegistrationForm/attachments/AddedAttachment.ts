import "intro.js/introjs.css";
import introJs from "intro.js";

const AddedAttachment = introJs().setOptions({
    steps: [
        {
            title: "Pièce jointe ajoutée",
            intro: "La pièce a été ajoutée avec succès! Vous pouvez choisir une des options suivantes:",
            scrollTo: "tooltip",
        },
        {
            element: "#success",
            title: "Terminer l'inscription",
            intro: "Vous pouvez soit terminer l'étape de l'inscription",
            position: "left",
        },
        {
            element: "#tab2",
            title: "Consulter les pièces jointes ajoutées",
            intro: "Ou Vous pouvez consulter la liste des pièces jointes en cliquant ci-dessus 👆",
            position: "bottom",
        },
    ],
    exitOnEsc: true,
    exitOnOverlayClick: false,
    prevLabel: "Précédent",
    nextLabel: "Suivant",
    doneLabel: "Terminer",
});

export default AddedAttachment;
