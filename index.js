var express = require("express");
var multer  = require('multer');
var app     = express();
var fs 	    = require('fs');
var pathApp = __dirname + '/uploads/';

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
	callback(null, './uploads');
  },
  
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/get',function(req,res){
	
    // Declare variables
    var fileName = req.query.fileName;
    var fs = require('fs');
    var obj;
    
    // Error validation
    try {
		fs.statSync(pathApp + fileName);
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			return res.status(404).json({statusCode: 404, message: 'File does not exists'});
		}
	}

	// Read the file and send to the callback
	fs.readFile(pathApp + fileName, handleFile)

	// Write the callback function
	function handleFile(err, data) {
		if (err) throw err
		obj = JSON.parse(data)
		res.send(obj);
	}	
});

app.post('/upload',function(req,res){
    var upload = multer({ storage : storage}).single('file');
    
    upload(req,res,function(err) {
        if(err) {
            return res.json({error: "Error uploading file."});
        }
         res.json({ file: req.file });
    });
});

app.listen(12345, () => console.log("Running on localhost:12345"))
