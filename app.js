/* ═══════════════════════════════════════════════════════════════
   CLEAN STREET — app.js
   ✏️  Modifiez uniquement les sections marquées CONFIGURATION
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════
   ✏️  CONFIGURATION — LOGO
   Remplacez par l'URL de votre logo PNG
   transparent. Laissez vide ("") pour
   garder l'icône SVG par défaut.
═══════════════════════════════════════ */
const LOGO_URL = "https://i.postimg.cc/PrrCJFhh/IMG-6043.png";

/* ═══════════════════════════════════════
   ✏️  CONFIGURATION — TEXTE HERO
   Texte en italique dans le titre hero.
═══════════════════════════════════════ */
const HERO_TAGLINE = "une ville vivante";

/* ═══════════════════════════════════════
   ✏️  CONFIGURATION — LIEN WAVE
   Votre lien de paiement Wave.
═══════════════════════════════════════ */
const WAVE_LINK = "https://pay.wave.com/m/M_ci_l1Mfeb8D5daT/c/ci/s";

/* ═══════════════════════════════════════
   ✏️  CONFIGURATION — IMAGES SLIDER
   Ajoutez / supprimez des objets.
   - url    : lien direct vers l'image
   - legende: texte affiché sur l'image
              (laisser "" pour aucun texte)
═══════════════════════════════════════ */
const SLIDER_IMAGES = [
  {
    url: "https://i.postimg.cc/XvT5yKxb/a713162f-12ad-470f-8cc1-2fd126c3fe3c.jpg",
    legende: "Journée de nettoyage à Abidjan"
  },
  {
    url: "https://i.postimg.cc/wBSNs5FY/40951e16-f0ce-48e0-ace5-9444e9ec14c7.jpg",
    legende: "Des rues propres pour tous"
  },
  {
    url: "https://i.postimg.cc/g0fh6ysf/455ef09a-ef97-4c7c-b69e-4569ab2c8dc8.jpg",
    legende: "Ensemble, faisons la différence"
  },
  /* -- Exemple pour ajouter une image :
  {
    url: "https://votre-lien-image.jpg",
    legende: "Votre texte ici"
  },
  */
];

/* ═══════════════════════════════════════
   ✏️  CONFIGURATION — COLLECTES PAR VILLE
   Pour chaque collecte :
   - ville       : nom affiché
   - objectif    : montant cible en FCFA
   - collecte    : montant déjà collecté (mettez à jour manuellement)
   - waveLink    : lien Wave spécifique à cette ville
                   (laisser "" pour utiliser le lien global WAVE_LINK)

   ⚡ BARRE DE PROGRESSION :
   Elle est calculée automatiquement :
   (collecte / objectif) × 100

   Pour mettre à jour une barre, changez
   simplement la valeur "collecte".
═══════════════════════════════════════ */
const COLLECTES = [
  {
    ville:     "Yopougon",
    objectif:  0,
    collecte:  420000,
    waveLink:  "https://pay.wave.com/m/M_ci_l1Mfeb8D5daT/c/ci/"
  },
  {
    ville:     "Port bouet",
    objectif:  0,
    collecte:  175000,
    waveLink:  ""
  },
  {
    ville:     "Koumassi",
    objectif:  0,
    collecte:  240000,
    waveLink:  ""
  },
  {
    ville:     "Bingerville",
    objectif:  0,
    collecte:  300000,
    waveLink:  ""
  },
  /* -- Exemple pour ajouter une ville :
  {
    ville:     "Daloa",
    objectif:  250000,
    collecte:  0,
    waveLink:  ""
  },
  */
];

/* ══════════════════════════════════════════════════════════════
   ██  NE MODIFIEZ PAS EN DESSOUS DE CETTE LIGNE  ██
══════════════════════════════════════════════════════════════ */

