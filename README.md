# Food Court Digital Menu

Single-page menu website for **Food Court** with these sections:

- Burger Factory
- MeatMe Mexicano
- PIZZARIA
- Baristo
- Tablo's Bakery

## Features

- Single landing page with section tabs
- Category-based item layout
- Item cards with image, name, price (IQD), description, and Halal tag
- Dark and light mode toggle
- Browser-based menu management panel (add/edit/delete)
- Admin login with Firebase Authentication
- Shared menu for all visitors using Firestore real-time sync
- Image upload from phone/PC via Cloudinary unsigned preset (free-friendly)
- Manual Image URL still supported
- Subtle idle/entry animations for hero and cards
- Food images shown fully inside cards (mobile-first framing)

## Setup (no Firebase Storage required)

### 1) Enable Firebase services

- Firestore Database
- Authentication → Email/Password

### 2) Create Firebase admin account

In Firebase Authentication, create your admin email/password.

### 3) Firestore rules

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4) Create Cloudinary free account

- Go to Cloudinary dashboard
- Copy your **Cloud Name**
- Create an **Unsigned Upload Preset**
  - Settings → Upload → Upload presets → Add upload preset
  - Signing mode: **Unsigned**

### 5) Fill config in `firebase-config.js`

```js
window.FOOD_COURT_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  cloudinaryCloudName: "...",
  cloudinaryUploadPreset: "..."
};
```

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
