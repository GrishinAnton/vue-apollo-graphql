const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')
const jwt =  require('jsonwebtoken')

require("dotenv").config({ path: "variables.env" });
const filepath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filepath, 'utf-8')
const resolvers = require('./resolvers')

const User = require('./models/User')
const Post = require("./models/Post");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connect"))
  .catch(err => console.log("err"));


 const getUser = async token => {
   if(token) {
    try {
      let user = await jwt.verify(token, process.env.SECRET)
      return user
    } catch (error) {
      throw new AuthenticationError('Your session has ended. Please try again.');
      
    }
   }
 } 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
    
  }
});

server.listen().then(({ url }) => {
  console.log(`server listening ${url}`);
});
