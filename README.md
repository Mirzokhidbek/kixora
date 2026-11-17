# KIXORA — Luxury Footwear

KIXORA — premium poyabzal do'koni uchun to'liq stekli onlayn savdo platformasi. Loyiha uch qismdan iborat:

- **REST API** (Express 5 + MongoDB) — mahsulotlar, buyurtmalar, to'lovlar, sharhlar, foydalanuvchilar
- **Admin panel** (EJS, server tomonida render) — mahsulot, buyurtma, foydalanuvchi va sharhlarni boshqarish, 2FA bilan himoyalangan
- **Veb-ilova** (`kixora-client/`, React 19 + Vite) — xaridorlar uchun do'kon interfeysi (PWA)

## Imkoniyatlar

**Xaridor uchun**
- Ro'yxatdan o'tish, login, Google orqali kirish (Firebase), parolni tiklash
- Mahsulotlar katalogi: qidiruv, saralash, filtr, mahsulot sahifasi
- **AI qidiruv** — Gemini yordamida tabiiy tildagi so'rov bo'yicha mahsulot topish
- Savat, o'lcham tanlash, checkout va to'lov (test yoki qo'lda tasdiqlash rejimi)
- Buyurtmalar tarixi va holatini kuzatish
- Sevimlilar (like), mahsulotga sharh va reyting qoldirish
- Yordam markazi, aloqa formasi, yangiliklarga obuna

**Admin uchun**
- Dashboard: daromad, buyurtmalar va mijozlar statistikasi
- Mahsulot qo'shish/tahrirlash, rasm yuklash
- Buyurtma va foydalanuvchi holatlarini boshqarish, loyalty ballari
- Sharhlarni moderatsiya qilish va javob berish
- Inbox (mijoz xabarlari), obunachilarni CSV eksport qilish
- Xavfsizlik: TOTP 2FA, adminlarni boshqarish

## Texnologiyalar

| Qism | Stek |
|---|---|
| Backend | Node.js 20+, TypeScript, Express 5, Mongoose 8, Zod, JWT, express-session |
| Xavfsizlik | Helmet, CSP, rate limiting, NoSQL sanitizer, bcrypt, otplib (2FA) |
| Infratuzilma | Redis (ixtiyoriy: kesh va rate limit), Sentry, Nodemailer, Multer, PM2 |
| Frontend | React 19, Vite, Redux Toolkit, React Router 7, MUI, Firebase Auth, Axios |
| Testlar | `node:test` + mongodb-memory-server (backend), Vitest (frontend) |
| CI | GitHub Actions — typecheck, lint, testlar, build |

## Loyiha tuzilmasi

```
kixora/
├── src/                  # Backend
│   ├── controllers/      # HTTP handlerlar (member, product, order, payment, admin, ...)
│   ├── services/         # Biznes mantiq
│   ├── models/           # Mongoose sxemalari
│   ├── middlewares/      # Auth, CSP, xatolarni ushlash
│   ├── libs/             # Config, validatsiya, kesh, Redis, mailer, AI qidiruv, ...
│   ├── views/            # Admin panel EJS shablonlari
│   ├── router.ts         # Ommaviy API (/member, /product, /order, /payment, ...)
│   ├── routerAdmin.ts    # Admin panel (/admin)
│   └── server.ts         # Kirish nuqtasi
├── kixora-client/        # React veb-ilova
│   ├── src/app/          # Ekranlar, komponentlar, servislar, Redux store
│   └── server.mjs        # Production uchun statik server + /api proxy
├── test/                 # Unit va e2e testlar
├── docs/AUDIT.md         # Xavfsizlik va arxitektura auditi hisoboti
└── ecosystem.config.js   # PM2 konfiguratsiyasi
```

## Ishga tushirish

**Talablar:** Node.js 20+, MongoDB (lokal yoki Atlas). Redis ixtiyoriy.

1. Paketlarni o'rnating:

   ```bash
   npm install
   cd kixora-client && npm install
   ```

2. `.env.example` dan nusxa olib `.env` yarating va qiymatlarni to'ldiring (kamida `MONGO_URL`):

   ```bash
   cp .env.example .env
   ```

3. Backendni ishga tushiring (standart port `3001`):

   ```bash
   npm run dev
   ```

4. Boshqa terminalda frontendni ishga tushiring:

   ```bash
   cd kixora-client && npm run dev
   ```

Admin panel: `http://localhost:3001/admin`

## Asosiy muhit o'zgaruvchilari

| O'zgaruvchi | Vazifasi |
|---|---|
| `MONGO_URL` | MongoDB ulanish satri |
| `JWT_SECRET`, `SESSION_SECRET` | Production'da majburiy |
| `ALLOWED_ORIGINS` | CORS ruxsat etilgan manzillar |
| `FIREBASE_PROJECT_ID` | Google login tokenini tekshirish |
| `GEMINI_API_KEY` | AI qidiruv (bo'lmasa endpoint 503 qaytaradi) |
| `PAYMENT_MODE` | `test` yoki `manual` |
| `REDIS_URL` | Bir nechta instansiya uchun kerak |
| `SMTP_URL` | Email yuborish (parol tiklash, bildirishnomalar) |

To'liq ro'yxat: [.env.example](.env.example).

## Skriptlar

**Backend (ildiz papka)**

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Ishlab chiqish rejimi (nodemon) |
| `npm run build` | `dist/` ga kompilyatsiya |
| `npm start` | Production server |
| `npm run typecheck` | TypeScript tekshiruvi |
| `npm test` | Unit testlar |
| `npm run test:e2e` | E2E testlar (in-memory MongoDB) |

**Frontend (`kixora-client/`)**

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | oxlint |
| `npm test` | Vitest |
| `npm start` | Build qilingan ilovani `/api` proxy bilan berish |

## Deploy

- **Backend:** Railway (yoki PM2 orqali istalgan server). Rasmlar uchun `UPLOAD_DIR` ga doimiy disk ulang.
- **Frontend:** Railway (`server.mjs` + `/api` proxy) yoki Vercel (`vercel.json`).
- Ikkala servisga bir xil `PROXY_SECRET` qo'ying — shunda rate limit haqiqiy IP'ni ko'radi.

## Litsenziya

ISC
