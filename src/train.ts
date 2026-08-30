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

  - Clean Code Architecture (Backend & Frontend):
      1. Backend Architecture:
         - MVC Model: Router &rarr; Controller &rarr; Service &rarr; Schema &rarr; Error Handling.
         - Server & DB Resilience: `store.on("error")`, `uncaughtException`, `unhandledRejection`, cloud health check `GET /`.
      2. Frontend Architecture:
         - Pure Type Imports: `import type { Member, Product, Order }` runtime xatoliklarning oldini oladi.
         - React Hooks & Fast Refresh: Action dispatchers `useMemo` bilan o'raldi, `useGlobals` alohida hook fayliga ajratildi, barcha `useEffect` dependency massivlari to'liq qanoatlantirildi.
         - Linting: `oxlint` orqali 0 warning va 0 error standartiga yetkazildi.
         - URL Sanitization: `serverApi` oxiridagi ortiqcha qiya chiziqlar tozalanishi (`.replace(/\/+$/, "")`) orqali `//route` 404 xatolarining oldi olindi.
         - Production Serving: React SPA uchun `serve -s dist -l $PORT` qo'llandi.
*/
