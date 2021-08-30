import 'reflect-metadata';
import express from 'express';
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";

import { TaskResolver } from "./resolvers/task";
import { UserResolver } from "./resolvers/user";

(async () => {
  const app = express();
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }))
  app.use(cookieParser());
  app.get('/', (_req, res) => res.send('hello'))

  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, TaskResolver]
    }),
    context: ({req, res}) => ({req, res})
  })
  await apolloServer.start();
  apolloServer.applyMiddleware({app, cors: false});

  app.listen(4000, () => {
    console.log('Server started');
  });
})();