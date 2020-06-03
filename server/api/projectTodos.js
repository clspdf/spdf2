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
            project_id: req.body.project_id ? mongoose.Types.ObjectId(req.body.project_id) : null,
            title: req.body.title,
            content: req.body.content,
            order: req.body.project_id ? await projectTodo_model.find({project_id: req.body.project_id}).countDocuments() : null,
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

router.get('/:projectID', async (req, res) => {
    // console.log('received project');
    if(req.session.userID){
        // res.send('New project received');
        const projectTodos = await projectTodo_model.find({project_id: req.params.projectID}).sort({order: 'asc'});
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
                    order: Number(req.body.order),
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


router.post('/switchproject/:oldprojectid', async (req, res) => {
    if (req.session.userID) {
        const old_project_id = req.params.oldprojectid;
        
        const old_order = Number(req.body.order);

        // adjust orders for todos in old project
        try {
            await projectTodo_model.updateMany(
                {project_id: old_project_id, order: {$gt: old_order}},
                {$inc: {order: -1}}
            );
    
            // find order for edit todo in new project
            
            await projectTodo_model.findOneAndUpdate(
                {_id: req.body._id},
                {$set: {
                    project_id: mongoose.Types.ObjectId(req.body.project_id),
                    title: req.body.title,
                    content: req.body.content,
                    order: await projectTodo_model.find({project_id: req.body.project_id}).countDocuments() - 1, // -1 to adjust for double-counting itself
                    created: new Date(),
                    due: new Date(req.body.due),
                    status: req.body.status,
                    nextStep: req.body.nextStep
                }}
            );
        } catch (error) {
            console.log(error);
            res.send(null);
        }
        

    }
});



router.post('/reorder/:projectID', async (req, res) => {
    if (req.session.userID) {
        
        // selected = (await projectTodo_model.find({order: req.body.order}));
        // await projectTodo_model.updateMany({order: {$gt: req.body.order}}, {$inc: {order: 10}});
        // res.send('updated successfully');
        // console.log('received re-order instruction');
        const projectID = req.params.projectID;
        const projectTodo_id = req.body.projectTodo_id;
        const newIndex = req.body.newIndex;
        const oldIndex = req.body.oldIndex;
        const orderShift = newIndex > oldIndex ? -1 : 1; 
        const smallIndex = Math.min(newIndex, oldIndex);

        const largeIndex = Math.max(newIndex, oldIndex);
        // console.log(`old index is ${oldIndex}, new index is ${newIndex}, order shift is ${orderShift}, the range is ${smallIndex} to ${largeIndex}, setting to new index!`)
        
        // await projectTodo_model.updateMany(
        //     {project_id: projectID, order: {$gt: 32, $lt:34}},
        //     {$inc: {order: -10}}
        //     );
        // console.log(target);
        
        // console.log(`those to be updated by ${orderShift}`);
        // const those = await projectTodo_model.find({project_id: projectID, order: {$gte: smallIndex, $lte: largeIndex}, _id: {$ne: projectTodo_id}}, 'title order');
        // console.log(`${those}`);
        // console.log(`the one to be set to ${newIndex} with ID as ${projectTodo_id}`);
        // const one = await projectTodo_model.find({_id: projectTodo_id});
        // console.log(`${one}`);

        try {
            await projectTodo_model.updateMany(
                {project_id: projectID, order: {$gte: smallIndex, $lte: largeIndex}, _id: {$ne: projectTodo_id}},
                {$inc: {order: orderShift}}
            );
            
            await projectTodo_model.updateOne(
                {_id: projectTodo_id},
                {$set: {order: newIndex}}
            );
            
            res.send('updated all!')
        } catch (error) {
            console.log(error);
            res.send(null);
        }
        // try {
        //     await projectTodo_model.findOneAndUpdate(
        //         {project_id: projectID, order: oldIndex},
        //         {$set: {
        //             order: Number(newIndex)
        //         }}
        //     );
        //     await projectTodo_model.updateMany({project_id: projectID, order: {$gt: smallIndex, $lt: largeIndex}},
        //                                        {$inc: {order: orderShift}});
        //     res.send('update successfully');
        // } catch (error) {
        //     console.log(error);
        //     res.send(null);
        // }
        

    } else {
        res.send(null);
    }
});

router.delete('/:id', async (req, res) => {
    if (req.session.userID) {
        // const order = req.body.order;
        // console.log(req.body);
        // res.send('finished');
        try {
            // console.log(req.body.project_id);
            // console.log(req.body.order);
            if (req.body.project_id) { // adjust order of the rest projectTodos
                await projectTodo_model.updateMany(
                    {project_id: req.body.project_id, order: {$gt: Number(req.body.order)}},
                    {$inc: {order: -1}}
                );
            }
            
            await projectTodo_model.deleteOne({_id: req.params.id});
            res.send('item removed with order adjusted');
        } catch (err) {
            console.log(err);
            res.send(null);
        }
    } else {
        res.send(null);
    }
});


module.exports = router;