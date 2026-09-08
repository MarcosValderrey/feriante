# Feriante PWA

A simple offline-first web application for managing sales at fairs.

Feriante was originally developed as a Chrome Extension and later rebuilt as a Progressive Web App (PWA) so it can be accessed from a normal browser, including mobile devices.

The application is designed for small-scale sellers who need a simple way to record sales and understand their selling activity without requiring an internet connection or a server.

## Features

* Product management
* Organizer management
* Workday management
* Sales recording
* Sales history by workday
* Sales summary and rankings
* Local data persistence using IndexedDB
* Offline-first operation
* JSON data import for development and migration
* Database reset tools for development

## Architecture

Feriante is intentionally a **local-first application**.

```text
                Netlify
                   │
                   ▼
              React / PWA
                   │
                   ▼
               IndexedDB
                   │
                   ▼
             User's browser
```

The deployed application provides the application code, while the user's data remains in the browser.

There is currently:

* No backend
* No user authentication
* No server-side database
* No account system
* No synchronization between devices

This keeps the application simple and allows it to work offline after the application has been loaded.

## Domain Model

The application is organized around four main entities:

```text
Organizer
    │
    └── Workday
            │
            └── Sale ─── Product
```

### Organizer

Represents an organization, fair, or other place/event where products are sold.

### Workday

Represents a particular selling day associated with an organizer.

### Sale

Represents a product sale recorded during a workday.

### Product

Represents a product that can be sold.

Historical sale prices are stored on the sale itself rather than on the product, allowing the same product to have different prices over time.

## Technology

* React
* Vite
* React Bootstrap
* Bootstrap
* Bootstrap Icons
* IndexedDB
* Progressive Web App APIs
* Netlify

## Project Structure

```text
feriante-pwa/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── db/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Services

The service layer provides access to the application's domain data without coupling the domain logic to the UI.

Examples include:

* Products
* Sales
* Workdays
* Organizers
* Summary calculations

### Database

IndexedDB is used as the application's persistent data store.

The database currently contains:

```text
feriante
├── products
│   └── name
├── organizers
├── workdays
│   ├── organizerId
│   └── date
└── sales
    ├── workdayId
    └── productId
```

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Development Data

The application includes development fixtures that can be imported through the developer tools.

The import layer uses **semantic references** such as product and organizer names rather than database IDs. This makes fixture data portable between databases and allows it to be used for migrations.

For example:

```json
{
    "products": [
        {
            "name": "Pulsera"
        }
    ],
    "organizers": [
        {
            "name": "Feria Artesanal"
        }
    ]
}
```

The migration layer resolves these references against the current database and creates the corresponding entities when necessary.

## Data and Privacy

Because data is stored in IndexedDB, it belongs to the browser profile in which Feriante is being used.

Clearing browser data can therefore remove application data.

At the current stage, Feriante does not provide cloud backup or synchronization.

A future version could introduce:

* Data export/import
* Cloud synchronization
* User accounts
* Multi-device access
* Server-side backups

These are intentionally outside the current scope.

## Origin

Feriante started as a Chrome Extension prototype intended to explore browser extension capabilities and to solve a real-world problem for a small seller.

The original extension remains in a separate repository as a reference implementation.

The PWA is a clean implementation of the same domain using standard web technologies, allowing the application to be accessed from desktop and mobile browsers.

## Current Status

**Prototype / validation stage.**

The application is functional and deployable, but it is not intended to be treated as a finished commercial product yet.

The next important step is not adding more functionality. It is observing how the application performs when used by a real person and determining whether the problem is valuable enough to justify further development.

## Possible Future Work

Ideas and potential improvements should be evaluated based on actual usage rather than implemented simply because they are technically interesting.

Potential areas include:

* Data backup and export
* Improved mobile experience
* More detailed sales analysis
* Product images
* Multi-device synchronization
* User accounts
* Cloud storage

These remain possibilities rather than commitments.
