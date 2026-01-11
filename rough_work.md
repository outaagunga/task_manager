
# ✅ The simple terminal solution

From your project folder, run:

```bash
firebase functions:config:set \
  vite.firebase_api_key="YOUR_API_KEY" \
  vite.firebase_auth_domain="YOUR_AUTH_DOMAIN" \
  vite.firebase_project_id="YOUR_PROJECT_ID" \
  vite.firebase_storage_bucket="YOUR_STORAGE_BUCKET" \
  vite.firebase_messaging_sender_id="YOUR_SENDER_ID" \
  vite.firebase_app_id="YOUR_APP_ID"
```

(Use the values from Firebase → Project Settings → Your Web App)

Then run:

```bash
firebase deploy
```
