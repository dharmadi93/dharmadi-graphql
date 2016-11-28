import mongoose from 'mongoose'
import  {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql'

let User = mongoose.model('User', {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    age: Number
})

mongoose.connect('mongodb://localhost/biodatadb', (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('mongo connected')
    }
})

let UserType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID User'
        },
        name: {
            type: GraphQLString,
            description: 'Name of User'
        },
        age: {
            type: GraphQLInt,
            description: 'age of user'
        }
    })
})

let getAll = () => {
    return new Promise((resolve, reject) => {
        User.find((err, users) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(users)
            }
        })
    })
}

let QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: () => {
                return getAll()
            }
        }
    })
})

let MutationAdd = {
    type: UserType,
    description: 'add a user',
    args: {
        name: {
            name: 'nama dari user',
            type: new GraphQLNonNull(GraphQLString)
        },
        age: {
            name: 'umur dari user',
            type: GraphQLInt
        }
    },
    resolve: (root, args) => {
        let newUser = new User({
            name: args.name,
            age: args.age
        })
        newUser.id = newUser._id
        return new Promise((resolve, reject) => {
            newUser.save((err) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(newUser)
                }
            })
        })
    }
}

let MutationDelete = {
    type: UserType,
    description: 'delete a user',
    args: {
        id: {
            id: 'id dari user',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {

        return new Promise((resolve, reject) => {
            User.findOneAndRemove({
                id: args.id
            }, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }
}

let MutationUpdate = {
    type: UserType,
    description: 'update a user',
    args: {
        id: {
            id: 'id dari user',
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            name: 'nama dari user',
            type: new GraphQLNonNull(GraphQLString)
        },
        age: {
            name: 'umur dari user',
            type: GraphQLInt
        }
    },
    resolve: (root, args) => {

        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({
                id: args.id
            }, {
                name: args.name,
                age: args.age
            }, {
                new: true,
                upsert: false
            }, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }
}

let MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: MutationAdd,
        delete: MutationDelete,
        update: MutationUpdate
    }
})

let Schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})

export default Schema