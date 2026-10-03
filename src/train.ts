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

  - Full Page & Button Interactions Audit (Dars 83-85):
      1. `HomePage`: `Statistics`, `PopularDishes` ("Add to Cart" + navigate), `NewDishes` ("Add to Cart" + navigate), `Advertisement` ("Book VIP Show Table" WhatsApp + YouTube reel), `ActiveUsers`, `Events` ("Reserve Invitation").
      2. `ProductsPage`: Category tabs, search filter, sorting chips, favorite toggle heart, pagination, dynamic image preview, "Add to Cart" toast, portion size pricing calculator, and related recommendations.
      3. `OrdersPage`: `PausedOrders` ("Pay & Cook" & "Cancel Order"), `ProcessOrders` ("Confirm Delivery +10 Pts" & animated cooking bar), `FinishedOrders` ("Download E-Receipt").
      4. `UserPage`: `MemberInfo` (tier progress, order metrics), `MemberSettings` (live `MemberService.updateMember` form submission with feedback snackbars).
      5. `HelpPage`: FAQ accordions, concierge hotline, contact inquiry form submission with snackbars.
      6. `Navbar` & `Footer`: Live cart badge count, drawer toggle, user profile menu with logout, newsletter VIP subscription, legal & menu direct links.
*/
