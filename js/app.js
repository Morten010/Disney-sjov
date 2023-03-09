const app = document.getElementById('app')


//build character screen
function buildCharacter(data) {
    //sort data into variables
    const name = data.name
  
    //build view
    html = `
    <div class="character">
        <h1>${name}</h1>
        <img src="${data.imageUrl}">
    </div>
    <div class="other">
        <h2>Movies with ${name}</h2>
        <div id="movies">none</div>
        <h2>Series with ${name}</h2>
        <div id="series">none</div>
        <h2>Short films with ${name}</h2>
        <div id="short-films">none</div>
        <h2>park attractions with ${name}</h2>
        <div id="park">none</div>
        <h2>video games with ${name}</h2>
        <div id="games">none</div>
    </div>
    `
    //removes loading screen
    app.innerHTML = html

    const movie = document.getElementById('movies');
    const series = document.getElementById('series');
    const shortFilm = document.getElementById('short-films');
    const park = document.getElementById('park');
    const games = document.getElementById('games');

    //input data into fields
    mapData(data.films, movie)
    mapData(data.tvShows, series)
    mapData(data.shortFilms, shortFilm)
    mapData(data.parkAttractions, park)
    mapData(data.videoGames, games)
    
}

function mapData(data, target) {

    if(data.length > 0 ){
        target.innerHTML= ""
        data.map((item) => {
            target.innerHTML += `
            <div class="item-box">${item}</div>
            `
        })
    }
    if(data.length == 0 ){
        target.previousElementSibling.remove();
        target.remove()
    }
}



//build loading screen
function buildLoadingScreen() {
    html = `
    <div class="loading">
        <div class="loader">
            <div class="square" id="sq1"></div>
            <div class="square" id="sq2"></div>
            <div class="square" id="sq3"></div>
            <div class="square" id="sq4"></div>
            <div class="square" id="sq5"></div>
            <div class="square" id="sq6"></div>
            <div class="square" id="sq7"></div>
            <div class="square" id="sq8"></div>
            <div class="square" id="sq9"></div>
        </div>
    </div>
    `
    app.innerHTML = html
}

//when app starts
async function onStart() {
    //fetch data
    let api = "https://api.disneyapi.dev/characters/4703"
    let response = await fetch(api);
    response = await response.json()

    //build view
    buildCharacter(response)
}

onStart()

//search
const form = document.querySelector('form');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector('form input');
    const value = input.value.trim()

    if(value.length == 0){
        input.placeholder = "write name"
    } else{
        buildLoadingScreen()
        
        const key = value.replace(/\s+/g, '%20')

        const api = `https://api.disneyapi.dev/character?name=${key}`
        
        search(api)
    }
})

//search with api
async function search(api) {
    //fetch api
    let response = await fetch(api)
    response = await response.json()

    if(response.count > 1){
        app.innerHTML = `
        <h1>Pick one</h1>
        <div id="choices"></div>
        `;
        const choices = document.getElementById('choices')
        const people = response.data;
        people.map((person) => {
            choices.innerHTML += `
            <div class="person" data-url="${person.url}">
                <img src="${person.imageUrl}">
                <h2>${person.name}</h2>
            </div>
            `
        })
        const person = document.querySelectorAll(".person")
        for(const index of person){
            index.addEventListener('click', (e) => {
                const api = e.currentTarget.dataset.url;
                fetch(api)
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        buildCharacter(response)
                    })
            })
        }
    } else if(response.count == 1){
        console.log(response);
        buildCharacter(response.data[0])
    } else{
        app.innerHTML = `
        <div class="notfound">
        <h1>no character found</h1>
        </div>
        `
    }
} 

//show more
const more = document.getElementById('more')
more.addEventListener('click', () => {
    buildLoadingScreen()
    fetchPage(1)
    
});

//build page
function fetchPage(pageNumber) {
    fetch(`https://api.disneyapi.dev/characters/?page=${pageNumber}`)
        .then(res => res.json())
        .then(res => {
            app.innerHTML = `
            <h1>Page ${pageNumber}</h1>
            <ul id="choices"></ul>
            <div class="pages">
            <i class="fa-solid fa-chevron-left" id="back"></i>
            <div><span id="pageNumber">${pageNumber}</span> / 149</div>
            <i class="fa-solid fa-chevron-right next" id="forward"></i>
            </div>

            `;

            const back = document.getElementById('back')
            const forward = document.getElementById('forward');
            switch(pageNumber){
                
                case 1:
                    back.classList.add('deactivated')
                    forward.addEventListener('click', () => {
                        nextPage()
                    })
                    break;
                case 149:
                    forward.classList.add('deactivated');
                    back.addEventListener('click', () => {
                        previousePage()
                    })
                    break;
                default:
                    back.addEventListener('click', () => {
                        previousePage()
                    })
                    forward.addEventListener('click', () => {
                        nextPage()
                    })
                    break
            }

            const choices = document.getElementById('choices')
            const people = res.data;
            people.map((person) => {
                choices.innerHTML += `
                <div class="person list-person" data-url="${person.url}">
                    <img src="${person.imageUrl}">
                    <h2>${person.name}</h2>
                </div>
                `
            })
            const listPerson = document.querySelectorAll(".list-person");
            for(const index in listPerson){
        
                listPerson[index].addEventListener('click', (e) => {
                    const api = e.currentTarget.dataset.url;
                    fetch(api)
                        .then(response => response.json())
                        .then(response => {
                            buildCharacter(response)
                        })
                })
            }


        })
        .catch(err => console.log(err));
}

//next page function
function nextPage(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let pageNumber = Number(document.getElementById('pageNumber').innerHTML);
    pageNumber++
    fetchPage(pageNumber)
}
//previous page function
function previousePage(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let pageNumber = Number(document.getElementById('pageNumber').innerHTML);
    pageNumber--
    fetchPage(pageNumber)
}
