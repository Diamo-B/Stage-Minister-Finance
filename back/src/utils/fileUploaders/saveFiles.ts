import httpException from '../httpException';
import { mkdirSync, readdir, rmdir } from 'fs';
import { UploadedFile } from 'express-fileupload';

const saveSingleFile = (dirPath: string, file: UploadedFile): string => {
    const filePath = `${dirPath}${file.name}`;
    file.mv(filePath, err => {
        if (err) {
            console.error('mv err:', err);
            //explain: Check if the directory is empty then remove the made folder if it is
            readdir(dirPath, (err, files) => {
                if (err) {
                    console.error('readdir err: Could not read directory:', err);
                } else if (files.length === 0) {
                    // If the directory is empty, remove it
                    rmdir(dirPath, err => {
                        if (err) {
                            console.error(
                                'rmdir err: Could not remove directory:',
                                err
                            );
                        } else {
                            console.error(
                                'Removed empty directory: ',
                                `${dirPath}`
                            );
                        }
                    });
                }
            });
            throw new httpException(500, err.message);
        }
    });
    return filePath;
};

export const saveFiles = (
    dirPath: string,
    files: UploadedFile[] | UploadedFile
): string[] => {
    let filesPaths: string[] = [];
    mkdirSync(dirPath, { recursive: true });
    if (Array.isArray(files)) {
        files.forEach((file: UploadedFile) => {
            filesPaths.push(saveSingleFile(dirPath, file));
        });
    } else {
        filesPaths.push(saveSingleFile(dirPath, files));
    }
    return filesPaths;
};
