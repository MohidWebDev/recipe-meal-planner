# Recipe & Meal Planner

A full-stack **MERN** app for saving recipes, planning meals for the week and automatically building a shopping list from those plans.

Users sign up, build a personal recipe collection, drop recipes into a 7-day planner (breakfast / lunch / dinner / snack), and the app works out exactly which ingredients to buy, scaled to the number of servings planned. The shopping list is built with a MongoDB aggregation pipeline.

---

## Table of contents

- [Features and mentor requirements](#features-and-mentor-requirements)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Getting started on Windows](#getting-started-on-windows)
- [Environment variables](#environment-variables)
- [Demo credentials](#demo-credentials)
- [API reference](#api-reference)
- [How the shopping list aggregation works](#how-the-shopping-list-aggregation-works)
- [Troubleshooting](#troubleshooting)
- [Future improvements](#future-improvements)

---

## Features and mentor requirements

| Requirement | How it is implemented |
| --- | --- |
| **Full CRUD** | Recipes: create, list, view, update and delete (`/api/recipes`). Meal plans: create, list by date range, update (recipe, date, meal type, servings) and delete (`/api/meal-plans`). Deleting a recipe also removes the meal plans that used it. |
| **Authentication** | Register and log in with email and password. Passwords are hashed with **bcrypt** in a Mongoose pre-save hook and are never returned (`select: false`). The API issues a **JWT**, which the client keeps in `localStorage` and sends as a `Bearer` token. Every route except register, login and health is protected, and every query is scoped to `req.user.id`, so users only ever see their own data. |
| **Pagination and search** | `GET /api/recipes` supports `page` and `limit` (default 9, max 50), a case-insensitive **title search** (input is regex-escaped), filters for `cuisine`, `maxTime`, `ingredient` and `tag`, and `sort` (`newest`, `oldest`, `title`, `cookTime`). It returns `{ data, total, page, pages }`. The UI has a debounced search bar, filters and page controls, all stored in the URL. |
| **Validation** | **Server:** `express-validator` rules for auth, recipes and meal plans, run through one shared `validate` middleware that returns `400` with `errors: [{ field, message }]`. Mongoose schema validation acts as a second layer. A duplicate email returns `409`. **Client:** the same rules run in the forms, and server errors are mapped back onto the matching fields, including individual ingredient rows. |
| **Aggregation** | `GET /api/shopping-list` uses a `$match → $lookup → $unwind → $unwind → $project → $group → $sort` pipeline to total every ingredient for a date range, scaled by planned servings. Two more pipelines power `GET /api/stats/top-ingredients` and `GET /api/stats/meals-by-cuisine`. |

### Other features

- **Recipe form:** one shared form for create and edit, with dynamic ingredient rows (add and remove), unit suggestions, tags, and field-level errors.
- **Recipe detail:** full view with ingredients and numbered steps, plus edit and delete. Delete asks for confirmation in a modal first.
- **Weekly planner:** a 7-day grid with four meal slots per day and previous, next and "this week" navigation. A modal lets you search for a recipe, choose servings (defaults to the recipe's servings) and add or edit the meal. Meals can be removed with one click.
- **Shopping list:** the date range defaults to the current week. Items can be ticked off (kept in the browser only), and a button copies the remaining items to the clipboard. Each item shows which recipes need it.
- **Stats card** on the planner: your top 5 ingredients and your planned meals per cuisine.
- **UX details:** toasts for success and error messages, inline form errors, loading and empty states, a responsive layout from phone to desktop, and automatic logout when the token expires (the axios response interceptor handles `401`).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Database | MongoDB + Mongoose |
| API | Node.js, Express 5, ES modules |
| Auth | bcryptjs, jsonwebtoken (JWT) |
| Validation | express-validator + Mongoose schema validators |
| Logging / misc | morgan, cors, dotenv, nodemon (dev) |
| Client | React 19 (Vite), React Router, axios |
| Styling | Tailwind CSS v4 |

---

## Folder structure

```
recipe-meal-planner/
├── README.md
├── .gitignore
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js                  # Express app: middleware, routes, 404 + error handler
│       ├── server.js               # Loads env, connects to MongoDB, starts the server
│       ├── seed.js                 # Demo user + 8 recipes + a week of meal plans
│       ├── config/db.js
│       ├── models/                 # User, Recipe, MealPlan
│       ├── controllers/            # auth, recipe, mealPlan, shoppingList, stats
│       ├── routes/                 # URL → controller mapping only
│       ├── middleware/             # auth (JWT), validate, error (notFound + errorHandler)
│       ├── validators/             # auth, recipe, mealPlan, common (id param)
│       └── utils/                  # ApiError, asyncHandler, generateToken, date, escapeRegex
└── client/
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/                    # axios instance + one module per resource
        ├── context/                # AuthContext, ToastContext
        ├── hooks/                  # useAuth, useDebounce, useToast
        ├── components/
        │   ├── common/             # Navbar, ProtectedRoute, Pagination, SearchBar, Loader, Modal, ConfirmModal
        │   ├── recipes/            # RecipeCard, RecipeFilters, RecipeForm, IngredientRows
        │   └── planner/            # WeekGrid, MealSlot, AddMealModal, StatsCard
        ├── pages/                  # Login, Register, Recipes, RecipeDetail, RecipeCreate, RecipeEdit, Planner, ShoppingList, NotFound
        └── utils/                  # dateHelpers, constants
```

Conventions used throughout the code:

- Routes only map URLs to controllers. All logic lives in the controllers.
- Controllers are wrapped in `asyncHandler` and throw an `ApiError`. A single error middleware turns every error into `{ message, errors? }`.
- Components never call axios directly. They go through the `client/src/api/` modules.

---

## Getting started on Windows

### Prerequisites

1. **Node.js 20.19+ or 22 LTS.** Download it from <https://nodejs.org> and check with `node -v`.
2. **MongoDB**, either:
   - **MongoDB Community Server**, installed locally (the default installer runs it as a Windows service on port 27017), or
   - a free **MongoDB Atlas** cluster. Copy its connection string into `MONGO_URI`.
3. **Git**

The commands below work in both **PowerShell** and **Git Bash** unless a block says otherwise.

### 1. Clone and install

```bash
git clone https://github.com/MohidWebDev/recipe-meal-planner.git
```

```bash
cd recipe-meal-planner
```

```bash
npm install --prefix server
```

```bash
npm install --prefix client
```

### 2. Create the `.env` files

PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Git Bash:

```bash
cp server/.env.example server/.env && cp client/.env.example client/.env
```

Open `server/.env` and set `JWT_SECRET` to any long random string. If you use Atlas, set `MONGO_URI` as well.

> Tip: to generate a secret, run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Seed the demo data (optional, recommended)

```bash
npm run seed --prefix server
```

This creates the demo account with 8 recipes and a full week of meal plans for the **current** week. You can run it again at any time; it only resets the demo user's data.

### 4. Run the app (two terminals)

Terminal 1, the API on <http://localhost:5000/api>:

```bash
npm run dev --prefix server
```

Terminal 2, the React app on <http://localhost:5173>:

```bash
npm run dev --prefix client
```

Open <http://localhost:5173> and log in with the demo account.

### Available scripts

| Folder | Script | Description |
| --- | --- | --- |
| `server` | `npm run dev` | Start the API with nodemon (auto-restart) |
| `server` | `npm start` | Start the API with node |
| `server` | `npm run seed` | Reset and seed the demo account |
| `client` | `npm run dev` | Start the Vite dev server |
| `client` | `npm run build` | Production build into `client/dist` |
| `client` | `npm run preview` | Preview the production build |

---

## Environment variables

### `server/.env`

| Variable | Example | Description |
| --- | --- | --- |
| `PORT` | `5000` | Port the API listens on |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/recipe-meal-planner` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | `a-long-random-string` | Secret used to sign JWTs (**required**) |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin(s), comma-separated |
| `NODE_ENV` | `development` | `production` hides internal error messages |

### `client/.env`

| Variable | Example | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the API (including `/api`) |

`.env` files are git-ignored. Only the `.env.example` templates are committed.

---

## Demo credentials

| Email | Password |
| --- | --- |
| `demo@example.com` | `demo1234` |

The login page also has a **"Fill in demo credentials"** button.

---

## API reference

Base URL: `http://localhost:5000/api`. Routes marked 🔒 need an `Authorization: Bearer <token>` header.

### Health and auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | – | API and database status |
| POST | `/auth/register` | – | `{ name, email, password }` → `201 { token, user }`. `409` if the email is taken |
| POST | `/auth/login` | – | `{ email, password }` → `{ token, user }`. `401` on bad credentials |
| GET | `/auth/me` | 🔒 | The current user |

### Recipes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/recipes` | 🔒 | Paginated list. Query: `page`, `limit` (default 9, max 50), `search`, `cuisine`, `maxTime`, `ingredient`, `tag`, `sort` (`newest`, `oldest`, `title`, `cookTime`). Returns `{ data, total, page, pages, limit }` |
| POST | `/recipes` | 🔒 | Create a recipe → `201` |
| GET | `/recipes/:id` | 🔒 | Get one recipe (`404` if it isn't yours) |
| PUT | `/recipes/:id` | 🔒 | Replace or update a recipe |
| DELETE | `/recipes/:id` | 🔒 | Delete a recipe and the meal plans that use it |

Recipe body:

```json
{
  "title": "Beef Tacos",
  "description": "Weeknight favourite",
  "cuisine": "Mexican",
  "cookTime": 30,
  "servings": 4,
  "instructions": "1. Brown the beef...",
  "tags": ["quick", "family"],
  "ingredients": [{ "name": "Ground beef", "quantity": 500, "unit": "g" }]
}
```

### Meal plans

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/meal-plans?from=YYYY-MM-DD&to=YYYY-MM-DD` | 🔒 | Meals in the range (defaults to the current week), each populated with the recipe's `title` and `cookTime` |
| POST | `/meal-plans` | 🔒 | `{ date, mealType, recipe, servings? }`. The recipe must exist and belong to you. `servings` defaults to the recipe's servings |
| PUT | `/meal-plans/:id` | 🔒 | Update any of `date`, `mealType`, `recipe`, `servings` |
| DELETE | `/meal-plans/:id` | 🔒 | Remove a meal from the plan |

`mealType` is one of `breakfast`, `lunch`, `dinner` or `snack`. Dates are stored as the start of the day (UTC).

### Shopping list and stats

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/shopping-list?from=&to=` | 🔒 | `[{ name, unit, totalQuantity, recipes }]`, built with an aggregation (see below) |
| GET | `/stats/top-ingredients` | 🔒 | Your 5 most-used ingredients across planned meals: `[{ name, count }]` |
| GET | `/stats/meals-by-cuisine` | 🔒 | Number of planned meals per cuisine: `[{ cuisine, count }]` |

### Error format

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" },
    { "field": "ingredients[0].quantity", "message": "Quantity must be a positive number" }
  ]
}
```

| Status | When |
| --- | --- |
| `400` | Validation error, malformed id or invalid JSON |
| `401` | Missing, invalid or expired token, or wrong login credentials |
| `404` | Unknown route, or a resource that doesn't exist or belongs to someone else |
| `409` | Email already registered |
| `500` | Unexpected server error |

---

## How the shopping list aggregation works

The pipeline lives in `server/src/controllers/shoppingList.controller.js`:

```js
[
  // 1. Only my meal plans in the date range.
  //    req.user.id is a string; aggregate() doesn't cast types, so convert it.
  { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: from, $lt: dayAfterTo } } },
  // 2. Join each meal plan with its recipe.
  { $lookup: { from: 'recipes', localField: 'recipe', foreignField: '_id', as: 'recipe' } },
  // 3. One recipe object per meal plan (drops plans whose recipe was deleted).
  { $unwind: '$recipe' },
  // 4. One document per ingredient.
  { $unwind: '$recipe.ingredients' },
  // 5. Normalise the name and scale: quantity × (planned servings ÷ recipe servings).
  { $project: { name: { $toLower: ... }, unit: ..., scaledQuantity: { $multiply: [qty, { $divide: [planServings, recipeServings] }] } } },
  // 6. Sum the same ingredient + unit.
  { $group: { _id: { name: '$name', unit: '$unit' }, totalQuantity: { $sum: '$scaledQuantity' } } },
  // 7. Alphabetical order.
  { $sort: { '_id.name': 1 } },
  // 8. Flatten the output to { name, unit, totalQuantity }.
  { $project: { _id: 0, name: '$_id.name', unit: '$_id.unit', totalQuantity: { $round: ['$totalQuantity', 2] } } },
]
```

**Example:** the Bolognese recipe serves 4 and uses 400 g of spaghetti. Planning it for 2 people on Monday and 6 people on Wednesday gives `400 × 2/4 + 400 × 6/4 = 800 g` of spaghetti on the list.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017` | Use `127.0.0.1` instead of `localhost` in `MONGO_URI`, and check that the **MongoDB** service is running (`services.msc`, or run `net start MongoDB` in an admin terminal). |
| `Missing required environment variables` | Create `server/.env` from `.env.example` (step 2). |
| `Cannot reach the server` in the UI | Start the API (`npm run dev --prefix server`) and check that `VITE_API_URL` matches its port. Restart Vite after changing `client/.env`. |
| CORS error in the browser console | Set `CLIENT_URL` in `server/.env` to the exact URL the client runs on (for example `http://localhost:5173`). |
| Port 5000 or 5173 already in use | Change `PORT` in `server/.env` (and `VITE_API_URL` to match), or stop the other process. |
| Planner is empty after seeding | The seed fills the week it was run in. Run `npm run seed --prefix server` again, or use **This week** in the planner. |

---

## Future improvements

- **Unit conversion in the shopping list**, so `500 g` and `1 kg` of the same ingredient are combined (for example, convert everything to a base unit per ingredient).
- **Favourites:** star recipes and filter by them.
- **Image upload:** recipe photos stored in Cloudinary or S3, shown on the cards.
- Shopping-list ticks saved on the server, so they sync across devices.
- Drag-and-drop meals between days in the planner.
- Recipe sharing and public recipe pages.
- Automated tests (Jest + Supertest for the API, Vitest + React Testing Library for the client) and CI.
- Refresh tokens or httpOnly cookies instead of storing the JWT in `localStorage`.
