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

  - Cross-Device Authentication & Bearer Header Token Persistence (Dars 98):
      1. Nega boshqa qurilmalarda avval login qilinishi kerak?
         - Har bir yangi telefon yoki kompyuter o'zining mustaqil brauzer xotirasiga (`LocalStorage` va `Cookie`) ega. Shuning uchun yangi qurilmadan ilk bor kirilganda `Guest` bo'ladi, 1 marta kirgach (yoki `⚡ 1-Click Instant VIP Login` ni bosgach) doimiy saqlanib qoladi.
      2. Dual Token Auth (Cookie + Authorization Bearer Header):
         - iOS Safari va Android brauzerlarida uchinchi tomon cookie-fayllari cheklangan holatda ham login holati uzilib qolmasligi uchun `access_token` `LocalStorage` da saqlanib, Axios Interceptor orqali har bir so'rovga `Authorization: Bearer <token>` sifatida biriktirildi.
*/
