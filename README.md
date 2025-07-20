# Kharidlo Admin

>Kharidlo Admin is an e-commerce admin dashboard built with Next.js, Prisma, and Tailwind CSS. It provides management features for products, customers, and sales, with authentication and analytics.

## Features
- Product management (add, edit, view products)
- Customer management (view customers, details)
- Sales management (view orders, complete orders)
- Authentication (Google OAuth, JWT, NextAuth)
- Dashboard analytics and charts
- PDF export (jsPDF)

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/) 19
- [Prisma](https://www.prisma.io/) ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- [Axios](https://axios-http.com/) for API requests
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export
- [Recharts](https://recharts.org/) for charts

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```
Required variables:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (NextAuth config)
- `DATABASE_URL` (Prisma DB connection)
- `JWT_SECRET` (JWT signing)
- `NEXT_PUBLIC_BACKEND_URL` (API base URL)

### 3. Set up the database
Run Prisma migrations and generate client:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the development server
```bash
npm run dev
```
The app runs at [http://localhost:3001](http://localhost:3001).

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React UI components (e.g., Navbar)
- `db/` - Prisma schema and migrations
- `public/` - Static assets
- `lib/` - Utility libraries (e.g., auth)

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma client generation)
- `npm run start` - Start production server
- `npm run lint` - Lint code

## Deployment
You can deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

### Live Demo
- [https://ecomm-admin-app.vercel.app/](https://ecomm-admin-app.vercel.app/)

## License
This project is private and not licensed for public use.
