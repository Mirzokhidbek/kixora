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

---

## 8. Like va izoh (review) tizimi — 2-bosqich

### Topilgan muammolar

| ID | Muammo | Qayerda edi | Ta'siri |
|---|---|---|---|
| E-1 | Backend'da like, comment yoki review uchun model ham, API ham yo'q edi | `src/models/` | Admin qaysi mahsulot yoqib qolganini ham, mijozlar fikrini ham ko'ra olmasdi |
| E-2 | Admin panelda like ko'rsatkichi va izohlarni moderatsiya qilish imkoniyati yo'q edi | `src/views/` | Spam yoki haqoratli izohni boshqarib bo'lmasdi |
| E-3 | Like (wishlist) faqat brauzerning `localStorage` ida saqlanardi | `useWishlist.ts` | Akkauntga bog'lanmagan edi, qurilmalar o'rtasida sinxronlanmasdi, bitta brauzerdagi turli foydalanuvchilar ro'yxatni bo'lishardi |
| E-4 | Wishlist'da mahsulotning eski nusxasi saqlanardi | `useWishlist.ts` | Narx o'zgarsa ham eski narx ko'rinardi, o'chirilgan mahsulotlar ro'yxatda qolardi |
| E-5 | Har bir komponent `useWishlist()` ning alohida nusxasidan foydalanardi | Navbar, Products, ChosenProduct | Navbar'dagi hisoblagich yangilanmasdi, "Clear" bosilganda boshqa komponent eski ro'yxatni qayta yozib qo'yardi |
| E-6 | Bosh sahifadagi yurakchalar oddiy `useState` edi | `PopularPicks.tsx`, `NewArrivals.tsx` | Like sahifa yangilanganda yo'qolardi |
| E-7 | **Soxta reytinglar:** "4.8 (128 reviews)", "4.8 (1.2k)", "4.9 (840)" | `ChosenProduct.tsx`, `Products.tsx`, `NewArrivals.tsx` | Xaridorni chalg'itadi (iste'molchi huquqlari xavfi) |
| E-8 | "In Stock" yozuvi doimiy edi | `ChosenProduct.tsx` | Qoldiq 0 bo'lsa ham "In Stock" ko'rinardi |
| E-9 | **`setAuthMember` har render'da qayta yaratilardi**, `App.tsx` dagi effekt esa unga bog'langan edi | `ContextProvider.tsx` | Login qilgan foydalanuvchi uchun `/member/detail` ga cheksiz so'rovlar ketardi (brauzerda o'lchandi: 8 soniyada 102 ta so'rov) |

### Yechim

**Backend**
- **Modellar:**
  - `ProductLike`: `{memberId, productId}`, unique index.
  - `ProductReview`: `{memberId, productId, reviewRating 1–5, reviewComment ≤1000, reviewStatus VISIBLE|HIDDEN, adminReply}`, har bir (foydalanuvchi, mahsulot) juftligi uchun bitta izoh.
  - `Product` ga hisoblagichlar qo'shildi: `productLikes`, `ratingAvg`, `reviewCount`.
- **Like:** idempotent. Unique index va `upsert` tufayli takroriy yoki parallel bosishlar bir marta hisoblanadi. Hisoblagich faqat yangi qator yaratilganda yoki rostdan o'chirilganda o'zgaradi. Liked ro'yxati mahsulotning **joriy** ma'lumotini qaytaradi.
- **Review:** faqat **tasdiqlangan xaridor**, ya'ni mahsulot bo'lgan buyurtmasi `FINISH` statusida bo'lgan foydalanuvchi yoza oladi. `reviewStatus` va `adminReply` maydonlarini klient o'rnata olmaydi (whitelist). Har o'zgarishdan keyin (saqlash, o'chirish, yashirish) reyting faqat `VISIBLE` izohlar bo'yicha qayta hisoblanadi. Muallif yashirilgan izohini o'zi ko'radi, tahrir qilsa ham izoh yashirin qoladi.
- **API:**
  - `GET /product/liked`
  - `POST /product/liked/sync` (mehmon ro'yxatini akkauntga birlashtirish)
  - `POST|DELETE /product/:id/like`
  - `GET /product/:id/reviews` (sahifalash va yulduzlar taqsimoti bilan)
  - `GET|PUT|DELETE /product/:id/reviews/me`
  - `GET /product/:id` endi login qilgan foydalanuvchi uchun `meLiked` qaytaradi.
  - Saralashga `productLikes` va `ratingAvg` qo'shildi.
- **Himoya:**
  - Alohida `engagementLimiter` (production'da daqiqasiga 30 ta so'rov).
  - Matndan boshqaruv belgilari olib tashlanadi.
  - Izoh matni React va EJS'da ekranlangan holda chiqadi (stored XSS'ga E2E testi bor).

