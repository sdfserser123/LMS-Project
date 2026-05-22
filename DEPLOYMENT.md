# Production Deployment Guide

This guide details the deployment of your full-stack LMS application. It uses a split-architecture managed platform approach for optimal reliability, speed, and cost-efficiency.

```
       [ Vercel (Frontend) ]
                 │
                 ▼ (HTTPS API Requests)
       [ Render (Express API) ]
                 │
         ┌───────┴───────┐
         ▼               ▼
[ Railway (MySQL) ]   [ Render Disk (/uploads) ]

```

---

## Phase 1: Prerequisites & Repository Structuring

Ensure your repository (https://github.com/sdfserser123/LMS-Project.git) meets the following requirements before production deployment:

### 1. Environment Variable Architecture

Your codebase references environment variables via `process.env` (Backend) and `import.meta.env` (Frontend). Prepare these values:

| Component | Variable Name | Purpose | Example Value |
| --- | --- | --- | --- |
| **Backend** | `PORT` | Server port | `5001` (Render binds this dynamically) |
|  | `DB_HOST` | Database host | `mysql.railway.internal` |
|  | `DB_USER` | Database user | `root` |
|  | `DB_PASSWORD` | Database password | `your_secure_password` |
|  | `DB_NAME` | Database name | `test_database` |
|  | `DB_PORT` | Database port | `3306` |
|  | `ACCESS_TOKEN_SECRET` | Token encryption key | `your_jwt_secret_token` |
|  | `CLIENT_URL` | CORS allowed origin | `https://lms-frontend.vercel.app` |
|  | `MASTER_USERNAME` | Master admin user | `admin` |
|  | `MASTER_PASSWORD` | Master admin password | `123456` |
| **Frontend** | `VITE_API_URL` | Express API endpoint | `https://lms-backend.onrender.com` |

### 2. Codebase Adaptations for Production

* **CORS Configuration:** Ensure `cors` in your Express app permits the eventual Vercel URL:
```javascript
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
```

* **Multer Storage Path:** Files are saved inside `prj-backend/uploads` relative to the application workspace directory.
* **Vite Build Command:** Verify your frontend `package.json` contains:
```json
"scripts": { "build": "vite build" }
```

---

## Phase 2: Database Deployment (Railway)

### Step 1: Create the MySQL Instance

1. Log into **Railway.app** using your GitHub account.
2. Click **New Project** -> Select **Provision MySQL**.
3. Railway provisions a MySQL 8.0 server.

### Step 2: Retrieve Credentials

1. Click on the **MySQL** service card in your Railway dashboard.
2. Navigate to the **Variables** tab.
3. Copy the production credentials: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, and `MYSQLPORT`.

### Step 3: Initialize Database Schema

1. Connect to your database via a local database client (e.g., MySQL Workbench, DBeaver) using the `MYSQL_URL` connection string provided by Railway.
2. Import and execute the `test-lms-db.sql` file located in the root directory to build the LMS tables (`users`, `courses`, `lessons`, `assignments`, `assignment_submissions`, `notifications`, `activity_logs`).

---

## Phase 3: Backend Deployment (Render)

### Step 1: Connect Repository

1. Log into **Render.com** and click **New +** -> **Web Service**.
2. Connect your GitHub account and select the `LMS-Project` repository.
3. Set the **Root Directory** parameter to `prj-backend`.

### Step 2: Configure Service Settings

Set the runtime environment parameters:

* **Runtime:** `Node`
* **Build Command:** `npm install`
* **Start Command:** `npm start`
* **Instance Type:** Select the **Free** or **Starter** tier.

### Step 3: Set Environment Variables

1. Navigate to the **Environment** tab on your Render dashboard.
2. Add all variables listed in the *Phase 1 Backend* table. For database connection details, use the credentials copied from your Railway instance in Phase 2.

### Step 4: Configure Persistent Disk Storage (Critical for Multer)

Because Render web services use an ephemeral filesystem, files uploaded via Multer are deleted during deployments or restarts unless a persistent disk is attached.

1. Navigate to the **Disks** tab on your Render Web Service dashboard.
2. Click **Add Disk**.
3. Set the configurations:
   * **Name:** `lms-uploads-storage`
   * **Mount Path:** `/opt/render/project/src/prj-backend/uploads`
   * **Size:** `1 GB` (Standard tier, scale up as needed).
4. Save changes. This mounts your persistent disk directly to the `/uploads` directory in your backend root folder.

---

## Phase 4: Frontend Deployment (Vercel)

### Step 1: Initialize Project

1. Log into **Vercel.com** using your GitHub account.
2. Click **Add New** -> **Project**.
3. Import the `LMS-Project` repository.

### Step 2: Build & Framework Settings

1. Vercel automatically detects the Vite configuration. Ensure the Framework Preset is set to **Vite**.
2. Set the **Root Directory** to `prj-frontend`.
3. Keep the **Build Command** as `npm run build` and **Output Directory** as `dist`.

### Step 3: Inject Variables & Deploy

1. Expand the **Environment Variables** accordion.
2. Add key: `VITE_API_URL`
3. Value: The HTTPS URL provided by Render (e.g., `https://lms-backend.onrender.com`). *Do not include a trailing slash.*
4. Click **Deploy**.

---

## Phase 5: Verification & Testing

Verify system operation using the following steps once the build pipelines complete:

### 1. Database Connection Test

Check the Render logs in the Web Service dashboard. Confirm that tables are successfully instantiated on boot and that database queries resolve with no connection or access timeouts.

### 2. API Health Check

Open a web browser or API client and trigger a request to:
```
https://your-backend.onrender.com/api/auth/refresh
```
Ensure the API responds with a valid JSON payload or a structured status code (e.g., `401 Unauthorized` due to missing token cookies rather than a `502 Bad Gateway` error).

### 3. End-to-End Workflow Validation

1. **Authentication & CORS:** Navigate to your live Vercel URL and register or log in. Check your browser developer tools to verify that your session cookies and JWT are successfully sent, and that the console shows no CORS preflight blocks.
2. **File Persistence:** Navigate to a course and upload a media block or submit an assignment attachment. Ensure it uploads successfully. Run a manual redeploy in Render, and verify the uploaded files remain accessible and uncorrupted.
