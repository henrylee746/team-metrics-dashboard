const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Middleware to parse JSON body from POST requests
app.use(express.json());

// Serve the static HTML page
app.use(express.static('public'));

// Route to handle the command execution
app.post('/run-command', (req, res) => {
    const reason = req.body.reason;
    
    if (!reason) {
        return res.status(400).send('Reason is required');
    }

    // Construct the shell command with the user input
    const command = `/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py --reasons:${reason}`;

    // Execute the shell command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error executing the command: ${error.message}`);
        }

        if (stderr) {
            return res.status(500).send(`stderr: ${stderr}`);
        }

        // Send the output back to the client
        res.send(`Command output:\n${stdout}`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
