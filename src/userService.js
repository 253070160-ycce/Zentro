import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, "../data/users.json");

// --- Utility: Read & Write Helpers ---
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, "[]", "utf8");
      return [];
    }
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

// --- Core Functions ---

export async function getUserByEmail(email) {
  const users = await readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function addUserIfNotExists(newUser) {
  const users = await readUsers();
  const existing = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase()) ||
  users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase());
  if (existing) throw 'already exists';

  const user = {
    id: Date.now().toString(),
    email: newUser.email,
    username: newUser.username,
    password: newUser.password
  };

  users.push(user);
  await writeUsers(users);
  return user;
}
