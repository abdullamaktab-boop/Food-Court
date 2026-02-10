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
- Add item photos by direct URL **or local file upload**
- Menu editing protected by Firebase Auth sign-in
- Shared menu data with Firestore (all devices see the same updates)
- Images stored in Firebase Storage
- Subtle idle/entry animations for hero and cards
- Food images shown fully inside cards (mobile-first framing)

## Firebase setup (required)

### 1) Create Firebase resources

- Firebase project
- Firestore Database (production mode)
- Firebase Storage
- Authentication > Email/Password enabled
- Create at least one admin user

### 2) Configure web app keys

Copy `firebase-config.example.js` to `firebase-config.js` and replace values with your Firebase web config.

### 3) Firestore rules (example)

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

### 4) Storage rules (example)

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
