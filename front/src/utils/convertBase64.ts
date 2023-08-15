async function convertBase64(file: File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = error => {
            console.error(error);
            reject(error);
        };
    });
}

export default convertBase64;
