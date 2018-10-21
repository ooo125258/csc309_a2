/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
    const newBookName = document.querySelector('#newBookName').value;
    const newBookAuthor = document.querySelector('#newBookAuthor').value;
    const newBookGenre = document.querySelector('#newBookGenre').value;
    var newBook = new Book(newBookName, newBookAuthor, newBookGenre);
    libraryBooks.push(newBook);
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
    const loanBookId = document.querySelector('#loanBookId').value;
    const loanCardNum = document.querySelector('#loanCardNum').value;
    let loanBook = libraryBooks[loanBookId]
    let loanPatron = patrons[loanCardNum]
	// Add patron to the book's patron property
    loanBook.patron = loanPatron
    
	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(loanBook)

	// Start the book loan timer.
	changeToOverdue(loanBook)

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
    let target = e.target
    if(!target.classList.contains('return')){
        return
    }
	// Call removeBookFromPatronTable()
    const btoReturn = target.parentElement.parentElement
    let bookID = Number(btoReturn.getElementsByTagName('td')[0].textContent);
    var retBook = libraryBooks[bookID];
    removeBookFromPatronTable(retBook);

	// Change the book object to have a patron of 'null'
    retBook.patron = null;

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
    const newPatronName = document.querySelector('#newPatronName').value
    let newPatron = new Patron(newPatronName)
    patrons.push(newPatron)
	// Call addNewPatronEntry() to add patron to the DOM
    addNewPatronEntry(newPatron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
    const bookInfoId = document.querySelector('#bookInfoId').value;
    const book = libraryBooks[bookInfoId]
	// Call displayBookInfo()	
    displayBookInfo(book)
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
    //var tr = bookTable.getElementsByTagName("tr")
    let table_len = (bookTable.rows.length);
    let row = bookTable.insertRow(table_len).outerHTML="<tr><td>" + book.bookId + "</td><td><strong>" + book.title + "</strong></td><td></td></tr>";
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
    let thePatron = "N/A"
    if (book.patron){
        thePatron = book.patron.name
    }
    bookInfo.innerHTML = "<p>Book Id: <span>"+
        book.bookId+"</span></p><p>Title: <span>"+
        book.title+"</span></p><p>Author: <span>"+
        book.author+"</span></p><p>Genre: <span>"+
        book.genre+"</span></p><p>Currently loaded to: <span>"+
        thePatron +"</span></p>"
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
    let patron = book.patron
    let patronBookTable = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber].getElementsByClassName('patronLoansTable')[0]
    let row = patronBookTable.insertRow(patronBookTable.rows.length).outerHTML="<tr><td>"+
        book.bookId+"</td><td><strong>" + book.title + "</strong></td><td><span class='green'>Within due date</span></td><td><button class='return'>return</button></td></tr>"
    bookTable.getElementsByTagName('tr')[book.bookId + 1].getElementsByTagName('td')[2].innerText = patron.cardNumber
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
    let newPatronElement = document.createElement("div")
    newPatronElement.className = 'patron'
    newPatronElement.innerHTML = "<p>Name: <span>"+
        patron.name+"</span></p><p>Card Number: <span>"+
        patron.cardNumber+"</span></p><h4>Books on loan:</h4><table class='patronLoansTable'><tr><th>BookID</th><th>Title</th><th>Status</th>	<th>Return</th></tr></table>"
    patronEntries.appendChild(newPatronElement)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
    //patronEntries.getElementsByClassName('patron')[patron.cardNumber].getElementByClassName('patronLoansTable').getElementByTagName('tr').getElementsByTagName('')
    var i;
    let table = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber].getElementsByClassName('patronLoansTable')[0]
    let booksTr = table.getElementsByTagName('tr')
    for (i = 1; i < booksTr.length; i++){
        if (Number(booksTr[i].getElementsByTagName('td')[0].innerText) == book.bookId){
            table.deleteRow(i)
            bookTable.getElementsByTagName('tr')[book.bookId + 1].getElementsByTagName('td')[2].innerText = ''
            return
        }
    }
    
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
    setTimeout(function() {
			let booksTr = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber].getElementsByClassName('patronLoansTable')[0].getElementsByTagName('tr');
            let i;
            for (i = 1; i < booksTr.length; i++){
                if (Number(booksTr[i].getElementsByTagName('td')[0].innerText) == book.bookId){
                    let message = booksTr[i].getElementsByTagName('td')[2];
                    message.innerText = "Overdue";
                    message.style.color = 'red';   
                }
            }

		}, 3000)
}

