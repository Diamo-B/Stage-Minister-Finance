const Footer = () => {
    return (
        <footer className="footer justify-items-start place-items-center py-5 px-10 bg-base-200 text-base-content border-t-2 border-neutral-content">
            <div className="place-items-center w-3/4">
                <img className="h-24" src="/testMEFNoBG.png" alt="logo MEF" />
                <p className="text-center font-bold">
                    Ministère de l'Économie et des Finances
                    <br />
                    Copyright 2023. Tout les droits sont réservés
                </p>
            </div>
            <div>
                <span className="footer-title">Services</span>
                <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
            </div>
            <div>
                <span className="footer-title">Company</span>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </div>
            <div>
                <span className="footer-title">Legal</span>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </div>
        </footer>
    );
};

export default Footer;
