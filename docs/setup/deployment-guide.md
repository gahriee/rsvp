# Deployment & Database Setup Guide

This document provides exact, step-by-step instructions for configuring the MongoDB Atlas cluster, connecting the GitHub repository to Vercel for automated deployments, and seeding the production database.

---

## 1. MongoDB Atlas Setup

To host the database in production using MongoDB Atlas:

1. **Create an Atlas Account and Cluster**
   - Log in or sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a new project (e.g., `Graduation-RSVP`).
   - Build a Database Cluster: Select the **FREE (M0)** shared tier, pick your preferred cloud provider (AWS, GCP, or Azure) and region closest to your primary audience.

2. **Configure Database Access (Credentials)**
   - Navigate to **Database Access** in the left sidebar.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Set a username (e.g., `rsvp_db_user`) and a strong password.
   - Under **Database User Privileges**, select **Read and write to any database** (`readWrite`).
   - Click **Add User** and save the credentials securely.

3. **Configure Network Access (IP Whitelisting)**
   - Navigate to **Network Access** in the left sidebar.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
     > *Note:* Serverless platforms like Vercel use dynamic outbound IP addresses, so allowing `0.0.0.0/0` is required for Next.js API routes to reliably connect to MongoDB Atlas.
   - Click **Confirm**.

4. **Obtain the Connection String**
   - Navigate back to **Database** (Overview).
   - Click **Connect** on your cluster.
   - Select **Drivers** (Node.js driver).
   - Copy the provided connection string URI, which looks like:
     ```ini
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<username>` and `<password>` with the credentials created in Step 2, and insert the database name `graduation-rsvp` right before the question mark (`?`):
     ```ini
     mongodb+srv://rsvp_db_user:YOUR_PASSWORD@cluster0.abcde.mongodb.net/graduation-rsvp?retryWrites=true&w=majority
     ```
   - This URI will be used as the `MONGODB_URI` environment variable.

---

## 2. Vercel Project Setup

To deploy the Next.js application to Vercel:

1. **Import the Repository**
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... -> Project**.
   - Connect your GitHub account if not already linked, and select the `graduation-rsvp` (or `rvsp`) repository.

2. **Configure Build Settings**
   - **Framework Preset:** Vercel will automatically detect **Next.js**. Leave the default build commands (`next build`) and output directory untouched.
   - **Node.js Version:** Ensure Node.js 20.x or later is selected in Project Settings -> Node.js Version.

3. **Configure Environment Variables**
   - Expand the **Environment Variables** section during project setup (or go to Project Settings -> Environment Variables after importing).
   - Add the required production variables:
     | Key | Value / Example | Environment |
     | :--- | :--- | :--- |
     | `MONGODB_URI` | `mongodb+srv://...` (from Step 1.4) | Production, Preview, Development |
     | `NEXTAUTH_SECRET` | A secure 32-character random string (`openssl rand -base64 32`) | Production, Preview, Development |
     | `NEXTAUTH_URL` | Your production Vercel URL (e.g., `https://graduation-rsvp.vercel.app`) | Production |
     | `ADMIN_EMAIL` | Admin login email address | Production, Preview |
     | `ADMIN_PASSWORD` | Strong password for admin access | Production, Preview |
     | `NEXT_PUBLIC_API_URL` | `/api/v1` | Production, Preview, Development |
   - Click **Deploy**.

4. **Verify Deployment**
   - Once the build finishes, Vercel will assign a `.vercel.app` domain (and any configured custom domain).
   - Visit the site to ensure the home page and API health endpoints load cleanly without errors.

---

## 3. Database Seeding in Production

After deploying the project and configuring `MONGODB_URI` on Vercel, populate your production MongoDB Atlas database with the initial gift registry items:

1. **Run Seeding Locally Against Production DB**
   - In your local development terminal, temporarily execute the seed script passing the production connection string explicitly:
     ```bash
     MONGODB_URI="mongodb+srv://rsvp_db_user:YOUR_PASSWORD@cluster0.abcde.mongodb.net/graduation-rsvp?retryWrites=true&w=majority" npm run seed
     ```
   - Alternatively, place the production URI inside your `.env.local` temporarily and run:
     ```bash
     npm run seed
     ```
   - *Expected Output:*
     ```
     Connected to MongoDB...
     Cleared existing gifts.
     Inserted X initial gifts successfully!
     Database connection closed.
     ```

2. **Verify Seeded Data**
   - You can verify the data was inserted successfully by visiting the `/api/v1/gifts` endpoint on your deployed Vercel domain (`https://your-domain.vercel.app/api/v1/gifts`) or by checking the **Collections** tab in MongoDB Atlas.
