import GenForm from "../../Components/Candidat/Registration/genForm";

const Register = () => {
    return (
        <div className="w-full flex-1 flex justify-center items-center py-10">
            <GenForm />
            {/* handling localStorage preventing loggedIn ppl from going into here*/}
        </div>
    ); 
    
};

export default Register;
