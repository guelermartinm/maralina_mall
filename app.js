"use strict";

/**
 * Normaliza texto para búsquedas (sin tildes, minúsculas)
 */
function normalize(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------
     1) FILTRO DE LOCALES (lo que ya tenías)
  ------------------------------------------------------------------ */
  const input = document.getElementById("searchLocal");
  const clear = document.getElementById("clearSearch");
  const count = document.getElementById("searchCount");
  const categorySelect = document.getElementById("filterCategory");
  const cards = Array.from(document.querySelectorAll("[data-store-name]")); // todos los locales

  function applyFilters() {
    const query = normalize(input?.value || "");
    const category = categorySelect?.value || "todas";
    let visible = 0;

    cards.forEach((cardWrap) => {
      const card = cardWrap.querySelector(".store-card");
      card?.classList.remove("highlight");

      const cardCategory = cardWrap.getAttribute("data-category") || "todas";
      const cardTitle = normalize(
        cardWrap.querySelector("h3, .h6")?.textContent || ""
      );

      const matchName = !query || cardTitle.includes(query);
      const matchCat = category === "todas" || cardCategory === category;

      if (matchName && matchCat) {
        cardWrap.style.display = "";
        card?.classList.add("highlight");
        visible++;
      } else {
        cardWrap.style.display = "none";
      }
    });

    if (count) {
      if (!query && category === "todas") {
        count.textContent = "Mostrando todos";
      } else {
        count.textContent = visible
          ? `Coincidencias: ${visible}`
          : "Sin resultados";
      }
    }
  }

  input?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);
  clear?.addEventListener("click", () => {
    if (input) input.value = "";
    if (categorySelect) categorySelect.value = "todas";
    applyFilters();
    input?.focus();
  });

  // primer render
  applyFilters();

  /* ------------------------------------------------------------------
     2) FUNCIÓN COMÚN: ir a un local por ID (clave para el mapa)
  ------------------------------------------------------------------ */
  function goToStore(storeId) {
    if (!storeId) return;

    // buscamos el local por el mismo id que usan las cards
    const cardWrap = document.querySelector(
      `[data-store-name="${storeId}"]`
    );

    if (cardWrap) {
      // scrolleo directamente al local
      cardWrap.scrollIntoView({ behavior: "smooth", block: "center" });

      // lo destaco un ratito
      const card = cardWrap.querySelector(".store-card") || cardWrap;
      setTimeout(() => {
        card.classList.add("highlight-store");
        setTimeout(() => card.classList.remove("highlight-store"), 1600);
      }, 300);
    } else {
      // si no está, al menos voy a la sección
      const section = document.querySelector("#nuestros-locales");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }

  /* ------------------------------------------------------------------
     3) LISTA DEL MAPA (NUEVO)
     ahora hay más locales: los 10 que tenés en la grilla
  ------------------------------------------------------------------ */
  document.querySelectorAll(".mapa-local-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id; // ej: "sushi-go"
      goToStore(id);
    });
  });

  /* ------------------------------------------------------------------
     4) CHAT (lo que ya tenías)
  ------------------------------------------------------------------ */
  const chatMsgs = document.getElementById("chatMsgs");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chat = document.getElementById("chat");
  const chatToggle = document.querySelector(".chat__toggle");

  function pushMsg(text, who) {
    if (!chatMsgs) return;
    const div = document.createElement("div");
    div.className = `chat__msg chat__msg--${who}`;
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function botReply(text) {
    const q = normalize(text);
    if (q.includes("horario")) return "Abrimos 10–22 hs. (Cine hasta 1 am).";
    if (q.includes("oferta") || q.includes("promo"))
      return "Revisá la sección Promociones.";
    if (q.includes("cine")) return "Tenés HOYTS en la planta principal.";
    return "Puedo ayudarte con horarios, locales y categorías.";
  }

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = chatInput?.value.trim();
    if (!t) return;
    pushMsg(t, "user");
    if (chatInput) chatInput.value = "";
    setTimeout(() => pushMsg(botReply(t), "bot"), 250);
  });

  chatToggle?.addEventListener("click", () => {
    chat?.classList.toggle("chat--minimized");
  });
});
