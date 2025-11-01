# Investment Leads

A Next.js web application for querying investment leads from NeonDB by date. This app allows you to search for stealth founders and free agents based on when they were added to the database.

## Features

- Calendar-based date selection
- Query stealth founders and free agents from NeonDB
- Clean, minimal UI with separate sections for each table type
- Dynamic result display - only shows sections when data is available

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your NeonDB connection string:
```
DATABASE_URL=your_connection_string_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI components
- PostgreSQL (via NeonDB)

