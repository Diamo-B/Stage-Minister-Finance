import { Router } from 'express';
import userRouter from './userRouter';
import cityRouter from './citiesRouter';
import regionRouter from './regionsRouter';
import countriesRouter from "./countriesRouter"
import universitiesRouter from "./universitiesRouter"
import diplomeRouter from "./diplomesRouter"
import attachmentRouter from './attachmentRouter';
import concoursRouter from './concoursRouter';
import directionsRouter from './directionRouter';
import postesRouter from './postesRouter';
import gradesRouter from './gradesRouter';
import branchesRouter from './branchesRouter';
import specialitesRouter from './specialitesRouter';
import accountsRouter from './accountsRouter';
import { UploadedFile } from 'express-fileupload';
import { existsSync } from 'fs';
import path from 'path';

const router: Router = Router();
router.use('/user', userRouter);
router.use('/city', cityRouter);
router.use('/region', regionRouter);
router.use('/country', countriesRouter);
router.use('/university', universitiesRouter);
router.use('/diplome', diplomeRouter);
router.use("/attachment", attachmentRouter);
router.use('/concours', concoursRouter);
router.use('/directions', directionsRouter);
router.use('/postes', postesRouter);
router.use('/grades', gradesRouter);
router.use('/branches', branchesRouter);
router.use('/specs', specialitesRouter);
router.use('/accounts', accountsRouter);

router.get('/download/:fileRelativePath', (req, res) => {
    const encodedPath = req.params.fileRelativePath;

    const fileRelativePath = decodeURIComponent(encodedPath);    
    const fullPath = 'public'+fileRelativePath;

    // Check if the file exists
    if (!existsSync(fullPath)) {
        return res.status(404).send('File not found');
    }


    const fileFinalFullPath = path.join(__dirname, '../../' + fullPath);
        
    // Send the file
    res.download(fileFinalFullPath, function (err) {
        if (err) {
            console.log(err);
        }
    });
});


export default router;
