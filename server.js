import express from 'express'
import schema from './schema'
import {graphql} from 'graphql'
import GraphQLHTTP from 'express-graphql'

const app = express()

app.get('/', (req, res) => {
    let query = '{users {id, name, age}}'
    graphql(schema, query).then((result) => {
        res.json(result)
    })
})

app.use('/graphql', GraphQLHTTP({
    schema: schema,
    pretty: true,
    graphiql: true
}))

app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("server is running on port 3000")
})