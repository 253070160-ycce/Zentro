import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "./userAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CART_FILE = path.join(__dirname, "../data/carts.json");

async function readCarts() {
  try {
    const data = await fs.readFile(CART_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(CART_FILE), { recursive: true });
      await fs.writeFile(CART_FILE, "[]");
      return [];
    }
    throw err;
  }
}

async function writeCarts(carts) {
  await fs.writeFile(CART_FILE, JSON.stringify(carts, null, 2), "utf8");
}

export async function addToCart(req, res) {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ error: "Missing userId or productId" });
  }

  if(!authMiddleware(req))
    return res.status(400).json({ error: "User Authentication Failed" });

  const carts = await readCarts();
  let cart = carts.find(c => c.userId === userId);

  if (!cart) {
    cart = { userId, items: [] };
    carts.push(cart);
  }

  const existingItem = cart.items.find(i => i.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await writeCarts(carts);

  res.json({ message: "Added to cart", cart });
}
