document.getElementById("search-form").addEventListener('submit', fetchAuthors)


function fetchAuthors(event) {
    event.preventDefault()
    let nameValue = event.target.name.value
    fetch(`https://openlibrary.org/search/authors.json?q=${parseName(nameValue)}`)
    .then(response => response.json())
    .then(appendAuthors(data))
}

function appendAuthors(authors) {

}

function parseName(name) {
    
}