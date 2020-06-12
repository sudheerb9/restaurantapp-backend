const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favorites');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser,  (req,res,next) => {
    Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dish')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(Favorites.find({user: req.user._id})){
        Favorites.find({user: req.user._id})    
        .populate('user')
        .populate('dish')
        .then((favorite) => {
            for (i=0; i<req.body.length; i++){
                if(favorite.dishes.indexOf(req.body[i]._id) < 0)
                favorite.dishes.push(req.body[i]);
            }
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else if (err) return next(err);
    else{
        Favorites.insertOne({user:req.user._id})
        for (i=0; i<req.body.length; i++){
            if(favorite.dishes.indexOf(req.body[i]._id) < 0)
            favorite.dishes.push(req.body[i]);
        }
        favorite.save()
        .populate('user')
        .populate('dish')
        then((favorite)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    if (Favorites.find({user: req.user._id})){
        Favorites.find({user: req.user._id}).remove()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    }
    else if (err) return next(err);
    else{
        err = new Error('You have no Favorites');
        res.statusCode = 404;
        return next(err);
    }
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    if(Favorites.find({user: req.user._id})){
        Favorites.find({user: req.user._id})
        .populate('user')
        .populate('dish')
        .then((favorite) => {
            if(favorite.dishes.indexOf(req.params.dishId) < 0){
                favorite.dishes.push({"_id": req.params.dishId});
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else if (err) return next(err);
    else{
        Favorites.insertOne({user:req.user._id})
        favorite.dishes.push({"_id": req.params.dishId})
        favorite.save()
        .populate('user')
        .populate('dish')
        then((favorite)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    if(Favorites.find({user: req.user._id})){
        Favorites.find({user: req.user._id})
        .populate('user')
        .populate('dish')
        .then((favorite) => {
            if(favorite.dishes.indexOf(req.params.dishId) > 0){
                favorite.dishes(req.params.dishId).remove();
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else{
                err = new Error('Dish not found in your favorites list');
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else if (err) return next(err);
    else{
        err = new Error('You have no Favorites');
        res.statusCode = 404;
        return next(err);
    }
});

module.exports = favoriteRouter;