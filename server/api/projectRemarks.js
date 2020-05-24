const express = require('express');
const {projectRemark_model} = require('../dbConnection/db');
const mongoose = require('mongoose');


const router = express.Router();


// CRUD project

router.post('/', async (req, res) => {
    // console.log('received project');
    if(req.session.userID){
        // res.send('New Todo received');
        // res.send(req.body.project_id);
        const projectRemark = new projectRemark_model({
            belong_id: mongoose.Types.ObjectId(req.body.project_id),
            
            content: req.body.content,
            
            created: new Date(),
            
            
            finalized_flag: req.body.finalized_flag
        });
        // console.log(`projectTodo created for ${projectTodo}`);
        try {
            await projectRemark.save();
            res.send(`projectRemark saved for ${projectRemark}`);
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
        const projectRemarks = await projectRemark_model.find({});
        res.send(projectRemarks);
    } else {
        res.send(null);
    }
});

router.post('/:id', async (req, res) => {
    if (req.session.userID) {
        try {
            await projectRemark_model.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    belong_id: mongoose.Types.ObjectId(req.body.project_id),
            
                    content: req.body.content,
                    
                    created: new Date(),
                    
                    
                    finalized_flag: req.body.finalized_flag
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
            await projectRemark_model.deleteOne({_id: req.params.id});
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