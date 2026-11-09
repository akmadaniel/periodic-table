# Periodic Table of People

Interactive 3D "periodic table" built with React, Vite and three.js (CSS3D).
After Google sign-in it reads people from a Google Sheet and shows them as tiles
coloured by net worth, in four layouts: Table (20x10), Sphere, Double Helix and Grid (5x4x10).

## Net worth colours
- Red: under $100K
- Orange: $100K to $200K
- Green: over $200K

## Run locally
```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

| Variable | Description |
|---|---|
| `VITE_CLIENT_ID` | Google OAuth Web client ID |
| `VITE_SHEET_ID` | ID of the Google Sheet holding the data |

The OAuth client needs `http://localhost:5173` and the deployed origin as authorized JavaScript origins,
and the Sheets API must be enabled on the Cloud project. The app requests the read-only Sheets scope.

## Structure
```
src/
  App.jsx            login gate, token handling
  PeriodicScene.jsx  three.js CSS3D scene and layout buttons
  layouts.js         position/orientation for each layout
  sheet.js           Google Sheets fetch and parsing
  color.js           net worth to colour
```
