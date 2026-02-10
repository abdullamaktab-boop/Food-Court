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
- **Option A:** Image URL only (no Firebase Storage uploads/cost)
- Subtle idle/entry animations for hero and cards
- Food images shown fully inside cards (mobile-first framing)

## Option A setup (free-friendly)

### 1) Firebase services to enable

- Firestore Database
- Authentication → Email/Password

(Do **not** enable/use Firebase Storage for this option.)

### 2) Configure Firebase keys

Edit `firebase-config.js` and paste your Firebase web config values.

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

### 4) Admin account

In Firebase Authentication, create your admin email/password. Use those to sign in from **Manage Menu**.

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
