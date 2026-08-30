# 🚂 Railway.app — Complete Deployment Guide for Burak Restaurant

This guide provides the exact step-by-step instructions to deploy both the **Node.js/Express Backend** and **React Vite Frontend** on [Railway.app](https://railway.app).

---

## 🏗️ Architecture on Railway

Your single GitHub repository will create **2 Services** inside a single Railway Project:

```
┌─────────────────────────────────────────────────────────────┐
│                 Railway Project: "burak"                    │
│                                                             │
│  ┌───────────────────────────┐ ┌──────────────────────────┐ │
│  │   Service 1: Backend      │ │   Service 2: Frontend    │ │
│  │   (Node.js / Express)     │ │   (React 19 / Vite SPA)  │ │
│  │   Root: /                 │ │   Root: /burak-react     │ │
│  │   Port: $PORT             │ │   Port: $PORT            │ │
│  └─────────────┬─────────────┘ └────────────┬─────────────┘ │
│                │                            │               │
│                ▼                            ▼               │
│        [ MongoDB Database ]      [ Users / Browsers ]       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📌 STEP 1: Deploy the Backend Service

1. Go to [Railway.app](https://railway.app) and click **"New Project"**.
2. Select **"Deploy from GitHub repo"** and choose your `burak` repository.
3. Click on the newly created Service box and open **Settings**:
   - **Service Name:** `burak-backend`
   - **Root Directory:** `/` (leave as default)
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start:prod`
4. Go to the **"Variables"** tab and add the following Environment Variables:
   ```env
   NODE_ENV=production
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/burak?retryWrites=true&w=majority
   SESSION_SECRET=BURAK_LUXURY_SECRET_KEY_2026
   JWT_SECRET=BURAK_JWT_TOKEN_SECRET_KEY_2026
   ```
   *(Note: Railway automatically provides the `$PORT` variable).*
5. Go to **Settings &rarr; Networking &rarr; Generate Domain**.
   - Copy your public backend URL (e.g. `https://burak-backend-production.up.railway.app`).

---

## 📌 STEP 2: Deploy the Frontend Service (React Vite)

1. Inside the **same Railway project**, click **"+ New"** &rarr; **"GitHub Repo"** &rarr; select the same `burak` repository again.
2. Click on the new Service box and open **Settings**:
   - **Service Name:** `burak-frontend`
   - **Root Directory:** `burak-react` *(IMPORTANT: set to `burak-react`)*
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run serve`
3. Go to the **"Variables"** tab and add:
   ```env
   VITE_API_URL=https://burak-backend-production.up.railway.app
   ```
   *(Replace with your actual backend domain from Step 1).*
4. Go to **Settings &rarr; Networking &rarr; Generate Domain**.
   - Your frontend will be live at (e.g. `https://burak-frontend-production.up.railway.app`).

---

## 📌 STEP 3: Verify Everything Live

1. Open your Frontend URL:
   - 🏠 **Home Page:** Loads banners, statistics, dishes, and active users via backend API.
   - 📋 **Menu Page:** Search, categories, and dishes load smoothly.
   - 🥩 **Dish Detail:** `/products/:id` loads dynamic pricing and portion calculators.
   - 🛒 **Basket & Checkout:** Adds items to cart, opens auth modal, and creates orders.
   - 📦 **Orders Tracking:** Shows `PAUSED`, `PROCESS`, and `FINISHED` orders with live updates.
   - 👤 **VIP Profile:** Manages credentials, addresses, and dining preferences.

2. Open your Backend Admin (BSSR) URL:
   - `https://burak-backend-production.up.railway.app/admin` &rarr; Restaurant Management & EJS Dashboard.

---

## 💡 Pro Tips for Railway:
- Whenever you push changes to GitHub, Railway automatically rebuilds and deploys both services with 0 downtime!
- Both services have full SSL/HTTPS enabled by default on Railway domains.
