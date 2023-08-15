import "intro.js/introjs.css";
import introJs from "intro.js";

const mailSuccessTour = introJs().setOptions({
    steps: [
        {
            element: "#success",
            title: "Email vérifié",
            intro: "Vous avez vérifié votre email avec succès. Vous pouvez maintenant continuer à remplir le formulaire 😄",
            position: "left",
        },
    ],
    exitOnEsc: true,
    showBullets: false,
    showButtons: false,
});

export default mailSuccessTour;
