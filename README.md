# PRM_BE_Ban-Tranh-

A Node.js backend project using Express, Sequelize ORM, and MySQL for managing users and related data.

## Technologies Used
- **Node.js**
- **Express.js**
- **Sequelize** (ORM for MySQL)
- **MySQL**
- **dotenv** (for environment variables)

## Project Structure
```
/ (project root)
├── package.json
├── .env
├── migrations/
├── seeders/
├── src/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
```

## Setup Instructions

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd PRM_BE_Ban-Tranh-
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following content:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```
Adjust the values as needed for your local MySQL setup.

### 4. Database Setup
- Make sure your MySQL server is running.
- Create the database specified in your `.env` file if it does not exist.
- Run migrations to set up tables:
```sh
npx sequelize-cli db:migrate
```
- (Optional) Seed the database with initial data:
```sh
npx sequelize-cli db:seed:all
```

### 5. Start the Server
```sh
npm start
```
The server will run on the port specified in your `.env` file (default: 3000).

## Useful Commands
- Run in development mode (with auto-reload):
  ```sh
  npm run dev
  ```
- Run migrations:
  ```sh
  npx sequelize-cli db:migrate
  ```
- Undo migrations:
  ```sh
  npx sequelize-cli db:migrate:undo
  ```
- Run seeders:
  ```sh
  npx sequelize-cli db:seed:all
  ```

## API Endpoints (in progress)
- `GET /api/user` — List all users

## License
MIT
