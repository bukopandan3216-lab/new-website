# Deployment Guide

## Frontend

1. Build the client:
   ```bash
   cd client
   npm install
   npm run build
   ```
2. Deploy the `dist/` folder to Vercel or Netlify.

## Backend

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Set environment variables in `.env`.
3. Start the server:
   ```bash
   npm run start
   ```

## Database

1. Create the MySQL database.
2. Run `database/schema.sql` to create tables.
