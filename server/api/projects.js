const express = require('express');
const {project_model} = require('../dbConnection/db');


const router = express.Router();


// CRUD project

router.post('/', async (req, res) => {
    // console.log('received project');
    if(req.session.userID){
        // res.send('New project received');
        const project = new project_model({
            projectCategory: req.body.projectCategory,
            title: req.body.title,
            content: req.body.content,
            created: new Date(),
            due: new Date(req.body.due),
            status: req.body.status
        });
        try {
            await project.save();
            res.send(`Project saved for ${project}`);
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
        const projects = await project_model.find({});
        res.send(projects);
    } else {
        res.send(null);
    }
});

router.post('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await project_model.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    projectCategory: req.body.projectCategory,
                    title: req.body.title,
                    content: req.body.content,
                    
                    due: new Date(req.body.due),
                    status: req.body.status
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
            await project_model.deleteOne({_id: req.params.id});
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