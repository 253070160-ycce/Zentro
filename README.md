# Zentro - E-Commerce Web App

It showcases authentication, product listing, cart management, and order checkout — all stored in JSON files (no database required).

---

**User Authentication**  
- Register & Login with JWT-based authentication  
- Local storage token handling on frontend  

**Product Management**  
- Fetch product list from `/api/products`  
- Supports search, category filtering, and reverse listing  

**Cart System**  
- Add, remove, and reset items  
- Syncs per-user with token-based auth  

**Checkout & Orders**  
- Places orders via `/api/order/add`  
- Calculates subtotal, shipping, and total dynamically  
- Stores orders in `data/orders.json`  

**Frontend**  
- Clean responsive UI  
- Functional cart, checkout, and order history pages  
- Reusable footer and modular JS functions  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js, Express |
| Frontend | HTML, CSS, Vanilla JS |
| Auth | JSON Web Token (JWT) |
| Data Storage | JSON files (no DB) |

