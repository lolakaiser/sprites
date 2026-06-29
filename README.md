# Fortnite Sprite Tracker
Shared collection tracker for Lola, Nate, Carly, Alex, Jake & Stylar.

## Deploy to Vercel (one time, ~10 min)

### 1. MongoDB Atlas
1. Log in at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster** if you don't have one
3. **Database Access** → Add a user with a username + password (save these)
4. **Network Access** → Add IP address `0.0.0.0/0` (allows Vercel to connect)
5. Click your cluster → **Connect** → **Drivers** → copy the connection string
   - Looks like: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password

### 2. GitHub
1. Create a new **public** repo named `sprite-tracker`
2. Upload all these files keeping the exact folder structure:
```
sprite-tracker/
├── api/
│   └── sprites.js
├── public/
│   └── index.html
├── package.json
├── vercel.json
└── README.md
```

### 3. Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
2. Before deploying, go to **Environment Variables** and add:
   - **Name:** `MONGODB_URI`
   - **Value:** your MongoDB connection string from step 1
3. Click **Deploy** ✅

### 4. Share the link!
Your app will be at `https://sprite-tracker-XXXXX.vercel.app`  
Send that URL to Nate, Carly, Alex, Jake & Stylar — everyone shares the same live data.

---

## How to use
- **My Collection** — tap your name, tap any sprite variant to check/uncheck it
- **Group Overview** — see who has each sprite across all 6 players, filter by Base/Gold/Gummy/Galaxy
- **Sprite Info** — tap any sprite card to see its ability and all variant bonuses
