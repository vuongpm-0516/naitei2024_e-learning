# naitei2024_e-learning

E-learning system

## Requirements

```
node: 20.16.0
docker: 27.1.1
```

## How to run with docker compose

**Step 1:** Clone this repository

```bash
   git clone https://github.com/vuongpm-0516/naitei2024_e-learning.git
```

**Step 2:** Create `.env` file in the root directory at the same level as `docker-compose.yml`. Copy the contents of the `.env.example` file into the `.env` file and fill in the values ​​for the environment variables.

```
# .env
PORT=3000
NODE_ENV=development

... other environment variables ...
```

**Step 3:** Build and run application with docker compose

```bash
docker compose up -d --build
```

Now, the application is running on http://localhost

**Step 4:** To stop application run the command:

```bash
docker compose down
```

## Available Scripts

### `npm run dev:start`

Run the server in development mode.

### `npm run server:start`

Run the server in development with debug mode.

### `npm run tailwind:css`

Watch changes when coding UI with tailwind.

### `npm run lint`

Check for linting errors.

### `npm run lint:fix`

Fix linting errors.

### `npm run format`

Format code with prettier rules.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm run migrate:generate ./src/migration/<migration_name>`

Generate a file migration containing the most recent changes that have not yet been run to the schema.

### `npm run migrate:run`

Execute all pending migrations.

### `npm run migrate:revert`

Rollback the most recently executed migration.

### `npm run migrate:show`

Show all migrations and whether they've been run or not.

[X] = Migration has been ran

[ ] = Migration is pending/unapplied

### `npm run seed`

Insert seed data for database.

### `npm run test`

Run the test suite once.

### `npm run test:watch`

Run the test suite in watch mode.

### `npm run test:cov`

Run the test suite with coverage reporting enabled.
