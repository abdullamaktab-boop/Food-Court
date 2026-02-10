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
- Admin password gate for opening menu editor
- Image URL workflow (no Firebase, no external backend)
- Subtle idle/entry animations for hero and cards
- Food images shown fully inside cards (mobile-first framing)

## Important behavior

This version is fully static and uses `localStorage`:

- Menu edits are saved only in the same browser/device where edits are made
- Other devices will not automatically receive those edits

Default admin password on first run: `foodcourt123`

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
