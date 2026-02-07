# madgrades.com [![Build and deploy to prod](https://github.com/Madgrades/madgrades.com/actions/workflows/prod.yml/badge.svg?branch=prod&event=push)](https://github.com/Madgrades/madgrades.com/actions/workflows/prod.yml)

The source for madgrades.com, a web interface for visualizing the data provided by the [Madgrades API](https://api.madgrades.com) \[[source](https://github.com/Madgrades/api.madgrades.com)\]. Get it yourself, or visit the official website at [madgrades.com](https://madgrades.com)!

## Docker instructions

1. Create a `.env` file based on the provided `.env.example`.
2. Build the Docker container

```bash
$ docker run --env-file .env -p 3000:3000 -it ghcr.io/madgrades/madgrades.com
```

You can now access the frontend from `http://localhost:3000`.

Alternatively, you can clone this repository and build the Docker image yourself:

```bash
$ docker build . -t madgrades.com
$ docker run --env-file .env -p 3000:3000 madgrades.com
```

## Native instructions

### Requirements

* Node.js >= 18
* NPM >= 8
* Git

### Tech Stack

* **React 19** - Modern React with latest features
* **Vite** - Fast build tool and dev server (replaced Create React App)
* **Redux + Redux Thunk** - State management
* **React Router 6** - Client-side routing
* **Semantic UI React** - UI component library
* **SASS** - CSS preprocessing

### Steps

1. Install the required dependencies.
   ```bash
   $ npm install
   ```
3. Get a Madgrades API token from [api.madgrades.com](https://api.madgrades.com), or start up your own backend (see [dockerfiles](https://github.com/madgrades/dockerfiles)).
4. Create a `.env` file based on the provided `.env.example`.      
5. Run the development server.
   ```bash
   $ npm start
   ```

Create a production-ready app with:

```bash
$ npm run build
```

## Example Page

This is a course page:

![Madgrades Picture](https://i.imgur.com/sastR8g.png)
