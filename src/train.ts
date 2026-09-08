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

  - 100% Database-Driven Dynamic Menu Architecture (Dars 103):
      1. Zero Hardcoded Dummy Data:
         - Barcha frontend sahifalaridagi (`PopularDishes.tsx`, `NewDishes.tsx`, `Products.tsx`) qo'lda yozilgan `defaultDishes` va `defaultProducts` massivlari to'liq olib tashlandi.
      2. Pure Live Database Fetching:
         - Frontend faqat va faqat Admin panel (`http://localhost:3001/admin`) orqali MongoDB Atlas bazasiga kiritilgan haqiqiy taomlarni API orqali olib keladi va namoyish etadi.
*/
