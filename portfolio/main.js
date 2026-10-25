(function () {
  if (location.search.includes("shot")) document.documentElement.classList.add("shot");
  const pad = (n) => String(n).padStart(2, "0");
  const webSrc = (f) => `assets/web/${f}.jpg`;
  const appSrc = (slug, n) => `assets/apps/${slug}-${n}.jpg`;
  const brandSrc = (slug, n) => `assets/brand/${slug}/${n}.jpg`;

  document.getElementById("cWeb").textContent = WEB.length;
  document.getElementById("cApps").textContent = APPS.length;
  document.getElementById("cBrands").textContent = BRANDS.length;

  // Long screenshots scroll inside their frame on hover; distance and speed depend on page length
  const fitScroll = (img) => {
    const set = () => {
      const screen = img.parentElement;
      const dist = img.offsetHeight - screen.clientHeight;
      img.style.setProperty("--dist", `-${Math.max(dist, 0)}px`);
      img.style.setProperty("--dur", `${Math.min(Math.max(dist / 420, 2), 14)}s`);
    };
    img.complete ? set() : img.addEventListener("load", set);
    addEventListener("resize", set);
  };

  // ---------- Websites ----------
  const webGrid = document.getElementById("webGrid");
  WEB.forEach((w, i) => {
    const card = document.createElement("article");
    card.className = "web-card reveal" + (i < 2 ? " feature" : "");
    card.innerHTML = `
      <button class="browser" data-web="${i}" aria-label="Open the full ${w.name} page">
        <span class="browser-bar"><i></i><i></i><i></i><span class="browser-url">${w.name}</span></span>
        <span class="browser-screen"><img class="scroll-img" src="${webSrc(w.file)}" alt="${w.name} website design" loading="lazy"></span>
      </button>
      <div class="web-meta">
        <span class="web-num">${pad(i + 1)}</span>
        <div>
          <span class="mono">${w.type}</span>
          <h3>${w.name}</h3>
          <p>${w.desc}</p>
        </div>
      </div>`;
    webGrid.appendChild(card);
  });

  // ---------- Apps ----------
  const appList = document.getElementById("appList");
  APPS.forEach((a, i) => {
    const el = document.createElement("article");
    el.className = "app-case" + (i % 2 ? " flip" : "");
    el.style.cssText = `--bg:${a.bg};--fg:${a.fg};--ac:${a.ac}`;
    const phone = (n, cls) => `
      <button class="phone ${cls}" data-app="${i}" data-idx="${n - 1}" aria-label="Open ${a.name} screen ${n}">
        <span class="phone-screen"><img class="${n === 2 ? "scroll-img" : ""}" src="${appSrc(a.slug, n)}" alt="${a.name} screen ${n}" loading="lazy"></span>
      </button>`;
    el.innerHTML = `
      <div class="app-info reveal">
        <span class="mono">${pad(i + 1)} · ${a.type}</span>
        <h3>${a.name} <span class="ar" lang="ar">${a.nameAr}</span></h3>
        <p>${a.desc}</p>
        <ul class="app-tags">${a.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="phones reveal">${phone(1, "side")}${phone(2, "main")}${phone(3, "side")}</div>`;
    appList.appendChild(el);
  });

  // ---------- Branding ----------
  const brandGrid = document.getElementById("brandGrid");
  BRANDS.forEach((b, i) => {
    const card = document.createElement("article");
    card.className = "brand-card reveal";
    card.innerHTML = `
      <button class="brand-img" data-brand="${i}" aria-label="Open ${b.name}">
        <img src="${brandSrc(b.slug, 1)}" alt="${b.name}" loading="lazy">
        ${b.n > 1 ? `<span class="brand-count mono">${b.n} pages</span>` : ""}
      </button>
      <div class="brand-meta">
        <span class="mono">${b.type}</span>
        <h3>${b.name}</h3>
        <p>${b.desc}</p>
      </div>`;
    brandGrid.appendChild(card);
  });

  document.querySelectorAll(".scroll-img").forEach(fitScroll);

  // ---------- Behance ----------
  const beGrid = document.getElementById("behanceGrid");
  BEHANCE_WORK.forEach((p, i) => {
    const a = document.createElement("a");
    a.className = "be-card reveal" + (i === 0 || i === 5 ? " wide" : "");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `
      <div class="be-img"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
      <div class="be-meta">
        <span class="num">${pad(i + 1)}</span>
        <div><h3>${p.title}</h3><span class="mono">${p.cat}</span></div>
        <i>↗</i>
      </div>`;
    beGrid.appendChild(a);
  });

  // ---------- Lightbox ----------
  const lb = document.getElementById("lightbox");
  const stage = lb.querySelector(".lb-stage");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector(".lb-cap");
  let set = [], pos = 0;
  const show = () => {
    const item = set[pos];
    lb.classList.toggle("tall", !!item.tall);
    lbImg.src = item.src;
    stage.scrollTop = 0;
    lbCap.textContent = `${item.cap} — ${pos + 1} / ${set.length}`;
  };
  const open = (items, start) => {
    set = items; pos = start; show();
    lb.hidden = false; document.body.style.overflow = "hidden";
  };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  const step = (d) => { pos = (pos + d + set.length) % set.length; show(); };

  document.addEventListener("click", (e) => {
    const w = e.target.closest("[data-web]");
    if (w) return open(WEB.map((x) => ({ src: webSrc(x.file), cap: x.name, tall: true })), +w.dataset.web);
    const ap = e.target.closest("[data-app]");
    if (ap) {
      const a = APPS[+ap.dataset.app];
      return open([1, 2, 3].map((n) => ({ src: appSrc(a.slug, n), cap: a.name, tall: n === 2 })), +ap.dataset.idx);
    }
    const br = e.target.closest("[data-brand]");
    if (br) {
      const b = BRANDS[+br.dataset.brand];
      return open(Array.from({ length: b.n }, (_, k) => ({ src: brandSrc(b.slug, k + 1), cap: b.name })), 0);
    }
  });
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".lb-prev")) return step(-1);
    if (e.target.closest(".lb-next")) return step(1);
    if (e.target === lb || e.target === stage || e.target.closest(".lb-close")) close();
  });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  // ---------- Reveal ----------
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Gentle parallax on the hero portrait
  const portrait = document.querySelector(".hero-portrait");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addEventListener("scroll", () => {
      const y = Math.min(scrollY, 900);
      portrait.style.transform = `translate(-50%, ${y * 0.12}px)`;
    }, { passive: true });
  }
})();
