const express = require('express');
const {todo_model, project_model} = require('../dbConnection/db');


const router = express.Router();


// fetch all todos

router.get('/', async (req, res) => {
    if (req.session.userID) {
        const todos = await todo_model.find();
        res.send(todos);
    } else {
        res.send(null);
    }
});

// add new todo

router.post('/', async (req, res) => {
    if (req.session.userID) {
        const todo = new todo_model({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            created: req.body.created,
            due: req.body.due
        });
        try {
            await todo.save();
            res.send('saved successfully');
        } catch (err) {
            console.log(err);
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

// update todo

router.post('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await todo_model.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    content: req.body.content,
                    status: req.body.status,
                    created: req.body.created,
                    due: req.body.due
                }}
            );
            console.log('update successfully'); 
            res.send('update successfully');   
        } catch (error) {
            console.log(error);
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

// delete todo

router.delete('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await todo_model.deleteOne({_id: req.params.id});
            res.send('item removed');
        } catch (err) {
            console.log(err);
            res.send(null);
        }
    } else {
        res.send(null);
    }
});








module.exports = router;