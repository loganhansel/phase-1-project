// EVENT-LISTENERS
document.getElementById("search-form").addEventListener('submit', fetchAuthors)



// FETCH AUTHOR LIST FROM API
function fetchAuthors(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("author-display").innerHTML = ""
    fetch(`https://openlibrary.org/search/authors.json?q=${parseName(event.target.name.value)}`)
    .then(response => response.json())
    .then(function(data){
        let authorData = data["docs"]
        authorData.forEach(element => appendAuthors(element))
    })
    document.getElementById("search-form").reset()
}



// CONVERTS USER SEARCH INTO QUERY STRING
function parseName(name) {
    let parsedName = encodeURIComponent(name)
    return parsedName
}



// APPENDS AUTHOR SEARCH RESULTS TO WEBPAGE
function appendAuthors(authorData) {
    let authorItem = document.createElement('li')
    let authorName = document.createElement('h3')
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



// FETCH AUTHOR PAGE FOR LIST 'CLICK' EVENT
function findAuthorPage(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    fetch(`https://openlibrary.org/authors/${event.currentTarget.authorKey}.json`)
    .then(response => response.json())
    .then(data => appendAuthorPage(data))
}



// APPENDS AUTHOR DATA TO WEBPAGE
function appendAuthorPage(author) {
    document.getElementById("author-display").innerHTML = ""
    let authorName = document.createElement('h1')
        authorName.innerText = author["name"]
        document.getElementById("author-display").appendChild(authorName)
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
                document.getElementById("author-display").appendChild(authorBirthdate)
                break;
            default:
                authorBirthdate.innerText = `${author["birth_date"]} - ${author["death_date"]}`
                document.getElementById("author-display").appendChild(authorBirthdate)
            }
        }
    switch (author["bio"]) {
        case undefined:
            break;
        default:
            let authorBio = document.createElement('p')
            authorBio.innerText = author["bio"]
            document.getElementById("author-display").appendChild(authorBio)
    }
    let booksList = document.createElement('button')
        booksList.innerText = 'Books'
        booksList.authorId = author["key"]
        booksList.addEventListener('click', fetchAuthorBooks)
        document.getElementById("author-display").appendChild(booksList)
}



// FETCH BOOKS
function fetchAuthorBooks(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    document.getElementById("author-display").innerHTML = ""
    fetch(`https://openlibrary.org${event.currentTarget.authorId}/works.json`)
    .then(response => response.json())
    .then(data => console.log(data))
}