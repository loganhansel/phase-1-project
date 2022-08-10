document.querySelector("search-form").addEventListener('submit', fetchAuthors())

function fetchAuthors(event) {
    event.preventDefault()
    fetch(`https://openlibrary.org/search/authors.json?q=${event.target.name.value}`)
    .then(response => response.json())
    .then(appendAuthors(data))
}

function appendAuthors(authors) {
    
}