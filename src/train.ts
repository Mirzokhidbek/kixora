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

  - Universal Authentication & Foolproof Onboarding (Dars 97):
      1. Universal Access:
         - Har bir yangi yoki mavjud foydalanuvchi hech qanday to'siqsiz tizimga kira oladi:
           a) **⚡ 1-Click Instant VIP Login** (hech qanday parolsiz 1 bosishda yangi VIP profil ochib kirish).
           b) **SIGN IN / SIGN UP** (mavjud hisob bilan kirish yoki yangi Nickname ochish).
           c) **Google Sign-In** (Google Cloud Client ID ulanganda avtomatik sinxronizatsiya).
      2. Intelligent Collision Handling:
         - Agar foydalanuvchi oldin ro'yxatdan o'tgan Nicknameni qayta kiritib yuborsa, tizim avtomatik tarzda `SIGN IN` tabiga yo'naltiradi va Nicknameni to'ldirib beradi.
*/
