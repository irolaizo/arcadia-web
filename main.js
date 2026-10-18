// ===== Pasaporte: el tutorial de la primera semana =====
(() => {
  const stamps = document.querySelectorAll(".stamp");
  const fill = document.getElementById("tutfill");
  const bar = fill.parentElement;
  const num = document.getElementById("tutnum");
  const rank = document.getElementById("rankname");
  const hint = document.getElementById("hint");
  const unlock = document.getElementById("unlock");

  stamps.forEach((s) => {
    s.addEventListener("click", () => {
      if (s.getAttribute("aria-pressed") === "true") return;
      s.setAttribute("aria-pressed", "true");
      const done = [...stamps].filter((x) => x.getAttribute("aria-pressed") === "true").length;
      fill.style.width = (done / 3) * 100 + "%";
      bar.setAttribute("aria-valuenow", done);
      num.textContent = done;
      if (done === 3) {
        rank.textContent = "Explorador";
        hint.textContent = "Tutorial completado. Has subido a Nivel 2.";
        unlock.hidden = false;
        unlock.innerHTML = '<strong>Planta superior desbloqueada.</strong> Ya puedes usar la Arena. <a href="#centro">Mira cómo es el centro</a>';
        setView("2");
      } else {
        hint.textContent = done === 2 ? "Te falta una misión." : "Te faltan dos misiones.";
      }
    });
  });
})();

// ===== El centro: mapa interactivo =====
const ZONES = {
  welcome: { floor: "Planta baja", title: "Bienvenida", lvl: 1,
    text: "Sin tornos ni vigilantes intimidantes. Te recibe alguien de la comunidad, te descargas el Pasaporte y firmas el pacto de honor. Empiezas en Nivel 1." },
  agora: { floor: "Planta baja", title: "El Ágora", lvl: 1,
    text: "El corazón social de ARCADIA. Sofás, consolas casuales y juegos de mesa para pasar la tarde, conocer gente y sentirte en un sitio seguro sin tener que consumir nada." },
  move: { floor: "Planta baja", title: "Zona activa", lvl: 1,
    text: "Cintas, bicis y estiramientos de muñeca y espalda. Antes de jugar, un circuito de 15 minutos. Escaneas el QR al terminar y sumas experiencia." },
  cafe: { floor: "Planta baja", title: "Cafetería", lvl: 1,
    text: "Productos saludables. Los snacks y bebidas se pueden canjear con la experiencia que ganas en el centro." },
  arena: { floor: "Planta superior", title: "La Arena", lvl: 2,
    text: "Entre 40 y 80 ordenadores de alto rendimiento para jugar y competir como en un setup profesional. Se desbloquea al completar el tutorial." },
  stream: { floor: "Planta superior", title: "Salas de streaming", lvl: 2,
    text: "Salas insonorizadas con croma verde para hacer streaming, grabar y editar contenido. Se reservan por bloques de 2 horas con experiencia." },
  lab: { floor: "Planta superior", title: "Academia", lvl: 2,
    text: "Donde se aprende entre iguales: programación, modelado 3D, diseño o edición de vídeo. Quien sabe, enseña, y gana experiencia por ello." },
};

const floors = document.getElementById("floors");
const chips = document.querySelectorAll(".viewas .chip");
const zoneBtns = document.querySelectorAll(".zone");
let currentZone = "agora";

function showZone(id) {
  currentZone = id;
  const z = ZONES[id];
  const view = Number(floors.dataset.view);
  document.getElementById("zi-floor").textContent = z.floor;
  document.getElementById("zi-title").textContent = z.title;
  document.getElementById("zi-text").textContent = z.text;
  const acc = document.getElementById("zi-access");
  const open = view >= z.lvl;
  acc.textContent = z.lvl === 1 ? "Abierta desde el Nivel 1" : open ? "Abierta para ti: ya eres Nivel 2" : "Bloqueada: completa el tutorial para entrar";
  acc.classList.toggle("locked", !open);
  zoneBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.zone === id)));
}

function setView(v) {
  floors.dataset.view = v;
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.view === v)));
  document.querySelectorAll(".floor-up .zone").forEach((b) => (b.tabIndex = v === "1" ? -1 : 0));
  showZone(currentZone);
}

chips.forEach((c) => c.addEventListener("click", () => setView(c.dataset.view)));
zoneBtns.forEach((b) => b.addEventListener("click", () => {
  showZone(b.dataset.zone);
  if (window.matchMedia("(max-width: 900px)").matches) {
    document.getElementById("zoneinfo").scrollIntoView({ behavior: "smooth", block: "center" });
  }
}));
document.querySelector(".floor-up .lock").addEventListener("click", () => showZone("arena"));
setView("1");

