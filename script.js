let bookTitle = "";
let authorName = "";
let pageNumber = "";
let readStatus = ""
let myLibrary = [];
let index = 0

const overlayShowing = document.getElementById("overlay")
const modalShowing = document.getElementById("modal")
const titleFormField = document.getElementById("title")
const authorFormField = document.getElementById("author")
const pagesFormField = document.getElementById("pages")
const bookCardContainer = document.getElementById("bookCardContainer")


function checkStorage () {
    if(!localStorage) {
        return
    } else {
        myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
        myLibrary.forEach(displayBooksOnPage)
    }
}

function updateLocalStorage () {
    let storageLib = JSON.stringify(myLibrary)
    let libClone = JSON.parse(storageLib)
    libClone.forEach(Book => Book.data = undefined)
    localStorage.setItem("myLibrary", JSON.stringify(libClone))
}


//book object constructor
function Book(title, author, pages, read, data) {
  this.title = title
  this.author = author
  this.pages = pages
  this.read = read
  this.data = data
}

//checks whether any of the form fields are empty
function areFieldsEmpty () {
    if (titleFormField.value.length == 0 || authorFormField.value.length == 0 || pagesFormField.value.length == 0) {
        alert("Please fill in all fields.")
    } else {
        return true;
    }
}

//toggles the visibility of the overlay
function displayWindow () {
    overlayShowing.style.display = "block"
    modalShowing.style.display = "block"
}

//closes and clears the input window
function closeWindow () {
    event.preventDefault()
    overlayShowing.style.display = "none"
    modalShowing.style.display = "none"
    clearFields()
}

//checks which bubble is ticked
function radioChecker () {
    if (document.getElementById("haveNotRead").checked) {
        return "false"
    } else {
        return "true"
    }
}

//clears the form fields
function clearFields () {
    titleFormField.value = ""
    authorFormField.value = ""
    pagesFormField.value = ""
}

//assigns the form values to variables to be used in the adding function
function variableSetter () {
    bookTitle = titleFormField.value
    authorName = authorFormField.value
    pageNumber = pagesFormField.value
    readStatus = radioChecker()
}


//creates a new book object with the values from the form variables
function addBookToLibrary() {
  let newBook = new Book(bookTitle, authorName, pageNumber, readStatus)
  myLibrary.push(newBook)
}


//renders input on screen
function displayBooksOnPage(Book) {

    //checks whether or not the book has already been displayed
    if(Book.data === undefined) {

        //creates all of the DOM elements
        let cardText = document.createElement("div");
        let titleDisplay = document.createElement("p");
        let authorDisplay = document.createElement("p")
        let pageNumberDisplay = document.createElement("p")
        let readButton = document.createElement("button")
        let deleteButton = document.createElement("button")
        let bookCard = document.createElement('div')
        
        //assigns DOM elements classes
        bookCard.className = "bookCard"
        cardText.className = "cardText"
        titleDisplay.className = "titleDisplay";
        authorDisplay.className = "authorDisplay";
        pageNumberDisplay.className = "pageNumberDisplay";
        readButton.className = "readToggle";
        deleteButton.className = "deleteEntry";


        //sets the data-attribute match in order to pair the array with the DOM
        bookCard.setAttribute("data", index)
        Book.data = `${index}`
        
        //displays the values of the book objects in text
        titleDisplay.textContent = `Title: ${Book.title}`
        authorDisplay.textContent = `Author: ${Book.author}`
        pageNumberDisplay.textContent = `Pages: ${Book.pages}`
        

        //chooses the correct read button display
        if (Book.read == "true") {
            readButton.textContent = "Have Read"
            readButton.classList.add("green")
        } else {
            readButton.textContent = "Have Not Read"
            readButton.classList.add("red")
        }
        
        deleteButton.textContent = "X"
        
        //changes the read button color and updates the object value
        readButton.addEventListener("click", function(){
            if (Book.read == "true") {
                Book.read = "false";
                readButton.textContent = "Have Not Read";
                readButton.classList.remove("green")
                readButton.classList.add("red")
            } else if (Book.read == "false") {
                Book.read = "true";
                readButton.textContent = "Have Read";
                readButton.classList.remove("red")
                readButton.classList.add("green")
            }
            updateLocalStorage()
        })

        //splices the correct object from the array and removes the display from the page
        deleteButton.addEventListener("click", function(){
            let deleteIndex = myLibrary.findIndex(function(element){
                return element.data == (deleteButton.parentNode.getAttribute("data"))
            })
            deleteButton.parentNode.remove()
            myLibrary.splice(deleteIndex, 1)
            updateLocalStorage()
        })
        
        //adds the new DOM elements in the correct places
        cardText.appendChild(titleDisplay);
        cardText.appendChild(authorDisplay)
        cardText.appendChild(pageNumberDisplay)
        
        bookCard.appendChild(cardText)
        bookCard.appendChild(readButton)
        bookCard.appendChild(deleteButton)

        bookCardContainer.appendChild(bookCard)

        //increments the index for the next object
        index++

    }
}

function bookAdd() {
    event.preventDefault()
    if (areFieldsEmpty()) {
        variableSetter()
        addBookToLibrary()
        closeWindow()
        myLibrary.forEach(displayBooksOnPage)
        updateLocalStorage()
    } 
}
