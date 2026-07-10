# Deploying to Namecheap at paidmediapro.eb28.co

This guide gets the app live on **Namecheap shared hosting** (Stellar plan with cPanel),
with the domain staying on Namecheap DNS. Total setup time: ~20 minutes, then every
push to `main` auto-deploys via GitHub Actions.

> **Prerequisite:** a Namecheap *hosting* plan (Stellar, ~$2–4/mo). A domain alone is
> not enough — the app needs a Node.js server for Stripe checkout and AI generation.
> If your account only has the eb28.co domain, add Stellar hosting first
> (Namecheap dashboard → Hosting). Make sure the server offers **Node.js 20+**
> (cPanel → Setup Node.js App → Node version dropdown). If it maxes out at 18,
> open a Namecheap support chat and ask to be placed on a server with Node 20.

## Step 1 — Create the subdomain in cPanel

1. Log into cPanel (Namecheap dashboard → Hosting List → Go to cPanel).
2. **Domains → Create a New Domain** → enter `paidmediapro.eb28.co`.
   - Uncheck "Share document root", set the document root to `paidmediapro/public`.
3. Note your server's **Shared IP Address** (cPanel right sidebar, "General Information").

## Step 2 — Point DNS at the hosting server

In Namecheap dashboard → Domain List → **eb28.co** → Advanced DNS, add:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | `paidmediapro` | *(your cPanel Shared IP)* | Automatic |

Wait a few minutes, then cPanel → **SSL/TLS Status** → Run AutoSSL so the
subdomain gets a free HTTPS certificate.

## Step 3 — Create the Node.js app in cPanel

1. cPanel → **Setup Node.js App** → Create Application:
   - Node.js version: **20.x** (highest available)
   - Application mode: **Production**
   - Application root: `paidmediapro`
   - Application URL: `paidmediapro.eb28.co`
   - Application startup file: `server.js`
2. In the same screen, add the **environment variables**:

   | Name | Value |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | `sk_live_...` |
   | `STRIPE_PRICE_ID_29` | `price_...` |
   | `STRIPE_PRICE_ID_49` | `price_...` |
   | `STRIPE_ACTIVE_PRICE` | `29` |
   | `OPENAI_API_KEY` | `sk-...` |
   | `APP_URL` | `https://paidmediapro.eb28.co` |

   (Or just `DEMO_MODE=true` to launch without payments/AI and test the flow.)
3. Don't click "Run NPM Install" — the deploy bundle already contains everything.

## Step 4 — Create an FTP account for deploys

1. cPanel → **FTP Accounts** → Create:
   - Username: e.g. `deploy@eb28.co`
   - Directory: `/home/<cpanel-user>/paidmediapro`
2. Note the FTP server hostname (shown under "Configure FTP Client",
   e.g. `premium123.web-hosting.com`).

## Step 5 — Add GitHub secrets and deploy

GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
| --- | --- |
| `NC_FTP_SERVER` | `premium123.web-hosting.com` |
| `NC_FTP_USERNAME` | `deploy@eb28.co` |
| `NC_FTP_PASSWORD` | *(the FTP password)* |
| `NC_SERVER_DIR` | `/` |

Then GitHub → **Actions → Deploy to Namecheap hosting → Run workflow**.
The first upload transfers the whole bundle (thousands of files — expect
15–40 minutes over shared-hosting FTP). Subsequent deploys only sync changed
files and take a couple of minutes.

## Step 6 — Start it

Back in cPanel → Setup Node.js App → your app → **Restart**. Visit
https://paidmediapro.eb28.co — you should see the landing page.

## How it works

- `next.config.ts` uses `output: 'standalone'`, so CI produces a self-contained
  server (app + minimal `node_modules` + `server.js`) — nothing to install on
  the host, and no memory-hungry build on shared hosting.
- cPanel runs `server.js` under Phusion Passenger, which supplies the `PORT`
  the standalone server listens on.
- Each deploy touches `tmp/restart.txt`, which tells Passenger to restart the
  app automatically.

## Troubleshooting

- **503 / "Passenger could not start"** — check the Node version is 20+, the
  startup file is `server.js`, and the application root matches the FTP upload
  directory. The error log is in cPanel → Errors, or `stderr.log` in the app root.
- **Stripe redirects to the wrong URL** — set `APP_URL=https://paidmediapro.eb28.co`
  in the Node app's environment variables and restart.
- **AI generation times out** — shared hosting has no request time limit under
  Passenger, but if a proxy kills long requests, set a smaller `OPENAI_MODEL`
  like `gpt-4o-mini` for faster responses.
- **First deploy is very slow** — normal over FTP. If your plan has SSH enabled
  (cPanel → Manage Shell), ask and we can switch the workflow to rsync-over-SSH,
  which is much faster.
