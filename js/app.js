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
        <div class="carousel-overlay">
            <i class="fa-solid fa-chevron-left carousel-left"></i>
            <i class="fa-solid fa-chevron-right carousel-right"></i>
        </div>
        <div id="movies" class="carousel">none</div>
        <h2>Series with ${name}</h2>
        <div class="carousel-overlay">
        <i class="fa-solid fa-chevron-left carousel-left"></i>
        <i class="fa-solid fa-chevron-right carousel-right"></i>
    </div>
        <div id="series" class="carousel">none</div>
        <h2>Short films with ${name}</h2>
        <div class="carousel-overlay">
        <i class="fa-solid fa-chevron-left carousel-left"></i>
        <i class="fa-solid fa-chevron-right carousel-right"></i>
    </div>
        <div id="short-films" class="carousel">none</div>
        <h2>park attractions with ${name}</h2>
        <div class="carousel-overlay">
        <i class="fa-solid fa-chevron-left carousel-left"></i>
        <i class="fa-solid fa-chevron-right carousel-right"></i>
    </div>
        <div id="park" class="carousel">none</div>
        <h2>video games with ${name}</h2>
        <div class="carousel-overlay">
        <i class="fa-solid fa-chevron-left carousel-left"></i>
        <i class="fa-solid fa-chevron-right carousel-right"></i>
    </div>
        <div id="games" class="carousel">none</div>
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

    setupCarousel()
    
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
        <h1>Which one where you looking for?</h1>
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
            <h1>Disney characters</h1>
            <div class="pages">
            <i class="fa-solid fa-chevron-left previouse" ></i>
            <div><span id="pageNumber">${pageNumber}</span> / 149</div>
            <i class="fa-solid fa-chevron-right next" ></i>
            </div>
            <ul id="choices"></ul>
            <div class="pages">
            <i class="fa-solid fa-chevron-left previouse"></i>
            <div><span id="pageNumber">${pageNumber}</span> / 149</div>
            <i class="fa-solid fa-chevron-right next"></i>
            </div>

            `;

            const back = document.querySelectorAll('.previouse')
            const forward = document.querySelectorAll('.next');
            switch(pageNumber){
                
                case 1:
                    back.forEach(element => {
                        element.classList.add('deactivated')
                    });
                    forward.forEach(element => {
                        element.addEventListener('click', () => {
                            nextPage()
                        })
                    });
                    
                    break;
                case 149:
                    forward.forEach(element => {
                        element.classList.add('deactivated')
                    });
                    back.forEach(element => {
                        element.addEventListener('click', () => {
                            previousePage()
                        })
                    });
                    break;
                default:
                    back.forEach(element => {
                        element.addEventListener('click', () => {
                            previousePage()
                        })
                    });
                    forward.forEach(element => {
                        element.addEventListener('click', () => {
                            nextPage()
                        })
                    });
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

//carousel
function setupCarousel() {
    console.log("setting up carousels");
    const carousel = document.querySelectorAll(".carousel");

    const left = document.querySelectorAll('.fa-chevron-left');
    const right = document.querySelectorAll('.fa-chevron-right');

    console.log(carousel);
    let index = 0;
    carousel.length
    carousel.forEach(item => {
        let containerDimension = item.getBoundingClientRect();
        let containerWidth = containerDimension.width;

        right[index].addEventListener('click', (e) => {
            item.scrollLeft += containerWidth;
        });
        left[index].addEventListener('click', (e) => {
            item.scrollLeft -= containerWidth;
        });


        index++
    });
}
