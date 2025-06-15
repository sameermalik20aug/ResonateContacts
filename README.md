# Question 1: Short Code Generator

- Access at: https://codepen.io/Sameer-Malik-the-scripter/pen/zxGaPOa

- Description: Generates 7-character codes (SS-TTTT) for store IDs (0–199) and transaction IDs (1–10000). Store IDs are encoded in base-36 (0–199 → 00–5J). Transactions 1–9999 use four digits (0001–9999); 10000 maps to ZZZZ. Decodes codes with today’s date. Codes are readable (7 chars, hyphen-separated) and validated to prevent invalid inputs.

- Safety: Strict regex (/^[0-9A-Z]{2}-([0-9]{4}|ZZZZ)$/) ensures valid format.

# Question 2: Contacts App for Resonate

## Live Demo
- Access at: https://resonate-contacts-one.vercel.app/
- Features: Contacts from JSONPlaceholder API with search, sort, modal, JSON export, document count (“Showing X contacts”). Navy/orange design, error handling, footer, Jest tests.
## Files
- `index.html`: Deployed React app.
- `App.js`: Testable component.
- `App.test.js`: Jest tests.
- `.gitignore`: Excludes `node_modules`.
- `jest.setup.js`: Jest mock setup.
- `package.json`: Test dependencies.
- `babel.config.js`: Babel config for JSX.
## Run Locally
1. Save `index.html` and open in a browser.
2. Or: `npm install -g serve`, then `serve`, visit `http://localhost:3000`.
## Run Tests
1. Install Node.js (nodejs.org).
2. Run `npm install`.
3. Run `npm test` (7 tests).
## Contact
- Sameer Malik (sameermalik20aug@gmail.com)