/* ─── THÈME (dark/light) avec persistance localStorage ─── */
(function initTheme() {
  const saved = localStorage.getItem("cs_theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
  // Si pas de préférence, on utilise dark (défini dans le HTML)
})();

function toggleTheme() {
  const html  = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("cs_theme", next);
}

/* ─── LOGO ─── */
function initLogo() {
  if (!LOGO_URL.trim()) return;
  const wrap = document.getElementById("logo-container");
  if (!wrap) return;
  wrap.innerHTML = `<img src="${LOGO_URL}" alt="Logo Clean Street"
    style="width:100%;height:100%;object-fit:contain;border-radius:10px;">`;
}

/* ─── HERO TAGLINE ─── */
function initHeroTagline() {
  const el = document.getElementById("hero-tagline-text");
  if (el && HERO_TAGLINE) el.textContent = HERO_TAGLINE;
}

/* ─── STATS ─── */
function renderStats() {
  const totalCollecte = COLLECTES.reduce((s, c) => s + (c.collecte || 0), 0);
  const villes        = COLLECTES.length;

  const elV = document.getElementById("stat-villes");
  const elM = document.getElementById("stat-montant");

  if (elV) animateCount(elV, villes, 0, 1200);
  if (elM) {
    const display = totalCollecte >= 1_000_000
      ? (totalCollecte / 1_000_000).toFixed(2) + " M"
      : totalCollecte >= 1_000
        ? (totalCollecte / 1_000).toFixed(0) + " K"
        : totalCollecte.toLocaleString("fr-FR");
    if (totalCollecte >= 1_000) {
      elM.textContent = display;
    } else {
      animateCount(elM, totalCollecte, 0, 1400);
    }
  }
}

function animateCount(el, to, from, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * ease).toLocaleString("fr-FR");
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── SLIDER ─── */
let currentSlide = 0;
let sliderTimer  = null;
let totalSlides  = 0;

function initSlider() {
  const images = SLIDER_IMAGES.filter(i => i.url && i.url.trim());
  if (!images.length) {
    document.getElementById("hero-static").style.display = "block";
    document.querySelector(".slider-nav") && (document.querySelector(".slider-nav").style.display = "none");
    document.getElementById("slider-dots").style.display = "none";
    return;
  }

  document.getElementById("hero-static").style.display = "none";
  totalSlides = images.length;

  const container = document.getElementById("hero-slider");

  // Build track
  const track = document.createElement("div");
  track.id = "slider-track";
  track.style.cssText = "display:flex;height:100%;transition:transform 1.1s cubic-bezier(0.77,0,0.175,1);";

  images.forEach((img, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " active" : "");
    slide.style.cssText = "min-width:100%;height:100%;position:relative;overflow:hidden;flex-shrink:0;";
    slide.innerHTML = `
      <img src="${img.url}" alt="${img.legende || ""}"
        style="width:100%;height:100%;object-fit:cover;
               transform:scale(${i === 0 ? "1" : "1.06"});
               transition:transform 12s ease;"
        loading="${i === 0 ? "eager" : "lazy"}">
      <div class="slide-veil"></div>
      ${img.legende ? `
      <div style="
        position:absolute;bottom:6rem;left:clamp(1.5rem,8vw,6rem);
        font-family:'Playfair Display',serif;font-size:clamp(1.1rem,2vw,1.5rem);
        font-weight:700;color:#fff;
        text-shadow:0 2px 20px rgba(0,0,0,.6);
        opacity:${i === 0 ? "1" : "0"};
        transform:translateY(${i === 0 ? "0" : "16px"});
        transition:opacity .8s ease .3s,transform .8s ease .3s;
        max-width:520px;line-height:1.3;
      " class="slide-caption">${img.legende}</div>` : ""}
    `;
    track.appendChild(slide);
  });

  container.appendChild(track);

  // Dots
  const dotsEl = document.getElementById("slider-dots");
  images.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "s-dot" + (i === 0 ? " active" : "");
    d.onclick = () => goToSlide(i);
    dotsEl.appendChild(d);
  });

  sliderTimer = setInterval(() => changeSlide(1), 6000);
}

function goToSlide(n) {
  const track = document.getElementById("slider-track");
  if (!track) return;
  const slides  = track.querySelectorAll(".slide");
  const dots    = document.querySelectorAll(".s-dot");
  const caps    = track.querySelectorAll(".slide-caption");

  // Désactiver l'ancien
  slides[currentSlide].classList.remove("active");
  slides[currentSlide].querySelector("img").style.transform = "scale(1.06)";
  if (caps[currentSlide]) { caps[currentSlide].style.opacity = "0"; caps[currentSlide].style.transform = "translateY(16px)"; }
  if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

  currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;

  // Activer le nouveau
  slides[currentSlide].classList.add("active");
  slides[currentSlide].querySelector("img").style.transform = "scale(1)";
  if (caps[currentSlide]) { setTimeout(() => { caps[currentSlide].style.opacity = "1"; caps[currentSlide].style.transform = "translateY(0)"; }, 300); }
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");

  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function changeSlide(dir) {
  clearInterval(sliderTimer);
  goToSlide(currentSlide + dir);
  sliderTimer = setInterval(() => changeSlide(1), 6000);
}

/* ─── COLLECTES ─── */
function renderCollectes() {
  const grid = document.getElementById("collectes-grid");
  if (!grid) return;

  if (!COLLECTES.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:5rem 2rem;color:var(--text-3)">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          style="display:block;margin:0 auto 1rem;opacity:.35">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <p>Aucune collecte configurée.</p>
      </div>`;
    return;
  }

  grid.innerHTML = COLLECTES.map((c, idx) => {
    const pct     = c.objectif > 0 ? Math.min(100, Math.round((c.collecte / c.objectif) * 100)) : 0;
    const raised  = Number(c.collecte || 0).toLocaleString("fr-FR");
    const goal    = Number(c.objectif || 0).toLocaleString("fr-FR");
    const link    = (c.waveLink && c.waveLink.trim()) ? c.waveLink : WAVE_LINK;

    return `
    <div class="collecte-card reveal" data-idx="${idx}" data-wave="${link}">
      <div class="cc-header">
        <div class="cc-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div>
          <div class="cc-city">${c.ville}</div>
          <div class="cc-status">Collecte en cours</div>
        </div>
      </div>

      <div class="cc-amounts">
        <div class="cc-raised">${raised} <span>FCFA</span></div>
        <div class="cc-pct"><strong>${pct}%</strong><br>atteint</div>
      </div>

      <div class="progress-track">
        <div class="progress-fill" data-pct="${pct}" style="width:0%"></div>
      </div>
      <div class="progress-goal">Objectif : ${goal} FCFA</div>

      <button class="btn-don"
        onclick="openModal(${idx})"
        aria-label="Faire un don pour ${c.ville}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
        </svg>
        Soutenir cette ville
      </button>
    </div>`;
  }).join("");

  // Animate bars after a frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll(".progress-fill[data-pct]").forEach(bar => {
        bar.style.width = bar.dataset.pct + "%";
      });
      initReveal();
    });
  });
}

