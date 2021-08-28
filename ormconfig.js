module.exports = {
   "type": "postgres",
   "host": process.env.DATABASE_URL,
   "port": 5432,
   "username": process.env.DATABASE_USER,
   "password": process.env.DATABASE_PASSWORD,
   "database": process.env.DATABASE_NAME,
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}