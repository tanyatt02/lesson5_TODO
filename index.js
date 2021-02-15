const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const mysql2 = require('mysql2')
const config = require('./config.js')
const create = require('./TODOcreate.js')
const task = require('./task')
const formatTODO = require('./formatTODO')


const app = express();


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser())

//const handlebars = require('handlebars');
const hbs = require('hbs')


//app.engine('hbs', handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


const pool = mysql2.createPool(config).promise();

let options = {
    name: '',
    begin: true,
    list: false,
    update: false,
    todo: [],


}

let todoItem = {
    done: false,
    title: ''
}

async function findId(num) {
    let todo = await task.list(pool, options.name)
    if (num <= todo.length) {
        id = todo[num - 1].id
    }
    return id
}

app.get('/', (req, res) => {
    console.log('cookie = ', req.cookies)
    if (req.cookies.name) {

        options.name = req.cookies.name
    }
    options.begin = true
    options.list = false

    console.log('options = ', options)
    res.render('form', options)
})

app.post('/create', async (req, res) => {
    if (!req.cookies || !req.cookies.name || req.cookies.name != req.body.name) {
        res.cookie('name', req.body.name)
    }
    options.name = req.body.name
    try {
        await create(pool, req.body.name)
        options.begin = false
        options.list = true
    } catch (err) {
        console.log('ERROR create = ', err.message)
        
    }

    todo = await task.list(pool, options.name)
    options.todo = formatTODO(todo)
    res.render('form', options)
})

app.post('/insert', async (req, res) => {
    let done = Array.isArray(req.body.done)
    let todoItem = [options.name,
        done,
        req.body.title
    ]
    try {
        await task.insert(pool, todoItem)
    } catch (err) {
        console.log('ERROR insert = ', err.message)
        
    }
console.log('options = ',options)
    todo = await task.list(pool, options.name)
    options.todo = formatTODO(todo)
    res.render('form', options)

})

app.post('/delete', async (req, res) => {

    let id = []
    id.push(options.name, await findId(req.body.num))
    try {
        await task.delete(pool, id)
    } catch (err) {
        console.log('ERROR delete = ', err.message)
    }

    todo = await task.list(pool, options.name)
    options.todo = formatTODO(todo)
    res.render('form', options)

})

app.post('/update', async (req, res) => {
    let id = await findId(req.body.num)
    let done = Array.isArray(req.body.done)
    let todoItem = [options.name, done, req.body.title, id]
    console.log('update todoItem = ', todoItem)
    try {
        await task.update(pool, todoItem)
    } catch (err) {
        console.log('ERROR update = ', err.message)
    }

    todo = await task.list(pool, options.name)
    options.todo = formatTODO(todo)
    res.render('form', options)

})


app.get('/cache', (req, res) => {
    console.log(Object.entries(cache));
    res.render('cache', cache);
});




app.listen(3000, () => console.log('Listening on port 3000'));
