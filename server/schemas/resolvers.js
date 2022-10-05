const {Book, User} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');


const resolvers = {
    Query:{
        me: async (parent, args,context) =>{
            if(context.user){
                const userData = await user.findOne({
                    _id: context.user_id
                }).select("-__v -password").populate('books')

                return userData;
            }
            throw new AuthenticationError("Not Logged In");
        }
    },

    Mutation: {
        addUser: async (parent,args)=>{
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },
        login: async (parent,{email,password}) =>{
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPassword = await User.isCorrectPassword(password)
            if(!correctPassword){
                throw new AuthenticationError("Incorrect password");
            }

            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent,{bookData}, context) =>{
            if(context.user){
                const updateUser = await User.findByIdAndUpdate(
                    {_id: context.User._id},
                    {$push: {saveBooks: bookData}},
                    {new: true}
                );

                return updateUser;
            }
            throw new AuthenticationError("You need to be loggen in");
        },

        removeBook: async(parent, {bookId}, context) =>{
            if(context.user){
                const deleteBook = await User.findOneAndUpdate(
                    {_id: context.User_id},
                    {$pull: {saveBooks: {bookId}}},
                    {new: true}
                );

                return deleteBook;
            }
            throw new AuthenticationError("You need to be logged in");
        }

    }

}

module.exports = resolvers;