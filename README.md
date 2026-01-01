# ku-lost-and-found
KU Lost & Found is a platform for Kasetsart University students and staff to report, search for, and recover lost items on campus easily and efficiently.

## Development (Monorepo)
```
npm install
npm run dev:frontend
npm run dev:backend
```

.env
```
DATABASE_URL=
NEXTAUTH_SECRET=
API_SERVER_URL=
```

### API
View api document at **localhost:8000/openapi** after running the backend server

### Note
- Use eden to use type-safe api call in frontend
- Use auth.js for google auth **(.ku.th mail only)**
