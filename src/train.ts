/* Project Standards:
  - Logging standards
  - Naming standards
      function, method, variable => CAMEL
      class => PASCAL
      folder, file => KEBAB-CASE / CAMEL
      css => KEBAB-CASE

  - WebServer & Authentication Process:
      VPS (Virtual Private Server) vs VPC (Virtual Private Cloud)
      Authentication (Identity verification) vs Authorization (Permission check)
      Session-Based Authentication (BSSR / EJS Cookies)
      Token-Based Authentication (JWT / SPA React)
      Browser Storages: Cookie, LocalStorage, SessionStorage
      CORS (Cross-Origin Resource Sharing):
        - `cors({ credentials: true, origin: true })`
        - Brauzer xavfsizlik siyosati tufayli turli xil portlardagi (React `http://localhost:5173` va Node backend `http://localhost:3001`) so'rovlarning cookie va headerlar bilan to'siqsiz almashinishini ta'minlaydi.

  - Production Deployment (Dars 86):
      1. Server & Process Management (PM2):
         - `ecosystem.config.js`: Cluster mode bilan barcha CPU yadrolaridan samarali foydalanish va server restart bo'lganda avtomatik qayta tiklanish (`pm2 startup && pm2 save`).
         - Backend Build: `tsc` &rarr; `dist/server.js` (`npm run start:prod`).
      2. Static Bundle & NGINX:
         - Frontend Build: `vite build` &rarr; `burak-react/dist/`.
         - NGINX Reverse Proxy:
           - `/` &rarr; React SPA (`try_files $uri $uri/ /index.html;`).
           - `/api/` &rarr; Reverse proxy `http://127.0.0.1:3001/`.
           - `/admin` &rarr; BSSR Admin Panel.
           - `/uploads/` &rarr; Rasm va media fayllar.
      3. SSL / HTTPS:
         - Certbot (Let's Encrypt) orqali xavfsiz HTTPS protokoli.

  - Frontend Configuration & API Services:
      1. Environmental Variables:
         - `.env`: `VITE_API_URL=http://localhost:3001`
         - `src/lib/config.ts`: `serverApi = import.meta.env.VITE_API_URL || "http://localhost:3001"`
      2. API Services Layer:
         - `ProductService`: `getProducts(inquiry)`, `getProduct(id)`.
         - `MemberService`: `getRestaurant()`, `getTopUsers()`, `getMemberDetail()`, `login()`, `signup()`, `logout()`, `updateMember(data)`.
         - `OrderService`: `createOrder(cartItems)`, `getMyOrders(inquiry)`, `updateOrder(input)`.

  - Basket & Orders Lifecycle:
      1. `useBasket` Hook (`cartItems`, `onAdd`, `onRemove`, `onDelete`, `onDeleteAll`).
      2. `OrdersPage`: `PausedOrders` (to'lov / bekor qilish), `ProcessOrders` (pishirish / yetkazib berish tasdig'i +10 ball), `FinishedOrders` (kvitansiya).
*/
