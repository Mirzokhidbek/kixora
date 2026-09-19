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

  - React & Single Page Application (SPA):
      1. Virtual DOM & Reconciliation (Diffing algorithm)
      2. Material UI (MUI): `ThemeProvider`, `createTheme`, Custom palette & typography.
      3. React Router DOM: `<BrowserRouter>`, `<Routes>`, `<Route>`, `<NavLink>`, `useNavigate`, `useLocation`.
      4. Header & Navbar Architecture:
         - Unified Luxury Charcoal Black navbar across all pages.
         - Glassmorphic Pill capsule menu, Cart badge, and User Avatar capsule.
      5. HomePage Sectional Architecture (Dars 61 & 62):
         - `Statistics.tsx`: 12+ yillik tajriba, 150+ taomlar, 250K+ mijozlar va sertifikatlar.
         - `PopularDishes.tsx`: Eng ko'p buyurtma qilinuvchi imzoli steyklar va kaboblar.
         - `NewDishes.tsx`: Qishki mavsumning yangi shirinliklari va ichimliklari.
         - `Advertisement.tsx`: CZN Burak jonli olovli shou va VIP stol band qilish banneri.
         - `ActiveUsers.tsx`: VIP foodie hamjamiyatining samimiy sharhlari va baholari.
      6. ProductsPage Nested Routing & Architecture (Dars 63 & 64):
         - Nested Route: `<Route path="/" element={<Products />} />` & `<Route path="/:productId" element={<ChosenProduct />} />`.
         - `Products.tsx`: Toifalar bo'yicha filter, qidiruv va savatga qo'shish.
         - `ChosenProduct.tsx`: Tanlangan taomning ko'p burchakli fotogalereyasi, porsiya va pishirish darajasi tanlovi, soni hisoblagichi va savatga joylash.
*/
