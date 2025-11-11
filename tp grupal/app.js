"use strict";

// locales disponibles
const STORES = [
  { id: "punto-n",    name: "PUNTO N" },
  { id: "bullbenny",  name: "BULLBENNY" },
  { id: "pixel-play", name: "PIXEL PLAY" },
  { id: "prime-boots",name: "PRIME BOOTS" },
  { id: "giza",       name: "GIZA" },
  { id: "hoyts",      name: "HOYTS" },
  { id: "neverland",  name: "NEVERLAND" },
  { id: "la-trattoria", name: "LA TRATTORIA" },
  { id: "sushi-go",     name: "SUSHI GO!" },
  { id: "green-fresh",  name: "GREEN & FRESH" },
];

function normalize(s){
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

document.addEventListener("DOMContentLoaded", () => {

  // elementos del filtro
  const input = document.getElementById("searchLocal");
  const clear = document.getElementById("clearSearch");
  const count = document.getElementById("searchCount");
  const categorySelect = document.getElementById("filterCategory");
  const cards = [...document.querySelectorAll("[data-store-name]")];

  // filtrar por nombre + categoría
  function applyFilters() {
    const query = normalize(input?.value || "");
    const category = categorySelect?.value || "todas";
    let visible = 0;

    cards.forEach(cardWrap => {
      const card = cardWrap.querySelector(".store-card");
      card?.classList.remove("highlight");

      const cat = cardWrap.getAttribute("data-category") || "todas";
      const title = normalize(cardWrap.querySelector("h3, .h6")?.textContent || "");

      const matchName = !query || title.includes(query);
      const matchCat = category === "todas" || cat === category;

      if (matchName && matchCat) {
        cardWrap.style.display = "";
        card?.classList.add("highlight");
        visible++;
      } else {
        cardWrap.style.display = "none";
      }
    });

    count.textContent =
      (!query && category === "todas")
        ? "Mostrando todos"
        : (visible ? `Coincidencias: ${visible}` : "Sin resultados");
  }

  input?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);
  clear?.addEventListener("click", () => {
    input.value = "";
    categorySelect.value = "todas";
    applyFilters();
    input.focus();
  });
  applyFilters();

  // foco desde el mapa
  function focusStore(id){
    document.querySelectorAll(".store-card").forEach(c => c.classList.remove("highlight"));
    const cardWrap = document.querySelector(`[data-store-name="${id}"]`);
    if(cardWrap){
      const card = cardWrap.querySelector(".store-card");
      card.classList.add("highlight");
      card.scrollIntoView({ behavior:"smooth", block:"center" });
      const link = cardWrap.querySelector(".store-link");
      link?.focus();
    }

    document.querySelectorAll("#mapaInicio .marker-btn").forEach(c => c.classList.remove("marker-active"));
    const marker = document.querySelector(`#mapaInicio [data-id="${id}"] .marker-btn`);
    if(marker) marker.classList.add("marker-active");
  }

  // eventos del mapa
  document.querySelectorAll("#mapaInicio .marker-group").forEach(g => {
    const id = g.getAttribute("data-id");
    g.addEventListener("click", () => focusStore(id));
    g.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        focusStore(id);
      }
    });
  });

  // CHAT
  const chatMsgs = document.getElementById("chatMsgs");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chat = document.getElementById("chat");
  const chatToggle = document.querySelector(".chat__toggle");

  function pushMsg(text, who){
    const div = document.createElement("div");
    div.className = `chat__msg chat__msg--${who}`;
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function botReply(text){
    const q = normalize(text);
    if(q.includes("horario")) return "Abrimos 10–22 hs. (Cine hasta 1 am).";
    if(q.includes("oferta") || q.includes("promo")) return "Revisá la sección Ofertas.";
    if(q.includes("cine")) return "Tenés HOYTS en la planta principal.";
    return "Puedo ayudarte con horarios, locales y categorías.";
  }

  chatForm?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const t = chatInput.value.trim();
    if(!t) return;
    pushMsg(t,"user");
    chatInput.value = "";
    setTimeout(()=>pushMsg(botReply(t),"bot"), 250);
  });

  chatToggle?.addEventListener("click", ()=>{
    chat.classList.toggle("chat--minimized");
  });

});
