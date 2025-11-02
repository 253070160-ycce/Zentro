import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCT_FILE = path.join(__dirname, "../data/products.json");

// utility
async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCT_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(PRODUCT_FILE), { recursive: true });
      await fs.writeFile(PRODUCT_FILE, "[]");
      return [];
    }
    throw err;
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
