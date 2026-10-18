// ===== Pasaporte del inicio =====
(() => {
  const stamps = document.querySelectorAll(".stamp");
  const fill = document.getElementById("xpfill");
  const bar = fill.parentElement;
  const xpEl = document.getElementById("xp");
  const lvl = document.getElementById("lvl");
  const hint = document.getElementById("hint");
  const unlock = document.getElementById("unlock");
  let xp = 0;

  stamps.forEach((s) => {
    s.addEventListener("click", () => {
      if (s.getAttribute("aria-pressed") === "true") return;
      s.setAttribute("aria-pressed", "true");
      xp = Math.min(100, xp + Number(s.dataset.xp));
      fill.style.width = xp + "%";
      bar.setAttribute("aria-valuenow", xp);
      xpEl.textContent = xp;
      const left = [...stamps].filter((x) => x.getAttribute("aria-pressed") !== "true").length;
      if (left === 0) {
        lvl.textContent = "2";
        hint.textContent = "¡Has subido a Nivel 2!";
        unlock.hidden = false;
        unlock.innerHTML = '<strong>Consolas desbloqueadas.</strong> Así funciona ARCADIA. <a href="#como-funciona">Mira cómo funciona</a>';
      } else {
        hint.textContent = left === 1 ? "Te falta un sello." : `Te faltan ${left} sellos.`;
      }
    });
  });
})();
