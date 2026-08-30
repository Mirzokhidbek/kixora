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

  - Production & Railway Deployment (Dars 86):
      1. Railway.app Cloud Architecture:
         - Bitta GitHub repositoriyasidan Railway loyihasi ichida 2 ta alohida xizmat (Service) yaratiladi:
           a) **Backend Service (Node.js/Express)**:
              - Root: `/`
              - Build: `npm run build`
              - Start: `npm run start:prod`
              - Variables: `MONGO_URL`, `SESSION_SECRET`, `JWT_SECRET`, `NODE_ENV=production`.
           b) **Frontend Service (React Vite SPA)**:
              - Root: `burak-react`
              - Build: `npm run build`
              - Start: `npm run serve`
              - Variables: `VITE_API_URL` (Backend Railway domeni).
      2. Cloud Domain & Health Checks:
         - `server.ts` da server `app.listen()` orqali zudlik bilan ishga tushadi, bu esa Railway Cloud Health Check tekshiruvlaridan muvaffaqiyatli o'tishini ta'minlaydi.
         - Backend domeni Railway tomonidan berilgan haqiqiy domen bilan frontend `VITE_API_URL` o'zgaruvchisiga to'g'ri ulanishi shart.
*/
