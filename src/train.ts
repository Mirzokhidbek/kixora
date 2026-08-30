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

  - Guest Session Optimization (Dars 94):
      1. Zero Unnecessary Guest Auth Calls:
         - Mehmon foydalanuvchi saytga kirganda `localStorage.getItem("member_data")` tekshiriladi. Agar foydalanuvchi tizimga kirmagan bo'lsa, `/member/detail` so'rovi umuman yuborilmaydi.
         - Natijada konsolda ortiqcha `401 Unauthorized` qizil xatolari chiqishi to'liq bartaraf etildi.
*/
