const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const events = require('events');
const uri = ''; //You have to insert here your database URI
const ObjectID = require('mongodb').ObjectId;
const app = express();
const json = express.json();
const emitter = new events.EventEmitter();

app.use(cors());

app.post('/autorise', json, async (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const clientDB = app.locals.db,
        authorize = clientDB.collection('Authorization'),
        userData = clientDB.collection('UsersData');

    await authorize.findOne(req.body, (err, doc) => {
        if(err) {
            res.sendStatus(400);
            return;
        }

        if(!doc) {
            res.sendStatus(404);
            return;
        }

        userData.findOne({authorization: doc._id}, (err, doc) => {
            let answer = JSON.stringify(doc);
            res.send(answer);
        });
    });
});

app.get('/board', async (req, res) => {
    const clientDB = app.locals.db,
        tasks = clientDB.collection('Projects');

    await tasks.find().toArray((err, result) => {
        if(err) {
            console.log(err);
        }

        res.send(result);
    });
});

app.post('/currentTasks', json, async (req, res) => {
    if(!req.body) return res.sendStatus(400);

    const clientDB = app.locals.db,
        tasks = clientDB.collection('Projects');

    await tasks.find({assignee: req.body.assignee, status: 'In Progress'}).toArray((err, result) => {
        if(err) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    });
});

app.post('/tasks/newTask', json, async (req, res) => {    
    if(!req.body) return res.sendStatus(400);

    const clientDB = app.locals.db,
        projects = clientDB.collection('Projects');

    await projects.insertOne(req.body, (err, req) => {
        if(err) {
            console.log(err);
            return;
        }
    });

    emitter.emit('changeTasks', req.body);
    res.sendStatus(204);
});

app.put('/tasks/taskStatus', json, async (req, res) => {
    if(!req.body) return res.sendStatus(400);

    const clientDB = app.locals.db,
        projects = clientDB.collection('Projects'),
        id = ObjectID(req.body.id);

    await projects.findOne({_id: id}, (err, doc) => {
        if(err || !doc) {
            res.sendStatus(404);
            return
        }

        if(req.body.status === 'In Progress') {
            if(!doc.assignee) {
                projects.updateOne(
                    {_id: id},
                    {$set: {assignee: req.body.assignee,
                                status: req.body.status, deadline: req.body.deadline}
                    }
                );

                emitter.emit('changeTasks', Object.assign(doc, req.body));

                res.sendStatus(204);
            }
        } else {
            projects.updateOne(
                {_id: id},
                {$set: {status: req.body.status,
                closed: req.body.closed}
            });

            emitter.emit('changeTasks', Object.assign(doc, req.body));

            res.sendStatus(204);
        }
    });
});

app.get('/tasksConnect', (req, res) => {

    res.writeHead(200, {
       'Connection': 'keep-alive',
       'Content-Type': 'text/event-stream',
       'Cache-Control': 'no-cache' 
    });

    emitter.on('changeTasks', (task) => {
        res.write(`data: ${JSON.stringify(task)} \n\n`)
    })
});

app.get('/task/:id', async (req, res) => {
    const clientDB = app.locals.db,
        projects = clientDB.collection('Projects'),
        id = ObjectID(req.params.id);
        
    await projects.findOne({_id: id}, (err, doc) => {
        if(err || !doc) {
            res.sendStatus(404);
            return;
        } else {
            res.send(doc);
        }
    });            
});

app.post('/messages', json, async (req, res) => {
    const clientDB = app.locals.db,
        chat = clientDB.collection('Chat');

    await chat.findOne({}, (err, doc) => {
        if(err) {
            res.sendStatus(404);
            return;
        }
            
        let counter = Math.floor(req.body.counter / 51),
            messagesArray = doc.messages,
            stepDownload = 51,
            endPosition = messagesArray.length - stepDownload * counter;

            if(req.body.counter === messagesArray.length || endPosition < 0) {
                res.send([false]);
                return;
            }

        res.send(doc.messages.slice(endPosition - stepDownload < 0 ? 0 : endPosition - stepDownload, endPosition));
    });
});

app.post('/message', json, async (req, res) => {
    const clientDB = app.locals.db,
        chat = clientDB.collection('Chat');
        
    await chat.findOne({name: 'chat'}, (err, doc) => {
        if(err) {
            res.sendStatus(404);
            return;
        }

        let document = doc;

        document.messages.push(req.body);
        chat.updateOne({name: 'chat'}, {$set: {messages: document.messages}})  
    });

    emitter.emit('newMessage', req.body);
    res.sendStatus(204);
});

app.get('/chatConnect', (req, res) => {
    res.writeHead(200, {
       'Connection': 'keep-alive',
       'Content-Type': 'text/event-stream',
       'Cache-Control': 'no-cache' 
    });

    emitter.on('newMessage', (message) => {
        res.write(`data: ${JSON.stringify(message)} \n\n`)
    })
});


MongoClient.connect(uri, (err, client) => {
    if(err) console.log(err);
    app.locals.db = client.db('Project');
    app.listen(3000);
});