// ===== Configuración =====
// Pega aquí la dirección de tu formulario de Formspree (https://formspree.io),
// por ejemplo "https://formspree.io/f/abcdwxyz". Mientras esté vacío,
// el formulario avisa de que las inscripciones abren pronto.
const FORM_ENDPOINT = "";

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
        unlock.innerHTML = '<strong>Consolas desbloqueadas.</strong> Así funciona cada tarde de ARCADIA. <a href="#apuntate">Apúntate al próximo pop-up</a>';
      } else {
        hint.textContent = left === 1 ? "Te falta un sello." : `Te faltan ${left} sellos.`;
      }
    });
  });
})();

// ===== Formulario =====
(() => {
  const form = document.getElementById("form");
  const msg = document.getElementById("form-msg");
  const edad = document.getElementById("edad");
  const tutorField = document.getElementById("tutor-field");
  const tutor = document.getElementById("tutor");

  const setTipo = (tipo) => {
    form.querySelectorAll("[data-only]").forEach((el) => {
      const on = el.dataset.only === tipo;
      el.hidden = !on;
      el.querySelectorAll("input").forEach((i) => { if (i.id === "edad") i.required = on; });
    });
    updateTutor();
  };

  const updateTutor = () => {
    const tipo = form.tipo.value;
    const n = Number(edad.value);
    const minor = tipo === "joven" && (n === 16 || n === 17);
    tutorField.hidden = !minor;
    tutor.required = minor;
  };

  form.querySelectorAll('input[name="tipo"]').forEach((r) => r.addEventListener("change", () => setTipo(form.tipo.value)));
  edad.addEventListener("input", updateTutor);

  document.querySelectorAll("[data-tipo]").forEach((a) =>
    a.addEventListener("click", () => {
      const r = form.querySelector(`input[name="tipo"][value="${a.dataset.tipo}"]`);
      if (r) { r.checked = true; setTipo(a.dataset.tipo); }
    })
  );

  const fail = (el, text) => {
    el.setAttribute("aria-invalid", "true");
    el.focus();
    msg.className = "form-msg err";
    msg.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    const tipo = form.tipo.value;

    if (!form.nombre.value.trim()) return fail(form.nombre, "Escribe tu nombre.");
    if (tipo === "joven") {
      const n = Number(edad.value);
      if (!n || n < 16 || n > 30) return fail(edad, "ARCADIA es para jóvenes de 16 a 30 años.");
      if ((n === 16 || n === 17) && !tutor.value.trim()) return fail(tutor, "Añade el contacto de tu madre, padre o tutor.");
    }
    if (!form.email.checkValidity() || !form.email.value) return fail(form.email, "Revisa tu email: parece incompleto.");
    if (!form.privacidad.checked) return fail(form.privacidad, "Marca la casilla de privacidad para apuntarte.");

    if (!FORM_ENDPOINT) {
      msg.className = "form-msg ok";
      msg.textContent = "Las inscripciones abren muy pronto. Síguenos y te avisamos.";
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.className = "form-msg";
    msg.textContent = "Enviando…";
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setTipo("joven");
      msg.className = "form-msg ok";
      msg.textContent = tipo === "joven"
        ? "¡Apuntado! Te escribiremos en cuanto tengamos lugar y fecha."
        : "¡Recibido! Te escribiremos en unos días para hablar.";
    } catch {
      msg.className = "form-msg err";
      msg.textContent = "No se ha podido enviar. Comprueba tu conexión y vuelve a intentarlo.";
    } finally {
      btn.disabled = false;
    }
  });
})();
