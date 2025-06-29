# LevelUp Project Details

![App Screenshot](./git_hub_assets/loading_screen.png)

# 🛠️ Project Setup: LevelUp (React + Node + PostgreSQL)

This guide will walk you through setting up the full stack project: frontend in React, backend in Node/Express, and data stored in PostgreSQL.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/) (version 14+)
- [pgAdmin](https://www.pgadmin.org/) (GUI tool for PostgreSQL)

---

## 🧱 PostgreSQL Setup

1. **Install PostgreSQL** (if not installed)
   - During installation, set a password for the default user `postgres`

2. **Open pgAdmin** and:
   - Connect to the `PostgreSQL` server with user: `postgres`
   - Create a new database named: `LevelUp`
   - (Optional: Create a new user/role if needed, else just use `postgres`)

3. **Create required table**  
   Run this SQL in pgAdmin query tool:

   ```sql
   CREATE TABLE day_entries (
     id SERIAL PRIMARY KEY,
     timestamp TIMESTAMPTZ,
     bed_time TEXT,
     up_time TEXT,
     rested_rating INTEGER,
     morning_mood_rating INTEGER,
     journal_entry TEXT,
     to_do_list TEXT,
     entry_type TEXT,
     submitted BOOLEAN
   );

⚠️⚠️⚠️  👀 Look at documentation/git_hub_howto.docx for more information 👀 ⚠️⚠️⚠️

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
