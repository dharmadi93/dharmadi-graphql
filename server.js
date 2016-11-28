import express from 'express'
import schema from './schema'
import {graphql} from 'graphql'
import GraphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extend: true}))

app.get('/api/users', (req, res) => {
    let query = '{users {id, name, age}}'
    graphql(schema, query).then((result) => {
        res.json(result)
    })
})

app.post('/api/users', (req, res) => {
    let query = `mutation{add(name: "${req.body.name}", age: ${req.body.age}){id name age}}`
    graphql(schema, query).then((result) => {
        res.json(result)
    })
})

app.delete('/api/users', (req, res) => {
    let query = `mutation{delete(id: "${req.body.id}"){id}}`
    graphql(schema, query).then((result) => {
        res.json(result)
    })
})

app.put('/api/users', (req, res) => {
    let query = `mutation{update(id: "${req.body.id}", name: "${req.body.name}", age: ${req.body.age}){id name age}}`
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