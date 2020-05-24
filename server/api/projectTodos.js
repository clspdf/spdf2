const express = require('express');
const {projectTodo_model} = require('../dbConnection/db');
const mongoose = require('mongoose');


const router = express.Router();


// CRUD project

router.post('/', async (req, res) => {
    // console.log('received project');
    if(req.session.userID){
        // res.send('New Todo received');
        // res.send(req.body.project_id);
        const projectTodo = new projectTodo_model({
            project_id: mongoose.Types.ObjectId(req.body.project_id),
            title: req.body.title,
            content: req.body.content,
            
            created: new Date(),
            due: new Date(req.body.due),
            status: req.body.status,
            nextStep: req.body.nextStep
        });
        // console.log(`projectTodo created for ${projectTodo}`);
        try {
            await projectTodo.save();
            res.send(`projectTodo saved for ${projectTodo}`);
        } catch (error) {
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

router.get('/', async (req, res) => {
    // console.log('received project');
    if(req.session.userID){
        // res.send('New project received');
        const projectTodos = await projectTodo_model.find({});
        res.send(projectTodos);
    } else {
        res.send(null);
    }
});

router.post('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await projectTodo_model.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    project_id: req.body.project_id,
                    title: req.body.title,
                    content: req.body.content,
                    
                    created: new Date(),
                    due: new Date(req.body.due),
                    status: req.body.status,
                    nextStep: req.body.nextStep
                }}
            );
            
            res.send('update successfully');   
        } catch (error) {
            console.log(error);
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

router.delete('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await projectTodo_model.deleteOne({_id: req.params.id});
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