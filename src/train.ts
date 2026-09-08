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
        - Brauzer xavfsizlik siyosati tufayli turli xil portlardagi (React `http://localhost:8080` va Node backend `http://localhost:3001`) so'rovlarning cookie va headerlar bilan to'siqsiz almashinishini ta'minlaydi.

  - Standard Registration & Authentication System (Dars 101):
      1. Clean Standard Login (`Login`):
         - `memberNick` va `memberPassword` bilan kirish.
         - Parol ko'rinishini boshqarish (`VisibilityToggle`).
         - `Enter` tugmasi bilan tezkor tasdiqlash.
      2. Clean Standard Registration (`Signup`):
         - `memberNick`, `memberPhone`, `memberPassword` va `confirmPassword`.
         - Validatsiyalar: Bo'sh maydonlar, minimal 4 belgili parol va parollar mosligi tekshiriladi.
         - Agar telefon yoki taxallus bazada oldin mavjud bo'lsa (`400 Duplicate Key`), tizim buni xushmuomala xabar bilan ko'rsatib, to'g'ridan-to'g'ri `Login` tabiga o'tish tugmasini chiqaradi.
*/
