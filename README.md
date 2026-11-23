# Mealwise

**Plan your week of meals and get your shopping list automatically.**

---

## What is it?

Mealwise is a web app that helps you decide what to cook and what to buy.

You save your favourite recipes in one place, choose what you want to eat each day of the week, and the app tells you exactly which ingredients to buy, with the right amounts.

No more guessing what is missing from the kitchen, and no more adding up quantities by hand.

---

## What you can do

- **Save your recipes.** Add a recipe with its ingredients, cooking time, number of servings and steps. Edit or delete it any time.
- **Find recipes fast.** Search by name, or filter by cuisine, cooking time, ingredient or tag.
- **Plan your week.** A simple 7-day calendar with slots for breakfast, lunch, dinner and snacks. Pick a recipe for each slot and say how many people you are cooking for.
- **Get a shopping list.** The app adds up every ingredient for the days you choose. If a recipe is planned for more people, the amounts are scaled for you. You can tick items off as you shop or copy the list to your phone.
- **See quick stats.** Find out which ingredients you use the most and which cuisines you plan most often.
- **Keep it private.** Every person has their own account. You only ever see your own recipes and plans.

The app works on phones, tablets and computers.

---

## How it works

1. **Create an account** (or use the demo account below).
2. **Add your recipes.** Type them in once and they are saved for good.
3. **Plan your week.** Open the planner and drop recipes into the days and meals you want.
4. **Open your shopping list.** It is already worked out for you. Take it to the shop.

**Example:** your Spaghetti Bolognese recipe serves 4 and needs 400 g of spaghetti. You plan it for 2 people on Monday and 6 people on Wednesday. Your shopping list will say **800 g of spaghetti**.

---

## Try it with the demo account

| Email              | Password   |
| ------------------ | ---------- |
| `demo@example.com` | `demo1234` |

The demo account comes with 8 sample recipes and a full week of meals already planned. The login page also has a **"Fill in demo credentials"** button.

---

## Built with

| What                    | Used for                                        |
| ----------------------- | ----------------------------------------------- |
| **React**               | The pages you see and click on                  |
| **Node.js and Express** | The server that handles requests                |
| **MongoDB**             | The database where recipes and plans are stored |
| **Tailwind CSS**        | The dark, modern look                           |

---

## What is coming next

- Combine different units automatically (for example, 500 g and 1 kg of the same ingredient).
- Mark recipes as favourites.
- Add photos to recipes.
- Keep shopping-list ticks in sync across your devices.
- Drag and drop meals between days.
- Share recipes with other people.

---

## For developers

Everything below is for people who want to run or work on the code. If you only want to know what the app does, you can stop reading here.

### Run it on your own computer (Windows)

#### What you need

1. **Node.js 20.19+ or 22 LTS** from <https://nodejs.org>. Check with `node -v`.
2. **MongoDB**, either MongoDB Community Server installed locally, or a free MongoDB Atlas cluster.
3. **Git**

The commands work in both **PowerShell** and **Git Bash**.

#### Step 1: Download and install

```bash
git clone https://github.com/MohidWebDev/recipe-meal-planner.git
cd recipe-meal-planner
npm install --prefix server
npm install --prefix client
```

#### Step 2: Create the settings files

PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Git Bash:

```bash
cp server/.env.example server/.env && cp client/.env.example client/.env
```

Open `server/.env` and set `JWT_SECRET` to any long random string. If you use Atlas, set `MONGO_URI` too.

> Tip: to generate a secret, run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Step 3: Add the demo data (optional)

```bash
npm run seed --prefix server
```

#### Step 4: Start the app (two terminals)

