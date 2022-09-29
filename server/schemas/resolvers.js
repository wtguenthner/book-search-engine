const {Book, User} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express')

const resolvers = {
    Query:{
        user: async () =>{
            return await User.findByID(args.id)
        }
    },

    Mutation: {
        addUser: async (parent,{username, email,password})=>{
            const user = await User.create({username,email, password});
            const token = signToken(profile);

            return {token, profile};
        },
        saveBook: async(parent,{authors, description, title, bookId,image,link})

    }

}