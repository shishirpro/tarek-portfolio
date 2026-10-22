// Paste any Google Drive share link here. File must be shared as "Anyone with the link".
// `thumb` is optional — without it the thumbnail is pulled from Drive automatically.
const VIDEOS = [
  { link: "https://drive.google.com/file/d/1D1eC74XZN5rXKAQX9l-ok8dx4EqwI00K/view", thumb: "./assets/thumb2.jpg", title: "Talking Head Edit 01", tag: "Talking Head" },
  { link: "https://drive.google.com/file/d/1bhBTHx2DKoiVHPka8W_EhTlObdPKm7nk/view", thumb: "./assets/thumb3.jpg", title: "Talking Head Edit 02", tag: "Talking Head" },
  { link: "https://drive.google.com/file/d/1vOqfWkpJD-iIyeMl_7N_IV5c1_VPuGEr/view", thumb: "./assets/thumb4.jpg", title: "Talking Head Edit 03", tag: "Talking Head" },
  { link: "https://drive.google.com/file/d/1muMAnu6soBhpS3hPdnKTyqSiTsRDOU1j/view", thumb: "./assets/thumb5.jpg", title: "Talking Head Edit 04", tag: "Talking Head" },
  { link: "https://drive.google.com/file/d/1BOoYp2k0XVgqLPDpdNDg_uIXIGrX31rm/view", thumb: "./assets/thumb6.jpg", title: "Talking Head Edit 05", tag: "Talking Head" },
  { link: "https://drive.google.com/file/d/1Po4OvRbD_2Ke9ieCBmzWicWNUt9pj-u8/view", thumb: "./assets/thumb1.jpg", title: "Talking Head Edit 06", tag: "Talking Head" },
].map((v) => {
  const id = (v.link.match(/\/d\/([\w-]+)/) || v.link.match(/[?&]id=([\w-]+)/) || [, v.link])[1];
  return { ...v, id, thumb: v.thumb || `https://drive.google.com/thumbnail?id=${id}&sz=w1280` };
});

const STEPS = [
  { title: "Brief", text: "You share your footage, goals and reference videos. We lock in the vision, style and deadline." },
  { title: "Edit", text: "Story cut, pacing, captions, music, sound effects and color grading — all handled in one go." },
  { title: "Review", text: "You watch the draft and leave feedback. I refine every detail until it feels right." },
  { title: "Deliver", text: "Final export in every size you need — 9:16, 1:1 or 16:9 — ready to post and perform." },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const pad = (n) => String(n).padStart(2, "0");

// ---------- Hero ----------
$$(".hero-line").forEach((el, i) => {
  el.animate(
    [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }],
    { duration: 900, delay: 100 + 120 * i, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
  );
});
$$(".hero-in").forEach((el, i) => {
  el.animate(
    [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }],
    { duration: 800, delay: 450 + 120 * i, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
  );
});

// Rotating word
(() => {
  const el = $("#rotator");
  const words = ["promo videos", "social reels", "corporate films", "YouTube videos", "podcasts"];
  let i = 0;
  setInterval(() => {
    el.style.opacity = 0;
    el.style.transform = "translateY(-8px)";
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.transform = "translateY(8px)";
      requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = "none"; });
    }, 300);
  }, 2400);
})();

