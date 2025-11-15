function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const storeCards = document.querySelectorAll("#storesGrid .store-card");
  const selectSector = document.getElementById("selectSector");
  const searchInput = document.getElementById("searchLocal");

  function applyFilters() {
    const sector = selectSector?.value || "";
    const searchTerm = normalize(searchInput?.value || "");

    storeCards.forEach((card) => {
      const col = card.closest("[data-store-name]");
      if (!col) return;

      const storeName = normalize(col.dataset.storeName || "");
      const category = col.dataset.category || "";

      const matchesSector = !sector || category === sector;
      const matchesSearch = !searchTerm || storeName.includes(searchTerm);

      if (matchesSector && matchesSearch) {
        col.classList.remove("d-none");
      } else {
        col.classList.add("d-none");
      }
    });
  }

  if (selectSector) {
    selectSector.addEventListener("change", applyFilters);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  applyFilters();

  const scrollToTopLinks = document.querySelectorAll('a[href="#inicio"]');
  scrollToTopLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  const mapaButtons = document.querySelectorAll(".mapa-local-link");
  mapaButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.storeId;
      if (targetId) goToStore(targetId);
    });
  });

  const chat = document.getElementById("chat");
  const chatMsgs = document.getElementById("chatMsgs");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatToggle = document.querySelector(".chat__toggle");

  if (chat && chatMsgs && chatForm && chatInput && chatToggle) {
    function addMsg(text, from = "bot") {
      const div = document.createElement("div");
      div.className = `chat__msg chat__msg--${from}`;
      div.textContent = text;
      chatMsgs.appendChild(div);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    function botReply(userText) {
      const text = normalize(userText);
      if (!text) return;

      if (text.includes("horario") || text.includes("hora")) {
        addMsg("Abrimos todos los días de 10 a 22 hs 🕒");
      } else if (
        text.includes("estacionamiento") ||
        text.includes("parking")
      ) {
        addMsg("Contamos con estacionamiento cubierto en los 3 niveles 🚗");
      } else if (
        text.includes("cines") ||
        text.includes("hoyts") ||
        text.includes("cine")
      ) {
        addMsg("Los cines HOYTS están en el sector de entretenimiento 🎬");
      } else if (
        text.includes("comer") ||
        text.includes("gastronomia") ||
        text.includes("restaurante")
      ) {
        addMsg("Tenés La Trattoria, Sushi Go! y Green & Fresh en el patio de comidas 🍝🍣🥗");
      } else {
        addMsg("Perfecto, ahora mismo no tengo más info, pero podés consultar en el stand de informes del shopping 😊");
      }
    }
    document.querySelectorAll(".mapa-local-link").forEach(btn => {
      btn.addEventListener("click", () => {
        const storeId = btn.dataset.store;
        const targetCard = document.querySelector(`.store-link[data-store-id="${storeId}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          targetCard.closest(".store-card").classList.add("highlight-store");
          setTimeout(() => {
            targetCard.closest(".store-card").classList.remove("highlight-store");
          }, 1500);
        }
      });
    });
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      addMsg(text, "user");
      chatInput.value = "";
      botReply(text);
    });

    chatToggle.addEventListener("click", () => {
      chat.classList.toggle("chat--minimized");
    });
  }
});

function goToStore(storeId) {
  const cardLink = document.querySelector(
    `.store-link[data-store-id="${storeId}"]`
  );
  if (!cardLink) return;

  const col = cardLink.closest("[data-store-name]");
  if (!col) return;

  document.querySelectorAll(".highlight-store").forEach((el) => {
    el.classList.remove("highlight-store");
  });

  col.classList.add("highlight-store");

  col.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    col.classList.remove("highlight-store");
  }, 1500);
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const mapId = target.dataset.id;
  if (!mapId) return;

  event.preventDefault();
  goToStore(mapId);
});
