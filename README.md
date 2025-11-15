# Backend Project

This is a backend made for educational purposes for the subject 'advanced topics in web programming' for the ITA

## Initialize Project

Step 1 - Create a .env file:

Copy the .env.template file and create a copy with the name `.env` adn replace the placeholders for actual values from your services

Step 2 - Install all the dependencies/node_modules

Run the next command to instal the dependencies/node_modules:

```bash
npm i
```

## Seed

To load the initial data you need to run the next command and then the backend will be loaded with `Users`, `Projects`, `Vehicles` and `Access`:

```bash
npm run seed
```

## Start Server

to start the server run the next command in the terminal:

```bash
npm run start
```

or use the next command to use Nodemon:

```bash
npm run dev
```

## Server tests

to run the tests powered by jest run the next command:

```bash
npm run test
```
