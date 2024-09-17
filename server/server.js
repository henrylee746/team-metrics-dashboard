const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { exec } = require("child_process");
const port = 3000

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
res.send("Welcome to your server")
})

app.post('/script', (req,res) =>{
	console.log(req.body.command)
	exec(req.body.command, (error, stdout, stderr) => {
	  if (error) {
		console.error(`Error: ${error.message}`);
		return;
	  }
	  if (stderr) {
		console.error(`Stderr: ${stderr}`);
		return;
	  }
	  console.log(`Stdout:\n${stdout}`);
	});
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})