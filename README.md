# E-Learn Monorepo

This repository now contains:
- `web`: React app (Vite) ported from your static HTML
- `mobile`: Flutter app skeleton with basic API calls
- `server`: Node/Express backend (optional)

You asked for React and Flutter code in GitHub — both are included.

## Folders
- `web/` → React app entry at `src/main.jsx`, routes in `src/App.jsx`
- `mobile/` → Flutter app entry at `lib/main.dart`
- `server/` → Express API entry at `src/app.js` (optional)

## Notes
- React dev server expects API at `/api` (proxy to `http://localhost:4000`).
- Flutter app uses `http://localhost:4000` by default; change `baseUrl` in `lib/main.dart` if needed.


