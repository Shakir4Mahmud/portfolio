document.addEventListener("DOMContentLoaded", () => {
  /* ============ CONFIG — ekhane tomar real link boshao ============ */
  const CONFIG = {
    social: { github: "https://github.com/Shakir4Mahmud", linkedin: "https://www.linkedin.com/in/shakir-mahmud/", facebook: "https://www.facebook.com/Shakir.x.01", instagram: "https://www.instagram.com/exotic.shakir/", x: "" },
    projects: {
      devstack: { live: "https://devstack-by-shakir.netlify.app/", github: "https://github.com/Shakir4Mahmud/Dev-stack-project" },
      fitlog: { live: "https://fitlog-by-shakir.netlify.app/", github: "https://github.com/Shakir4Mahmud/FitLog-project" },
      inboxpilot: { live: "", github: "" },
      bajardor: {
        live: "https://bajar-dor-mauve.vercel.app",
        github: "https://github.com/Shakir4Mahmud/Bajar-Dor",
      },
    },
  };
  /* ================================================================ */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  // Toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let tt;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // Link helper: link thakle khule, na thakle toast
  const wire = (a, url) => {
    if (!a) return;
    if (url) {
      a.hidden = false;
      a.href = url;
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    } else {
      a.hidden = true;
      a.removeAttribute("href");
    }
  };

  $("#currentYear") &&
    ($("#currentYear").textContent = new Date().getFullYear());

  // Mobile nav
  const menuToggle = $("#menuToggle"),
    navLinks = $("#navLinks");
  const closeMenu = () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };
  menuToggle.addEventListener("click", () => {
    const o = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", o);
    menuToggle.setAttribute("aria-expanded", String(o));
    menuToggle.setAttribute(
      "aria-label",
      o ? "Close navigation menu" : "Open navigation menu",
    );
  });
  $$("a", navLinks).forEach((l) => l.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target))
      closeMenu();
  });
  addEventListener("resize", () => innerWidth > 760 && closeMenu());
  addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  // Scroll: progress, header, hero parallax (rAF)
  const bar = $("#scrollProgress"),
    header = $(".site-header"),
    heroVisual = $(".hero-visual");
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width =
      (max > 0 ? Math.min((scrollY / max) * 100, 100) : 0) + "%";
    header.classList.toggle("scrolled", scrollY > 20);
    if (heroVisual && scrollY < innerHeight)
      heroVisual.style.translate = `0 ${scrollY * 0.08}px`;
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  // ---- 4th project card (BazarDor) ----
  const grid = $(".project-grid");
  if (grid && !$('[data-project="bajardor"]')) {
    const c = document.createElement("article");
    c.className = "project-card";
    c.dataset.project = "bajardor";
    c.innerHTML = `<div class="project-art project-art-bajar" role="img" aria-label="Abstract price tracker illustration">
      <span class="project-art-label">PROJECT / 004</span>
      <div class="price-window" aria-hidden="true"><span>BAZARDOR / TODAY</span>
        <div class="price-row"><i style="--w:.85"></i><b class="up">▲</b></div>
        <div class="price-row"><i style="--w:.55"></i><b class="down">▼</b></div>
        <div class="price-row"><i style="--w:.7"></i><b>—</b></div></div>
      <span class="project-art-symbol" aria-hidden="true">৳</span></div>
      <div class="project-card-body"><div class="project-meta"><span>FULL STACK</span><span></span></div>
      <h3>BazarDor</h3>
      <p>A Bengali web app for tracking daily prices of essentials, with market-wise price breakdowns and secure sign-in.</p>
      <div class="project-tech"><span>Next.js</span><span>Tailwind CSS</span><span>MongoDB</span><span>BetterAuth</span></div>
      <button class="project-details-button" type="button" data-open-project="bajardor">View project details <span>↗</span></button></div>`;
    grid.appendChild(c);
  }
  $$(".project-card").forEach((c, i, all) => {
    const m = $(".project-meta span:last-child", c);
    if (m) m.textContent = `0${i + 1} / 0${all.length}`;
  });

  // ---- Scroll system (same on phone / tablet / laptop) ----
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const split = (el, cls) => {
    const words = [];
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    (function walk(node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) return frag.append(" ");
            const w = document.createElement("span");
            w.className = cls;
            w.setAttribute("aria-hidden", "true");
            if (cls === "w") {
              const i = document.createElement("span");
              i.className = "wi";
              i.textContent = tok;
              w.appendChild(i);
            } else w.textContent = tok;
            frag.append(w);
            words.push(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    })(el);
    return words;
  };
  $$(".section-heading h2, .contact-copy h2").forEach((h) =>
    split(h, "w").forEach((w, i) => w.style.setProperty("--d", i * 80 + "ms")),
  );
  const aboutEl = $(".about-statement > p");
  const aboutWords = aboutEl ? split(aboutEl, "sw") : [];

  const scrubs = [];
  const addScrub = (sel, kind) =>
    $$(sel).forEach((el, i) => {
      el.classList.remove("reveal", "reveal-delay-1", "reveal-delay-2");
      el.classList.add("scrub", "s-" + kind);
      el.dataset.scrub = "";
      if (kind === "lr") el.classList.add(i % 2 ? "from-r" : "from-l");
      scrubs.push(el);
    });
  addScrub(".section-heading", "line");
  addScrub(".skill-group", "lr");
  addScrub(".project-card", "tilt");
  addScrub(".education-card", "wipe");
  addScrub(".about-details", "rise");
  addScrub(".contact-copy", "rise");
  addScrub(".contact-links", "rise");

  const marquee = $(".tech-marquee"),
    grid2 = $(".background-grid"),
    heroCopy = $(".hero-copy");
  const pars = $$(".orbit-one,.orbit-two,.chip-code,.chip-ai").map((el) => [
    el,
    el.classList.contains("orbit-two")
      ? 0.12
      : el.classList.contains("orbit-one")
        ? 0.07
        : el.classList.contains("chip-code")
          ? 0.1
          : -0.06,
  ]);
  const ttBtn = document.createElement("button");
  ttBtn.className = "to-top";
  ttBtn.type = "button";
  ttBtn.setAttribute("aria-label", "Back to top");
  ttBtn.innerHTML =
    '<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="ring-bg" cx="22" cy="22" r="20"/><circle class="ring" cx="22" cy="22" r="20"/></svg><span aria-hidden="true">↑</span>';
  document.body.appendChild(ttBtn);
  const tRing = ttBtn.querySelector(".ring");
  const goTop = (e) => {
    e && e.preventDefault();
    scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  };
  ttBtn.addEventListener("click", goTop);
  $$('a[href="#top"]').forEach((a) => a.addEventListener("click", goTop));

  let lastY = scrollY,
    sk = 0,
    req = false;
  const frame = () => {
    req = false;
    const H = innerHeight,
      y = scrollY,
      vel = y - lastY;
    lastY = y;
    scrubs.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -60 || r.top > H + 60) return;
      el.style.setProperty("--p", clamp((H - r.top) / (H * 0.55)).toFixed(3));
    });
    if (aboutEl) {
      const r = aboutEl.getBoundingClientRect(),
        p = clamp((H * 0.85 - r.top) / (H * 0.45 + r.height)),
        t = p * (aboutWords.length + 3);
      aboutWords.forEach(
        (w, i) => (w.style.opacity = (0.16 + 0.84 * clamp(t - i)).toFixed(2)),
      );
    }
    pars.forEach(
      ([el, sp]) => (el.style.translate = `0 ${(-y * sp).toFixed(1)}px`),
    );
    if (heroCopy)
      heroCopy.style.setProperty("--hp", clamp(y / (H * 0.8)).toFixed(3));
    if (grid2) grid2.style.backgroundPosition = `0 ${(-y * 0.15).toFixed(1)}px`;
    sk += (clamp(vel * 0.12, -7, 7) - sk) * 0.15;
    if (marquee) marquee.style.transform = `skewX(${sk.toFixed(2)}deg)`;
    const max = document.documentElement.scrollHeight - H;
    tRing.style.strokeDashoffset = (
      125.66 *
      (1 - (max > 0 ? clamp(y / max) : 0))
    ).toFixed(1);
    ttBtn.classList.toggle("show", y > 500);
    if (Math.abs(sk) > 0.05) want();
  };
  const want = () => {
    if (!req) {
      req = true;
      requestAnimationFrame(frame);
    }
  };
  addEventListener("scroll", want, { passive: true });
  addEventListener("resize", want);
  addEventListener("load", want);
  frame();

  // Reveal (reduced-motion e o cholbe)
  $$(".skill-pills").forEach((g) =>
    $$("span", g).forEach((s, i) => s.style.setProperty("--i", i)),
  );
  const rev = $$(".reveal,[data-scrub]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es, o) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    rev.forEach((el) => io.observe(el));
  } else rev.forEach((el) => el.classList.add("visible"));

  // Active nav link
  if ("IntersectionObserver" in window) {
    const links = $$('.nav-links a[href^="#"]');
    const so = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) =>
            l.getAttribute("href") === "#" + e.target.id
              ? l.setAttribute("aria-current", "location")
              : l.removeAttribute("aria-current"),
          );
        }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    $$("main section[id]").forEach((s) => so.observe(s));
  }

  // Typing effect
  const kicker = $(".code-kicker");
  if (kicker) {
    const t = document.createElement("span");
    t.className = "typed";
    const c = document.createElement("span");
    c.className = "caret";
    c.setAttribute("aria-hidden", "true");
    kicker.append(" ", t, c);
    const words = [
      "a full stack developer.",
      "a React & Next.js builder.",
      "a Node.js API developer.",
      "building with AI.",
    ];
    let w = 0,
      i = 0,
      del = false;
    (function tick() {
      const word = words[w];
      t.textContent = word.slice(0, i);
      if (!del && i === word.length) {
        del = true;
        return setTimeout(tick, 1400);
      }
      if (del && i === 0) {
        del = false;
        w = (w + 1) % words.length;
      }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 80);
    })();
  }

  // Portrait tilt — mouse + touch (pointer events)
  const tilt = $("#tiltFrame");
  if (tilt && heroVisual) {
    heroVisual.style.touchAction = "pan-y";
    const move = (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    };
    const reset = () =>
      (tilt.style.transform = "perspective(1000px) rotateX(0) rotateY(0)");
    heroVisual.addEventListener("pointermove", move);
    ["pointerleave", "pointerup", "pointercancel"].forEach((ev) =>
      heroVisual.addEventListener(ev, reset),
    );
  }

  // Spotlight on cards (mouse + touch) + 3D tilt on mouse
  $$(".project-card, .skill-group, .education-card").forEach((card) => {
    const isProj = card.classList.contains("project-card");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
      card.classList.add("lit");
      if (isProj && e.pointerType === "mouse") {
        const x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-5px)`;
      }
    });
    ["pointerleave", "pointercancel"].forEach((ev) =>
      card.addEventListener(ev, () => {
        card.classList.remove("lit");
        card.style.transform = "";
      }),
    );
    card.addEventListener(
      "pointerup",
      (e) =>
        e.pointerType !== "mouse" &&
        setTimeout(() => card.classList.remove("lit"), 400),
    );
  });

  // Magnetic buttons + ripple
  if (fine)
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  $$(".button, .nav-cta, .card-links a").forEach((b) =>
    b.addEventListener("pointerdown", (e) => {
      const r = b.getBoundingClientRect(),
        s = Math.max(r.width, r.height),
        d = document.createElement("span");
      d.className = "ripple";
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(d);
      setTimeout(() => d.remove(), 650);
    }),
  );

  // Custom cursor (desktop only)
  const dot = $("#cursorDot"),
    ring = $("#cursorRing");
  if (fine && dot && ring) {
    document.body.classList.add("custom-cursor-enabled");
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      raf = null;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf =
        Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1
          ? requestAnimationFrame(loop)
          : null;
    };
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("mouseover", (e) =>
      ring.classList.toggle(
        "cursor-hover",
        !!e.target.closest("a, button, .project-card"),
      ),
    );
  }

  // Social links
  $$("[data-social]").forEach((a) =>
    wire(
      a,
      CONFIG.social[a.dataset.social],
      a.dataset.social.charAt(0).toUpperCase() + a.dataset.social.slice(1),
    ),
  );

  $$(".hero-socials,.social-links").forEach((c) => {
    if (!$$("a", c).some((a) => !a.hidden)) c.hidden = true;
  });

  // Projects: data, card buttons, modal
  const projects = {
    devstack: {
      index: "PROJECT / 001",
      title: "DevStack",
      description:
        "A responsive developer-resource platform that helps users explore programming technologies, built with React, TypeScript and Tailwind CSS.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      challenges:
        "Building a responsive layout, organizing reusable UI components, and maintaining type safety.",
      future:
        "Connect real resource data, improve search and filtering, and add user authentication.",
    },
    fitlog: {
      index: "PROJECT / 002",
      title: "FitLog",
      description:
        "A workout tracking web application that fetches exercise data from an API and presents it through a responsive interface.",
      tech: ["React", "API Integration", "JavaScript", "CSS"],
      challenges:
        "Managing API data, handling loading and error states, and designing for different screen sizes.",
      future:
        "Add workout history, filtering, detailed workout pages, and improved progress tracking.",
    },
    inboxpilot: {
      index: "PROJECT / 003",
      title: "InboxPilot AI",
      description:
        "An AI-assisted inbox for businesses that drafts replies and streamlines common customer order workflows.",
      tech: ["Node.js", "Express.js", "JavaScript", "OpenAI API"],
      challenges:
        "Connecting a backend API, handling customer messages, and structuring AI-assisted responses.",
      future:
        "Expand integrations, add conversation history, and build a full business dashboard.",
    },
    bajardor: {
      index: "PROJECT / 004",
      title: "BazarDor",
      description:
        "A fully Bengali-language web app for tracking daily prices of essentials like rice, lentils, oil, vegetables, fish and spices, with market-wise price breakdowns across major bazaars in Bangladesh.",
      tech: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "DaisyUI",
        "MongoDB",
        "BetterAuth",
      ],
      challenges:
        "Sorting prices correctly with Bengali numerals, keeping product details behind sign-in, and handling loading states across every screen size.",
      future:
        "Add price history charts, more markets and categories, and price-change alerts.",
    },
  };
  const dlg = $("#projectDialog");
  const open = (key) => {
    const p = projects[key],
      l = CONFIG.projects[key];
    if (!p) return;
    $("#dialogIndex").textContent = p.index;
    $("#dialogTitle").textContent = p.title;
    $("#dialogDescription").textContent = p.description;
    $("#dialogChallenges").textContent = p.challenges;
    $("#dialogFuture").textContent = p.future;
    const tech = $("#dialogTech");
    tech.replaceChildren(
      ...p.tech.map((x) =>
        Object.assign(document.createElement("span"), { textContent: x }),
      ),
    );
    wire($("#dialogLive"), l.live, "Live demo");
    wire($("#dialogGithub"), l.github, "GitHub repo");
    $(".dialog-actions").hidden = !(l.live || l.github);
    document.body.classList.remove("custom-cursor-enabled");
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    dlg.appendChild(toast);
    document.body.style.overflow = "hidden";
  };

  $$(".project-card").forEach((card) => {
    const key = card.dataset.project,
      l = CONFIG.projects[key];
    const row = document.createElement("div");
    row.className = "card-links";
    row.innerHTML =
      '<a data-k="github">GitHub ↗</a><a data-k="live">Live demo ↗</a>';
    $(".project-card-body", card).insertBefore(
      row,
      $(".project-details-button", card),
    );
    wire($('[data-k="github"]', row), l.github, "GitHub repo");
    wire($('[data-k="live"]', row), l.live, "Live demo");
    if (!$$("a", row).some((a) => !a.hidden)) row.hidden = true;
    card.addEventListener("click", (e) => {
      if (!e.target.closest("a")) open(key);
    });
  });
  $$("[data-open-project]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      open(b.dataset.openProject);
    }),
  );

  $("#dialogClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener("close", () => {
    document.body.style.overflow = "";
    document.body.appendChild(toast);
    if (fine && !matchMedia("(pointer:coarse)").matches)
      document.body.classList.add("custom-cursor-enabled");
  });
});
