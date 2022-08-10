// EVENT-LISTENERS
document.getElementById("search-form").addEventListener('submit', fetchAuthors)



// FETCH AUTHOR LIST FROM API
function fetchAuthors(event) {
    event.preventDefault()
    let queryString = parseName(event.target.name.value)
    fetch(`https://openlibrary.org/search/authors.json?q=${queryString}`)
    .then(response => response.json())
    .then(function(data){
        let authorData = data["docs"]
        authorData.forEach(element => appendAuthors(element))
    })
}



// APPENDS AUTHOR SEARCH RESULTS TO WEBPAGE
function appendAuthors(authorData) {

}



// CONVERTS USER SEARCH INTO QUERY STRING
function parseName(name) {
    let parsedName = encodeURIComponent(name)
    return parsedName
}