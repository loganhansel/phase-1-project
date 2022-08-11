// Search bar events
document.getElementById("search-form").addEventListener('submit', function(event){
    event.preventDefault()
    let selectedType = document.getElementById("selectedType").value
    if (selectedType === "author") {
        fetchAuthors(event)
    } if (selectedType === "book") {
        fetchBooks(event)
    }
})



// Search bar fetches books from API
function fetchBooks(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("display").innerHTML = ""
    fetch(`https://openlibrary.org/search.json?q=${parseName(event.target.name.value)}`)
    .then(response => response.json())
    .then(function(data){
        data["docs"].forEach(book => appendBookData(book))
    })
    document.getElementById("search-form").reset()
}



// Search bar fetches authors from API
function fetchAuthors(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("display").innerHTML = ""
    fetch(`https://openlibrary.org/search/authors.json?q=${parseName(event.target.name.value)}`)
    .then(response => response.json())
    .then(function(data){
        data["docs"].forEach(element => appendAuthors(element))
    })
    document.getElementById("search-form").reset()
}



// Turns search results into usable query strings
function parseName(name) {
    let parsedName = encodeURIComponent(name)
    return parsedName
}

// When authors are fetched from API, this appends the results in a list
function appendAuthors(authorData) {
    let authorItem = document.createElement('li')
    let authorImage = document.createElement('img')
        authorImage.src = `https://covers.openlibrary.org/a/olid/${authorData["key"]}-M.jpg`
        authorItem.appendChild(authorImage)
    let authorName = document.createElement('h2')
        authorName.innerText = authorData["name"]
        authorItem.appendChild(authorName)
    switch (authorData["birth_date"]) {
        case undefined:
            if (authorData["death_date"] === true) {
                let authorBirthdate = document.createElement('p')
                authorBirthdate.innerText = `Died: ${authorData["death_date"]}`
            }
            break;
        default:
            let authorBirthdate = document.createElement('p')
            switch (authorData["death_date"]) {
            case undefined:
                authorBirthdate.innerText = `Born: ${authorData["birth_date"]}`
                authorItem.appendChild(authorBirthdate)
                break;
            default:
                authorBirthdate.innerText = `${authorData["birth_date"]} - ${authorData["death_date"]}`
                authorItem.appendChild(authorBirthdate)
            }
        }
    let authorWorksCount = document.createElement('p')
    switch (authorData["work_count"]) {
        case 0:
            authorWorksCount.innerText = `${authorData["work_count"]} books`
            authorItem.appendChild(authorWorksCount)
            break
        default:
        authorWorksCount.innerText = `${authorData["work_count"]} books, including: ${authorData["top_work"]}`
        authorItem.appendChild(authorWorksCount)
    }
    authorItem.authorKey = authorData["key"]
    authorItem.addEventListener('click', findAuthorPage)
    document.getElementById("search-results").appendChild(authorItem)
}



// Clicking on an author from the list fetches specific author data from API
function findAuthorPage(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    fetch(`https://openlibrary.org/authors/${event.currentTarget.authorKey}.json`)
    .then(response => response.json())
    .then(data => appendAuthorPage(data))
}



// When specific author data is fetched from API, this appends the author's profile to the webpage
function appendAuthorPage(author) {
    let authorDiv = document.getElementById("display")
    authorDiv.innerHTML = ""
    let authorImage = document.createElement("img")
        authorImage.src = `https://covers.openlibrary.org/a/olid/${author["key"].slice(9)}-L.jpg`
        authorDiv.appendChild(authorImage)
    let authorName = document.createElement('h1')
        authorName.innerText = author["name"]
        authorDiv.appendChild(authorName)
    switch (author["birth_date"]) {
        case undefined:
            if (author["death_date"] === true) {
                let authorBirthdate = document.createElement('p')
                authorBirthdate.innerText = `Died: ${author["death_date"]}`
            }
            break;
        default:
            let authorBirthdate = document.createElement('p')
            switch (author["death_date"]) {
            case undefined:
                authorBirthdate.innerText = `Born: ${author["birth_date"]}`
                authorDiv.appendChild(authorBirthdate)
                break;
            default:
                authorBirthdate.innerText = `${author["birth_date"]} - ${author["death_date"]}`
                authorDiv.appendChild(authorBirthdate)
            }
        }
    switch (author["bio"]) {
        case undefined:
            break;
        default:
            let authorBio = document.createElement('p')
            authorBio.innerText = author["bio"]
            authorDiv.appendChild(authorBio)
    }
    let booksList = document.createElement('button')
        booksList.innerText = 'Books'
        booksList.authorId = author["key"]
        booksList.addEventListener('click', fetchAuthorBooks)
        authorDiv.appendChild(booksList)
}



// When 'books' button is pressed on an author's profile this fetches the list from the API
function fetchAuthorBooks(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("display").innerHTML = ""
    fetch(`https://openlibrary.org${event.currentTarget.authorId}/works.json`)
    .then(response => response.json())
    .then(function(data) {
        data["entries"].forEach(book => appendBookData(book))
    })
}



// When books are fetched from the API, this appends them to a list
function appendBookData(book) {
    let bookItem = document.createElement('li')
    let bookImage = document.createElement('img')
        bookImage.src = `https://covers.openlibrary.org/b/id/${book["cover_i"]}-M.jpg`
        bookItem.appendChild(bookImage)
    let bookName = document.createElement('h2')
        bookName.innerText = book["title"]
        bookItem.appendChild(bookName)
    switch (book["author_name"]) {
        case undefined:
            break;
        default:
            let bookAuthor = document.createElement('p')
            bookAuthor.innerText = `Author: ${book["author_name"]}`
            bookItem.appendChild(bookAuthor)
    }
    switch (book["edition_count"]) {
        case undefined:
            break;
        default:
            let editionCount = document.createElement('p')
            editionCount.innerText = `Edition count: ${book["edition_count"]}`
            bookItem.appendChild(editionCount)
    }
    bookItem.bookId = book["key"]
    bookItem.addEventListener('click', fetchBookDetails)
    document.getElementById("search-results").appendChild(bookItem)
}



// When a specific book is chosen from the list, will fetch it's data from the API
function fetchBookDetails(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("display").innerHTML = ""
    fetch(`https://openlibrary.org${event.currentTarget.bookId}.json`)
    .then(response => response.json())
    .then(data => appendBook(data))
}



// Once a book's data has been fetched, this will append all it's details to the webpage
function appendBook(book) {
    console.log(book)
    let bookDisplay = document.getElementById('display')
    let bookImage = document.createElement('img')
        bookImage.src = `https://covers.openlibrary.org/b/id/${book["covers"][0]}-L.jpg`
        bookDisplay.appendChild(bookImage)
    let bookTitle = document.createElement('h1')
        bookTitle.innerText = book["title"]
        bookDisplay.appendChild(bookTitle)
    switch (book["description"]["value"]) {
        case undefined:
            break;
        default:
        let bookDescription = document.createElement('p')
            bookDescription.innerText = book["description"]["value"]
            bookDisplay.appendChild(bookDescription)
    }
    let bookAuthor = document.createElement('button')
        bookAuthor.innerText = 'Author'
        bookAuthor.authorId = book["authors"][0]["author"]["key"]
        bookAuthor.addEventListener('click', goToAuthor)
        bookDisplay.appendChild(bookAuthor)
}



// When looking at a book, a button will call this function to fetch the author and append it
function goToAuthor(event) {
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("display").innerHTML = ""
    fetch(`https://openlibrary.org${event.target.authorId}.json`)
    .then(response => response.json())
    .then(data => appendAuthorPage(data))
}