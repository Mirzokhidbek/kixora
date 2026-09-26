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

  - SPA Restaurant & Lean Query Architecture (Dars 67):
      1. `GET /member/restaurant`:
         - Faol restoran ma'lumotlarini qaytaradi.
         - `.lean()`: Mongoose Document o'rniga yengil va tezkor sof JavaScript obyekti (POJO) qaytarib, o'qish tezligini 3-5 baravar oshiradi.

  - MongoDB Aggregation & Products Pipeline (Dars 68):
      1. `GET /product/all` (URL Query vs Params):
         - `req.query`: `page`, `limit`, `order`, `productCollection`, `search`.
         - Aggregation Pipeline:
           - `$match`: `productStatus: PROCESS`, ixtiyoriy `productCollection` va `productName` regex search.
           - `$sort`: `createdAt: -1` yoki `productPrice: 1` yoki `productViews: -1`.
           - `$skip`: `(page - 1) * limit`.
           - `$limit`: `limit`.

  - Product Details & View Tracking System (Dars 69):
      1. `GET /product/:id` (`req.params.id`):
         - `View` Schema (`viewGroup`, `memberId`, `viewRefId`).
         - `ViewService.checkViewExistence`: Autentifikatsiyadan o'tgan foydalanuvchi ushbu mahsulotni oldin ko'rganligini tekshiradi.
         - Agar ko'rmagan bo'lsa: `ViewService.insertMemberView` orqali yangi View yozuvi kiritiladi va mahsulotning `productViews` ko'rsatkichi `$inc: { productViews: 1 }` orqali 1 taga oshiriladi.
*/
