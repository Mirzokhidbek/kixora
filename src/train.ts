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

  - Responsive UI/UX & Mobile-First Excellence (Dars 87):
      1. Layout & Viewport Fluidity:
         - Eski tor 1126px `#root` chegaralari olib tashlandi, butun ekran kengligida (*Full-Bleed*) silliq moslashuvchanlik ta'minlandi.
         - `index.html` ga zamonaviy Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Playfair Display`) ulandi.
      2. Mobile Ergonomics & Floating Cart Bar:
         - Mobil qurilmalarda foydalanuvchi taom tanlaganda ekranning pastki qismida silliq chiquvchi **Floating Cart Bar** (`Slide` animatsiyasi) qo'shildi.
         - Sensorli ekranlar uchun minimal 44px teginish hududi (*Touch targets*) va qulay barmoq ergonomikasi yaratildi.
      3. Luxury Typography & Theme Tokens:
         - MaterialTheme `responsiveFontSizes` orqali noutbuk, planshet va telefon ekranlarida sarlavhalar avtomatik mutanosib o'lchamga keladi.
*/
