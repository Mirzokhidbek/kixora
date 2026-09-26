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

  - SPA Order Architecture & Aggregation Lookup (Dars 70 & 71):
      1. Schemas & Models:
         - `Order.model.ts`: `orderTotal`, `orderDelivery`, `orderStatus` (PAUSE, PROCESS, FINISH, DELETE), `memberId`.
         - `OrderItem.model.ts`: `itemQuantity`, `itemPrice`, `orderId`, `productId`.
      2. `POST /order/create`:
         - `req.body`: `OrderItemInput[]`.
         - Mahsulotlar jami summasini va yetkazib berish narxini hisoblaydi, `Order` hujjatini va unga bog'langan barcha `OrderItem` larni yaratadi.
      3. `GET /order/all` (Advanced MongoDB Aggregation):
         - `$match`: `memberId` va `orderStatus` (PAUSE, PROCESS, FINISH).
         - `$sort`: `{ updatedAt: -1 }`.
         - `$skip` & `$limit`: Sahifalash.
         - `$lookup` (orderitems): `orderId` orqali buyurtmadagi elementlarni birlashtiradi.
         - `$lookup` (products): `productId` orqali taomlarning to'liq ma'lumotlarini (nomi, narxi, rasmlari) avtomatik yuklaydi.
      4. `POST /order/update`:
         - Buyurtma statusini o'zgartiradi (`PAUSE` -> `PROCESS` -> `FINISH`).
         - Agar `FINISH` bo'lsa, har $10 uchun foydalanuvchiga 1 ta sodiqlik balli (`memberPoints`) qo'shiladi.
*/
