<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pexels Image Gallery</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #111;
    color: #fff;
    margin: 0;
    padding: 0;
  }
  header {
    display: flex;
    justify-content: center;
    padding: 20px;
    gap: 10px;
  }
  input {
    padding: 8px;
    border-radius: 5px;
    border: none;
    width: 200px;
  }
  button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: #ff6b6b;
    color: white;
  }
  .images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    padding: 20px;
  }
  .card {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: #222;
  }
  .card img {
    width: 100%;
    display: block;
    cursor: pointer;
    transition: transform 0.3s;
  }
  .card img:hover {
    transform: scale(1.05);
  }
  .details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .light-box {
    position: fixed;
    top:0; left:0; right:0; bottom:0;
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.9);
    flex-direction: column;
    z-index: 1000;
  }
  .light-box img {
    max-width: 90%;
    max-height: 80%;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  .light-box span {
    color: #fff;
    margin-bottom: 20px;
  }
  .light-box .fa-xmark, .light-box .fa-download {
    font-size: 24px;
    cursor: pointer;
    margin: 5px;
    color: #ff6b6b;
  }
  #btn {
    display: block;
    margin: 0 auto 30px auto;
    padding: 10px 20px;
    font-size: 16px;
  }
</style>
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>
<body>

<header>
  <input type="text" id="searchInput" placeholder="Search images...">
  <button class="searchBtn">Search</button>
</header>

<ul class="images"></ul>
<button id="btn">Load More</button>

<div class="light-box">
  <i class="fa-solid fa-xmark"></i>
  <img src="" alt="Image">
  <span></span>
  <i class="fa-solid fa-download"></i>
</div>

<script>
const imageBox = document.querySelector(".images");
const loadmoreBtn = document.querySelector("#btn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchBtn");
const lightBox = document.querySelector(".light-box");
const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadBtn = lightBox.querySelector(".fa-download");

// 🔑 Apni Pexels API Key yaha paste karo (quotes me)
const API_KEY = "ieFMe35AHROIpCI41zY1VHyOBU2TFcYKNEr4BzQL9KEQXrY5FvzLJu7n";

const perPage = 20;
let currentPage = 1;
let searchTerm = null;

// Download Image
const downloadImg = async (url) => {
  try {
    const res = await fetch(url);
    const file = await res.blob();
    const aTag = document.createElement("a");
    aTag.href = URL.createObjectURL(file);
    aTag.download = new Date().getTime();
    aTag.click();
  } catch {
    alert("Failed to Download Image!");
  }
};

// Lightbox
const showLightBox = (photographer, imgURL) => {
  lightBox.querySelector("img").src = imgURL;
  lightBox.querySelector("span").textContent = photographer;
  downloadBtn.setAttribute("data-img", imgURL);
  lightBox.style.display = "flex";
};

// Generate HTML
const generateHTML = (images) => {
  imageBox.innerHTML += images.map(image => `
    <li class="card">
      <img src="${image.src.large2x}" 
           onclick="showLightBox('${image.photographer}', '${image.src.large2x}')">
      <div class="details">
        <div class="photographer">
          <span>${image.photographer}</span>
        </div>
        <button onclick="downloadImg('${image.src.large2x}')">
          Download
        </button>
      </div>
    </li>
  `).join("");
};

// Fetch Images
const getImages = async (url) => {
  loadmoreBtn.textContent = "Loading...";
  loadmoreBtn.disabled = true;

  try {
    const res = await fetch(url, {
      headers: { Authorization: API_KEY }
    });
    const data = await res.json();
    generateHTML(data.photos);
  } catch {
    alert("Failed to load images!");
  }

  loadmoreBtn.textContent = "Load More";
  loadmoreBtn.disabled = false;
};

// Load More
const loadMoreImages = () => {
  currentPage++;
  const url = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  getImages(url);
};

// Search
const loadSearchImages = () => {
  if (searchInput.value === "") return;

  currentPage = 1;
  searchTerm = searchInput.value;
  imageBox.innerHTML = "";

  const url = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
  getImages(url);
};

// Initial Load
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// Events
loadmoreBtn.addEventListener("click", loadMoreImages);
searchBtn.addEventListener("click", loadSearchImages);
closeBtn.addEventListener("click", () => {
  lightBox.style.display = "none";
});
downloadBtn.addEventListener("click", (e) => {
  downloadImg(e.target.dataset.img);
});
</script>

</body>
</html>
