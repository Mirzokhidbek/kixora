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

  - Frontend Configuration & API Services (Dars 75 & 76):
      1. Environmental Variables:
         - `.env`: `VITE_API_URL=http://localhost:3001`
         - `src/lib/config.ts`: `serverApi = import.meta.env.VITE_API_URL || "http://localhost:3001"`
      2. API Services Layer:
         - `ProductService`: `getProducts(inquiry)`, `getProduct(id)`.
         - `MemberService`: `getRestaurant()`, `getTopUsers()`, `getMemberDetail()`, `login()`, `signup()`, `logout()`, `updateMember(data)`.
         - `OrderService`: `createOrder(cartItems)`, `getMyOrders(inquiry)`, `updateOrder(input)`.

  - ProductsPage Type Integration & Redux Data-Flow (Dars 77 & 78):
      1. Type Integration:
         - `Product`, `ProductInquiry`, `ProductCollection`, `ProductSize`, `ProductStatus`.
         - `Member`, `MemberType`, `MemberStatus`.
         - `import type { Member }` qoidasi: Faqat tiplardan iborat fayllarni import qilishda runtime xatoliklarning oldini olish uchun `import type` sintaksisidan foydalaniladi.
      2. Redux Slice & Selectors:
         - `productsPageSlice`: `restaurant`, `chosenProduct`, `products`.
         - `ProductsPage/index.tsx`: `MemberService.getRestaurant()` orqali faol restoran ma'lumotlarini yuklaydi.
      3. `Products.tsx` Inquiry & Handlers:
         - `productsSearch` State: `page`, `limit`, `order`, `productCollection`, `search`.
         - Handlers: `searchHandler`, `collectionHandler`, `orderHandler`, `paginationHandler`, `chosenProductHandler`.

  - Basket Architecture & Custom Hook (Dars 80):
      1. `useBasket` Hook (`src/app/hooks/useBasket.ts`):
         - `cartItems` State: `localStorage.getItem("cart_items")` orqali saqlanadi va brauzer yangilanganda ham yo'qolmaydi.
         - `onAdd(product, quantity)`: Mahsulot mavjud bo'lsa `quantity` oshiriladi, bo'lmasa yangi element qo'shiladi.
         - `onRemove(item)`: Soni 1 taga kamaytiriladi, 1 bo'lsa savatdan o'chiriladi.
         - `onDelete(item)`: Bitta mahsulotni to'liq o'chirish.
         - `onDeleteAll()`: Savatni butunlay tozalash.
      2. `BasketDrawer.tsx`:
         - O'ng tomondan chiquvchi interaktiv panel: Har bir taom surati, soni hisoblagichi, yetkazib berish xizmati narxi va umumiy summa hisobi.
         - `Checkout`: Foydalanuvchi tizimga kirmagan bo'lsa `AuthModal` ni ochadi, kirgan bo'lsa `OrderService.createOrder` ni chaqirib buyurtmani rasmiylashtiradi.

  - Global State & Context Hook (Dars 82):
      1. `ContextProvider` (`src/app/context/ContextProvider.tsx`):
         - `GlobalContext`: `authMember`, `setAuthMember`, `orderBuilder`, `setOrderBuilder`.
         - `localStorage.setItem("member_data", ...)` orqali foydalanuvchi autentifikatsiya holatini doimiy ushlab turadi.
      2. `useGlobals()` Custom Hook:
         - Istalgan komponentdan turib `const { authMember, setAuthMember } = useGlobals();` orqali global foydalanuvchi ma'lumotlariga kirish va boshqarish imkoniyatini beradi.

  - UserPage Complete Sections & Business Logic (Dars 85):
      1. Profile Hero & Metrics (`MemberInfo.tsx`):
         - Avatar & jonli rasm yuklash kamerasi (`memberImage` multer uploader).
         - Foydalanuvchi niki, telefoni, manzili, bio ma'lumotlari.
         - VIP ochkolar progress shkalasi (`memberPoints`) va unvonlar (GOLD VIP / PLATINUM VIP / DIAMOND VIP).
         - 4 ta interaktiv statistika kartasi (Buyurtmalar soni, Burak ballari, Sevimlilar, Saqlangan manzillar).
      2. Settings, Addresses & Preferences (`MemberSettings.tsx`):
         - Tab 1: **Personal Profile** (Shaxsiy ma'lumotlarni tahrirlash va `MemberService.updateMember` orqali saqlash).
         - Tab 2: **Saved Addresses** (Yetkazib berish manzillari, asosiy belgilash va yangi manzil qo'shish modali).
         - Tab 3: **Dining Preferences** (Achchiqlik darajasi, stol joylashuvi tanlovi).
         - Tab 4: **Security & Password** (Parolni yangilash va seans xavfsizligi).
*/
