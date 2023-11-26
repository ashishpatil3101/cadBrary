const express = require('express');
const router =  express.Router();
const Author = require('../models/author');
const { Book } = require('../models/book');

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

//get  author rout
router.get('/:id' , async  (req, res)=>{

    try {
        //if not directly send from browser it has : on it
        if(req.params.id.charAt(0) === ':') req.params.id = req.params.id.substring(1)

        const author = await Author.findById( req.params.id );
        
        const books = await Book.find( { author: author.id }).limit(6).exec();
        res.render('authors/show',{
            author: author,
            booksByAuthor: books
        })
    } 
    catch (error) {
        console.log(error)
        res.redirect('/')
    }

    
})

//edit author rout
router.get('/:id/edit' , async  (req, res)=>{

    try {
        const author = await Author.findById( req.params.id );
        res.render('authors/edit', {author: author})
    } catch (error) {
       
        res.redirect('/')
    }
})

//update  author
router.put('/:id' , async  (req, res)=>{

    let authorObject;

    try {
        if( req.body.name === '') throw new Error();
        authorObject = await Author.findById( req.params.id)
        authorObject.name = req.body.name;
        const newAuthor =  await authorObject.save();
        console.log('heyy  '+newAuthor.id)
        res.redirect(`/authors/:${newAuthor.id}`)
        

    } 
    catch (error) {
        console.log(error)
        if( authorObject == null) res.redirect('/')
        else{
            res.render('authors/edit', {
                author: authorObject,
                errorMessage: 'Error updating author'
            });

       }
        
       
    }
})

//delete  author
router.delete('/:id' , async  (req, res)=>{

    let authorObject;

    try {
        const books = await Book.find( {author: req.params.id})
        
        if(  books.length > 0 )throw Error('author has books still')

        authorObject = await Author.findByIdAndDelete(  { _id: req.params.id } );

    
        res.redirect(`/authors`)
    } 
    catch (error) {
       console.log(error)
            res.redirect('/',)
         
    }
})

module.exports = router;