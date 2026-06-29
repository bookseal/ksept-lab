// Injects ONE sticky sidebar with a toggle between two views:
//   • "이 페이지" — this page's sections (auto-built from <section><h2>), with
//                   scroll-spy so the section you're reading is highlighted
//   • "모듈"      — the global module list (same on every page)
// Loaded with <script src="./nav.js" defer></script> in each page's <head>.
(function () {
  // ── single source of truth for the module list ──
  // Add a module here once and it appears in every page's "모듈" view.
  const CHAPTERS = [
    { href: "index.html",       label: "개념 지도",         num: "·"   },
    { href: "setup.html",       label: "Setup",             num: "1"   },
    { href: "foundations.html", label: "Foundations",       num: "2-1" },
    { href: "chat-app.html",    label: "chat-app",          num: "2-2" },
    { href: "tools.html",       label: "Tools & Structure", num: "3"   },
    { href: "context.html",     label: "Context / RAG",     num: "4"   },
    { href: "agents.html",      label: "Agents",            num: "5"   },
    { href: "production.html",  label: "Production",         num: "6"   },
    { href: "workshop.html",    label: "Workshop",          num: "7"   },
  ];

  const here = location.pathname.split("/").pop() || "index.html";
  const wrap = document.querySelector(".wrap");
  if (!wrap) return;

  // ── "모듈" panel ───────────────────────────────────────────────
  const chaptersNav = document.createElement("nav");
  chaptersNav.className = "rail-panel";
  for (const c of CHAPTERS) {
    const a = document.createElement("a");
    a.href = "./" + c.href;
    a.innerHTML = `<span class="rail-num">${c.num}</span>${c.label}`;
    if (c.href === here) a.className = "current";
    chaptersNav.appendChild(a);
  }

  // ── "이 페이지" panel (built from this page's sections) ─────────
  const bookmarksNav = document.createElement("nav");
  bookmarksNav.className = "rail-panel";

  const slug = (t) =>
    t.toLowerCase().trim().replace(/[^0-9a-z가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "").slice(0, 40) || "sec";

  const used = {};
  const targets = []; // { section, link } pairs for the scroll-spy
  for (const sec of wrap.querySelectorAll("section")) {
    const h = sec.querySelector("h2");
    if (!h) continue;
    // label = the <h2> text WITHOUT the trailing "슬라이드 N" link
    const label = Array.from(h.childNodes)
      .filter((n) => !(n.nodeType === 1 && n.classList.contains("slide")))
      .map((n) => n.textContent)
      .join("")
      .trim();
    if (!sec.id) {
      let s = slug(label);
      while (used[s]) s += "-x";
      used[s] = true;
      sec.id = s;
    }
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = label;
    bookmarksNav.appendChild(a);
    targets.push({ section: sec, link: a });
  }

  // ── assemble the rail with a toggle header ─────────────────────
  const rail = document.createElement("aside");
  rail.className = "rail";
  const toggle = document.createElement("div");
  toggle.className = "rail-toggle";
  const btnHere = document.createElement("button");
  btnHere.textContent = "이 페이지";
  const btnMods = document.createElement("button");
  btnMods.textContent = "모듈";
  toggle.append(btnHere, btnMods);
  rail.append(toggle, bookmarksNav, chaptersNav);

  function show(view) {
    const onHere = view === "bookmarks";
    bookmarksNav.hidden = !onHere;
    chaptersNav.hidden = onHere;
    btnHere.classList.toggle("on", onHere);
    btnMods.classList.toggle("on", !onHere);
    try { localStorage.setItem("railView", view); } catch (e) {}
  }
  btnHere.addEventListener("click", () => show("bookmarks"));
  btnMods.addEventListener("click", () => show("chapters"));

  // default: remembered choice, else "이 페이지"; fall back to "모듈" if the
  // page has no sections to bookmark
  let initial = "bookmarks";
  try { initial = localStorage.getItem("railView") || "bookmarks"; } catch (e) {}
  if (!targets.length) initial = "chapters";
  show(initial);

  // restructure: body > .layout > (rail, .wrap)
  const layout = document.createElement("div");
  layout.className = "layout";
  wrap.parentNode.insertBefore(layout, wrap);
  layout.append(rail, wrap);

  // ── scroll-spy: highlight the section currently being read ─────
  if (targets.length && "IntersectionObserver" in window) {
    const linkById = new Map(targets.map((t) => [t.section.id, t.link]));
    const visible = new Set();
    let activeId = null;

    const setActive = (id) => {
      if (id === activeId) return;
      if (activeId && linkById.has(activeId)) linkById.get(activeId).classList.remove("active");
      activeId = id;
      if (id && linkById.has(id)) linkById.get(id).classList.add("active");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // among sections near the top of the viewport, pick the topmost one
        let best = null, bestTop = Infinity;
        for (const id of visible) {
          const top = document.getElementById(id).getBoundingClientRect().top;
          if (top < bestTop) { bestTop = top; best = id; }
        }
        if (best) setActive(best);
      },
      // only count a section once its top has scrolled into the upper 35%
      { rootMargin: "0px 0px -65% 0px", threshold: 0 }
    );
    for (const t of targets) io.observe(t.section);
  }
})();