**Admin panel**
- **Yangi "Reviews" sahifasi** (`/admin/review/all`):
  - VISIBLE/HIDDEN filtrlari va sonlari, sahifalash;
  - Hide/Show, ochiq javob yozish (Reply) va o'chirish.
- **Katalog:** "Likes" va "Rating" ustunlari qo'shildi.

**Klient**
- **Bitta umumiy wishlist store** (`useSyncExternalStore`):
  - Login qilganda server asosiy manba bo'ladi, mehmon ro'yxati akkauntga birlashtiriladi.
  - Logout qilganda ro'yxat tozalanadi.
  - Like bosish optimistik: server rad etsa, o'zgarish qaytariladi.
- **Bosh sahifadagi yurakchalar** umumiy wishlist'ga ulandi.
- **Soxta reytinglar o'rniga haqiqiy `ratingAvg` va `reviewCount`.** Izoh bo'lmasa "No reviews yet" yoziladi.
- **Stok holati** haqiqiy qoldiqdan olinadi.
- **Mahsulot sahifasida "Reviews" tabi:**
  - umumiy reyting va yulduzlar taqsimoti;
  - o'z izohini yozish, tahrirlash yoki o'chirish;
  - "Verified buyer" belgisi va do'kon javobi.
- **`setAuthMember` `useCallback` bilan barqaror qilindi** (E-9).

### Tekshiruv

| Tekshiruv | Natija |
|---|---|
| Unit testlar (`test/engagement.test.ts` + avvalgilar) | ✅ 18/18 |
| Asosiy E2E (regressiya) | ✅ 29/29 |
| Like va review E2E: idempotent like, joriy narx, birlashtirish, xaridor bo'lmagan va hali yetkazilmagan buyurtma uchun 403, reytingning qayta hisoblanishi, moderatsiya, XSS ekranlanishi | ✅ 28/28 |
| Brauzer: admin Hide/Show (reyting 5.0 → 0 → 5.0), katalog ustunlari, mehmon like → login → birlashish, Reviews tabida tahrirlash (sarlavha darhol 3.0), konsol xatosiz | ✅ |

