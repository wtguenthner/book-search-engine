const express = require('express');
const path = require('path');
const {ApolloServer} = require('apollo-server-express')
const db = require('./config/connection');

const {typeDefs, resolvers} = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("/", (req, res) => res.sendFile(path.join(__dirname,"../client/build/index.html")));
// app.use(routes);

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({app});


  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}`);
    })
  });
}

startApolloServer(typeDefs,resolvers);