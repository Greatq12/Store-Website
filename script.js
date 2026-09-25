/* =========================================================================
   OWNER SETUP
   1) Set your real WhatsApp number below (digits only, country code, no +).
   2) Replace placeholder products with your real items: name, price, and
      (optionally) an image URL. Until you add "img", each card shows a
      colored placeholder with the item name — that's expected.
   3) To add a real photo to any product, add:  img: "https://your-image-link"
      to that product's object. The card will show the photo automatically.
   ========================================================================= */
const WHATSAPP_NUMBER = "15551234567"; // <-- replace with your WhatsApp number

function waLink(itemName){
  const msg = encodeURIComponent(`Hi! I'm interested in: ${itemName}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// Placeholder gradient palette so cards look intentional before real photos are added
const swatches = [
  "linear-gradient(160deg,#7a2f47,#a83b5c)",
  "linear-gradient(160deg,#12332B,#2b5c4c)",
  "linear-gradient(160deg,#8a5a1c,#C9A24B)",
  "linear-gradient(160deg,#3b3168,#7a5fb8)",
  "linear-gradient(160deg,#8a1f3b,#c9536f)",
  "linear-gradient(160deg,#1c5e63,#4fa3a8)"
];

// ---- DIRAC (replace/add as many as you like — 100+ supported) ----
const diracProducts = [
  {name:"Amal Chiffon Dirac", price:45, tag:"New"},
  {name:"Hodan Beaded Dirac", price:65},
  {name:"Sahra Georgette Dirac", price:38},
  {name:"Layla Wedding Guest Dirac", price:95},
  {name:"Nadia Embroidered Dirac", price:120},
  {name:"Zainab Bridal Dirac", price:210, tag:"Bridal"},
  {name:"Faiza Everyday Dirac", price:32},
  {name:"Ikram Sequin Dirac", price:140},
  {name:"Rahma Silk-Feel Dirac", price:78},
  {name:"Yasmin Lace Trim Dirac", price:105},
  {name:"Khadra Two-Piece Dirac", price:58},
  {name:"Muna Velvet Dirac", price:165},
  {name:"Asha Printed Dirac", price:42},
  {name:"Deqa Crystal Dirac", price:185, tag:"Bridal"}
];

// ---- PERFUMES ----
const perfumeProducts = [
  {name:"Royal Oud Attar", price:28},
  {name:"Dab Qaad Bakhoor Blend", price:22},
  {name:"Amber Musk Perfume Oil", price:19},
  {name:"Rose & Oud Spray", price:26},
  {name:"Sandalwood Attar", price:24},
  {name:"Wedding Night Gift Set", price:55, tag:"Gift Set"}
];

// ---- CREAMS ----
const creamProducts = [
  {name:"Radiance Body Cream", price:16},
  {name:"Cocoa Butter Glow Cream", price:14},
  {name:"Bridal Prep Brightening Cream", price:22, tag:"Bridal"},
  {name:"Rose Water Body Lotion", price:15},
  {name:"Shea & Honey Cream", price:17},
  {name:"Even Tone Night Cream", price:20}
];

// ---- RINGS & JEWELRY ----
const ringProducts = [
  {name:"Gold-Tone Statement Ring", price:24},
  {name:"Bridal Jewelry Set", price:85, tag:"Bridal"},
  {name:"Layered Gold Bangles (Set of 6)", price:32},
  {name:"Crystal Engagement Ring", price:45},
  {name:"Pearl Drop Earring Set", price:28},
  {name:"Henna Night Jewelry Set", price:60}
];

// ---- ACCESSORIES ----
const accessoryProducts = [
  {name:"Garbasaar Shawl", price:25},
  {name:"Embellished Hijab Pin Set", price:9},
  {name:"Bridal Clutch Bag", price:34},
  {name:"Henna Kit", price:12},
  {name:"Wedding Guest Scarf", price:20},
  {name:"Beaded Hair Accessory", price:15}
];

function priceBucket(p){
  if(p < 50) return "under50";
  if(p < 100) return "50-100";
  if(p < 150) return "100-150";
  return "150plus";
}

function cardHTML(item, idx){
  const grad = item.img ? "" : swatches[idx % swatches.length];
  const media = item.img
    ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">`
    : `<div style="background:${grad};width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:14px;">
         <span style="font-size:1.05rem;">${item.name}</span>
         <span class="ph">Photo coming soon</span>
       </div>`;
  return `
    <div class="card">
      <div class="card-media">
        ${item.tag ? `<span class="card-tag">${item.tag}</span>` : ""}
        ${media}
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <div class="price-row">
          <span class="price">$${item.price}</span>
          <a class="order-btn" href="${waLink(item.name)}" target="_blank" rel="noopener">Order</a>
        </div>
      </div>
    </div>`;
}

function renderSimpleGrid(containerId, items){
  document.getElementById(containerId).innerHTML = items.map((it,i)=>cardHTML(it,i)).join("");
}
renderSimpleGrid("perfumeGrid", perfumeProducts);
renderSimpleGrid("creamGrid", creamProducts);
renderSimpleGrid("ringGrid", ringProducts);
renderSimpleGrid("accessoryGrid", accessoryProducts);

// ---- Dirac grid: filter + search + show more ----
const diracGrid = document.getElementById("diracGrid");
const diracEmpty = document.getElementById("diracEmpty");
const loadMoreBtn = document.getElementById("diracLoadMore");
let activeFilter = "all";
let searchTerm = "";
let visibleCount = 12;

function getFiltered(){
  return diracProducts.filter(p=>{
    const matchesFilter = activeFilter === "all" || priceBucket(p.price) === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderDirac(){
  const filtered = getFiltered();
  const slice = filtered.slice(0, visibleCount);
  diracGrid.innerHTML = slice.map((it,i)=>cardHTML(it,i)).join("");
  diracEmpty.style.display = filtered.length === 0 ? "block" : "none";
  loadMoreBtn.style.display = filtered.length > visibleCount ? "block" : "none";
}
renderDirac();

document.getElementById("diracFilters").addEventListener("click", (e)=>{
  const btn = e.target.closest(".chip");
  if(!btn) return;
  document.querySelectorAll("#diracFilters .chip").forEach(c=>c.setAttribute("aria-pressed","false"));
  btn.setAttribute("aria-pressed","true");
  activeFilter = btn.dataset.filter;
  visibleCount = 12;
  renderDirac();
});

document.getElementById("diracSearch").addEventListener("input",(e)=>{
  searchTerm = e.target.value;
  visibleCount = 12;
  renderDirac();
});

loadMoreBtn.addEventListener("click", ()=>{
  visibleCount += 12;
  renderDirac();
});

// WhatsApp links
document.getElementById("waMain").href = waLink("your dirac collection");
document.getElementById("waFloat").href = waLink("your dirac collection");
document.getElementById("year").textContent = new Date().getFullYear();
