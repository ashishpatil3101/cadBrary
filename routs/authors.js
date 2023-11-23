const express = require('express');
const router =  express.Router();
const Author = require('../models/author')

//show all authors route
router.get('/', async( req, res)=>{

    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp( req.query.name, 'i');
    }

    try {

        const authors = await Author.find( searchOptions ) ;

        res.render('authors/index',{ 
            authors: authors,
            searchOptions:  req.query
        } );
        
    } 
    catch (error) {
        res.render('/')
    }
})

// new author rout
router.get('/new', async( req, res)=>{
    res.render('authors/new' , { author: new Author()})
})

//add new author rout
router.post('/', async( req, res)=>{
    
    
    const authorObject = new Author(  {
        name: req.body.name
    });

    try {
        if( req.body.name === '') throw new Error();
        const newAuthor = await authorObject.save();
    
        res.redirect('/authors')
    } 
    catch (error) {
        
        res.render('authors/new', {
            author: authorObject,
            errorMessage: 'Error creating author'
        });
    }
   
})

module.exports = router;