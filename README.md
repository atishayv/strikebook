# Strikebook

Strikebook is a static React app for exploring an illustrative options chain. It
does not provide live prices, place orders, or produce validated trading
signals.

## Run locally

### Requirements

- Node.js and npm

### Start the development server

From the project directory, install the dependencies and start the server:

```sh
npm install
npm run dev
```

Open [http://localhost:8000](http://localhost:8000). The dev command builds the
app and serves the project directory; it watches the source files and rebuilds
when they change. Stop it with `Ctrl+C`.

To create a production bundle without starting the server:

```sh
npm run build
```

Run the tests with:

```sh
npm test
```

## Publish with GitHub Pages

This project is a static site and can be published from the repository root.
The checked-in `dist/app.js` bundle must be up to date with the source.

1. Build the app locally:

   ```sh
   npm install
   npm run build
   ```

2. Commit and push the project files, including `dist/app.js`, to your GitHub
   repository's publishing branch (usually `main`).
3. In the repository on GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the publishing branch and the `/(root)` folder, then click **Save**.
6. Wait for the Pages deployment to finish. GitHub will show the published URL
   in the Pages settings; it is typically
   `https://<your-github-username>.github.io/<repository-name>/`.

Whenever you change app code, run `npm run build` and commit the updated
`dist/app.js` before pushing. The `index.html` uses relative asset paths, so the
site works both at the repository's GitHub Pages URL and when served locally.
