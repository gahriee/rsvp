# Deployment Guide

This guide outlines the steps to deploy the Graduation RSVP application using Vercel for the Next.js frontend/backend routes, and MongoDB Atlas for the database.

## 1. MongoDB Atlas Setup

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new project and provision a free shared cluster.
3. Add `0.0.0.0/0` (allow access from anywhere) to the Network Access IP whitelist since Vercel serverless functions have dynamic IPs.
4. Retrieve the **Mongo Connection URL** from the "Connect" -> "Connect your application" section. This is your production `MONGODB_URI`.

## 2. Vercel Deployment Setup

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository. Vercel will automatically detect the Next.js framework.
4. Open the **Environment Variables** section in your Vercel project configuration and add the following variables:

### Environment Variables for Vercel

| Variable | Description |
|---|---|
| `MONGODB_URI` | The connection string copied from MongoDB Atlas in step 1. |
| `NEXTAUTH_SECRET` | A secure random 32+ character string. Generate one using `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | The URL of your Vercel deployment (e.g., `https://your-domain.vercel.app`). |
| `ADMIN_EMAIL` | The email address you want to use for the admin login. |
| `ADMIN_PASSWORD` | A secure password for the admin dashboard. |
| `SMTP_HOST` | Nodemailer/SMTP host for sending emails. |
| `SMTP_PORT` | Nodemailer/SMTP port (typically 465 or 587). |
| `SMTP_USER` | Nodemailer/SMTP username. |
| `SMTP_PASS` | Nodemailer/SMTP password. |
| `SMTP_FROM` | The sender address (e.g., `"Graduation RSVP" <rsvp@example.com>`). |
| `NEXT_PUBLIC_SITE_URL` | The public-facing URL of your app for Open Graph images (e.g., `https://your-domain.vercel.app`). |

> [!WARNING]
> Ensure none of the sensitive secrets (database URI, passwords, SMTP credentials) are prefixed with `NEXT_PUBLIC_` as this would expose them to the client.

5. Click **Deploy**. Vercel will build the application using the configuration in `next.config.ts`. The default configuration is already optimized for Vercel.

## 3. Built-in CI/CD

Since the application is deployed on Vercel, it acts as its own CI/CD pipeline. Every push to the `main` branch automatically triggers a new deployment. During the build process, Vercel will automatically run:
- Type checking (`tsc`)
- Linting (`eslint`)

If any of these checks fail, Vercel will safely abort the deployment, ensuring that no broken code reaches production.