// ===== Simulador de XP =====
(() => {
  const RANKS = [
    { name: "Explorador", min: 0 },
    { name: "Veterano", min: 500 },
    { name: "Mentor", min: 3000 },
  ];
  let total = 0, wallet = 0, banned = false;

  const el = (id) => document.getElementById(id);
  const board = document.querySelector(".sim-board");
  const rankItems = [...document.querySelectorAll("#ranks li")];
  const fill = el("nextfill");
  const cheat = el("cheat");
  const log = el("log");
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  function render(msg, bad) {
    el("s-total").textContent = fmt(total);
    el("s-wallet").textContent = fmt(wallet);

    const current = banned ? -1 : RANKS.filter((r) => total >= r.min).length - 1;
    rankItems.forEach((li, i) => {
      li.classList.toggle("on", i === current + 1);
      li.classList.toggle("reached", i <= current + 1);
    });

    const next = banned ? null : RANKS[current + 1];
    if (banned) {
      fill.style.width = "0%";
      el("nexttext").textContent = "Has vuelto a Iniciado. Tendrás que repetir el tutorial.";
    } else if (next) {
      const prev = RANKS[current].min;
      const pct = Math.min(100, ((total - prev) / (next.min - prev)) * 100);
      fill.style.width = pct + "%";
      fill.parentElement.setAttribute("aria-valuenow", Math.round(pct));
      el("nexttext").textContent = `Te faltan ${fmt(next.min - total)} XP para ${next.name}.`;
    } else {
      fill.style.width = "100%";
      el("nexttext").textContent = "Eres Mentor. Tienes voz en la asamblea y las empresas aliadas te conocen.";
    }

    document.querySelectorAll(".act").forEach((b) => {
      b.disabled = banned || (b.dataset.cost ? wallet < Number(b.dataset.cost) : false);
    });
    cheat.textContent = banned ? "Repetir el tutorial y volver a empezar" : "Fingir una clase con un amigo para farmear XP";

    if (msg) {
      log.textContent = msg;
      log.classList.toggle("bad", !!bad);
    }
  }

  document.querySelectorAll(".act").forEach((b) =>
    b.addEventListener("click", () => {
      const before = RANKS.filter((r) => total >= r.min).length;
      if (b.dataset.xp) {
        total += Number(b.dataset.xp);
        wallet += Number(b.dataset.xp);
      } else {
        wallet -= Number(b.dataset.cost);
      }
      const after = RANKS.filter((r) => total >= r.min).length;
      const up = after > before ? ` ¡Subes a ${RANKS[after - 1].name}!` : "";
      render(b.dataset.msg + up);
    })
  );

  cheat.addEventListener("click", () => {
    if (banned) {
      banned = false;
      render("Tutorial repetido. Vuelves a ser Explorador, con el contador a cero.");
      return;
    }
    banned = true;
    total = 0;
    wallet = 0;
    board.classList.remove("shake");
    void board.offsetWidth;
    board.classList.add("shake");
    render("Pacto de honor roto. Simular clases entre amigos para sumar XP te devuelve automáticamente al Nivel 1.", true);
  });

  render();
})();

// ===== Pestañas accesibles =====
function tabs(list, onSelect) {
  const items = [...list.querySelectorAll('[role="tab"]')];
  const select = (t) => {
    items.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
    });
    onSelect(t);
  };
  items.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = items[(i + d + items.length) % items.length];
      n.focus();
      select(n);
    });
  });
}

tabs(document.querySelector(".tabs"), (t) => {
  document.querySelectorAll(".persona").forEach((p) => (p.hidden = p.id !== t.getAttribute("aria-controls")));
});

const ALLIES = {
  ayto: ["Un espacio municipal o industrial sin uso.", "Un centro juvenil de vanguardia que saca a los jóvenes de casa y de la calle, y les da formación."],
  fund: ["Financiación para el día a día del centro.", "Impacto medible en salud, educación e igualdad de oportunidades para la juventud de Bizkaia."],
  marca: ["Equipos: ordenadores, periféricos, consolas.", "Visibilidad directa ante la Generación Z, con espacios con su nombre, como «La Arena» de la marca."],
  empresa: ["Una cuota anual como partner de ARCADIA.", "Acceso prioritario a jóvenes que programan, diseñan y crean contenido, formados en el centro."],
};
const deal = document.querySelector(".deal");
tabs(document.querySelector(".allies"), (t) => {
  const [give, get] = ALLIES[t.dataset.ally];
  document.getElementById("deal-give").textContent = give;
  document.getElementById("deal-get").textContent = get;
  deal.classList.remove("flash");
  void deal.offsetWidth;
  deal.classList.add("flash");
});
