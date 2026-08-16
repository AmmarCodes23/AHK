# Deploy the AHK R2 worker (one-time, from this directory)

# 1. Log in to Cloudflare
npx wrangler login

# 2. Create the bucket
npx wrangler r2 bucket create ahk-files

# 3. Set the upload API key (same value as WORKER_UPLOAD_API_KEY in ahk-web/.env.local)
npx wrangler secret put API_KEY

# 4. Deploy
npx wrangler deploy

# After deploy, confirm WORKER_UPLOAD_URL in ahk-web/.env.local matches the workers.dev URL.
