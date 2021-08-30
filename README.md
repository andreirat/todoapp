# To-Do Application API

Steps to install the app:

1. Clone this repo
2. Run ```yarn install```
3. Rename ```demo.env``` in ```.env```, add environment variables and run in terminal ```source .env```
4. Run ```ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run``` in order to generate database tables
5. Run ```yarn start``` and the app will be available on ```http://localhost:4000```
