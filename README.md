# Registration Process Portal

Responsive registration and login portal built with React (Vite), Formik, Yup, Axios and custom CSS.

## Features
- Reusable form components (FormInput, FormSelect, RadioGroup, FormCheckbox, Button, Alert)
- Formik form state + Yup schema validation (inline, touched-based errors)
- Registration and login with a shared service layer and custom hooks
- Registered accounts are saved in `localStorage` so you can log in after signing up
- Loading, error and success states
- Fully responsive (2-column desktop, 1-column mobile), accessible labels and aria attributes

## Run
```
npm install
npm run dev
```

## Flow
1. Register with email and password.
2. Open **Continue to login** (or **Log in** from the form footer).
3. Sign in with the same email and password.
4. Use **Log out** to return to the login screen.

## API
Registration accounts are saved in the current browser's `localStorage`, and login checks those locally saved accounts. This demo does not create accounts on a server; browser storage is cleared if the site's local data is removed. A backend must be connected for accounts to be shared across browsers or devices.