Terminal 1, the server (runs on <http://localhost:5000/api>):

```bash
npm run dev --prefix server
```

Terminal 2, the website (runs on <http://localhost:5173>):

```bash
npm run dev --prefix client
```

Open <http://localhost:5173> and log in with the demo account.

#### Available scripts

| Folder   | Command           | What it does                          |
| -------- | ----------------- | ------------------------------------- |
| `server` | `npm run dev`     | Start the server with auto-restart    |
| `server` | `npm start`       | Start the server                      |
| `server` | `npm run seed`    | Reset and fill the demo account       |
| `client` | `npm run dev`     | Start the website in development mode |
| `client` | `npm run build`   | Create the production build           |
| `client` | `npm run preview` | Preview the production build          |

---

### Settings (environment variables)

#### `server/.env`

| Variable         | Example                                         | Description                                   |
| ---------------- | ----------------------------------------------- | --------------------------------------------- |
| `PORT`           | `5000`                                          | Port the server listens on                    |
| `MONGO_URI`      | `mongodb://127.0.0.1:27017/recipe-meal-planner` | Database connection string                    |
| `JWT_SECRET`     | `a-long-random-string`                          | Secret used for login tokens (**required**)   |
| `JWT_EXPIRES_IN` | `7d`                                            | How long a login lasts                        |
| `CLIENT_URL`     | `http://localhost:5173`                         | Website address allowed to talk to the server |
| `NODE_ENV`       | `development`                                   | `production` hides internal error messages    |

#### `client/.env`

| Variable       | Example                     | Description                              |
| -------------- | --------------------------- | ---------------------------------------- |
| `VITE_API_URL` | `http://localhost:5000/api` | Address of the server (including `/api`) |

`.env` files are not uploaded to GitHub. Only the `.env.example` templates are.

---

### Technical details

#### Technology

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| Database         | MongoDB + Mongoose                             |
| API              | Node.js, Express 5, ES modules                 |
| Authentication   | bcryptjs, JSON Web Tokens (JWT)                |
| Validation       | express-validator + Mongoose schema validators |
| Client           | React 19 (Vite), React Router, axios           |
| Styling          | Tailwind CSS v4 (custom dark theme)            |
| Icons and motion | lucide-react, Lenis (smooth scrolling)         |

#### Key features, technically

- **Authentication:** passwords are hashed with bcrypt and never returned. The API issues a JWT, and every route except register, login and health requires it. Every query is limited to the logged-in user.
- **Search and pagination:** `GET /api/recipes` supports `page`, `limit`, title search, `cuisine`, `maxTime`, `ingredient`, `tag` and `sort`.
- **Validation:** rules run on the server (`express-validator`) and in the forms, and server errors are shown on the matching fields.
- **Shopping list:** built with a MongoDB aggregation pipeline that joins meal plans with recipes, scales each ingredient by planned servings, and totals matching ingredients. The code is in `server/src/controllers/shoppingList.controller.js`.

#### Folder structure

```
recipe-meal-planner/
├── server/        # API: models, controllers, routes, middleware, validators, seed script
└── client/        # Website: pages, components, API modules, context, hooks
```

#### API overview

Base URL: `http://localhost:5000/api`. Routes marked 🔒 need an `Authorization: Bearer <token>` header.

| Method | Endpoint                   | Auth | Description                          |
| ------ | -------------------------- | ---- | ------------------------------------ |
| GET    | `/health`                  | –    | Server and database status           |
| POST   | `/auth/register`           | –    | Create an account                    |
| POST   | `/auth/login`              | –    | Log in                               |
| GET    | `/auth/me`                 | 🔒   | Current user                         |
| GET    | `/recipes`                 | 🔒   | List recipes (paginated, searchable) |
| POST   | `/recipes`                 | 🔒   | Create a recipe                      |
| GET    | `/recipes/:id`             | 🔒   | Get one recipe                       |
| PUT    | `/recipes/:id`             | 🔒   | Update a recipe                      |
| DELETE | `/recipes/:id`             | 🔒   | Delete a recipe and its meal plans   |
| GET    | `/meal-plans?from=&to=`    | 🔒   | Meals in a date range                |
| POST   | `/meal-plans`              | 🔒   | Add a meal to the plan               |
| PUT    | `/meal-plans/:id`          | 🔒   | Update a planned meal                |
| DELETE | `/meal-plans/:id`          | 🔒   | Remove a planned meal                |
| GET    | `/shopping-list?from=&to=` | 🔒   | Shopping list for a date range       |
| GET    | `/stats/top-ingredients`   | 🔒   | Your 5 most-used ingredients         |
| GET    | `/stats/meals-by-cuisine`  | 🔒   | Planned meals per cuisine            |

Errors are returned as `{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }` with status `400` (invalid input), `401` (not logged in), `404` (not found), `409` (email already used) or `500` (server error).

---

### Troubleshooting

| Problem                                                        | Fix                                                                                                                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017` | Use `127.0.0.1` instead of `localhost` in `MONGO_URI`, and check that the MongoDB service is running (`services.msc`, or `net start MongoDB` in an admin terminal). |
| `Missing required environment variables`                       | Create `server/.env` from `.env.example`.                                                                                                                           |
| `Cannot reach the server` in the app                           | Start the server (`npm run dev --prefix server`) and check that `VITE_API_URL` matches its port. Restart the website after changing `client/.env`.                  |
| CORS error in the browser console                              | Set `CLIENT_URL` in `server/.env` to the exact address the website runs on.                                                                                         |
| Port 5000 or 5173 already in use                               | Change `PORT` in `server/.env` (and `VITE_API_URL` to match), or stop the other program.                                                                            |
| Planner is empty after seeding                                 | The demo data fills the week it was created in. Run the seed again, or click **This week** in the planner.                                                          |
