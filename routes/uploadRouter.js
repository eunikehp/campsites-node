const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({ //set configuration settings
    destination: (req, file, cb) => { //cb = callback
        cb(null, 'public/images') //null means there is no error. pblic/images where we set so can be accesesed as a static file from outside world. 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) // this will make sure the name of file of the server same as the name of the file on the client side.
    }
})

//file filter
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

//handle the http request
uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),(req,res) => { //add multer middleware
    res.statusCode = 200;
    res.setHeader ('Content-Type', 'application/json')
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})


module.exports = uploadRouter;