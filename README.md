# GALAXIQURA — Enterprise Strategic Consulting & Operational Transformation

A high-performance 3D spatial web experience built with Three.js, responsive modern CSS, and Vercel Serverless / Apache dual deployment support.

---

## 🌟 Key Features

- **Dynamic 3D Spatial Hero**: Interactive Three.js particle constellation and celestial core representing strategic synergy and multi-sector transformation.
- **MotionSites / Modern UI Aesthetics**: Glassmorphic spatial HUD, cybernetic accents, kinetic preloader, and responsive pillar drawer with deep-dive strategic case studies.
- **Universal Multi-Device Responsiveness**: Tailored layouts tested across 4K displays, laptops, iPad/tablets, and mobile devices (iOS / Android) with touch target sizing $\ge 44\text{px}$.
- **Dual-Environment Architecture**:
  - **Vercel Serverless Deployment**: Native `/api/contact.js` endpoint for instant serverless execution and lead routing.
  - **Traditional Apache / cPanel**: Full fallback support for `contact.php` and GoDaddy/cPanel native mailer.
  - **Offline Resilience**: Automatic client-side `mailto:` fallback if network is restricted.
- **Anti-Spam Security**: Honeypot protection, sanitized input encoding, and zero third-party data tracking.

---

## 🚀 One-Click Vercel Deployment

### Method 1: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select the **`galaxiqura`** repository:
   ```
   https://github.com/kathir-kevin/galaxiqura.git
   ```
3. Framework Preset: **Other** (Static HTML/JS).
4. Root Directory: `./`
5. Click **Deploy**. Your site will be live on a `*.vercel.app` domain in under 30 seconds!

### Method 2: Deploy via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy directly to your Vercel account.

---

## ⚙️ Environment Variables (Optional)

Configure these in your **Vercel Project Settings → Environment Variables** if you wish to deliver contact form submissions directly via SMTP or Resend:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `CONTACT_RECIPIENT` | Email address where enquiries are delivered | `info@galaxiqura.com` |
| `SMTP_HOST` | Outgoing SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (587 for TLS, 465 for SSL) | `587` |
| `SMTP_USER` | SMTP username / sender email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password or Google App Password | `xxxx xxxx xxxx xxxx` |
| `RESEND_API_KEY` | *(Alternative)* Resend API token | `re_123456789...` |

> *Note: If no SMTP variables are set, enquiries are safely logged in real-time to your Vercel Function logs under `[GALAXIQURA_NEW_LEAD]`, ensuring zero customer inquiries are ever lost.*

---

## 💻 Local Development

Run the lightweight local development server:
```bash
npm run dev
```
Open [http://localhost:4173](http://localhost:4173) in your browser.

Validate all JavaScript scripts:
```bash
npm run validate
```

---

## 🏢 Leadership & Corporate Information

- **Founder & Managing Director**: Kathiravan
- **Headquarters**: Chennai, Tamil Nadu, India
- **Core Pillars**: Strategic Advisory, Operational Transformation, Tech Modernization, Capital & Governance
