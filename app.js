const imageBox = document.querySelector(".images");
const loadmoreBtn = document.querySelector("#btn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchBtn");
const lightBox = document.querySelector(".light-box");
const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadBtn = lightBox.querySelector(".fa-download");

// 🔑 Apni Pexels API Key yaha paste karo
const API_KEY = ieFMe35AHROIpCI41zY1VHyOBU2TFcYKNEr4BzQL9KEQXrY5FvzLJu7n

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
  lightBox.style.display = "block";
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
