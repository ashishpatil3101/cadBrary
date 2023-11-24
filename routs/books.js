const express = require('express');
const path = require('path');
const fs = require('fs');
const router =  express.Router();
const {Book } = require('../models/book')
const Author = require('../models/author')

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


//show all books route
router.get('/', async( req, res)=>{

    //returns query obj .will be useful for  adding dynamic condition
    let query = Book.find();  

    if( req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp( req.query.title, 'i') );
    }
    if( req.query.publishAfter != null && req.query.publishAfter != ''){
        query = query.gte('publishDate',req.query.publishAfter)
    }
    if( req.query.publishBefore != null && req.query.publishBefore != ''){
        query = query.lte('publishDate',req.query.publishBefore)
    }

    try {
        
        const books = await query.exec();

        res.render('books/index' ,{
            books: books,
            searchOptions: req.query
        })
    } 
    catch (error) {
       res.redirect('/')    
    }

   
})

// new book rout
router.get('/new', async( req, res)=>{
    
    renderNewPage( res, new Book());
})

//add new book rout
router.post('/',  async( req, res)=>{

    const book = new Book({
        title: req.body.title ,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author,
    })
    saveCover( book , req.body.cover );

    try {
        const newBook = await book.save();
        res.redirect('/books')
    } 
    catch (error) {
        
        renderNewPage(res, book, true)
    }
    
    
   
})


async function renderNewPage (res,book, hasError = false ){
    try {
        
        const authors = await Author.find({});
        let params =  {
            authors: authors,
            book: book
        };
        if(hasError ) params.errorMessage = "error creating book"

        res.render('books/new',params);
    } 
    catch (error) {
       res.redirect('/books')    
    }
}
function saveCover( book, coverEncoded){

    if(coverEncoded == null) return;
    const cover = JSON.parse( coverEncoded );
    if( cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from( cover.data,'base64' ) 
        book.coverImageType = cover.type;
    }

}
module.exports = router;