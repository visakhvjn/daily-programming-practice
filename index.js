import express from 'express';
import { getDailyQuestion } from './openai.js';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Define a route to generate text via an API
app.get('/', async (req, res) => {
    // Check if the file exists
    if (fs.existsSync('./data/question.txt')) {
        // Read the file content
        const data = fs.readFileSync('./data/question.txt', 'utf8');
        res.render('index', { htmlContent: data });
        return;
    }

    try {
        const dailyQuestion = await getDailyQuestion();

        // Write the new question to the file
        fs.writeFileSync('./data/question.txt', dailyQuestion, 'utf8');

        // Render the new question
        res.render('index', { htmlContent: dailyQuestion });
    } catch (error) {
        console.error('Error generating the question:', error);
        res.status(500).send('An error occurred while generating the question.');
    }
});

// Define a route to handle email submissions
app.post('/subscribe', (req, res) => {
    const email = req.body.email;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    // Save the email to the file
    const filePath = './data/subscribers.txt';
    fs.appendFileSync(filePath, `${email}\n`, 'utf8');
    res.status(200).send('Email subscribed successfully.');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
