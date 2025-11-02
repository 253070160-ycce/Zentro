import jwt from "jsonwebtoken";

import { addUserIfNotExists, getUserByEmail } from "./userService.js";

const JWT_SECRET = "34njewfsdufs8uewrfidjsfo";

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (password != user.password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    user: { id: user.id, email: user.email, username: user.username },
    token,
  });
}

export async function register(req, res) {
const { email, password, username } = req.body;
    console.log('registering: ', email, password, username);
    try {    
    const user = await addUserIfNotExists(req.body);
    console.log('registered: ', user);
    
    return res.status(200).json({status: "OK"});
    } catch (error) {
        return res.status(401).json({ error: "User Already Exists" });
    }
    
}
