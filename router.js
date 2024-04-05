const express = require('express');
const router = new express.Router();
const items = require('./fakeDb');
const ExpressError = require('./expressError');

router.get('/', function(req, res){
    return res.json(items);
});

router.post('/', function(req, res, next){
    try{
        if (!req.body.name) throw new ExpressError("Name is required", 400);
    
        if (!req.body.price) throw new ExpressError("Price is required", 400);
        const newItem = req.body;
        items.push(newItem);
        return res.json({"added": newItem}, 201);
    } catch(error){
        next(error);
    }
});

router.get('/:name', function(req, res, next){
    try{
        const foundItem = items.find((item) => item.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        return res.json(foundItem);
    } catch(err){
        next(err);
    }
});

router.patch('/:name', function(req, res, next){
    try {
        const foundItem = items.find((item) => item.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        if (!req.body.name) throw new ExpressError("Name is required", 400);
    
        if (!req.body.price) throw new ExpressError("Price is required", 400);
        let {name, price} = req.body
        foundItem.name = name;
        foundItem.price = price;
        return res.json({"updated": foundItem});
    } catch(err){
        next(err);
    }
});

router.delete('/:name', function(req, res, next){
    try{
        const foundItem = items.find((item) => item.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        const index = items.indexOf(foundItem);
        items.splice(index, 1);
        return res.json({"message": "Deleted"});
    } catch(err){
        next(err);
    }
});

module.exports = router;

//Write tests