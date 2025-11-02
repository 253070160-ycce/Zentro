import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express server setup
const app = express();
const PORT = 3000;

// Let The Express server decode POST data and form submissions into a readable JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Paths

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "error404.html"));
});

//Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
