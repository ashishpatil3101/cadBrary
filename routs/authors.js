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
    
        res.redirect(`/authors/:${newAuthor.id}`)
    } 
    catch (error) {
        
        res.render('authors/new', {
            author: authorObject,
            errorMessage: 'Error creating author'
        });
    }
   
})

//get a author rout
router.get('/:id' , async  (req, res)=>{

    res.send('get author '+ req.params.id)
})

//edit a author rout
router.get('/:id/edit' , async  (req, res)=>{

    try {
        const author = await Author.findById( req.params.id );
        res.render('authors/edit', {author: author})
    } catch (error) {
       
        res.redirect('/')
    }
})

//update a author
router.put('/:id' , async  (req, res)=>{

    let authorObject;

    try {
        if( req.body.name === '') throw new Error();
        authorObject = await Author.findById( req.params.id)
        authorObject.name = req.body.name;
        await authorObject.save();
    
        res.redirect(`/authors/:${authorObject.id}`)
    } 
    catch (error) {

        if( authorObject == null) res.redirect('/')
        else{
            res.render('authors/edit', {
                author: authorObject,
                errorMessage: 'Error updating author'
            });

       }
        
       
    }
})

//delete a author
router.delete('/:id' , async  (req, res)=>{

    let authorObject;

    try {
        authorObject = await Author.deleteOne( {id: req.params.id});
        await authorObject.deleteOne();

    
        res.redirect(`/authors`)
    } 
    catch (error) {

        if( authorObject == null) res.redirect('/')
        else{
            console.log(error.message)
            res.redirect(`/authors/:${authorObject.id}`)

       }
        
       
    }
})

module.exports = router;