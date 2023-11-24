const express = require('express');
const path = require('path');
const fs = require('fs');
const router =  express.Router();
const {Book,coverImageBasePath } = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const uploadPath = path.join('public', coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
      callback(null, imageMimeTypes.includes(file.mimetype))
    }
  })

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
router.post('/', upload.single('cover'),  async( req, res)=>{
    
    const fileName = req.file != null ? req.file.filename : null;

    const book = new Book({
        title: req.body.title ,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author,
        coverImageName: fileName
    })

    try {
        const newBook = await book.save();
        res.redirect('/books')
    } 
    catch (error) {
        
        if( book.coverImageName != null ) removeBookCover(book.coverImageName )
        renderNewPage(res, book, true)
    }
    
    
   
})

function removeBookCover( fileName){
     
    fs.unlink( path.join( uploadPath, fileName ) , err => {
        if( err) console.log(err)
    });
}
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

module.exports = router;