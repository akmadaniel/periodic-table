# Periodic Table of People

Interactive 3D "periodic table" built with React, Vite and three.js (CSS3D).
After Google sign-in it reads people from a Google Sheet and shows them as tiles
coloured by net worth, in four layouts: Table (20x10), Sphere, Double Helix and Grid (5x4x10).

Live demo: https://akmadaniel.github.io/periodic-table/

## Net worth colours
- Red: under $100K
- Orange: $100K to $200K
- Green: over $200K

## Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) 20 or newer (check with `node -v`)
- Git
- A Google account

### 2. Clone and install
```bash
git clone https://github.com/akmadaniel/periodic-table.git
cd periodic-table
npm install
```

### 3. Create the Google Sheet
1. Go to https://sheets.new.
2. Choose **File > Import > Upload** and select the data CSV (columns: Name, Photo, Age, Country, Interest, Net Worth).
3. Choose **Replace spreadsheet** and click **Import data**.
4. (Optional) Click **Share** to give other people view access.
5. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`.

### 4. Create the Google Cloud project and OAuth client
1. Open https://console.cloud.google.com and create a new project.
2. Go to **APIs & Services > Library**, search **Google Sheets API** and click **Enable**.
3. Go to **APIs & Services > OAuth consent screen**:
   - Set the audience to **External** and keep it in **Testing**.
   - Add every account that will sign in (including yours) under **Test users**.
   - Under **Data Access**, add the scope `https://www.googleapis.com/auth/spreadsheets.readonly`.
4. Go to **Clients > Create client**, choose **Web application**, and add these **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - your deployed origin, e.g. `https://<username>.github.io`
5. Click **Create** and copy the **Client ID**.

The signed-in Google account must be able to view the Sheet.

### 5. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_CLIENT_ID=<your OAuth client ID>
VITE_SHEET_ID=<your Sheet ID>
```
`.env` is gitignored and must not be committed.

### 6. Run locally
```bash
npm run dev
```
Open http://localhost:5173/periodic-table/ and click **Sign in with Google**.
Use the **TABLE / SPHERE / HELIX / GRID** buttons to switch layouts. Drag to rotate, scroll to zoom.

### 7. Build for production
```bash
npm run build
npm run preview
```
The static site is generated in `dist/`.

## Deploy to GitHub Pages
1. Push the repository to GitHub.
2. In **Settings > Pages**, set **Source** to **GitHub Actions**.
3. In **Settings > Secrets and variables > Actions > Variables**, add `VITE_CLIENT_ID` and `VITE_SHEET_ID`.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys the site.
5. If the repository name is not `periodic-table`, update `base` in `vite.config.js`.

## Troubleshooting
| Problem | Fix |
|---|---|
| Blank page when deployed | `base` in `vite.config.js` must match the repository name |
| "origin_mismatch" on sign-in | Add the page's origin to the OAuth client's authorized JavaScript origins |
| "access_denied" on sign-in | Add the account as a Test user on the OAuth consent screen |
| `Sheets API 403` | Enable the Google Sheets API and make sure the account can view the Sheet |
| `Sheets API 401` | The token expired (about 1 hour). Refresh and sign in again |

## Structure
```
src/
  App.jsx            login gate, token handling
  PeriodicScene.jsx  three.js CSS3D scene and layout buttons
  layouts.js         position/orientation for each layout
  sheet.js           Google Sheets fetch and parsing
  color.js           net worth to colour
```
