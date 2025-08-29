# E‑commerce Backend (Express + TypeScript + Prisma)

A Node.js REST API for the e‑commerce app. Built with Express, TypeScript, Prisma (PostgreSQL), Multer + Sharp (image processing), Supabase Storage, and Nodemailer.

## Tech Stack
- **Node.js** + **Express 5**
- **TypeScript**
- **Prisma** ORM (PostgreSQL)
- **Multer** (memory storage) + **Sharp** for image processing to WebP
- **Supabase Storage** for images
- **Nodemailer** for email notifications
- **CORS** enabled

## Project Structure
```
backend/
├─ src/
│  ├─ index.ts                 # Express app entry
│  ├─ routes/                  # Express routers
│  ├─ controllers/             # Route handlers
│  ├─ middlewares/upload.ts    # Multer (memory storage)
│  ├─ prisma/client.ts         # Prisma client instance
│  ├─ services/email.ts        # Nodemailer integration
│  └─ utils/supabaseClient.ts  # Supabase client
├─ prisma/
│  ├─ schema.prisma            # Prisma schema (PostgreSQL)
│  ├─ migrations/              # Prisma migrations
│  └─ seed.ts                  # Seed script
├─ package.json
├─ tsconfig.json
└─ nodemon.json
```

## Environment Variables
Create `.env` in `backend/` with the following variables:
```
# Server
PORT=4000

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname?schema=public
# Optional: direct connection for migrations if needed
DIRECT_URL=

# Supabase (for file storage)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=...

# Email (Gmail example)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your-app-password
```
Notes:
- `src/utils/supabaseClient.ts` requires `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- `src/services/email.ts` uses Gmail via `EMAIL_USER` and `EMAIL_PASS`.
- Prisma datasource reads `DATABASE_URL` and `DIRECT_URL` in `prisma/schema.prisma`.

## Install & Run
```
npm install
# Dev
npm run dev
# Build
npm run build
# Start compiled server
npm start
```
Default base URL: `http://localhost:${PORT}` (4000 if unset).

## Prisma
- Generate client (usually handled by migrate):
```
npx prisma generate
```
- Create and apply a migration:
```
npx prisma migrate dev --name <migration_name>
```
- Push schema without migration (development only):
```
npx prisma db push
```
- Seed database (configured in package.json):
```
npx prisma db seed
```
Schema models include: `Product`, `Image`, `Color`, `ProductColors` (join), `Setting`, `Order`, `OrderProducts`.

## File Uploads & Images
- Uploads use Multer memory storage (`src/middlewares/upload.ts`).
- Images are resized/converted to WebP using Sharp.
- Files are uploaded to Supabase Storage buckets:
  - `product_images` (product images)
  - `logo` (store logo)
- Public URLs are generated via Supabase and stored in DB.

## Email Notifications
- `sendOrderEmail()` in `src/services/email.ts` sends a Gmail email when a new order is created.
- Configure `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password recommended) in `.env`.

## API
Base path: `/api`

- Orders (`/api/orders`) — see `src/controllers/orderController.ts`
  - `POST /` Create order
  - `GET /` List orders with pagination (`skip`, `limit`)
  - `PUT /:id` Update status (body: `{ id, status }`)
  - `DELETE /:id` Delete order
  - `GET /count` Total orders count
  - `GET /delivered-count` Delivered orders count
  - `GET /not-delivered-count` Not delivered orders count
  - `GET /total-price` Sum of order totals

- Products (`/api/products`) — see `src/controllers/productController.ts`
  - `GET /` List products (`skip`, `limit`)
  - `GET /length` Total products count
  - `GET /last` Last 4 products
  - `GET /:id` Get product by id
  - `POST /` Create product (multipart form, `images[]` up to 10)
  - `PUT /:id` Update product (multipart form, `images[]` optional)
  - `DELETE /:id` Delete product

- Colors (`/api/colors`) — see `src/controllers/colorController.ts`
  - `POST /` Create color
  - `GET /` List colors
  - `GET /length` Colors count
  - `DELETE /:id` Delete color

- Settings (`/api/settings`) — see `src/controllers/settingController.ts`
  - `GET /` Get settings
  - `PUT /` Update settings (multipart form, `logo` optional)

Static files:
- `GET /uploads/*` serves files from local `uploads/` if used (currently storage is via Supabase).

## CORS
- Enabled with default configuration (`app.use(cors())`).
- Ensure your frontend origin (e.g., `http://localhost:5173`) is allowed in production.

## Validation
- Uses **Zod** across controllers for input validation.

## Common Issues
- Missing `.env` values (DB/Supabase/Email) cause startup or runtime errors.
- Prisma migration errors: ensure `DATABASE_URL` points to a reachable PostgreSQL instance.
- Supabase upload errors: verify bucket names (`product_images`, `logo`) exist and keys are valid.
- Gmail auth: use an App Password if 2FA is enabled.

## Scripts
From `package.json`:
- `dev` — start with nodemon
- `build` — compile TypeScript to `dist/`
- `start` — run compiled server `dist/index.js`

Prisma seed is configured via:
```
"prisma": { "seed": "ts-node prisma/seed.ts" }
```
Run with: `npx prisma db seed`.

## License
Add your license of choice (e.g., MIT).
