# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

eyep.me is an Express.js web application that provides IP address and user agent lookup services, along with DNS record lookups. It's designed to run behind a reverse proxy (expects `x-forwarded-for` headers).

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server with nodemon (auto-reload)
npm start            # Start production server
npm run build        # Build Docker image
```

The application runs on port 3000.

## Architecture

### Request Flow

1. All requests pass through `middleware/requestLogger.js` which logs requests using Winston
2. Requests are routed to either:
   - `routes/index.js` - Renders Handlebars views for the web UI
   - `routes/api.js` - Returns JSON responses for API endpoints

Both route handlers use the same underlying data functions from `lib/`.

### Core Libraries (`lib/`)

- **`lib/api.js`**: Combines IP geolocation data (from ip-api.com) with user agent parsing (UAParser.js)
- **`lib/dns.js`**: Executes DNS lookups using the system `dig` command via `child_process.spawn()`. Validates domains with `validator.isFQDN()`. Returns A, AAAA, MX, TXT, NS, and CNAME records.
- **`lib/cache.js`**: Simple in-memory cache with 24-hour expiration for DNS records
- **`lib/logger.js`**: Winston logger configuration for console output

### IP Detection

IP addresses are extracted using the following priority:
1. `req.headers["cf-connecting-ip"]` - Cloudflare's client IP header
2. `req.headers["x-forwarded-for"]` - Standard reverse proxy header
3. `req.socket.remoteAddress` - Direct connection fallback

This pattern is used consistently across routes and middleware.

### External Dependencies

- **ip-api.com**: Free IP geolocation service (no auth required) - used for IP location, ISP, and proxy detection
- **System `dig` command**: Required for DNS lookups - the Dockerfile installs `bind-tools` on Alpine Linux to provide this

### Views

- Uses express-handlebars with a main layout
- `views/index.handlebars` - IP/UA lookup display
- `views/dns.handlebars` - DNS records display
- `public/styles.css` - Stylesheet

## Key Endpoints

- `GET /` - Web UI showing IP and user agent information
- `GET /api` - JSON API returning same IP/UA data
- `GET /dns/:domain` - Web UI showing DNS records for a domain
- `GET /api/dns/:domain` - JSON API for DNS records
- `GET /status` - Health check endpoint returning version

## Docker Deployment

The Dockerfile is configured for Alpine Linux and includes:
- Node.js 18
- `bind-tools` package (provides the `dig` command)
- Exposes port 3000

## Important Notes

- The application expects to run behind a reverse proxy that sets `x-forwarded-for` headers
- DNS lookups require the `dig` command to be available on the system
- DNS cache is in-memory only and will be lost on restart
- No tests are currently present in the codebase
