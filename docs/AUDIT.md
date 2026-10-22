# KIXORA — Kod auditi va tuzatishlar hisoboti

**Sana:** 2026-10-22
**Qamrov:** backend (`src/`, Express + MongoDB + EJS admin panel) va frontend (`kixora-client/`, React + Vite)
**Natija:** 8 ta kritik xavfsizlik teshigi va 40 dan ortiq kod, struktura va arxitektura muammosi topildi. Kod ichida hal qilsa bo'ladiganlari tuzatildi. Infratuzilma talab qiladiganlari (Redis, obyekt saqlash, CI) pastda tavsiya sifatida yozilgan.

Holat belgilari:
- ✅ tuzatildi
- ⚠️ qisman tuzatildi yoki ongli kelishuv (sababi yozilgan)
- 📋 tavsiya: kod ichida hal bo'lmaydi, infratuzilma yoki mahsulot qarori kerak

---

## 1. Kritik xavfsizlik muammolari

| ID | Muammo | Qayerda edi | Xavf | Yechim | Holat |
|---|---|---|---|---|---|
| S-1 | **Google login tekshirilmasdi.** Server klient yuborgan `userData.email` ga to'g'ridan-to'g'ri ishonardi. Token tekshiruvi yiqilsa, imzosi tekshirilmagan JWT o'qilardi. | `member.controller.ts` (googleLogin), `AuthModal.tsx` | Istalgan email bilan istalgan akkauntga kirish (akkauntni egallab olish) | Server endi faqat `credential` (ID token) qabul qiladi va uning **imzosini** tekshiradi: Firebase ID token Google'ning `securetoken` sertifikatlari bilan (`issuer`/`audience` = Firebase loyiha ID), Google Identity token esa `GOOGLE_CLIENT_ID` bilan. `email_verified` talab qilinadi. Klient `user.getIdToken()` yuboradi. → `Auth.service.ts: verifyGoogleCredential` | ✅ |
| S-2 | **JWT kaliti kodda yozilgan edi.** Kod `SECRET_TOKEN` ni o'qirdi, `.env` da esa `JWT_SECRET` bor. Natijada amalda `"BURAK_AUTH_SECRET_KEY_2026"` ishlatilardi. | `Auth.service.ts` | Kodni ko'rgan har kim istalgan foydalanuvchi nomidan token yasay olardi | Barcha env bitta joyda: `libs/config.ts → env`. `JWT_SECRET` (zaxira: `SECRET_TOKEN`) va `SESSION_SECRET` majburiy: production'da bo'lmasa server ishga tushmaydi, development'da tasodifiy kalit olinadi. Kodda yozilgan kalit qolmadi. | ✅ |
| S-3 | **Narxni klient yuborardi.** Buyurtma summasi so'rovdagi `itemPrice` dan hisoblanardi. | `Order.service.ts: createOrder` | Har qanday mahsulotni $0 ga sotib olish | Narx har doim bazadagi `productPrice` dan olinadi. Klientdan narx qabul qilinmaydi (validatsiya sxemasida bu maydon yo'q). Hisob-kitob `libs/orderRules.ts: calculateTotals` da. | ✅ |
| S-4 | **Mass assignment.** `/member/update` va signup butun `req.body` ni bazaga yozardi. | `Member.service.ts` | Foydalanuvchi o'ziga `memberType: "RESTAURANT"` qo'yib **admin bo'lib olardi**, yoki `memberPoints`/`memberStatus` ni o'zgartirardi | Har bir endpoint uchun zod **whitelist** sxemasi (`libs/validation.ts`). Noma'lum maydonlar tashlab yuboriladi. `memberType`, `memberStatus` va `memberPoints` server tomonida qo'yiladi. Admin ham faqat foydalanuvchi statusini o'zgartira oladi. | ✅ |
| S-5 | **Buyurtma statusi tekshirilmasdi.** Foydalanuvchi to'lovsiz `FINISH` qila olardi, va har `FINISH` da qayta ball berilardi. | `Order.service.ts: updateOrder` | Cheksiz loyalty ball yig'ish, to'lovni chetlab o'tish | Atomik holat mashinasi (`orderRules.ts`). Foydalanuvchi: `PAUSE→PROCESS`, `PAUSE→DELETE`, `PROCESS→FINISH`. Admin qo'shimcha ravishda `PROCESS→DELETE` qila oladi. Yangilash faqat joriy status ruxsat etilgan bo'lsa ishlaydi (`findOneAndUpdate` filtri), shuning uchun ball **bir marta** beriladi. | ✅ |
| S-6 | **CORS hamma saytlarga ruxsat berardi** (`else` shoxi ham `callback(null, true)`). Bunga `credentials: true` qo'shilgan edi. | `app.ts` | Istalgan sayt foydalanuvchi nomidan API'ga so'rov yubora olardi | Faqat `ALLOWED_ORIGINS` dagi manzillar. Development'da standart localhost portlari ruxsat etiladi, production'da ro'yxat bo'sh bo'lsa hech qaysi tashqi manzil ruxsat olmaydi. | ✅ |
| S-7 | **Fayl yuklashda filtr yo'q edi.** Fayl turi va hajmi cheklanmagan, kengaytma klient fayl nomidan olinardi. | `libs/uploader.ts` | `.html` yoki `.svg` yuklab stored XSS qilish, diskni to'ldirish | Faqat JPEG/PNG/WEBP/GIF qabul qilinadi (SVG yo'q). Kengaytma tekshirilgan MIME turidan olinadi. Hajm 5 MB gacha, 5 ta faylgacha. Fayl nomi `crypto.randomBytes` bilan yaratiladi. | ✅ |
| S-8 | **Regex injection (ReDoS) va cheklanmagan so'rovlar.** Qidiruv matni `new RegExp` ga to'g'ridan-to'g'ri berilardi, `limit` va `order` cheklanmagan edi. | `Product.service.ts` | Bitta so'rov bilan DB'ni qotirish, butun katalogni tortib olish | `escapeRegex()`. `limit` 1..50, `order` faqat `createdAt`, `productViews` yoki `productPrice`. AI qidiruvdagi kalit so'zlar ham escape qilinadi. | ✅ |
| S-9 | **JWT `localStorage` da ham saqlanadi.** Bu httpOnly cookie himoyasini kuchsizlantiradi. | klient `MemberService.ts` | XSS bo'lsa token o'g'irlanishi mumkin | Takroriy axios interceptor olib tashlandi. **Kelishuv:** klient (Vercel) va API (Railway) turli saytlarda, Safari va boshqa brauzerlar esa uchinchi tomon cookie'larini bloklaydi. Shu sababli Bearer token zaxira sifatida qoldirildi. To'liq yechim pastda (D-6). | ⚠️ |
| S-10 | **Admin dashboard (`GET /admin`) login'siz ochiq edi.** | `routerAdmin.ts` | Daromad, buyurtma va mijozlar statistikasi hammaga ko'rinardi | `verifyAdmin` middleware qo'shildi. | ✅ |
| S-11 | **Admin session: fixation, CSRF va ortiqcha sessiyalar.** | `app.ts`, admin login | Session fixation, saytlararo forma yuborish, har bir anonim so'rov uchun DB'da session | Login'da `session.regenerate()` chaqiriladi. Admin cookie'si `sameSite: "lax"` (admin panel o'sha saytda, shuning uchun saytlararo POST'lar bloklanadi). `saveUninitialized: false`, `resave: false`. Session faqat `/admin` yo'lida yaratiladi. | ✅ |
| S-12 | **Xatolar `<script>alert("${message}")` ichiga ekranlashsiz qo'yilardi.** | admin controller'lar | Reflected XSS | `libs/adminResponse.ts: sendAdminAlert`: matn `JSON.stringify` qilinadi va `<` ekranlanadi. | ✅ |
| S-13 | **`cookies.txt` (session cookie) git'ga commit qilingan edi.** | repo ildizi | Maxfiy ma'lumot sizib chiqishi | Fayl o'chirildi va `.gitignore` ga qo'shildi. Git tarixida hali bor (pastdagi "Deploy" bo'limiga qarang). | ⚠️ |
| S-14 | **Parol hash'i javobda qaytardi.** Google orqali yangi foydalanuvchi yaratilganda hash qaytarilardi, Google akkauntlarining paroli esa `googleId` ning hash'i edi. | `Member.service.ts` | Hash sizib chiqishi; `googleId` ni bilgan odam parol bilan kira olardi | Barcha javoblarda `stripPassword()`. Google akkauntlari uchun parol tasodifiy 32 bayt. | ✅ |
| S-15 | **Login akkaunt mavjudligini oshkor qilardi** ("No member with that nickname" va "Password is incorrect" farqli edi). | `Member.service.ts` | Mavjud akkauntlarni aniqlash | Ikkala holatda ham bir xil xabar: "Incorrect login or password". Admin login faqat `RESTAURANT` akkauntlarini qabul qiladi. | ✅ |
| S-16 | **Gemini API kaliti URL'da yuborilardi** (log'larga tushadi). | `libs/aiSearch.ts` | Kalit sizib chiqishi | Kalit endi `x-goog-api-key` header'ida. | ✅ |
| S-17 | **Admin logini va xatolarida so'rov tanasi/session log'ga yozilardi** (`console.log(req.body)`). | controller'lar | Shaxsiy ma'lumot log'larda qolishi | Bunday loglar olib tashlandi. Kutilmagan xatolar faqat markaziy handler'da log qilinadi. | ✅ |

## 2. Kod sifati

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| C-1 | 30 dan ortiq bir xil `try/catch` bloki copy-paste qilingan edi. | Express 5 async xatolarni o'zi uzatadi. Markaziy `middlewares/errorHandler.ts` (Errors, Multer va JSON parse xatolari, kutilmaganlari uchun 500) va `notFound` qo'shildi. Controller'lar endi faqat `throw` qiladi. | ✅ |
| C-2 | Kiruvchi ma'lumot tekshirilmasdi, `T = any` turi hamma joyda edi. | `zod` sxemalari (`libs/validation.ts`) va `parse()` yordamchisi (noto'g'ri input → 400). Controller'larda `T` ishlatilmaydi. | ✅ |
| C-3 | Noto'g'ri ObjectId (`/product/abc`) 500 xatosi berardi. | `shapeIntoMongooseObjectId` endi noto'g'ri id uchun 400 qaytaradi. | ✅ |
| C-4 | Kod `node-fetch` ni import qilardi, lekin u `package.json` da yo'q edi (v3 esa faqat ESM). Ishlatilmaydigan `mongodb@3` ham bor edi. | Node'ning o'rnatilgan `fetch` i ishlatiladi. `mongodb` olib tashlandi. `engines.node >= 20`. | ✅ |
| C-5 | Restoran shablonidan qolgan nomlar: `restaurantController`, `PopularDishes`, `NewDishes`, "Burak Restaurant" va `Statistics`/`Events` (taomlar haqida). | `admin.controller.ts`, `PopularPicks.tsx`, `NewArrivals.tsx` va Redux nomlari almashtirildi. Footer matni tuzatildi. Ishlatilmaydigan komponentlar o'chirildi: `Statistics`, `Events`, `Advertisement`, `ActiveUsers`, `NavbarHome`, `NavbarOther`. | ✅ |
| C-6 | Haqiqiy mahsulotlarga **soxta chegirma, eski narx va reyting** qo'shib ko'rsatilardi. Katalog bo'sh bo'lsa, namuna kartalarni (`_id: "sample_0"`) savatga qo'shish mumkin edi. | Haqiqiy mahsulotlar faqat haqiqiy ma'lumot bilan ko'rsatiladi. Namuna kartalar faqat katalog bo'sh bo'lganda chiqadi, `isSample` bilan belgilanadi va "Add to Cart" ularni `/products` ga yo'naltiradi. Backend ham bunday id'ni rad etadi. | ✅ |
| C-7 | Javob formatlari bir xil emas edi. | Xatolar endi bir xil `{ code, message }` (`Errors.toJSON`). Muvaffaqiyatli javoblar formati klient bilan moslik uchun o'zgartirilmadi. | ⚠️ |
| C-8 | Testlar yo'q edi. | `npm test` (Node'ning o'rnatilgan test runner'i va ts-node): buyurtma qoidalari va validatsiya bo'yicha 13 ta unit test. Bundan tashqari 29 ta tekshiruvli E2E stsenariy alohida bazada qo'lda ishga tushirildi (repoga qo'shilmagan, 4-bo'limga qarang). | ✅ |
| C-9 | Lint ogohlantirishlari (ishlatilmaydigan import'lar). | Tozalandi. `oxlint` 0 ta xato. | ✅ |
| C-10 | Parol talabi juda zaif edi (klientda 4 belgi, serverda umuman yo'q). | Foydalanuvchi uchun kamida 6 belgi, admin uchun 8 belgi (server, klient va EJS forma). | ✅ |

## 3. Struktura va arxitektura

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| A-1 | `models/` ichida servislar, `schema/` ichida modellar turardi. | `services/` (biznes mantiq), `models/` (mongoose sxemalari), `middlewares/` (auth va xatolar). Tartib: `router → controller → service → model`. | ✅ |
| A-2 | Auth middleware controller ichida edi, admin va foydalanuvchi auth'i aralashgan edi. | `middlewares/auth.ts`: `verifyAuth`, `retrieveAuth` (SPA, JWT) va `verifyAdmin` (EJS, session). JWT ichida faqat `{_id, memberType, memberNick}` saqlanadi (`AuthPayload`), profil har doim DB'dan o'qiladi. | ✅ |
| A-3 | Static fayllar 5 joydan, uploads 5 joydan, views 4 joydan berilardi. | Bitta static manba, `/uploads` (asosiy va eski joylashuv), 2 ta views yo'li. | ✅ |
| A-4 | Takroriy yo'llar: `/signup` va `/member/signup`, `/login`, `/google-login`. Admin'da bir xil ishni qiladigan ikkita handler bor edi. | Ortiqcha yo'llar olib tashlandi (klient ularni ishlatmasdi). Admin mahsulot yangilash bitta validatsiyali handler'ga birlashtirildi. | ✅ |
| A-5 | `process.env` kod bo'ylab tarqalgan edi. MongoDB `MONGO_URL` ni kutardi, `.env` da esa `MONGO_DEV` bor edi. | `env` obyekti: `MONGO_URL`, zaxira sifatida `MONGO_DEV`. `.env.example` qo'shildi. | ✅ |
| A-6 | `dotenv.config()` boshqa import'lardan keyin chaqirilardi. | `import "dotenv/config"` birinchi qatorda. | ✅ |
| A-7 | `uncaughtException` dan keyin jarayon "tirik" qolardi (holati noma'lum). Graceful shutdown yo'q edi. | `uncaughtException` bo'lsa log yoziladi va jarayon to'xtaydi (PM2 yoki Railway uni qayta ishga tushiradi). SIGTERM/SIGINT da so'rovlar yakunlanadi va DB yopiladi. Production'da DB ulanmasa server to'xtaydi. | ✅ |
| A-8 | Health check DB holatini ko'rsatmasdi. | `GET /`: DB ulanmagan bo'lsa `503 degraded` qaytaradi. | ✅ |
| A-9 | `dist/` da eski fayllar qolib ketardi (`router-admin.js`). | `npm run build` avval `dist` ni tozalaydi. `npm run typecheck` skripti qo'shildi. | ✅ |
| A-10 | Admin panel va REST API bitta jarayonda. | Router, middleware va session darajasida ajratildi (session faqat `/admin` da). Alohida servisga ajratish hozirgi hajmda shart emas. | ⚠️ |
| A-11 | Klientda state uch joyda boshqariladi: Redux, Context va localStorage hook'lari. | Takroriy interceptor olib tashlandi. State'ni bitta joyga yig'ish katta refaktor, shuning uchun D-7 ga qarang. | 📋 |
| A-12 | Klient komponentlari juda katta (`AuthModal` 948, `AISearchDialog` 730, `CheckoutModal` 617 qator). | Testsiz bo'lib chiqish UI'ni buzish xavfini tug'diradi. Tavsiya: D-7. | 📋 |

## 4. System design va ma'lumotlar yaxlitligi

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| D-1 | **Ombor qoldig'i kamaytirilmasdi** (overselling). `Order` va `OrderItem` tranzaksiyasiz yaratilardi, yarim buyurtma qolishi mumkin edi. | Har bir mahsulot uchun shartli atomik `$inc` (`productLeftCount >= qty`). Biror qadam yiqilsa, kompensatsiya: qoldiq qaytariladi, buyurtma va uning qatorlari o'chiriladi. Bekor qilishda (`DELETE`) qoldiq qaytariladi. Takroriy qatorlar birlashtiriladi. Bu yondashuv replica set talab qilmaydi (lokal MongoDB'da ham ishlaydi). | ✅ |
| D-2 | **Dashboard butun jadvallarni xotiraga yuklardi**, oylik grafik esa yilni hisobga olmasdi. | MongoDB aggregation (`$group`, `$facet`, `countDocuments`). Oylar yil bilan birga hisoblanadi. Bekor qilingan buyurtmalar daromadga kirmaydi. | ✅ |
| D-3 | **PM2 cluster rejimida rate limit ishlamasdi.** `instances: "max"` bilan xotiradagi limit har bir jarayonda alohida bo'lardi. | `instances: 1` (fork). Gorizontal kengayish uchun Redis store kerak (`rate-limit-redis`). | ⚠️ / 📋 |
| D-4 | **Admin ro'yxatlari sahifalanmasdi.** | Users, orders va products uchun 25 tadan sahifalash, umumiy son va "Previous/Next" tugmalari (`includes/pagination.ejs`). | ✅ |
| D-5 | **AI qidiruv:** timeout yo'q edi, 4 ta modelni ketma-ket sinardi, kesh yo'q edi, alohida limit yo'q edi. Model javobi tekshirilmasdi. | Har bir chaqiruvga 8 soniya timeout, 2 ta model, 10 daqiqalik kesh (500 yozuvgacha), alohida `aiSearchLimiter` (production'da daqiqasiga 10 ta). Model javobi `normalizeIntent` bilan tekshiriladi. Prompt-injection'ga qarshi ko'rsatma qo'shildi. `systemInstruction` va `responseMimeType: application/json` ishlatiladi. | ✅ |
| D-6 | Klient va API turli saytlarda, shuning uchun cookie auth uchinchi tomon cookie bloklanishiga duch keladi (S-9 sababi). | 📋 API'ni klient bilan bir saytga ko'chirish (masalan `api.kixora.uz` va `kixora.uz`) yoki Vercel rewrite orqali bir manzilga keltirish. Shundan keyin `accessToken` ni javob tanasidan va `localStorage` dan olib tashlash mumkin. | 📋 |
| D-7 | Klient arxitekturasi. | 📋 Avval Playwright yoki RTL bilan smoke testlar yozish, keyin katta komponentlarni bo'lish va state'ni Redux Toolkit (RTK Query) atrofida birlashtirish. | 📋 |
| D-8 | Yuklangan rasmlar lokal diskda saqlanadi. Konteyner yoki cluster'da yo'qoladi. | 📋 S3, Cloudinary yoki Firebase Storage (Firebase allaqachon ulangan) ga o'tish. | 📋 |
| D-9 | To'lov tizimi yo'q. `PAUSE→PROCESS` ("to'lash") hozir faqat status o'zgarishi. Checkout oynasidagi karta maydonlari faqat bezak. | 📋 To'lov provayderi (Payme, Click yoki Stripe) bilan server tomonidagi webhook: `PROCESS` statusini faqat to'lov tasdiqlanganda qo'yish. | 📋 |
| D-10 | Bloklangan foydalanuvchining JWT'si 24 soat amal qiladi. | Login bloklangan. Ochiq qolgan sessiyalar uchun 📋: qisqa muddatli access token va refresh token, yoki `verifyAuth` da status keshini tekshirish. | ⚠️ |
| D-11 | Kuzatuv vositalari yo'q (strukturalangan log, metrika, Sentry). | 📋 `pino` logger va Sentry. Health check endi DB holatini ko'rsatadi. | 📋 |
| D-12 | CI/CD yo'q. | 📋 GitHub Actions: `npm run typecheck`, `npm test`, `cd kixora-client && npm run build && npx oxlint src`. | 📋 |
| D-13 | `memberNick` maydonida unique index yo'q. | Admin login endi `memberType: RESTAURANT` bo'yicha ham filtrlaydi, shuning uchun to'qnashuv xavfi yo'q. Index qo'shishdan oldin mavjud ma'lumotlarda takrorlar bor-yo'qligini tekshirish kerak. | 📋 |
| D-14 | `mongoose@6` eski versiya (`strictQuery` ogohlantirishi). | 📋 `mongoose@8` ga yangilash. Bu alohida ish, chunki breaking change'lar bor. | 📋 |

---

## 5. Qanday tekshirildi

| Tekshiruv | Natija |
|---|---|
| `npx tsc --noEmit` (backend) | ✅ xatosiz |
| `npm test`: 13 ta unit test (`test/orderRules.test.ts`, `test/validation.test.ts`) | ✅ 13/13 |
| Klient: `tsc -b`, `oxlint`, `vite build` | ✅ xatosiz |
| `npm run build` va `node dist/server.js` | ✅ ishlaydi |
| Production'da `JWT_SECRET` bo'lmasa | ✅ server "Missing required environment variable" bilan to'xtaydi |
| Haqiqiy server bilan E2E (alohida, vaqtinchalik `kixora_e2e_*` bazasi, keyin o'chirildi) | ✅ 29/29 |
| Brauzer: admin login, katalog, dashboard; SPA bosh sahifasi | ✅ |

E2E stsenariylari: admin ro'yxatdan o'tishi va ikkinchi adminning bloklanishi; HTML fayl yuklashning rad etilishi; mahsulot yaratish va rasmning to'g'ri `Content-Type` bilan berilishi; signup va profil yangilashda `memberType` va `memberPoints` e'tiborga olinmasligi; JWT bilan admin panelga kirib bo'lmasligi; `itemPrice: 0` bo'lsa ham summa bazadagi narxdan hisoblanishi (2×40+5=85); ombor 3→1 ga kamayishi; overselling rad etilishi; `sample_0` id rad etilishi; `PAUSE→FINISH` rad etilishi; ball faqat bir marta berilishi (50+9=59); bekor qilganda ombor qaytishi; admin sahifalari ochilishi; admin faqat statusni o'zgartira olishi; bloklangan foydalanuvchi kira olmasligi; session'siz admin AJAX so'roviga 401 JSON qaytishi; login'da yangi session id berilishi.

Bundan tashqari HTTP orqali tekshirilgan hujumlar: eski kodda yozilgan kalit bilan soxtalashtirilgan JWT → 401; imzosiz Google token → 401; faqat `userData` yuborish → 400; begona `Origin` → CORS sarlavhasi qaytmaydi; `limit=1000` → 400; `order=memberPassword` → 400.

---

## 6. Deploy qilishdan oldin MAJBURIY qadamlar

1. **Production env (Railway):**
   - `JWT_SECRET` va `SESSION_SECRET`: uzun tasodifiy qiymatlar (`openssl rand -hex 32`). **Bo'lmasa server ishga tushmaydi.**
   - `ALLOWED_ORIGINS`: klient manzili, masalan `https://kixora.vercel.app`. **Bo'lmasa SPA API'ga murojaat qila olmaydi.**
   - `MONGO_URL` (avvalgidek), `FIREBASE_PROJECT_ID=kixora-99964`, ixtiyoriy `GEMINI_API_KEY`.
2. **Barcha foydalanuvchilar bir marta tizimdan chiqadi.** JWT kaliti almashgani uchun eski tokenlar yaroqsiz bo'ladi. Bu kutilgan holat, chunki eski kalit oshkor bo'lgan edi.
3. **Maxfiy kalitlarni almashtiring:** `SESSION_SECRET`, MongoDB paroli va `GEMINI_API_KEY`. Ular repo tarixida yoki jamoa kompyuterlarida qolgan bo'lishi mumkin. Git tarixidagi `cookies.txt` uchun eng oddiy yechim: session cookie'lar 6 soatda o'z-o'zidan eskiradi, `SESSION_SECRET` almashtirilsa esa darhol yaroqsiz bo'ladi.
4. Klient yangi versiyasini (Google login o'zgargan) backend bilan **bir vaqtda** deploy qiling.
5. Yangi Google login Firebase loyihasi `kixora-99964` ga bog'langan. Loyiha boshqa bo'lsa, `FIREBASE_PROJECT_ID` ni moslang.

## 7. O'zgargan va yangi fayllar (qisqacha)

- **Yangi:** `src/libs/validation.ts`, `src/libs/orderRules.ts`, `src/libs/adminResponse.ts`, `src/middlewares/auth.ts`, `src/middlewares/errorHandler.ts`, `src/views/includes/pagination.ejs`, `test/*.test.ts`, `.env.example`, `docs/AUDIT.md`
- **Ko'chirilgan:** `src/models/*.service.ts` → `src/services/`, `src/schema/*.model.ts` → `src/models/`, `restaurant.controller.ts` → `admin.controller.ts`, `PopularDishes.tsx` → `PopularPicks.tsx`, `NewDishes.tsx` → `NewArrivals.tsx`
- **O'chirilgan:** `cookies.txt`, `src/schema/`, ishlatilmaydigan 6 ta klient komponenti
- **Qayta yozilgan:** `app.ts`, `server.ts`, `router.ts`, `routerAdmin.ts`, barcha controller'lar va servislar, `libs/config.ts`, `libs/uploader.ts`, `libs/aiSearch.ts`
