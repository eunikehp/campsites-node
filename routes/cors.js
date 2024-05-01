const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) { //indexOf = -1 meaning the item that you are looking for the indexOf was not found
        corsOptions = { origin: true }; // found and allowing this request to be accepted
    } else { 
        corsOptions = { origin: false }; // not found
    }
    callback(null, corsOptions); //null meaning no error has occurred, 
};

exports.cors = cors(); // return middleware function configure to set a course header of access-control-allow-origin on a response object with a wildcard as its value, which allow cors for all origins 
exports.corsWithOptions = cors(corsOptionsDelegate); // this cors function will return a middleware function that checking if the incoming request belongs to one of the whitelisted origins. if it does, it will send back the cors response header of access control allow origin with the whitelisted origin as the value. 