import fs from 'fs';

export const saveFile = (
    concoursId: string,
    file: Buffer, //file as a buffer
    name: string,
    ext: string
): string => {
    fs.mkdirSync(`./public/concours_${concoursId}`, { recursive: true });

    const filePath = `./public/concours_${concoursId}/`;

    const fileName = name.replace(' ', '_').split('.')[0] + '.' + ext;

    let fullFilePath = filePath + fileName;

    fs.writeFile(fullFilePath, file, { encoding: 'binary' }, err => {
        if (err) {
            throw err;
        } else {
            return true;
        }
    });
    return fullFilePath;
};
