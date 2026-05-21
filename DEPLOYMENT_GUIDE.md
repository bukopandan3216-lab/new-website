# FarmDirect - Infinity Free Deployment Guide

## Project Overview
FarmDirect is a full-stack agricultural marketplace platform built with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MySQL
- **Authentication**: JWT-based auth with bcrypt password hashing

## Deployment Steps for Infinity Free

### Step 1: Set Up Infinity Free Account
1. Go to https://www.infinityfree.net/
2. Create a free account
3. Create a new website and select:
   - PHP Version: 7.4 or higher
   - MySQL Database: Create one

### Step 2: Database Setup

#### 2.1 Access MySQL Database
1. In Infinity Free control panel, go to **MySQL Databases**
2. Note down:
   - Database Name
   - Database Username
   - Database Password
   - MySQL Server Address

#### 2.2 Import Database Schema
1. Go to **phpMyAdmin** in your control panel
2. Click on your database name
3. Go to **Import** tab
4. Upload the `database.sql` file (included in this repo)
5. Click **Go** to import all tables and seed data

**Seed Data Included:**
- Admin user (username: `admin`, password: `admin123`)
- 3 Sample Farmers with products
- 1 Sample Buyer

### Step 3: Backend Deployment

Since Infinity Free uses **PHP**, we need to set up a Node.js compatible environment or use an alternative backend hosting:

#### Option A: Use Railway.app (Recommended for Node.js)
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project from GitHub
4. Connect your FarmDirect repository
5. Add MySQL addon
6. Set environment variables:
   ```
   NODE_ENV=production
   DB_HOST=your_railway_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secret_key_change_this
   PORT=5000
   ```
7. Deploy automatically

#### Option B: Use Vercel/Netlify (For Frontend Only)
If you want to use Infinity Free database with a different backend host:
1. Deploy frontend to Vercel: `npm run build` in client/
2. Deploy backend to Railway or Heroku
3. Update frontend API endpoint in `client/src/api/axios.js`

### Step 4: Frontend Deployment

#### 4.1 Build React App
```bash
cd client
npm install
npm run build
```

This creates `client/dist/` folder with static files.

#### 4.2 Upload to Infinity Free
1. Connect via FTP (get credentials from Infinity Free control panel)
2. Delete existing `public_html` folder contents
3. Upload contents of `client/dist/` to `public_html/`

#### 4.3 Configure Frontend API URL
Create `.env` in `client/` directory:
```
VITE_API_URL=https://your-backend-url.com
```

Update `client/src/api/axios.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com/api'
```

### Step 5: Admin Access

**Login Credentials:**
- Email: `admin@farmdirect.ph`
- Password: `admin123`

**Admin Features:**
- View pending applications
- Manage users (farmers, buyers, admins)
- View all products
- Monitor orders and sales
- View reports and analytics

To create additional admins:
1. Login with admin account
2. Go to User Management
3. Change user role to "admin"

### Step 6: Verification Checklist

- [ ] Database imported successfully in MySQL
- [ ] Can login with admin credentials
- [ ] Backend API running and accessible
- [ ] Frontend static files uploaded to public_html
- [ ] API endpoint URL configured in frontend
- [ ] SSL certificate installed (usually automatic on Infinity Free)

### Step 7: Environment Variables Reference

**Backend (.env file on Railway/Heroku):**
```
NODE_ENV=production
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=farmdirect
JWT_SECRET=change_this_to_secure_key
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env file):**
```
VITE_API_URL=https://your-backend-url.com/api
```

### Step 8: Important Security Notes

1. **Change JWT_SECRET** to a strong, unique value
2. **Change admin password** immediately after first login
3. **Use HTTPS** for all communications
4. **Validate all user inputs** on both frontend and backend
5. **Enable CORS** properly to prevent unauthorized access
6. **Backup database regularly** through Infinity Free control panel

### Troubleshooting

**Cannot connect to database:**
- Verify database credentials in control panel
- Check that MySQL server address is correct
- Ensure your IP is whitelisted (usually automatic)

**CORS errors:**
- Update `CORS_ORIGIN` environment variable
- Check backend CORS configuration in `server/app.js`

**Frontend shows blank page:**
- Check browser console for errors (F12)
- Verify API endpoint in Network tab
- Check that dist files were uploaded correctly

**Admin panel not loading:**
- Clear browser cache (Ctrl+Shift+Delete)
- Verify authentication token is stored
- Check that user role is set to 'admin'

### Support Resources

- Express.js: https://expressjs.com/
- React Router: https://reactrouter.com/
- Infinity Free Docs: https://www.infinityfree.net/support/
- Railway.app Docs: https://docs.railway.app/

### Contact Information

For issues or questions, refer to the project documentation or contact the development team.

---
**Last Updated**: May 2026
**Version**: 1.0