### Hali qilinmagan (📋)
- Mahsulot sahifasidagi **"Specifications" tabi** ham kodga yozilgan soxta ma'lumot (material, og'irlik). Uni mahsulot maydonlaridan olish kerak.
- ~~Admin tahrirlash oynasida rasmni almashtirish imkoniyati yo'q~~: ✅ qo'shildi (9-bo'lim).
- **Izohga rasm qo'shish, "foydali" ovozi va so'kinish filtri yo'q.**
- **Mahsulotlar sahifasida sahifalash noto'g'ri:** 3 ta mahsulot uchun 3 ta sahifa ko'rsatiladi (oldindan mavjud xato).

---

## 9. Admin panelda mahsulot rasmini almashtirish — 3-bosqich

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| I-1 | Tahrirlash oynasida rasmni almashtirib bo'lmasdi. Rasm o'chib ketsa, mahsulotni qaytadan yaratishga to'g'ri kelardi. | Yangi `POST /admin/product/:id/images` (multipart `productImages`, 1–5 ta fayl, faqat admin). Oynada joriy rasmlar ko'rinadi (fayli yo'q bo'lsa "Missing" deb belgilanadi), yangi tanlangan rasmlarning ko'rinishi chiqadi. Saqlashda avval ma'lumotlar, keyin rasmlar yuboriladi. | ✅ |
| I-2 | Eski rasm fayllari diskda qolib ketardi. | Eski fayl faqat quyidagi shartlarda o'chiriladi: aynan shu mahsulotning `public/uploads/products/...` dagi fayli bo'lsa va boshqa hech bir mahsulot unga havola qilmasa. Fayl allaqachon yo'q bo'lsa, xato hisoblanmaydi. Mahsulot topilmasa, yangi yuklangan fayllar o'chiriladi. | ✅ |
| I-3 | Oyna o'lcham va kolleksiya uchun `null` yuborardi: `productSize: NORMAL` yoki `CASUAL` kolleksiyali mahsulot ro'yxatda bo'lmagani uchun tanlov bo'sh qolardi, validatsiya esa uni rad etardi. Natijada bunday mahsulotni umuman saqlab bo'lmasdi. | Bo'sh tanlov yuborilmaydi (joriy qiymat saqlanib qoladi). Oynaga "Standard release", EU 38 va "Casual" variantlari qo'shildi. | ✅ |

**Tekshiruv:** vaqtinchalik bazada 11/11 API stsenariy o'tdi: SVG fayl, bo'sh so'rov va session'siz so'rov rad etildi; rasm almashtirildi; bir nechta rasm bilan almashtirildi; eski fayl diskdan o'chdi; noma'lum mahsulot uchun 404. Brauzerda "Missing" belgisi, yangi rasm ko'rinishi va saqlashdan keyin katalogda yangi rasm tekshirildi. Unit testlar 18/18.

**Hodisa:** 2-bosqichdagi test tozalashida fayllarni yaratilish vaqti bo'yicha o'chirish natijasida foydalanuvchining "Nike Dunk Low." rasmi o'chib ketgan edi. Endi testlar faqat o'zlari yaratgan fayllarni aniq ro'yxat bo'yicha o'chiradi. Foydalanuvchi rasmni qayta yukladi, fayl joyida (`200 image/png`).

---

## 10. Qolgan kamchiliklar tuzatildi — 4-bosqich

Qarorlar (foydalanuvchi bilan kelishilgan): to'lov hozircha **test rejimi** (haqiqiy provayder keyin ulanadi), rasmlar **diskda** (lekin papka sozlanadigan), **Redis** ulanadi.

### Topilgan va tuzatilgan muammolar

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| P-1 | **To'lovsiz "to'langan" buyurtma.** Klient buyurtma yaratib, o'zi darhol `PROCESS` ga o'tkazardi. | Foydalanuvchi endi `PAUSE→PROCESS` qila olmaydi. To'lovni faqat server tasdiqlaydi: test provayder (`POST /payment/test/pay`, faqat `PAYMENT_MODE=test` bo'lsa) yoki admin ("Confirm Payment" tugmasi, `MANUAL`). `Payment` jadvali qo'shildi (har buyurtmaga bitta yozuv, unique index). Bekor qilinganda yozuv `REFUNDED` bo'ladi. Production'da standart rejim `manual`. | ✅ |
| P-2 | Checkout'da **soxta karta raqami** ("8600 •••• 4589") va hech narsaga ulanmagan karta/Payme variantlari bor edi. | Checkout faqat serverdagi `/payment/config` bo'yicha mavjud usullarni ko'rsatadi. | ✅ |
| P-3 | Admin'da har bir buyurtmada **"Card Verified"** deb yozilgan edi. | Endi haqiqiy holat ko'rsatiladi: Paid · TEST/MANUAL, Refunded yoki "Awaiting payment". | ✅ |
| P-4 | **Manzil saqlanmasdi:** checkout manzilni so'rardi, lekin serverga yubormasdi. | `orderRecipient`, `orderPhone`, `orderAddress` va `orderNote` buyurtmaga yoziladi (validatsiya bilan) va admin'da hamda chekda ko'rinadi. | ✅ |
| P-5 | **O'lcham saqlanmasdi.** Admin va "Orders" sahifasi soxta o'lchamni (birinchi o'lcham yoki "42") ko'rsatardi. | Har bir buyurtma qatorida `itemSize` saqlanadi va mahsulotda shu o'lcham borligi server tomonida tekshiriladi. Mahsulot sahifasi faqat mavjud o'lchamlarni taklif qiladi. | ✅ |
| P-6 | **Yetkazish narxi uch joyda har xil edi:** checkout va savat $10, server esa $5 olardi. | Umumiy qoida (`kixora-client/src/lib/pricing.ts`), server qoidasi bilan bir xil. | ✅ |
| P-7 | **Soxta promo-kod:** "KIXORA10" savatda 10% chegirma ko'rsatardi, server esa to'liq narxni olardi. | Promo maydoni olib tashlandi (serverda promo tizimi yo'q). | ✅ |
| F-1 | **Sahifalash soxta edi** (`count={3}`). | API jami sonni `X-Total-Count` sarlavhasida qaytaradi (CORS orqali ochiq), klient haqiqiy sahifalar sonini hisoblaydi va "Showing X of N" ko'rsatadi. | ✅ |
| F-2 | **"Specifications" hamma mahsulot uchun bir xil edi** ("Carbon Shank", "290g"). Tavsif bo'sh bo'lsa, umumiy reklama matni chiqardi. | Mahsulotga material, midsole, outsole va og'irlik maydonlari qo'shildi (admin yaratish va tahrirlash formalarida). Tab faqat haqiqiy ma'lumotni ko'rsatadi. | ✅ |
| F-3 | **Har bir email ro'yxatdan o'tishida bir xil soxta telefon** ("+998901234567") yozilardi. Har qanday 400 xatosi "allaqachon ro'yxatdan o'tgan" deb ko'rsatilardi. | Telefon yuborilmaydi. Faqat haqiqiy takror (409) shunday xabar beradi. | ✅ |
| F-4 | Login'dagi **"Forgot password?" hech narsa qilmasdi.** Maxfiylik siyosati "PCI-DSS" va karta to'lovlari haqida noto'g'ri da'vo qilardi. | Haqiqiy holatga mos matn qo'yildi. | ✅ |
| F-5 | **AI qidiruv xatolari yashirilardi** (bo'sh natija ko'rsatilardi). | Haqiqiy sabab ko'rsatiladi (503 yoki 429). | ✅ |
| S-9 | **JWT `localStorage` da saqlanar va javob tanasida qaytarilardi.** | Token faqat httpOnly cookie'da. Production'da API Vercel orqali bitta domen ostida ishlaydi (`vercel.json`: `/api/*` → Railway), shuning uchun cookie birinchi tomon cookie'si bo'ladi. Klientdagi eski `access_token` avtomatik o'chiriladi. | ✅ |
| S-18 | **Bloklangan foydalanuvchining tokeni 24 soat ishlardi.** | Har so'rovda akkaunt statusi tekshiriladi (30 soniyalik kesh). Admin statusni o'zgartirganda kesh darhol o'chiriladi. | ✅ |
| S-19 | **CSP o'chiq edi.** | Har bir so'rov uchun nonce bilan CSP yoqildi: `script-src 'self' 'nonce-…' + CDN`, `script-src-attr 'none'`. Inline `onclick`/`onerror` handler'lar JS'ga ko'chirildi. Production'da `upgrade-insecure-requests` qo'shiladi. | ✅ |
| D-3 | Rate limit va keshlar har jarayonda alohida edi. | `REDIS_URL` berilsa, rate limit (`rate-limit-redis`), AI kesh va status kesh Redis'da bo'ladi. PM2 Redis bo'lsa `max` nusxa, bo'lmasa 1 nusxa ishga tushiradi. | ✅ |
| D-8 | Rasmlar konteyner diskida yo'qolishi mumkin. | `UPLOAD_DIR`: Railway Volume'ga yo'naltirish mumkin. DB'dagi yo'l formati (`public/uploads/...`) o'zgarmaydi. | ✅ (S3 ga o'tish ixtiyoriy) |
| D-11 | Kuzatuv vositalari yo'q edi. | Strukturalangan logger (production'da JSON qatorlar), access logda query string yo'q, ixtiyoriy Sentry (`SENTRY_DSN`, shaxsiy ma'lumot yuborilmaydi). | ✅ |
| D-12 | CI yo'q edi. | `.github/workflows/ci.yml`: backend uchun typecheck, test va build; klient uchun typecheck, lint, test va build. | ✅ (GitHub'da hali ishga tushirilmagan) |
| D-13 | `memberNick` unique emas edi. | Unique index (`nestar` da takroriy niklar yo'q, tekshirildi). Google signup'dagi poyga holatida qayta urinadi. | ✅ |
| D-14 | `mongoose@6` eskirgan edi. | `mongoose@8.24`. | ✅ |
| A-12 | Katta komponentlar. | `AuthModal` 948 → 332 qator (AuthField, LoginForm, SignupForm, AuthShowcase, GoogleButton, PolicyDialog). `CheckoutModal` 617 → 238 qator (Shipping, Payment va Review qadamlari). `AISearchDialog` 730 → 399 qator (AIPopularRequests, AIRecommendation, AIProductCard). | ✅ |
| C-8 | Klientda testlar yo'q edi. | Vitest: narx, yetkazish formasi va rasm URL'i bo'yicha 13 ta test. | ✅ |
| — | `ai-plugin.json` noto'g'ri manzilga ishora qilardi. ChatGPT plaginlari 2024 yilda yopilgan. | Fayl o'chirildi (`llms.txt` qoldi). | ✅ |

### Ongli qaror: state boshqaruvi (A-11)
Uchta mexanizm qoladi, lekin har birining vazifasi aniq belgilandi. Ularni birlashtirish katta refaktor va hozir xato keltirib chiqarmaydi.
- **Redux:** sahifalar uchun serverdan kelgan ma'lumotlar.
- **Context:** auth sessiyasi.
- **Modul darajasidagi store'lar** (`useSyncExternalStore`): saqlanadigan klient holati, ya'ni wishlist va savat.

### Tekshiruv (4-bosqich)
Testlar to'liq alohida muhitda o'tkazildi: vaqtinchalik `kixora_e2e_*` bazasi, alohida Redis konteyneri, `UPLOAD_DIR=/tmp/...`. Foydalanuvchining 3001/8080 dagi server'lari va `nestar` bazasiga tegilmadi.

| Tekshiruv | Natija |
|---|---|
| Backend unit testlar | ✅ 21/21 |
| Klient unit testlar (Vitest) | ✅ 13/13 |
| Asosiy E2E (to'lov oqimi bilan) | ✅ 31/31 |
| Like va review E2E | ✅ 28/28 |
| Rasm almashtirish E2E (`UPLOAD_DIR` bilan) | ✅ 11/11 |
| 4-bosqich E2E: token tanada yo'q, takroriy nik 409, CSP nonce, `X-Total-Count`, spetsifikatsiyalar, manzil va o'lcham, admin to'lov tasdig'i va refund, bloklash darhol ta'sir qilishi | ✅ 21/21 |
| Ikkita production nusxa bitta Redis bilan: rate-limit hisoblagichi umumiy (1493 → 1492 → 1491 → 1490), JSON loglar, production'da to'lov rejimi `manual` | ✅ |
| Brauzer: login (token `localStorage` da yo'q), mahsulot sahifasi (haqiqiy o'lchamlar va spetsifikatsiyalar), savat → checkout → test to'lovi → "Active shipments", admin buyurtmalarida manzil, EU 41 va "Paid · TEST", admin sahifalarida CSP buzilishi yo'q | ✅ |

### Deploy'dan oldin (qo'shimcha qadamlar)
1. **Vercel:** `VITE_API_URL` ni `/api` ga o'zgartiring yoki o'chirib tashlang (production'da standart qiymat `/api`). Rewrite qoidasi `kixora-client/vercel.json` da.
2. **Railway:**
   - `PAYMENT_MODE=manual` (standart). Demo uchun `test` qo'yish mumkin.
   - Volume ulab, `UPLOAD_DIR=/data/uploads` qo'ying va mavjud `public/uploads` fayllarini shu yerga ko'chiring.
   - Ixtiyoriy: `REDIS_URL`, `SENTRY_DSN`.
3. Klient va backend'ni **birga** deploy qiling: buyurtma API'si o'zgardi (`{ items, shipping }`), JWT esa endi javob tanasida qaytmaydi.
4. Eski buyurtmalarda manzil va o'lcham yo'q. Admin'da ular "No shipping address" va "Size n/a" deb ko'rinadi.

### Haqiqiy to'lov provayderini ulash (keyingi qadam)
`src/services/Payment.service.ts` — tayyor joy. Payme yoki Click webhook'i imzoni tekshirib, `orderService.markPaid(orderId, …, "provider", memberId, providerTxnId)` ni chaqiradi. Buyurtma holati, to'lov yozuvi va takror to'lovdan himoya allaqachon ishlaydi.

---

## 11. Oxirgi kamchiliklar — 5-bosqich

### Topilgan va tuzatilgan muammolar

| ID | Muammo | Yechim | Holat |
|---|---|---|---|
| R5-1 | **Savatdagi narx eskirib qolardi.** Narx qo'shilgan paytdagicha saqlanardi; o'chirilgan yoki tugagan mahsulot savatda qolardi. | `GET /product/batch` va `reconcileCart`: savat ilova ochilganda va har bir checkout oldidan tekshiriladi. Yangi narx qo'llanadi, sotuvdan olingan yoki tugagan mahsulot olib tashlanadi, miqdor qoldiq bilan cheklanadi, nima o'zgargani mijozga aytiladi. Savatga qo'shishda ham qoldiq tekshiriladi. | ✅ |
| R5-2 | **Qoldiq o'lcham bo'yicha emas edi.** | `productSizeStock` (`[{size, count}]`). Har bir o'lcham alohida va atomik band qilinadi, bekor qilinganda o'sha o'lchamga qaytariladi. `productLeftCount` va `productSizes` avtomatik hisoblanadi. Admin'da "Stock per size" maydoni (`40:5, 41:3`), jadvalda o'lchamlar bo'yicha qoldiq. Mahsulot sahifasida tugagan o'lcham o'chirilgan holda ko'rinadi, "Sold Out" tugmasi chiqadi. O'lchamsiz mahsulotlar avvalgidek ishlaydi. | ✅ |
| R5-3 | **Aloqa formasi soxta edi** ("sent" deydi, hech narsa yubormaydi). | `POST /support/message` (rate limit bilan) va admin'da yangi **Inbox** sahifasi (New/Resolved holati). `STORE_NOTIFY_EMAIL` bo'lsa, do'konga email bilan xabar beriladi. | ✅ |
| R5-4 | **Obuna soxta edi.** | `POST /newsletter/subscribe` (takroriy obuna xavfsiz). Admin obunachilarni CSV qilib eksport qila oladi, unda imzolangan obunani bekor qilish havolalari ham bor. `/unsubscribe` sahifasi qo'shildi. | ✅ |
| R5-5 | **Soxta ball va daraja:** "+10 VIP Points", hammaga "KIXORA Elite" va "VIP Member". | Haqiqiy ball (buyurtma summasining 1/10 qismi) va ballarga qarab daraja: Member, Silver (100+), Gold (500+), Elite (1500+). Keyingi darajagacha qancha ball qolgani ko'rsatiladi. | ✅ |
| R5-6 | **Tizimga zid va'dalar:** "Secure Payments" (onlayn to'lov yo'q), NFC sertifikat, "Authenticity Certificate Included", "24/7 Support", maxfiy raffle havolalari. | Haqiqiy holatga moslandi. Siyosat va'dalari (qaytarish muddati, bepul yetkazish chegarasi) bitta joyga yig'ildi: `kixora-client/src/lib/storeInfo.ts`. **Do'kon egasi buni tasdiqlashi kerak.** | ✅ / egasi tasdiqlaydi |
| R5-7 | **Parolni tiklash yo'q edi.** | "Forgot password?" → email → `/reset-password`. Token bir martalik, 30 daqiqa amal qiladi, bazada faqat hash saqlanadi. Mavjud bo'lmagan email bilan farqlanmaydigan bir xil javob qaytadi. Parol almashganda barcha eski tokenlar bekor bo'ladi (`passwordChangedAt`). | ✅ |
| R5-8 | Email tasdiqlanmasdi. | Email tasdiqlash qurilgan edi, lekin **do'kon egasining qarori bilan olib tashlandi**: banner, buyurtma bloki va tasdiqlash xatlari yo'q. Parolni tiklash qoldi. | ➖ olib tashlandi |
| R5-9 | **Admin CSRF'dan faqat SameSite cookie bilan himoyalangan edi.** | Sinxronizator CSRF token: sessiyada saqlanadi, `<meta>` orqali axios header'iga qo'yiladi, multipart formalarda `?_csrf=` bilan yuboriladi. Barcha o'zgartiruvchi admin so'rovlarida tekshiriladi. Eski sessiyalarga token avtomatik qo'shiladi. | ✅ |
| R5-10 | **Admin uchun 2FA yo'q edi.** | TOTP (Google Authenticator va boshqalar): Security sahifasida QR kod. Login paroldan keyin kod so'raydi. O'chirish uchun ham kod kerak. Sir bazada AES-256-GCM bilan shifrlangan. | ✅ |
| R5-11 | **Faqat bitta admin bo'lishi mumkin edi.** | Security sahifasida admin qo'shish va boshqa adminni faollashtirish yoki o'chirish. O'zini va oxirgi faol adminni o'chirib bo'lmaydi. O'chirilgan admin keyingi so'rovdayoq chiqariladi. Do'kon profili birinchi adminga tegishli. | ✅ |
| R5-12 | **Buyurtmalar sahifasi faqat oxirgi 10 tasini ko'rsatardi.** | Har bir tabda "Show more orders" tugmasi. | ✅ |
| R5-13 | **E2E testlar repoda yo'q edi.** | `test/e2e/` (xotiradagi MongoDB, `npm run test:e2e`): 23 ta stsenariy (har biri bir nechta tekshiruv bilan). Ular CI'ga qo'shildi. Klient: loyalty va qoldiq bo'yicha +4 test. | ✅ |

### Kod ichida hal bo'lmaydigan narsalar (sizning akkaunt va ruxsatingiz kerak)

| Narsa | Nima uchun men qila olmayman | Nima qilish kerak |
|---|---|---|
| Haqiqiy to'lov (Payme/Click) | Merchant shartnoma va kalitlar kerak. Do'kon narxlari USD'da, Payme va Click esa UZS'da ishlaydi, shuning uchun valyuta va kurs qarori kerak. | Merchant akkaunt oching va valyutani tanlang. Ulash nuqtasi tayyor: `Payment.service.ts` → `orderService.markPaid(...)`. |
| Email yuborish | SMTP akkaunt kerak (masalan Resend, Mailgun, Gmail SMTP). | `SMTP_URL` va `MAIL_FROM` ni qo'ying. Ularsiz parolni tiklash production'da ishlamaydi. |
| CI'ni ishga tushirish | GitHub'ga push qilish kerak. | `git push`: workflow avtomatik ishga tushadi. |
| Deploy | Vercel va Railway akkauntlaringiz. | 6, 10 va pastdagi qadamlar. |

### Tekshiruv (5-bosqich)
- **Backend:** 21 unit test va 23 E2E stsenariy (xotiradagi MongoDB, taxminan 8 soniya). Typecheck va build toza.
- **Klient:** typecheck, lint (0 xato), 17 unit test, build.
- **Brauzer (preview server, `nestar` bazasiga yozmasdan):** bosh sahifa ("Easy Payment"), Help FAQ, mahsulot sahifasi, `/product/batch`. Konsolda JS xatosi yo'q.

### Deploy'dan oldin (qo'shimcha)
1. **Railway'ga o'zgaruvchilarni qo'ying:** `SMTP_URL`, `MAIL_FROM`, `PUBLIC_APP_URL`, `PUBLIC_SERVER_URL`. Ixtiyoriy: `STORE_NOTIFY_EMAIL`, `DATA_ENCRYPTION_KEY`.
2. **Do'kon egasi `kixora-client/src/lib/storeInfo.ts` dagi va'dalarni tasdiqlasin:** qaytarish muddati, to'lov usuli.
3. **Tizimga kirgandan keyin Admin → Security bo'limida 2FA'ni yoqing.**

---

## 12. Railway frontend deploy xatosi va bitta domen ostidagi API

**Belgi:** `kixora_frontend` xizmati: *Build › Build image — Failed to build an image* (05:31).

**Tashxis:** Railway infratuzilma xatosi: builder kod nusxasini olib kela olmagan (*failed to fetch snapshot*), build umuman boshlanmagan. Kodda xato yo'q. `dc32500` va hozirgi commit lokal toza nusxada Railway'dagi Node 24.20.0 bilan `npm ci && npm run build` dan muvaffaqiyatli o'tdi.

**Tekshiruv paytida topilgan jiddiy muammo:** frontend **Railway'da** joylashgan, Vercel'da emas. 10-bosqichdagi "bitta domen ostidagi API" yechimi faqat `vercel.json` da qilingan edi. `*.up.railway.app` Public Suffix List'da, shuning uchun frontend va backend brauzer uchun alohida saytlar. Token endi `localStorage` da saqlanmagani uchun, proxy bo'lmasa keyingi frontend deploy'da login ishlamay qolardi.

| ID | Yechim |
|---|---|
| RW-1 | `kixora-client/server.mjs` qo'shildi: qo'shimcha paketsiz Node server. U `dist` ni beradi (SPA fallback, hash'langan fayllar uchun uzoq kesh, path traversal'dan himoya) va `/api/*` so'rovlarini `API_ORIGIN` ga proxy qiladi. Bunda cookie, multipart yuklash va status kodlari o'zgarmay o'tadi. `npm start` endi shu server. `serve` paketi olib tashlandi. |
| RW-2 | Proxy orqali kelgan so'rovlarda rate limit mijozning haqiqiy IP'sini ko'radi: proxy `X-Client-IP` ni `PROXY_SECRET` bilan yuboradi. Backend sarlavhaga faqat secret mos kelsa ishonadi (`src/libs/clientIp.ts`), shuning uchun soxtalashtirib bo'lmaydi. |
| RW-3 | `mongodb-memory-server` → `mongodb-memory-server-core`. Avvalgi paket har `npm ci` da taxminan 100 MB'lik MongoDB faylini yuklardi, bu Railway backend build'larini sekinlashtirardi. Endi u faqat E2E testlar ishga tushganda yuklanadi. |

**Tekshiruv:** production build'ga `/api` kirgan, localhost manzili yo'q. `server.mjs` + test backend bo'yicha 11/11 tekshiruv o'tdi: statik fayllar, SPA fallback, kesh, path traversal, API, `X-Total-Count`, signup cookie, cookie bilan so'rov, multipart yuklash, `/api/uploads`, logout. Brauzerda ham sinaldi. Unit testlar 22/22, E2E 23/23.

### Railway'da qilinadigan ishlar
1. **`kixora_frontend` → Variables:**
   - `VITE_API_URL` ni **o'chiring** yoki `/api` qiling;
   - `API_ORIGIN=https://burak-backend-production.up.railway.app` qo'shing;
   - `PROXY_SECRET=<uzun tasodifiy qiymat>` qo'shing.
2. **`kixora_frontend` → Settings:** Root Directory `kixora-client`, Start Command `npm start` (yoki bo'sh qoldiring).
3. **Backend xizmati → Variables:** o'sha `PROXY_SECRET`. `ALLOWED_ORIGINS` ga frontend manzilini qo'shing (`https://burak-frontend-production.up.railway.app`).
4. Oxirgi commit'dan **Redeploy** qiling. "failed to fetch snapshot" yana chiqsa, bu Railway tomonidagi muammo, Railway support'ga murojaat qiling.
