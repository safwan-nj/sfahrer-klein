# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

update browser list:
npx update-browserslist-db@latest

start project:
yarn vite
or
yarn vite --host


###### ######################## ######
Full Project construction:
###### ######################## ######

├── .blackboxrules
├── .eslintrc.cjs
├── .gitattributes
├── .gitignore
├── README.md
├── barcode.html
├── dev-dist
    ├── registerSW.js
    ├── sw.js
    └── workbox-54d0af47.js
├── index.html
├── manifest.json
├── package.json
├── postcss.config.js
├── public
    ├── favicon.png
    ├── icon.png
    ├── logo192.png
    ├── logo512.png
    └── vite.svg
├── src
    ├── App.jsx
    ├── Components
    │   ├── ButtonPrimary
    │   │   └── ButtonPrimary.jsx
    │   ├── Camera
    │   │   ├── Camera.css
    │   │   └── Camera.jsx
    │   ├── Card
    │   │   ├── Card.css
    │   │   └── Card.jsx
    │   ├── CardList
    │   │   ├── CardList.css
    │   │   └── CardList.jsx
    │   ├── CustomerOptions
    │   │   ├── CustomerOptions.css
    │   │   ├── CustomerOptions.jsx
    │   │   └── CustomerOptionsLine.jsx
    │   ├── CustomerRow
    │   │   ├── CustomerRow.css
    │   │   └── CustomerRow.jsx
    │   ├── CustomerSignature
    │   │   ├── CustomerSignature.css
    │   │   ├── CustomerSignature.jsx
    │   │   ├── Modal.css
    │   │   ├── Modal.jsx
    │   │   └── Sign.jsx
    │   ├── Grids
    │   │   ├── Grids.css
    │   │   └── Grids.jsx
    │   ├── InputPrimary
    │   │   └── InputPrimary.jsx
    │   ├── Navbar
    │   │   ├── Navbar.css
    │   │   ├── Navbar.jsx
    │   │   ├── SidebarData-bup.jsx
    │   │   └── SidebarData.jsx
    │   ├── PreviewModal
    │   │   └── PreviewModal.jsx
    │   └── index.jsx
    ├── Pages
    │   ├── Final
    │   │   ├── Final.css
    │   │   └── Final.jsx
    │   ├── Home
    │   │   ├── Home copy.jsx
    │   │   ├── Home.css
    │   │   └── Home.jsx
    │   ├── Kassa
    │   │   ├── Kassa.css
    │   │   └── Kassa.jsx
    │   ├── KassaList
    │   │   ├── KassaList.css
    │   │   └── KassaList.jsx
    │   ├── Retour
    │   │   ├── ArtikelCard.jsx
    │   │   ├── ArtikelPopup.jsx
    │   │   ├── ArtikelPopup1.jsx
    │   │   ├── CustomerCard.css
    │   │   ├── CustomerCard.jsx
    │   │   ├── CustomerPopup.jsx
    │   │   ├── Retour.css
    │   │   ├── Retour.jsx
    │   │   ├── Retour1.jsx
    │   │   └── distriputed
    │   │   │   ├── AddEntryPopup.jsx
    │   │   │   ├── ArtikelInput.jsx
    │   │   │   ├── EntryList.jsx
    │   │   │   ├── KundeNummerPopup.jsx
    │   │   │   ├── Retour.jsx
    │   │   │   ├── api.jsx
    │   │   │   └── useRetour.jsx
    │   ├── Splash
    │   │   ├── Splash.css
    │   │   └── Splash.jsx
    │   ├── Support
    │   │   ├── Support.css
    │   │   └── Support.jsx
    │   ├── Tour
    │   │   ├── Tour.css
    │   │   └── Tour.jsx
    │   ├── TourList
    │   │   ├── TourList.css
    │   │   ├── TourList.jsx
    │   │   └── TourListBup.jsx
    │   ├── Tutorial
    │   │   ├── Tutorial.css
    │   │   ├── Tutorial.jsx
    │   │   ├── TutorialCard.css
    │   │   └── TutorialCard.jsx
    │   └── index.jsx
    ├── Redux
    │   ├── basketSlice.jsx
    │   ├── customerSlice.jsx
    │   ├── invoicesSlice.jsx
    │   ├── jobSlice.jsx
    │   ├── kassaSlice.jsx
    │   ├── optionsSlice.jsx
    │   ├── requestSlice.jsx
    │   ├── restaurantSlice.jsx
    │   ├── scannedInvoicesSlice.jsx
    │   ├── tourSlice.jsx
    │   └── userLocationSlice.jsx
    ├── Services
    │   ├── AxiosConnect-test.jsx
    │   ├── AxiosConnect.jsx
    │   ├── CreateJobs.jsx
    │   ├── EnterFullScreen.jsx
    │   ├── GeocodeAddress.jsx
    │   ├── GetCurrentCoordinates.jsx
    │   ├── GetLocalStorageItems.jsx
    │   ├── NormalDate.jsx
    │   ├── OptimizerConnect.jsx
    │   ├── RootNavigator.jsx
    │   └── index.jsx
    ├── assets
    │   ├── favicon.png
    │   ├── icon.png
    │   ├── icon192.png
    │   ├── images
    │   │   ├── retour1.png
    │   │   ├── retour1o.png
    │   │   ├── retour2.png
    │   │   ├── retour2o.png
    │   │   ├── retour3.png
    │   │   ├── retour3o.png
    │   │   ├── retour4.png
    │   │   ├── retour4o.png
    │   │   ├── retour5.png
    │   │   ├── retour5o.png
    │   │   ├── retour6.png
    │   │   ├── retour6o.png
    │   │   ├── retour7.png
    │   │   ├── retour7o.png
    │   │   ├── support1.png
    │   │   ├── support1o.png
    │   │   ├── support2.png
    │   │   ├── support2o.png
    │   │   ├── support3.png
    │   │   ├── support3o.png
    │   │   ├── tut1.png
    │   │   ├── tut1o.png
    │   │   ├── tut2.png
    │   │   ├── tut2o.png
    │   │   ├── tut3.png
    │   │   ├── tut3o.png
    │   │   ├── tut4.png
    │   │   ├── tut4o.png
    │   │   ├── tut5.png
    │   │   ├── tut5o.png
    │   │   ├── tut6.png
    │   │   ├── tut6o.png
    │   │   ├── tut71.png
    │   │   ├── tut71o.png
    │   │   ├── tut72.png
    │   │   ├── tut72o.png
    │   │   ├── tut73.png
    │   │   ├── tut73o.png
    │   │   ├── tut74.png
    │   │   ├── tut74o.png
    │   │   ├── tut75.png
    │   │   ├── tut75o.png
    │   │   ├── tut76.png
    │   │   ├── tut76o.png
    │   │   ├── tut8.png
    │   │   ├── tut8o.png
    │   │   ├── tut9.png
    │   │   └── tut9o.png
    │   ├── klLogo.png
    │   ├── klLogo1.png
    │   ├── react.svg
    │   ├── wicht.png
    │   ├── wichtig.jpg
    │   └── wichtig.png
    ├── main.css
    ├── main.jsx
    └── store.jsx
├── tailwind.config.js
├── vite.config.js
└── yarn.lock