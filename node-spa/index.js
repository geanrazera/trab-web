const restify = require('restify')
const errs = require('restify-errors')

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
})

//**CONNECTION**//
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'dbtrab'
    }
})

//**TEST CONNECTION**//
knex.select().from('task')
    .then((foo) => {
        console.log(foo);
    });

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.listen(8081, function () {
    console.log('%s listening at %s', server.name, server.url)
})

server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
}))

//**ROUTES**//------------------------------------------------------------------------------------------------------
//SELECT
server.get('/read', function (req, res, next) {
    knex('task').then((dados)=>{
      res.send(dados)
    },next)
  
    return next();
  });
//CREATE
server.post('/create', function (req, res, next) {
    knex('task')
        .insert(req.body)
        .then((dados) => {
            res.send(dados)
        }, next)
    return next()
})
//SELECT BY ID
server.get('/show/:id', function (req, res, next) {
    const { id } = req.params
    knex('task')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send(dados)
        }, next)
    return next()
})
//UPDATE
server.put('/update/:id', function (req, res, next) {
    const { id } = req.params
    knex('task')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))

            res.send('dados atualizados!')
        }, next)
    return next()
})
//DELETE
server.del('/delete/:id', function (req, res, next) {
    const { id } = req.params
    knex('task')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))

            res.send('dados excluidos!')
        }, next)
    return next()
})