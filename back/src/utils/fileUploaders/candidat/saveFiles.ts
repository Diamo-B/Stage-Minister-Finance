import httpException from '../../httpException';
import fs from 'fs';

export const saveFiles = (
    candidat: string,
    files: string[],
    name: string[],
    ext: string[]
): string[] => {
    let filesPaths: string[] = [];
    fs.mkdirSync(`./public/candidat_${candidat}`, { recursive: true });
    if(typeof files === 'string' && typeof name === 'string' && typeof ext === 'string') 
    {
        files = [files];
        name = [name];
        ext = [ext];
    }  
    
    //explain: removing the first part of the data to get the base64 string
    const dataUriRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,(.*)$/;
    files.forEach((base64String: string, index: number) => {
        const matches = base64String.match(dataUriRegex);
        if (!matches)
            throw new httpException(
                500,
                'Invalid base64 string format for the file.' + name[index]
            );
        const base64Data = matches[2];
        const binaryData = Buffer.from(base64Data, 'base64');
        const filePath = `./public/candidat_${candidat}/`;
       
        const fileName =
            (name[index] as string).replace(' ', '_').split('.')[0] +
            '_' +
            index +
            '.' +
            (ext[index] as string); 
        
        filesPaths.push(filePath+fileName);

        fs.writeFile(
            filePath + fileName,
            binaryData,
            { encoding: 'binary' },
            err => {
                if (err) {
                    throw err;
                } else {
                    return true;
                }
            }
        );
    });
    return filesPaths;
};
