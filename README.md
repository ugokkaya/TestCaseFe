# YAPAY ZEKA DESTEKLİ OTOMATİK TEST SENARYOSU VE KOD ÜRETİM SİSTEMİ

Bu ödev kapsamında React + Vite + TypeScript + Tailwind kullanılarak geliştirilen arayüz, TestCase API'si üzerinden yapay zekâ destekli test senaryosu ve script üretimini yönetir.

## Prerequisites
- Node.js 18+
- npm 9+
- TestCase API için `VITE_API_BASE_URL` değerini içeren bir `.env` dosyası

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the environment template and adjust if needed
   ```bash
   cp .env.example .env
   ```
3. Start the development server
   ```bash
   npm run dev
   ```
4. Open the printed local URL (defaults to `http://localhost:5173`).

## Available Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and bundle for production
- `npm run preview` – serve the production build locally
- `npm run lint` – run TypeScript for static checks

## Backend Entegrasyonu
- `POST /api/Ai/generate` → Beklenen gövde: `{ "requirement": "metin", "framework": "React" }`. Yapay zekâdan dönen `test_case`, `script` ve `script_code` alanlarını geri verir ve veritabanına kaydeder.
- `GET /api/Ai/list` → Kaydedilen tüm test senaryolarını döner. Her kayıt `requirement`, `title`, `framework`, `expected`, `steps (JSON)`, `createdAt` alanlarını içerir.
- Frontend'de `src/services/apiTestCase.ts` bu uç noktalarla konuşur; base URL `.env` içindeki `VITE_API_BASE_URL` üzerinden yönetilir (varsayılan: `http://localhost:5000/api`).

## Project Structure
```
src/
 ┣ components/
 ┃ ┣ Layout.tsx
 ┃ ┗ Modal.tsx
 ┣ pages/
 ┃ ┣ AskTestPage.tsx
 ┃ ┣ HomePage.tsx
 ┃ ┗ TestCaseListPage.tsx
 ┣ services/
 ┃ ┗ apiTestCase.ts
 ┣ App.tsx
 ┗ main.tsx
```
