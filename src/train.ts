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

  - Google OAuth 2.0 Integration (Dars 95):
      1. One-Click Google Authentication:
         - Frontend: `@react-oauth/google` kutubxonasi yordamida `AuthModal` da **Continue with Google** tugmasi joylashtirildi.
         - Backend: `google-auth-library` orqali Google ID Token tekshiriladi (`verifyIdToken`).
      2. Automated Member Provisioning:
         - Agar foydalanuvchi birinchi marta Google orqali kirsa, avtomatik tarzda `memberNick` (Google ismi), `memberEmail`, `memberImage` (Google rasmi) va `googleId` bilan yangi VIP Member yaratilib, 100 ballik xush kelibsiz bonusi taqdim etiladi.
         - Agar foydalanuvchi oldin kirgan bo'lsa, uni to'g'ridan-to'g'ri tizimga kiritib, `accessToken` cookie taqdim etiladi.
*/
