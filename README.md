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
- Menu editing protected by an admin password
- Subtle idle/entry animations for hero and cards
- Food images shown fully inside cards (mobile-first framing)
- Saved changes using `localStorage`

## Admin password

- Default password on first run: `foodcourt123`
- Open **Manage Menu** and use the **Security** section to change it right away.

## Run locally

Open `index.html` directly in a browser, or run a quick static server:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
