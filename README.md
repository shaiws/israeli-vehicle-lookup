# Israeli Vehicle Lookup

Hebrew RTL web app for looking up Israeli vehicle registration data by license plate number, using the official Ministry of Transport open datasets on [data.gov.il](https://data.gov.il) (CKAN `datastore_search`).

**Live site:** https://shaiws.github.io/israeli-vehicle-lookup/

Deployed from this repository to GitHub Pages.

## Features

- Enter a 5–8 digit plate (digits only; hyphens allowed in input)
- Queries the active private/commercial registry first
- If empty, fans out to motorcycles, heavy vehicles, public vehicles, inactive, and final-cancellation datasets
- Always pulls odometer/test history, ownership-type history, continuation fields, and plate-level recalls when available
- Hebrew field labels, RTL layout, loading / empty / error states
- Explicit notice that MOT open data contains **technical vehicle fields only** — no private owner PII

## Data sources

| Dataset | resource_id |
|---------|-------------|
| Active private/commercial | `053cea08-09bc-40ec-8f7a-156f0677aff3` |
| Active continuation (tires/tow) | `0866573c-40cd-4ca8-91d2-9dd2d7a492e5` |
| History — odometer / tests | `56063a99-8a3e-4ff4-912e-5966c0279bad` |
| Ownership-type history | `bb2355dc-9ec7-4f06-9c3f-3344672171da` |
| Final cancellation | `851ecab1-0622-4dbe-a6c7-f950cf82abf9` |
| Older cancellation archives | `4e6b9724-4c1e-43f0-909a-154d4cc4e046`, `ec8cbc34-72e1-4b69-9c48-22821ba0bd6c` |
| Inactive (no model) | `6f6acd03-f351-4a8f-8ecf-df792f4f573a` |
| Inactive (with model) | `f6efe89a-fb3d-43a4-bb61-9bf12a9b9099` |
| Heavy | `cd3acc5c-03c3-4c89-9c54-d40f93c0d790` |
| Motorcycles | `bf9df4e2-d90d-4c0a-a400-19e15af8e95f` |
| Public vehicles | `cf29862d-ca25-4691-84f6-1be60dcb4a1e` |
| Recalls by plate (`hagbalat_recall`) | `36bf1404-0be4-49d2-82dc-2f1ead4a8b93` |

API endpoint: `https://data.gov.il/api/3/action/datastore_search` with filter `mispar_rechev` (or `MISPAR_RECHEV` for recalls).

## CORS

Browser calls go **directly** to `data.gov.il`. The CKAN API responds with `Access-Control-Allow-Origin: *`, so GitHub Pages and local dev work without a proxy.

## Run locally

Requirements: Node.js 20+, npm.

```bash
npm install
npm run dev
```

Dev server: http://localhost:5174 (binds `0.0.0.0`).

Build:

```bash
npm run build
npm run preview
```

## Deploy

Push to `main` runs GitHub Actions workflow `.github/workflows/deploy-pages.yml` (build + `actions/deploy-pages`). Site base path: `/israeli-vehicle-lookup/`.

## Privacy

This app only displays fields returned by MOT open data (manufacturer, model, color, engine, test dates, ownership **type**, etc.). It does not invent or request private owner identity data.
## Android (Flutter) app

Play package id: **il.shaiws.vehiclelookup**

Sources live in [`mobile/`](mobile/). Store listing draft: [`mobile/STORE_LISTING.md`](mobile/STORE_LISTING.md).

### Build a release App Bundle (.aab)

Prerequisites on the machine: Flutter stable, Android SDK (`ANDROID_HOME`), JDK 17+, and a local upload keystore.

1. Place signing config at `mobile/android/key.properties` (gitignored) pointing at your upload `.jks` (see Flutter docs).
2. From `mobile/`:

```bash
flutter pub get
flutter build appbundle --release
```

Output: `mobile/build/app/outputs/bundle/release/app-release.aab`

Upload that AAB in Google Play Console (Create app → Production/Internal testing → Create new release). Do not commit `key.properties` or the keystore.