// Viewfinder timecode (HH:MM:SS:FF @ 25fps)
(() => {
  const el = $("#timecode");
  const start = performance.now();
  setInterval(() => {
    const f = Math.floor((performance.now() - start) / 40), s = Math.floor(f / 25);
    el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 25)}`;
  }, 40);
})();

// ---------- Film strip ----------
(() => {
  const frames = VIDEOS.map((v, i) => `
    <a href="#work" data-index="${i}" class="frame group block shrink-0">
      <div class="relative h-28 w-48 overflow-hidden rounded-sm sm:h-36 sm:w-64">
        <img src="${v.thumb}" alt="" class="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0">
        <span class="absolute bottom-1.5 left-2 font-mono text-[10px] text-white/80">${pad(i + 1)}A</span>
      </div>
    </a>`).join("");
  $("#filmstrip").innerHTML = frames.repeat(4);
  $$("#filmstrip a").forEach((a) => a.addEventListener("click", () => select(+a.dataset.index)));
})();

// ---------- Split headings ----------
$$(".split").forEach((el) => {
  let n = 0;
  el.innerHTML = el.textContent.trim().split(/\s+/)
    .map((w) => `<span class="w"><span style="--i:${n++}">${w}</span></span>`).join(" ");
});

// ---------- About: words light up while scrolling ----------
(() => {
  const el = $("#manifesto");
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) return frag.append(part);
      const s = document.createElement("span");
      s.className = "mw transition-opacity duration-300";
      s.textContent = part;
      frag.append(s);
    });
    node.replaceWith(frag);
  });
  const words = $$(".mw", el);
  const update = () => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.25)));
    const lit = reduceMotion || innerWidth < 768 ? words.length : Math.ceil(p * words.length);
    words.forEach((w, i) => (w.style.opacity = i < lit ? 1 : 0.15));
  };
  addEventListener("scroll", update, { passive: true });
  update();
})();

// ---------- Services: rolling letters ----------
$$(".roll").forEach((el) => {
  el.innerHTML = [...el.dataset.roll].map((c, i) => {
    const ch = c === " " ? "&nbsp;" : c;
    return `<span style="--i:${i}" data-c="${c === " " ? " " : c}">${ch}</span>`;
  }).join("");
});

// ---------- Work: cinema screen + reel ----------
let current = 0;
function select(i, play = false) {
  current = (i + VIDEOS.length) % VIDEOS.length;
  const v = VIDEOS[current];
  const screen = $("#screen");
  $("iframe", screen)?.remove();
  $("#screen-play").style.display = "";
  $("#screen-meta").style.display = "";
  $("#screen-shade").style.display = "";
  $("#screen-drive").href = `https://drive.google.com/file/d/${v.id}/view`;
  const img = $("#screen-img");
  img.style.opacity = 0;
  setTimeout(() => { img.src = v.thumb; img.alt = v.title; img.style.opacity = 1; }, 200);
  $("#screen-title").textContent = v.title;
  $("#screen-tag").textContent = v.tag;
  $("#screen-num").textContent = pad(current + 1);
  $$("#reel button").forEach((b, k) => {
    b.classList.toggle("is-active", k === current);
  });
  if (play) playScreen();
}
function playScreen() {
  const v = VIDEOS[current];
  // Phones: the small inline box makes Drive's player cramped, so play in a full-screen popup
  if (innerWidth < 768) return openPlayer(v);
  const f = document.createElement("iframe");
  f.src = `https://drive.google.com/file/d/${v.id}/preview`;
  f.allow = "autoplay; fullscreen";
  f.allowFullscreen = true;
  f.className = "absolute inset-0 z-10 h-full w-full bg-black";
  $("#screen-play").style.display = "none";
  $("#screen-meta").style.display = "none";
  $("#screen-shade").style.display = "none";
  $("#screen-drive").href = `https://drive.google.com/file/d/${v.id}/view`;
  $("#screen").append(f);
}
// Phone player (bottom sheet). The Drive iframe is laid out at 640x360 and scaled to fit,
// because at phone widths Drive switches to a mobile player that covers the picture.
function fitPlayer() {
  const box = $("#player-box");
  $("#player-frame").style.transform = `scale(${box.clientWidth / 640})`;
}
function openPlayer(v) {
  $("#player-frame").src = `https://drive.google.com/file/d/${v.id}/preview`;
  $("#player-title").textContent = v.title;
  $("#player-tag").textContent = `${pad(current + 1)} / ${pad(VIDEOS.length)} · ${v.tag}`;
  $("#player-drive").href = `https://drive.google.com/file/d/${v.id}/view`;
  $("#player").classList.replace("hidden", "flex");
  document.body.style.overflow = "hidden";
  fitPlayer();
  requestAnimationFrame(() => $("#player-sheet").classList.remove("translate-y-full"));
}
function closePlayer() {
  if ($("#player").classList.contains("hidden")) return;
  $("#player-sheet").classList.add("translate-y-full");
  setTimeout(() => {
    $("#player").classList.replace("flex", "hidden");
    $("#player-frame").src = "about:blank";
    document.body.style.overflow = "";
  }, 300);
}
$("#player-close").addEventListener("click", closePlayer);
$("#player [data-close]").addEventListener("click", closePlayer);
$("#player-prev").addEventListener("click", () => { select(current - 1); openPlayer(VIDEOS[current]); });
$("#player-next").addEventListener("click", () => { select(current + 1); openPlayer(VIDEOS[current]); });
addEventListener("resize", fitPlayer);
addEventListener("keydown", (e) => { if (e.key === "Escape") closePlayer(); });

(() => {
  $("#reel").innerHTML = VIDEOS.map((v, i) => `
    <button data-i="${i}" class="reel-item group flex w-60 shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-left transition duration-300 hover:border-white/25 hover:bg-white/[0.08] lg:w-full">
      <div class="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl">
        <img src="${v.thumb}" alt="" loading="lazy" class="h-full w-full object-cover">
        <span class="absolute inset-0 grid place-items-center bg-black/30 text-xs opacity-0 transition group-hover:opacity-100">▶</span>
      </div>
      <div class="min-w-0">
        <p class="font-mono text-[10px] text-accent">${pad(i + 1)}</p>
        <p class="truncate text-sm font-semibold">${v.title}</p>
      </div>
    </button>`).join("");
  $("#screen-total").textContent = pad(VIDEOS.length);
  $$("#reel button").forEach((b) => b.addEventListener("click", () => select(+b.dataset.i, true)));
  $("#screen-play").addEventListener("click", playScreen);
  $("#prev").addEventListener("click", () => select(current - 1));
  $("#next").addEventListener("click", () => select(current + 1));
  select(0);
})();

// ---------- Process: timeline with moving playhead ----------
(() => {
  // Waveform
  const wf = $("#waveform");
  const bars = 120;
  wf.setAttribute("viewBox", `0 0 ${bars * 4} 40`);
  wf.innerHTML = Array.from({ length: bars }, (_, i) => {
    const h = 6 + Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.13)) * 28 + Math.random() * 6;
    return `<rect x="${i * 4}" y="${20 - h / 2}" width="2.4" height="${h}" rx="1" fill="rgba(255,90,31,.55)"/>`;
  }).join("");

  const tl = $("#timeline");
  const head = $("#playhead");
  const clips = $$(".step-clip");
  let step = 0, auto = true, t = 0, last = performance.now();

  const show = (i) => {
    step = i;
    clips.forEach((c, k) => c.classList.toggle("active", k === i));
    $("#step-num").textContent = `STEP ${pad(i + 1)}`;
    $("#step-title").textContent = STEPS[i].title;
    $("#step-text").textContent = STEPS[i].text;
  };
  const placeHead = (p) => {
    const track = clips[0].parentElement;
    const r = track.getBoundingClientRect(), base = tl.getBoundingClientRect();
    head.style.left = `${r.left - base.left + p * r.width}px`;
    $("#tl-time").textContent = `00:${pad(Math.floor(p * 60))}:${pad(Math.floor((p * 6000) % 100))}`;
  };

  clips.forEach((c, i) => c.addEventListener("click", () => {
    auto = false;
    t = (i + 0.5) / 4;
    placeHead(t);
    show(i);
    setTimeout(() => (auto = true), 6000);
  }));

  let visible = false;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(tl);
  (function loop(now) {
    const dt = (now - last) / 1000; last = now;
    if (visible && auto && !reduceMotion) {
      t = (t + dt / 16) % 1;
      placeHead(t);
      const i = Math.min(3, Math.floor(t * 4));
      if (i !== step) show(i);
    }
    requestAnimationFrame(loop);
  })(last);
  show(0);
  addEventListener("resize", () => placeHead(t));
  requestAnimationFrame(() => placeHead(0));
})();

