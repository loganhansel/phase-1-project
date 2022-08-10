// EVENT-LISTENERS
document.getElementById("search-form").addEventListener('submit', fetchAuthors)



// FETCH AUTHOR LIST FROM API
function fetchAuthors(event) {
    event.preventDefault()
    document.getElementById("search-results").innerHTML = ""
    let queryString = parseName(event.target.name.value)
    fetch(`https://openlibrary.org/search/authors.json?q=${queryString}`)
    .then(response => response.json())
    .then(function(data){
        let authorData = data["docs"]
        authorData.forEach(element => appendAuthors(element))
    })
    document.getElementById("search-form").reset()
}



// APPENDS AUTHOR SEARCH RESULTS TO WEBPAGE
function appendAuthors(authorData) {
    let authorItem = document.createElement('li')
    let authorName = document.createElement('h3')
        authorName.innerText = authorData["name"]
        authorItem.appendChild(authorName)
    document.getElementById("search-results").appendChild(authorItem)
}



// CONVERTS USER SEARCH INTO QUERY STRING
function parseName(name) {
    let parsedName = encodeURIComponent(name)
    return parsedName
}