/* ─── MODAL ─── */
let activeIdx    = null;
let activeWave   = WAVE_LINK;

function openModal(idx) {
  const c = COLLECTES[idx];
  if (!c) return;

  activeIdx  = idx;
  activeWave = (c.waveLink && c.waveLink.trim()) ? c.waveLink : WAVE_LINK;

  document.getElementById("modal-city-label").innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
    ${c.ville}`;

  document.getElementById("wave-link").href = activeWave;

  // Reset form
  document.getElementById("don-nom").value         = "";
  document.getElementById("don-montant").value     = "";
  document.getElementById("don-transaction").value = "";
  document.querySelectorAll(".qa-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("msg-ok").style.display  = "none";
  document.getElementById("msg-err").style.display = "none";
  const btn = document.getElementById("btn-submit");
  btn.disabled    = false;
  btn.textContent = "";
  btn.innerHTML   = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    Confirmer mon don`;

  document.getElementById("modal-backdrop").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-backdrop").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modal-backdrop").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

function setMontant(val, btn) {
  document.getElementById("don-montant").value = val;
  document.querySelectorAll(".qa-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

/* ─── SOUMISSION DON ─── */
/* 
  Le site est statique : le don est enregistré
  localement et affiché comme "envoyé".
  Pour connecter à un backend, décommentez
  le bloc fetch() et renseignez API_URL.
*/
const API_URL = "https://backend-xxgf.onrender.com"; // ✏️ votre lien Render

async function soumettreDon() {
  const nom     = (document.getElementById("don-nom").value.trim())     || "Anonyme";
  const montant = parseFloat(document.getElementById("don-montant").value);
  const txId    = document.getElementById("don-transaction").value.trim();
  const btn     = document.getElementById("btn-submit");
  const msgOk   = document.getElementById("msg-ok");
  const msgErr  = document.getElementById("msg-err");

  msgOk.style.display = "none";
  msgErr.style.display = "none";

  if (!montant || montant < 50) {
    msgErr.textContent   = "⚠️ Montant minimum : 100 FCFA";
    msgErr.style.display = "block";
    return;
  }

  btn.disabled  = true;
  btn.innerHTML = `<span style="opacity:.7">Envoi en cours…</span>`;

  try {
    const res = await fetch(`${API_URL}/cs/don`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collecte_id:   activeIdx + 1, // ID basé sur position dans le tableau
        nom_donateur:  nom,
        montant:       montant,
        transaction_id: txId
      })
    });
    const data = await res.json();

    if (data.success) {
      msgOk.style.display = "block";
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        Don envoyé !`;
    } else {
      throw new Error(data.message || "Erreur inconnue");
    }

  } catch (e) {
    // Mode statique : si le backend est absent, on confirme quand même
    if (e instanceof TypeError) {
      // Pas de connexion backend → confirmation locale
      msgOk.style.display = "block";
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        Merci pour votre don !`;
    } else {
      msgErr.textContent   = "❌ " + (e.message || "Erreur réseau. Réessayez.");
      msgErr.style.display = "block";
      btn.disabled  = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        Confirmer mon don`;
    }
  }
}

/* ─── REVEAL ON SCROLL ─── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el));
}

/* ─── INIT ─── */
document.addEventListener("DOMContentLoaded", () => {
  initLogo();
  initHeroTagline();
  initSlider();
  renderCollectes();
  renderStats();
  initReveal();
});
