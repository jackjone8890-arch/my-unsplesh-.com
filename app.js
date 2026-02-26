const imageBox = document.querySelector(".images");
const loadmoreBtn = document.querySelector("#btn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchBtn");
const lightBox = document.querySelector(".light-box");
const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadBtn = lightBox.querySelector(".fa-download");
const api = document.querySelector("#api");

const pexelApiKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const splashApiKey ="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

const perPage = 20;
let currentPageP = 1;
let currentPageS = 1;
let searchTerm = null;



const downloadImg = (url)=>{
    fetch(url).then(res=>
        res.blob())
            .then(file=>{
                let aTag = document.createElement("a");

                aTag.href = URL.createObjectURL(file);

                aTag.download = new Date().getTime()
                aTag.click();

            })
            .catch(()=>
                alert("Failed to Download Image!!!")
            )
}

const showLightBox = (photographer, imgURL) =>{
    lightBox.querySelector("img").src = imgURL;
    lightBox.querySelector("span").textContent = photographer;
    downloadBtn.setAttribute("data-img", imgURL);
    lightBox.style.display = "block";
}


const generateHTMLPexels = (images) =>{
    imageBox.innerHTML += images.map(image =>
        `<li class="card">
            <img src="${image.src.large2x}" alt="" onclick="showLightBox('${image.photographer}', '${image.src.large2x}')">
            <div class="details">
                <div class="photographer">
                    <i class="fa-solid fa-camera"></i>
                    <span>${image.photographer}</span>
                </div>
                <button onclick="downloadImg('${image.src.large2x}'); event.stopPropagation();">
                    <i class="fa-solid fa-download" style="color: #000;"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const generateHTMLSplash = (images) =>{
    imageBox.innerHTML += images.map(image =>
        `<li class="card">
            <img src="${image.urls.regular}" alt="" onclick="showLightBox('${image.user.name}', '${image.urls.regular}')">
            <div class="details">
                <div class="photographer">
                    <i class="fa-solid fa-camera"></i>
                    <span>${image.user.name}</span>
                </div>
                <button onclick="downloadImg('${image.urls.regular}'); event.stopPropagation();">
                    <i class="fa-solid fa-download" style="color: #000;"></i>
                </button>
            </div>
        </li>`
    ).join("");
}



async function getImagesPexels(apiURL){

    loadmoreBtn.textContent = "Loading...";
    loadmoreBtn.classList.add("disabled");

    await fetch(apiURL, {
        headers: {Authorization: pexelApiKey}
    }).then(res => res.json()).then(data => {
        generateHTMLPexels(data.photos);
        loadmoreBtn.textContent = "Load More";
        loadmoreBtn.classList.remove("disabled");
    }).catch(()=>
        alert("Failed to load images!!!")
    )

}

async function getImagesSplash(apiURL){

    loadmoreBtn.textContent = "Loading...";
    loadmoreBtn.classList.add("disabled");

    await fetch(apiURL).then(res => res.json()).then(data => {
        generateHTMLSplash(data);
        loadmoreBtn.textContent = "Load More";
        loadmoreBtn.classList.remove("disabled");
    }).catch(()=>
        alert("Failed to load images!!!")
    )
}

async function getImagesSplashsearch(apiURL){

    loadmoreBtn.textContent = "Loading...";
    loadmoreBtn.classList.add("disabled");

    await fetch(apiURL).then(res => res.json()).then(data => {
        generateHTMLSplash(data.results);
        console.log(data)
        loadmoreBtn.textContent = "Load More";
        loadmoreBtn.classList.remove("disabled");
    }).catch(()=>
        alert("Failed to load images!!!")
    )

}

const loadmoreImages = () =>{
    if(api.value === "pexels"){
        currentPageP++;
        let apiURL = `https://api.pexels.com/v1/curated?page=${currentPageP}&per_page=${perPage}`;
        apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPageP}&per_page=${perPage}` : apiURL;
        getImagesPexels(apiURL);
    }
    else{
        currentPageS++;
        let apiURL = `https://api.unsplash.com/photos?page=${currentPageS}&per_page=${perPage}&client_id=${splashApiKey}`;
        apiURL = searchTerm ? `https://api.unsplash.com/search/photos?page=${currentPageS}&query=${searchTerm}&per_page=${perPage}&client_id=${splashApiKey}` : apiURL;
        if(searchTerm != null){
            getImagesSplashsearch(apiURL);
        }
        else{getImagesSplash(apiURL);}
    }
}


const loadSearchImages = () =>{
    if(searchInput.value === "") return searchTerm = null;

    if(api.value === "pexels"){
        currentPageP = 1;
        searchTerm = searchInput.value;
        imageBox.innerHTML = "";
        getImagesPexels(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPageP}&per_page=${perPage}`)
    }
    else if(api.value === "splash"){
        currentPageS = 1;
        searchTerm = searchInput.value;
        imageBox.innerHTML = "";
        getImagesSplashsearch(`https://api.unsplash.com/search/photos?page=${currentPageS}&query=${searchTerm}&per_page=${perPage}&client_id=${splashApiKey}`)
    }
}


getImagesPexels(`https://api.pexels.com/v1/curated?page=${currentPageP}&per_page=${perPage}`);

api.addEventListener("change", ()=>{
    if(api.value == 'splash'){
        imageBox.innerHTML = "";
        searchInput.value = "";
        searchInput.placeholder = "Search images in Splash.com";
        getImagesSplash(`https://api.unsplash.com/photos?page=${currentPageS}&per_page=${perPage}&client_id=${splashApiKey}`)
    }
    else{
        imageBox.innerHTML = "";
        searchInput.value = "";
        searchInput.placeholder = "Search images in Pexels.com";
        getImagesPexels(`https://api.pexels.com/v1/curated?page=${currentPageP}&per_page=${perPage}`);
    }
})

loadmoreBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    loadmoreImages();
});

searchBtn.addEventListener("click", loadSearchImages);

closeBtn.addEventListener("click", ()=>{
    lightBox.style.display = 'none';
})

downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));