// ---------- Contact: clapperboard snaps shut ----------
(() => {
  const clapper = $("#clapper");
  new IntersectionObserver(([en]) => {
    clapper.style.rotate = en.isIntersecting ? "0deg" : "";
  }, { threshold: 0.6 }).observe(clapper.parentElement);
})();

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
  });
}, { threshold: 0.15 });
$$(".reveal, .split").forEach((el) => revealObserver.observe(el));

// ---------- Counters ----------
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.to, start = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - start) / 1600);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$(".counter").forEach((el) => counterObserver.observe(el));

// ---------- FAQ ----------
$$(".faq-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq");
    const wasOpen = item.classList.contains("open");
    $$(".faq.open").forEach((f) => f.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
});

// ---------- Mobile menu ----------
(() => {
  const menu = $("#mobile-menu");
  const set = (open) => {
    menu.classList.toggle("opacity-0", !open);
    menu.classList.toggle("pointer-events-none", !open);
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  $("#menu-btn").addEventListener("click", () => set(true));
  $("#menu-close").addEventListener("click", () => set(false));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
})();

// ---------- Scroll: nav, progress, back-to-top, active link ----------
(() => {
  const nav = $("#nav"), bar = $("#progress"), toTop = $("#to-top");
  const links = $$(".nav-link");
  const sections = links.map((a) => $(a.getAttribute("href")));
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("bg-paper/80", y > 30);
    nav.classList.toggle("backdrop-blur-md", y > 30);
    nav.classList.toggle("shadow-sm", y > 30);
    bar.style.transform = `scaleX(${y / (document.documentElement.scrollHeight - innerHeight)})`;
    const show = y > 600;
    toTop.classList.toggle("opacity-0", !show);
    toTop.classList.toggle("translate-y-20", !show);
    let active = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) active = i; });
    links.forEach((a, i) => {
      a.classList.toggle("bg-ink", i === active);
      a.classList.toggle("text-white", i === active);
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ---------- Desktop touches: magnetic buttons, hero parallax ----------
if (finePointer && !reduceMotion) {
  $$(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => (el.style.transform = ""));
  });
  const photo = $("#hero-photo");
  $("#home").addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    photo.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
  });
}

$("#year").textContent = new Date().getFullYear();
