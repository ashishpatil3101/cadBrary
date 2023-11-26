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
        res.redirect(`books/${newBook.id}`)
    } 
    catch (error) {
        
        renderNewPage(res, book, true)
    }
    
})

//show  book rout
router.get('/:id', async (req, res) =>{

    try {
       
        const books = await Book.findById( req.params.id )
                                .populate('author')
                                .exec();
        res.render('books/show',{
            book: books
        })
    } 
    catch (error) {
       
        res.redirect('/')
    }
})

// edit book rout
router.get('/:id/edit', async( req, res)=>{

    try {
        const book = await Book.findById( req.params.id);
        renderEditPage( res, book,false);
    } 
    catch (error) {
        
        res.redirect('/')
    }
    
    
})

//update book rout
router.put('/:id', async (req, res) => {
    let book
  
    try {
    
      book = await Book.findById(req.params.id)
      book.title = req.body.title
      book.author = req.body.author
      book.publishDate = new Date(req.body.publishDate)
      book.pageCount = req.body.pageCount
      book.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(book, req.body.cover)
      }
      await book.save()
      res.redirect(`/books/${book.id}`)
    } catch(error) {
      
      if (book != null) {
        renderEditPage(res, book, true)
      } else {
        redirect('/')
      }
    }
  })

  // Delete Book rout
router.delete('/:id', async (req, res) => {
    let book
    try {
      book = await Book.findByIdAndDelete(req.params.id)
      
      res.redirect('/books')
    } catch(err) {

      if (book != null) {
        res.render('books/show', {
          book: book,
          errorMessage: 'Could not remove book'
        })
      } else {
        res.redirect('/')
      }
    }
  })

async function renderNewPage (res,book, hasError = false ){
    // try {
        
    //     const authors = await Author.find({});
    //     let params =  {
    //         authors: authors,
    //         book: book
    //     };
    //     if(hasError ) params.errorMessage = "error creating book"

    //     res.render('books/new',params);
    // } 
    // catch (error) {
    //    res.redirect('/books')    
    // }

    renderFormPage(res,book,'new', hasError)
}


async function renderEditPage (res,book, hasError = false ){
    renderFormPage(res,book,'edit', hasError)
}

async function renderFormPage (res,book, form, hasError = false ){
    try {
        
        const authors = await Author.find({});
        let params =  {
            authors: authors,
            book: book
        };
        if (hasError) {
            if (form === 'edit') {
              params.errorMessage = 'Error Updating Book'
            } else {
              params.errorMessage = 'Error Creating Book'
            }
        }

        res.render(`books/${form}`,params);
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