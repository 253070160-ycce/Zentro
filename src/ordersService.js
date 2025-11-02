import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {  } from "jsonwebtoken";
import { authMiddleware } from "./userAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDER_FILE = path.join(__dirname, "../data/orders.json");

async function readOrders() {
  try {
    const data = await fs.readFile(ORDER_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(ORDER_FILE), { recursive: true });
      await fs.writeFile(ORDER_FILE, "[]");
      return [];
    }
    throw err;
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ORDER_FILE, JSON.stringify(orders, null, 2), "utf8");
}


export async function getOrders(req, res) {
  if(!authMiddleware(req))
      return res.status(400).json({ error: "User Authentication Failed" });
   
  const orders = await readOrders();
  const userOrders = orders.filter(o => o.userId === req.body.userId);
  res.json(userOrders);
}

export async function addToOrder(req, res) {
  console.log('order: ', req.body);
  if(!authMiddleware(req))
      return res.status(400).json({ error: "User Authentication Failed" });
    
  const { items, userId, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing or invalid items" });
  }

  const orders = await readOrders();

  const newOrder = {
    userId: userId,
    orderId: `ORD-${Date.now()}`,
    total: total,
    items,
    date: new Date().toISOString()
  };

  orders.push(newOrder);
  await writeOrders(orders);

  res.json({ message: "Order placed successfully", order: newOrder });
}
