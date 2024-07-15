const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Commented out to stop serving static files from the static directory
// app.use(express.static(path.join(__dirname, 'static')));

// Serve the index.html file from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
