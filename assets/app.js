const main = document.querySelector("#main-content");
const dock = document.querySelector("#dock");
const projectDialog = document.querySelector("#project-dialog");
const mediaDialog = document.querySelector("#media-dialog");
const celebration = document.querySelector("#celebration");
const EMAIL = "bakhramova.b@northeastern.edu";
const PDF = "assets/resume/Binafsha_Bakhramova_Resume.pdf";
const LINKEDIN = "https://www.linkedin.com/in/binafsha-bakhramova/";
const GITHUB = "https://github.com/httpsbina";
const SPOTIFY = "https://open.spotify.com/playlist/37i9dQZF1FwSifOc09xCom";
const PR = "https://github.com/Forge-NU/HuskyMarketplace/pull/52";
const TBCA = "https://github.com/CharlesTChapman/26su-TBCA-Project";
const mapImage = {
  src: "assets/common-senses/tasnim-map.png",
  alt: "Common SENSES Heat Sensor Network map by Tasnim Ahmed, with street names, sensor locations and legend",
};
const plots = [
  {
    src: "assets/projects/texas-convergence.png",
    alt: "Texas convergence plots, showing R-hat and effective sample size across recorded audits",
  },
  {
    src: "assets/projects/texas-seat-distribution.png",
    alt: "Texas ensemble distribution of Democratic seats compared with enacted plans",
  },
];
const monthly = {
  src: "assets/common-senses/monthly-means.png",
  alt: "Common SENSES monthly sensor averages",
};
const acesPhoto = {
  src: "assets/photos/aces-scavenger-hunt.jpg",
  alt: "ACES students at Farmer’s Horse during the community scavenger hunt",
};
const apps = [
  ["calendar", "Calendar", "calendar"],
  ["home", "Home", "finder"],
  ["resume", "Résumé", "notes"],
  ["about", "About", "health"],
  ["mail", "Mail", "mail"],
  ["photos", "Photos", "photos"],
];
const noteNames = {
  overview: "Résumé overview",
  research: "Research & analysis",
  product: "Product & development",
  leadership: "Leadership & service",
  education: "Education & coursework",
  skills: "Skills & interests",
};
const notePreviews = {
  overview: "Business analytics and FinTech",
  research: "BARI / PEAK / eBay / EU labor-market models",
  product: "Forge / Husky Marketplace / UI, data and trust",
  leadership: "AI Advisory Board / ACES / SLA / budget leadership",
  education: "Northeastern / 3.76 GPA / Honors / relevant courses",
  skills: "Excel / Python / SQL / modeling / photography",
};
const events = [
  {
    key: "accounting",
    day: 0,
    start: 8.4,
    end: 15,
    area: "course",
    tag: "Coursework",
    title: "Managerial Accounting",
    description:
      "I use Excel formulas and data tables to model profit, costs and break-even points.",
  },
  {
    key: "tbca",
    day: 0,
    start: 16,
    end: 23.2,
    area: "product",
    tag: "Python / SQL / models",
    title: "TBCA",
    description:
      "I built EU employment regressions and funding-allocation models using Eurostat data.",
  },
  {
    key: "common-senses",
    day: 1,
    start: 12.5,
    end: 19,
    area: "data",
    tag: "Python / research",
    title: "Common SENSES",
    description:
      "I analyze PM2.5 in Python with BARI and Boston’s Office of Emerging Technology.",
  },
  {
    key: "aces",
    day: 2,
    start: 8.4,
    end: 15,
    area: "leadership",
    tag: "Mentoring",
    title: "ACES",
    description:
      "I mentor first-year ACES students and support their weekly service and reflections.",
  },
  {
    key: "advisory",
    day: 2,
    start: 15.8,
    end: 23,
    area: "leadership",
    tag: "AI / leadership",
    title: "AI Advisory Board",
    description:
      "I propose panel topics and help plan student–faculty AI discussions, including DMSB curriculum work.",
  },
  {
    key: "forge",
    day: 3,
    start: 9.2,
    end: 16,
    area: "product",
    tag: "Product / software",
    title: "Forge",
    description:
      "I design UI/UX and build Husky Marketplace’s account, profile and listing flows.",
  },
  {
    key: "statistics",
    day: 3,
    start: 18,
    end: 24,
    area: "course",
    tag: "Coursework",
    title: "Business Statistics",
    description:
      "I analyze eBay auctions in Excel and Python using correlation, distributions and IQR.",
  },
  {
    key: "peak",
    day: 4,
    start: 10.4,
    end: 17.4,
    area: "data",
    tag: "Python / research",
    title: "PEAK research",
    description:
      "I test Texas and North Carolina maps for partisan bias using MCMC.",
  },
];
const filters = new Set(["data", "product", "leadership", "course"]);
const initialSudoku = [1, 2, 0, 4, 0, 4, 1, 0, 0, 1, 4, 0, 4, 0, 0, 1];
const solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
let sudoku = [...initialSudoku],
  selectedCell = -1,
  solved = false;
let data,
  library,
  icons,
  current = { app: "home", section: "" };
let media = { items: [], index: 0, scale: 0, opener: null };
let lastProjectOpener = null;

function esc(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
}
function icon(name) {
  return (icons[name] || icons["square-pen"] || "")
    .replace(/#[0-9a-fA-F]{6}/g, "currentColor")
    .replace("<svg", '<svg aria-hidden="true"');
}
function controls() {
  return '<div class="window-controls" aria-hidden="true"><i></i><i></i><i></i></div>';
}
function external(url, label, extra = "") {
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)}</a>`;
}
function replyLink(subject) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Hi Binafsha,\n\n")}`;
}
function side(label, href, symbol = "folder", active = false, count = "") {
  return `<a class="side-item ${active ? "active" : ""}" href="${href}" ${active ? 'aria-current="page"' : ""}>${symbol.startsWith("native:") ? `<img src="assets/ui/${symbol.slice(7)}.png" alt="">` : icon(symbol)}<span>${esc(label)}</span>${count !== "" ? `<span class="count">${count}</span>` : ""}</a>`;
}
function richSlice(record, start = 0, end = record.text.length) {
  const ranges = record.runs || [],
    cuts = new Set([start, end]);
  for (const r of ranges) {
    if (r.start > start && r.start < end) cuts.add(r.start);
    if (r.end > start && r.end < end) cuts.add(r.end);
  }
  const points = [...cuts].sort((a, b) => a - b);
  return points
    .slice(0, -1)
    .map((a, i) => {
      const b = points[i + 1],
        active = ranges.filter((r) => r.start <= a && r.end >= b);
      let html = esc(record.text.slice(a, b));
      if (active.some((r) => r.bold)) html = `<strong>${html}</strong>`;
      const href = active.find((r) => r.href)?.href;
      if (href) {
        if (href.includes("assets/common-senses/live-map.html"))
          html = `<a href="${mapImage.src}" data-asset="map">${html}</a>`;
        else
          html = `<a href="${esc(href)}" ${/^https:/.test(href) ? 'target="_blank" rel="noopener noreferrer"' : ""}>${html}</a>`;
      }
      return html;
    })
    .join("");
}
function sections(record, technical = false) {
  if (!record) return "";
  let cursor = 0;
  return record.text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((block) => {
      const offset = record.text.indexOf(block, cursor);
      cursor = offset + block.length;
      const lines = block.split("\n");
      const heading = /^[A-Z0-9][A-Z0-9 /,&’'().:+−–-]+$/.test(lines[0]);
      let local = offset;
      const html = lines
        .map((line, i) => {
          const start = local;
          local += line.length + 1;
          const content = richSlice(record, start, start + line.length);
          if (i === 0 && heading)
            return `<${technical ? "h2" : "h3"}>${content}</${technical ? "h2" : "h3"}>`;
          return line.startsWith("• ")
            ? `<div class="bullet">${content}</div>`
            : `<div>${content || "&nbsp;"}</div>`;
        })
        .join("");
      return `<section class="${technical ? "technical-section" : "resume-section"}">${html}</section>`;
    })
    .join("");
}
function renderDock() {
  dock.innerHTML = apps
    .map(
      ([app, label, image]) =>
        `<a href="#${app}" ${current.app === app ? 'aria-current="page"' : ""}><img src="assets/ui/${image}.png" alt="" width="64" height="64"><span>${label}</span></a>`,
    )
    .join("");
}
function home() {
  return `<section class="hero" aria-label="Binafsha Bakhramova"><div class="notebook" aria-hidden="true"></div><img class="hero-gingham" src="assets/ui/gingham.svg" alt=""><article class="identity-card"><img class="hero-binder" src="assets/ui/binder-clip.svg" alt=""><div class="hero-copy"><h1>BINAFSHA<br>BAKHRAMOVA</h1><p class="hero-role">Business analytics<br>&amp; political science</p><p class="hero-school">Northeastern University<br>Data science minor</p><button class="project-scrap code" data-project="common-senses" aria-label="Explore Common SENSES research"><strong>live-map.html</strong>function classify(val, scale) {<br>&nbsp; for (const c of scale)<br>&nbsp;&nbsp; if (val &lt; c.max) return c;<br>}</button></div><div><figure class="hero-portrait"><img class="hero-star" src="assets/ui/hero-star.svg" alt=""><img class="hero-paperclip" src="assets/ui/paperclip.svg" alt=""><img class="portrait" src="assets/img/portrait.jpg" alt="Binafsha at a lighthouse by the ocean"><span class="bina">Bina</span><figcaption>STUDENT / RESEARCHER / PHOTOGRAPHER</figcaption><button class="project-scrap map" data-project="peak" aria-label="Explore PEAK redistricting research"><strong>gerrymander detector</strong>Texas congressional maps<br>Enacted vs. simulated<br><br><small>PYTHON / GEOPANDAS</small></button></figure><div class="barcode" aria-hidden="true"></div></div></article></section>`;
}
function eventCard(e) {
  return `<button class="calendar-event ${filters.has(e.area) ? "" : "filtered-out"}" data-project="${e.key}" data-area="${e.area}" style="--top:${((e.start - 8) / 16) * 100}%;--height:${((e.end - e.start) / 16) * 100}%"><small>${e.tag}</small><h3>${e.title}</h3><p>${e.description}</p></button>`;
}
function calendar() {
  const categories = [
    ["data", "Python & data", "#b46a7a"],
    ["product", "Product & software", "#658c78"],
    ["leadership", "Leadership & strategy", "#9b9085"],
    ["course", "Coursework", "#b49960"],
  ];
  const mini =
    ["S", "M", "T", "W", "T", "F", "S"]
      .map((x) => `<span class="day">${x}</span>`)
      .join("") +
    Array.from(
      { length: 30 },
      (_, i) => `<span class="${i === 17 ? "today" : ""}">${i + 1}</span>`,
    ).join("");
  return `<section class="app-window calendar-shell" aria-label="My calendar"><header class="native-toolbar">${controls()}<h1>Calendar</h1><div class="calendar-views" aria-label="Calendar view"><span>Day</span><span class="selected">Week</span><span>Month</span><span>Year</span></div></header><aside class="sidebar calendar-sidebar panel-rule"><div class="mini-month"><strong>November 2026</strong><div class="mini-grid">${mini}</div></div><div class="filter-heading"><h2>Explore by area</h2><button data-action="reset-filters">Reset</button></div><div class="filters">${categories.map(([key, label, color]) => `<label class="calendar-filter" style="--swatch:${color}"><input type="checkbox" data-filter="${key}" ${filters.has(key) ? "checked" : ""}>${label}</label>`).join("")}</div><div class="relevant"><h2>Relevant classes</h2><button class="class-link" data-project="statistics"><strong>Business Statistics</strong><small>Excel / pandas / pricing analysis</small></button><button class="class-link" data-project="accounting"><strong>Managerial Accounting</strong><small>Excel formulas / cost models</small></button><button class="class-link" data-project="coursework"><strong>Database Design</strong><small>SQL / joins / relational models</small></button></div><button class="text-button" data-project="coursework">View coursework</button><button class="text-button" data-project="research">Research experience</button></aside><div class="calendar-content"><div class="calendar-title"><h2>November 2026</h2><button class="today-button" data-action="reset-filters">Today</button></div><div class="week-head">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => `<span>${d}<b class="${i === 2 ? "selected" : ""}">${16 + i}</b></span>`).join("")}</div><div class="week-body">${Array.from({ length: 9 }, (_, i) => `<span class="time-label" style="top:${i * 12.5}%">${String(8 + i * 2).padStart(2, "0")}:00</span>`).join("")}${Array.from(
    { length: 5 },
    (_, i) =>
      `<div class="day-column" style="left:${i * 20}%">${events
        .filter((e) => e.day === i)
        .map(eventCard)
        .join("")}</div>`,
  ).join("")}</div><div class="agenda">${[
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]
    .map(
      (day, i) =>
        `<section class="agenda-day"><h2>${day} / November ${16 + i}</h2>${events
          .filter((e) => e.day === i)
          .map(eventCard)
          .join("")}</section>`,
    )
    .join("")}</div></div></section>`;
}
function resume() {
  const selected = Object.hasOwn(noteNames, current.section)
    ? current.section
    : "overview";
  const tabs = (keys) =>
    keys
      .map(
        (key) =>
          `<button class="note-item ${selected === key ? "selected" : ""}" data-note="${key}" ${selected === key ? 'aria-current="page"' : ""}><strong>${noteNames[key]}</strong><small>${notePreviews[key]}</small></button>`,
      )
      .join("");
  return `<section class="app-window notes-shell" aria-label="Résumé in Notes"><header class="native-toolbar">${controls()}<div class="notes-title"><h1>Notes</h1></div><span class="quiet" aria-hidden="true">Aa</span><div class="toolbar-end"><input class="notes-search" type="search" placeholder="Search résumé" aria-label="Search résumé" hidden><a class="download-pdf" href="${PDF}" download>${icon("archive")}Download PDF</a><button class="icon-button" data-action="note-search" aria-label="Search résumé">${icon("search")}</button></div></header><aside class="sidebar notes-sidebar panel-rule"><h2>iCloud</h2>${side("All iCloud", "#resume", "panel-left", false, 6)}${side("Résumé", "#resume", "inbox", true, 6)}${side("Experience", "#resume/research", "inbox", false, 3)}${side("Education", "#resume/education", "inbox", false, 1)}${side("Skills & interests", "#resume/skills", "inbox", false, 1)}<div class="sidebar-footer"><strong>Binafsha Bakhramova</strong>Business analytics<br>&amp; political science<br><br>Northeastern / Class of 2029</div></aside><nav class="notes-list" aria-label="Résumé sections"><h2>Pinned</h2>${tabs(["overview"])}<h2>Experience</h2>${tabs(["research", "product", "leadership"])}<h2>Education &amp; skills</h2>${tabs(["education", "skills"])}</nav><article class="note-reader" aria-labelledby="note-title"><p class="note-date">November 2026</p><h2 id="note-title">${selected === "overview" ? "Binafsha Bakhramova" : noteNames[selected]}</h2><p class="note-subtitle">${selected === "overview" ? "Business analytics & political science" : "Northeastern University / Résumé"}</p><div class="resume-sections ${selected === "research" ? "research" : ""}">${sections(data.notes[selected].body)}</div></article></section>`;
}
function healthRow(label, value) {
  return `<div class="health-row"><dt>${label}</dt><dd>${value}</dd></div>`;
}
function about() {
  return `<section class="app-window health-shell" aria-label="About Bina"><header class="health-header"><a href="#home" aria-label="Back to home">${icon("arrow-left")}</a><h1>Health Details</h1></header><div class="profile"><img src="assets/img/portrait.jpg" alt="Binafsha Bakhramova"><p>Outside work</p></div><div class="health-columns"><div class="health-column"><dl class="health-group">${healthRow("First name", "Binafsha")}${healthRow("Last name", "Bakhramova")}${healthRow("Pronouns", "she/her")}${healthRow("Languages", "English / Russian")}</dl><dl class="health-group">${healthRow("Coffee stop", "Caffè Paradiso, North End")}${healthRow("Small finds", "Buffalo Exchange, Brookline")}</dl></div><div class="health-column"><dl class="health-group">${healthRow("Photography", "Street & travel / Kodak PIXPRO")}${healthRow("Listening", external(SPOTIFY, "Pop music"))}${healthRow("Collecting", "Vinyl / Noah Kahan (bone)")}</dl><section class="sudoku-card" aria-label="Mini Sudoku"><h2>Mini Sudoku</h2><div class="sudoku-layout"><div class="sudoku-grid" role="group" aria-label="4 by 4 Sudoku">${sudoku.map((v, i) => `<input aria-label="Row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}${initialSudoku[i] ? ", given" : ""}" data-cell="${i}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" ${initialSudoku[i] ? "readonly" : ""} value="${v || ""}">`).join("")}</div><div class="sudoku-actions"><button class="primary" data-action="check-sudoku">Check</button><button class="secondary" data-action="hint-sudoku">Hint</button><button class="text-button" data-action="reset-sudoku">Reset</button><p class="sudoku-status" role="status" aria-live="polite"></p></div></div></section></div></div></section>`;
}
function emailAttachments(index) {
  if (index === 1) return [mapImage];
  if (index === 2) return [monthly];
  if (index === 3) return plots;
  if (index === 6) return [acesPhoto];
  if (index === 4 || index === 8)
    return [
      {
        url: PR,
        src: "assets/ui/pr-preview.png",
        type: "GitHub / pull request #52",
        title: "Connect Home and finish account setup",
        context: "Forge-NU / HuskyMarketplace",
      },
    ];
  if (index === 5)
    return [
      {
        url: TBCA,
        src: "assets/projects/tbca-site.png",
        type: "GitHub / project repository",
        title: "TBCA / labor forecasts and university models",
        context: "CharlesTChapman / 26su-TBCA-Project",
      },
    ];
  return [];
}
const mailOrder = [0, 1, 2, 3, 4, 7, 8, 6, 5];
const mailTimes = [
  "1:10 PM",
  "12:42 PM",
  "11:18 AM",
  "11/17/26",
  "11/17/26",
  "6/12/26",
  "9/24/26",
  "11/17/26",
  "11/16/26",
];
const mailISODates = [
  "2026-11-18T13:10:00-05:00",
  "2026-11-18T12:42:00-05:00",
  "2026-11-18T11:18:00-05:00",
  "2026-11-17T16:06:00-05:00",
  "2026-11-17T14:23:00-05:00",
  "2026-06-12T10:08:00-04:00",
  "2026-09-24T15:12:00-04:00",
  "2026-11-17T10:36:00-05:00",
  "2026-11-16T17:07:00-05:00",
];
function signature() {
  return `<div class="signature"><span class="n-logo" aria-hidden="true">N</span><div><strong>Binafsha Bakhramova</strong><br>Business Administration &amp; Political Science<br>Data Science Minor / Northeastern ’29<br>Backend Developer @ Sherman Center / PEAK Summit Fellow<br><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>`;
}
function mail() {
  const index =
      /^\d$/.test(current.section) &&
      Number(current.section) < data.emails.length
        ? Number(current.section)
        : 0,
    m = data.emails[index];
  const attachments = emailAttachments(index);
  const attachmentHTML = attachments.length
    ? `<div class="message-attachments">${attachments.map((a, i) => (a.url ? `<a class="message-attachment" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(a.title)}"><img src="${a.src}" alt="${esc(a.title)}"></a>` : `<button class="message-attachment" data-mail-image="${index}:${i}" aria-label="Open attachment: ${esc(a.alt)}"><img src="${a.src}" alt="${esc(a.alt)}"></button>`)).join("")}</div>`
    : "";
  return `<section class="app-window mail-shell" aria-label="Contact in Mail"><header class="native-toolbar">${controls()}<div class="mail-title"><h1>Inbox</h1><p class="mail-total">9 messages</p></div><div class="toolbar-end"><a class="icon-button" href="${replyLink(m.subject)}" aria-label="Compose an email">${icon("square-pen")}</a><a class="mail-toolbar-reply" href="${replyLink(m.subject)}">${icon("reply")}Reply</a><input class="mail-search" type="search" aria-label="Search messages" placeholder="Search"></div></header><aside class="sidebar mail-sidebar panel-rule"><h2>Favorites</h2>${side("Inbox", "#mail", "inbox", true, 9)}<a class="side-item" href="${replyLink("Hi Bina!")}">${icon("send")}Write to me</a><div class="contact-links"><h2>Elsewhere</h2>${external(LINKEDIN, "LinkedIn")}${external(GITHUB, "GitHub")}<a href="tel:+13478934988">347-893-4988</a></div></aside><nav class="mailbox-list" aria-label="Messages"><div class="primary-tab">Primary</div><div class="mail-messages">${mailOrder
    .map((i) => {
      const x = data.emails[i],
        a = emailAttachments(i)[0];
      return `<button class="mail-item ${i === index ? "selected" : ""} ${a ? "has-attachment" : ""}" data-email="${i}" ${i === index ? 'aria-current="page"' : ""}><strong>${esc(x.sender)}</strong><time datetime="${mailISODates[i]}">${mailTimes[i]}</time><span class="mail-subject">${esc(x.subject)}</span><span class="mail-preview">${esc(x.body.replace(/^[^\n]+\n\n/, "").replace(/\n/g, " "))}</span>${a ? `<img class="mail-thumb" data-inbox-attachment="${i}" src="${a.src}" alt="${a.url ? "Attached project link" : "Image attachment"}">` : ""}</button>`;
    })
    .join(
      "",
    )}</div></nav><article class="mail-reader"><h2>${esc(m.subject)}</h2><div class="message-meta"><strong>${esc(m.sender)}</strong><time datetime="${mailISODates[index]}">${esc(m.date)}</time><div>${esc(m.context)}</div><div>${esc(m.recipient)}</div></div><div class="message-body">${m.body
    .split(/\n\n+/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join(
      "",
    )}${attachmentHTML}${m.signature ? signature() : ""}<a class="message-reply" href="${replyLink(m.subject)}">${icon("reply")}Reply</a></div></article></section>`;
}
function currentPhotos() {
  const album = library.albums.find((a) => a.id === current.section);
  return album
    ? album.photoIds.map((id) => library.photos.find((p) => p.id === id))
    : library.photos;
}
function photos() {
  const isAlbums = current.section === "albums",
    album = library.albums.find((a) => a.id === current.section),
    title = isAlbums ? "Albums" : album?.title || "Library",
    photos = currentPhotos();
  return `<section class="app-window photos-shell" aria-label="Photography"><header class="native-toolbar">${controls()}<div><h1>${title}</h1><p class="photo-count">${isAlbums ? "3 albums" : photos.length + " photos"}</p></div><div class="toolbar-end"><a class="all-photos" href="#photos"><img src="assets/ui/library.png" alt="">All Photos</a></div></header><nav class="sidebar photos-sidebar panel-rule" aria-label="Photo albums">${side("Library", "#photos", "native:library", !album && !isAlbums)}${side("Albums", "#photos/albums", "native:albums", isAlbums)}<h2>My Albums</h2>${[
    ...library.albums,
  ]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((a) =>
      side(a.title, "#photos/" + a.id, "native:album", a.id === album?.id),
    )
    .join("")}</nav><div class="photo-library"><div class="photo-scroll">${
    isAlbums
      ? `<div class="album-grid">${library.albums
          .map((a) => {
            const image = library.photos.find((p) => p.id === a.coverId);
            return `<button class="album-card" data-album="${a.id}"><img src="${image.src}" alt="${esc(image.alt)}"><strong>${a.title}</strong><small>${a.photoIds.length} photos</small></button>`;
          })
          .join("")}</div>`
      : `<div class="photo-grid">${photos.map((p) => `<button class="photo-tile" data-photo="${p.id}" aria-label="Open photograph: ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" width="${p.width}" height="${p.height}"></button>`).join("")}</div>`
  }</div><p class="photo-footer">${isAlbums ? "3 albums" : photos.length + " photos"}</p></div></section>`;
}
function projectImage(key) {
  return {
    "common-senses": mapImage,
    tbca: {
      src: "assets/projects/tbca-site.png",
      alt: "TBCA project dashboard",
    },
    peak: {
      src: "assets/projects/gerrymander-maps.png",
      alt: "Texas district-map comparison",
    },
    aces: acesPhoto,
    research: {
      src: "assets/projects/nyu-poster.png",
      alt: "Binafsha’s NYU Tandon robotics research poster",
    },
    forge: {
      src: "assets/projects/forge-logo.png",
      alt: "Forge / Husky Marketplace",
    },
  }[key];
}
function openProject(key, opener = document.activeElement) {
  const p = data.projects[key];
  if (!p) return;
  lastProjectOpener = opener;
  const image = projectImage(key);
  const course = key === "coursework";
  const body = course
    ? `<div class="gpa-record"><strong>3.76 / 4.00</strong><p>Data Science minor / John Martinson Honors Program / Expected graduation 2029</p></div><div class="coursework-grid"><section><h2>Current / Fall 2026</h2>${p.current.map((c) => `<section><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p></section>`).join("")}<button class="text-button" data-project="accounting">Managerial Accounting</button><button class="text-button" data-project="statistics">Business Statistics</button></section><section><h2>Completed</h2>${p.completed.map((c) => `<p class="completed-course">${esc(c)}</p>`).join("")}<p class="quiet small">Belgium Dialogue / Summer 2026<br>DS 3000 + CS 4973</p></section></div>`
    : `<div class="project-note-grid"><div>${sections(p.body, true)}</div><aside class="project-side">${image ? `<button class="project-evidence" data-project-image="${key}" aria-label="Open full image: ${esc(image.alt)}"><img src="${image.src}" alt="${esc(image.alt)}"></button>` : ""}${p.paperNote ? `<div class="project-paper-note">${esc(p.paperNote)}</div>` : ""}<h2>${esc(p.asideTitle)}</h2><p>${esc(p.aside).replace(/\n/g, "<br>")}</p>${
        p.links.length
          ? "<h2>Project materials</h2>" +
            p.links
              .filter(
                (link, i, all) =>
                  all.findIndex((l) => l.url === link.url) === i,
              )
              .map((l) => external(l.url, l.label))
              .join("")
          : ""
      }${["accounting", "statistics"].includes(key) ? '<button class="text-button" data-project="coursework">All coursework</button>' : ""}</aside></div>`;
  projectDialog.innerHTML = `<article class="paper-note"><img class="note-clip" src="assets/ui/binder-clip.svg" alt=""><button class="project-close" data-close>Close ×</button><p class="note-category">${esc(p.category)}</p><h1>${esc(p.title)}</h1><p class="project-subtitle">${esc(p.subtitle)}</p><p class="project-period">${esc(p.period)}</p>${p.intro ? `<p class="project-intro">${esc(p.intro)}</p>` : ""}${body}<button class="primary project-return" data-close>Return to calendar</button></article>`;
  if (!projectDialog.open) projectDialog.showModal();
  projectDialog.scrollTop = 0;
}
function openMedia(items, index = 0) {
  media = { items, index, scale: 0, opener: document.activeElement };
  mediaDialog.innerHTML = `<header class="media-toolbar">${items.length > 1 ? `<button class="icon-button" data-media-step="-1" aria-label="Previous image">${icon("arrow-left")}</button><button class="icon-button" data-media-step="1" aria-label="Next image">${icon("arrow-right")}</button>` : ""}<span class="position"></span><div class="media-controls"><button data-zoom="fit">Fit</button><button data-zoom="out" aria-label="Zoom out">−</button><button data-zoom="in" aria-label="Zoom in">+</button><button data-close aria-label="Close image">Done</button></div></header><div class="media-stage"><div class="media-canvas"><img alt="" draggable="false"></div></div>`;
  mediaDialog.showModal();
  setMediaImage();
}
function setMediaImage() {
  const image = mediaDialog.querySelector("img"),
    item = media.items[media.index];
  image.onload = () => {
    media.scale = 0;
    resizeMedia();
  };
  image.src = item.src;
  image.alt = item.alt || "";
  mediaDialog.querySelector(".position").textContent =
    media.items.length > 1 ? `${media.index + 1} / ${media.items.length}` : "";
  if (image.complete && image.naturalWidth) resizeMedia();
}
function resizeMedia() {
  const stage = mediaDialog.querySelector(".media-stage"),
    canvas = mediaDialog.querySelector(".media-canvas"),
    image = canvas.querySelector("img");
  if (!image.naturalWidth) return;
  const fit = Math.min(
      stage.clientWidth / image.naturalWidth,
      stage.clientHeight / image.naturalHeight,
      1,
    ),
    scale = media.scale || fit,
    w = Math.round(image.naturalWidth * scale),
    h = Math.round(image.naturalHeight * scale);
  image.style.width = w + "px";
  image.style.height = h + "px";
  canvas.style.width = Math.max(w, stage.clientWidth) + "px";
  canvas.style.height = Math.max(h, stage.clientHeight) + "px";
  stage.scrollTop = 0;
  stage.scrollLeft = 0;
}
function stepMedia(delta) {
  media.index = (media.index + delta + media.items.length) % media.items.length;
  media.scale = 0;
  setMediaImage();
}
function zoomMedia(mode) {
  if (mode === "fit") media.scale = 0;
  else {
    const image = mediaDialog.querySelector("img"),
      current = image.getBoundingClientRect().width / image.naturalWidth;
    media.scale = Math.max(
      0.2,
      Math.min(4, mode === "in" ? Math.max(1, current * 1.5) : current / 1.5),
    );
  }
  resizeMedia();
}
function checkSudoku(showErrors = false) {
  const cells = [...main.querySelectorAll("[data-cell]")];
  if (showErrors) {
    cells.forEach((c, i) =>
      c.classList.toggle(
        "invalid",
        Boolean(sudoku[i]) && sudoku[i] !== solution[i],
      ),
    );
    const wrong = cells.some((_, i) => sudoku[i] && sudoku[i] !== solution[i]);
    main.querySelector(".sudoku-status").textContent = wrong
      ? "A few squares need another look."
      : sudoku.includes(0)
        ? "Looking good so far."
        : "";
  }
  if (!solved && sudoku.every((v, i) => v === solution[i])) {
    solved = true;
    celebration.showModal();
    confetti();
  }
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const holder = document.querySelector("#confetti"),
    colors = ["#803d48", "#d4bf85", "#9ea89b", "#d9b7b0", "#f4f0e6"];
  holder.replaceChildren();
  for (let i = 0; i < 45; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    bit.style.setProperty("--x", `${(Math.random() - 0.5) * 800}px`);
    bit.style.setProperty("--y", `${200 + Math.random() * 400}px`);
    bit.style.setProperty("--rotate", `${Math.random() * 720}deg`);
    bit.style.setProperty("--color", colors[i % colors.length]);
    bit.style.animationDelay = Math.random() * 0.15 + "s";
    holder.append(bit);
  }
  setTimeout(() => holder.replaceChildren(), 2100);
}
function renderRoute(animate = true) {
  const parts = location.hash.slice(1).split("/");
  const allowed = new Set(apps.map((a) => a[0]));
  current = {
    app: allowed.has(parts[0]) ? parts[0] : "home",
    section: parts[1] || "",
  };
  const renderers = { home, calendar, resume, about, mail, photos };
  main.innerHTML = renderers[current.app]();
  renderDock();
  document.title =
    current.app === "home"
      ? "Binafsha Bakhramova"
      : apps.find((a) => a[0] === current.app)[1] + " / Binafsha Bakhramova";
  if (animate) {
    main.classList.remove("view-enter");
    void main.offsetWidth;
    main.classList.add("view-enter");
  }
  window.scrollTo({ top: 0 });
  if (current.app === "calendar" && data.projects[current.section])
    openProject(current.section);
}
function route(app, section = "") {
  const hash = "#" + app + (section ? "/" + section : "");
  if (location.hash === hash) renderRoute(false);
  else location.hash = hash;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button,a");
  const thumb = event.target.closest("[data-inbox-attachment]");
  if (thumb) {
    const i = Number(thumb.dataset.inboxAttachment),
      a = emailAttachments(i);
    event.preventDefault();
    event.stopPropagation();
    if (a[0].url) window.open(a[0].url, "_blank", "noopener,noreferrer");
    else openMedia(a);
    return;
  }
  if (!button) return;
  if (button.hasAttribute("data-close")) {
    button.closest("dialog")?.close();
    return;
  }
  if (button.dataset.project) {
    openProject(button.dataset.project, button);
    return;
  }
  if (button.dataset.note) {
    route("resume", button.dataset.note);
    return;
  }
  if (button.dataset.email !== undefined) {
    route("mail", button.dataset.email);
    return;
  }
  if (button.dataset.album) {
    route("photos", button.dataset.album);
    return;
  }
  if (button.dataset.photo) {
    const list = currentPhotos();
    openMedia(
      list,
      list.findIndex((p) => p.id === button.dataset.photo),
    );
    return;
  }
  if (button.dataset.projectImage) {
    openMedia([projectImage(button.dataset.projectImage)]);
    return;
  }
  if (button.dataset.mailImage) {
    const [i, j] = button.dataset.mailImage.split(":").map(Number);
    openMedia(emailAttachments(i), j);
    return;
  }
  if (button.dataset.asset === "map") {
    event.preventDefault();
    openMedia([mapImage]);
    return;
  }
  if (button.dataset.mediaStep) {
    stepMedia(Number(button.dataset.mediaStep));
    return;
  }
  if (button.dataset.zoom) {
    zoomMedia(button.dataset.zoom);
    return;
  }
  switch (button.dataset.action) {
    case "reset-filters":
      filters.clear();
      ["data", "product", "leadership", "course"].forEach((x) =>
        filters.add(x),
      );
      main.innerHTML = calendar();
      break;
    case "note-search": {
      const input = main.querySelector(".notes-search");
      input.hidden = !input.hidden;
      if (!input.hidden) input.focus();
      break;
    }
    case "check-sudoku":
      checkSudoku(true);
      break;
    case "reset-sudoku":
      sudoku = [...initialSudoku];
      selectedCell = -1;
      solved = false;
      main.innerHTML = about();
      break;
    case "hint-sudoku": {
      let i = selectedCell;
      if (i < 0 || initialSudoku[i] || sudoku[i] === solution[i])
        i = sudoku.findIndex((v, j) => !initialSudoku[j] && v !== solution[j]);
      if (i >= 0) {
        sudoku[i] = solution[i];
        const cell = main.querySelector(`[data-cell="${i}"]`);
        cell.value = sudoku[i];
        cell.classList.remove("invalid");
        cell.focus();
        checkSudoku();
      }
      break;
    }
  }
});
main.addEventListener("change", (e) => {
  if (e.target.dataset.filter) {
    if (e.target.checked) filters.add(e.target.dataset.filter);
    else filters.delete(e.target.dataset.filter);
    main
      .querySelectorAll(".calendar-event")
      .forEach((el) =>
        el.classList.toggle("filtered-out", !filters.has(el.dataset.area)),
      );
  }
});
main.addEventListener("focusin", (e) => {
  if (e.target.dataset.cell !== undefined)
    selectedCell = Number(e.target.dataset.cell);
});
main.addEventListener("input", (e) => {
  if (e.target.dataset.cell !== undefined) {
    const i = Number(e.target.dataset.cell);
    if (initialSudoku[i]) return;
    e.target.value = e.target.value.replace(/[^1-4]/g, "").slice(-1);
    sudoku[i] = Number(e.target.value) || 0;
    e.target.classList.remove("invalid");
    checkSudoku();
  }
  if (e.target.classList.contains("mail-search")) {
    const term = e.target.value.toLowerCase();
    let count = 0;
    main.querySelectorAll(".mail-item").forEach((el) => {
      const m = data.emails[Number(el.dataset.email)],
        match = (m.sender + " " + m.subject + " " + m.body)
          .toLowerCase()
          .includes(term);
      el.hidden = !match;
      if (match) count++;
    });
    main.querySelector(".mail-total").textContent = count + " messages";
  }
  if (e.target.classList.contains("notes-search")) {
    const term = e.target.value.toLowerCase();
    main
      .querySelectorAll(".note-item")
      .forEach(
        (el) =>
          (el.hidden = !(
            noteNames[el.dataset.note] +
            " " +
            data.notes[el.dataset.note].body.text
          )
            .toLowerCase()
            .includes(term)),
      );
  }
});
main.addEventListener("keydown", (e) => {
  if (e.target.dataset.cell === undefined) return;
  const i = Number(e.target.dataset.cell);
  if (["Backspace", "Delete"].includes(e.key) && !initialSudoku[i]) {
    e.preventDefault();
    e.target.value = "";
    sudoku[i] = 0;
    solved = false;
    e.target.classList.remove("invalid");
  }
  const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[
    e.key
  ];
  if (delta !== undefined) {
    e.preventDefault();
    main
      .querySelector(`[data-cell="${Math.max(0, Math.min(15, i + delta))}"]`)
      ?.focus();
  }
});
document.addEventListener("keydown", (e) => {
  if (!mediaDialog.open) return;
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    stepMedia(-1);
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    stepMedia(1);
  }
  if (e.key === "+" || e.key === "=") {
    e.preventDefault();
    zoomMedia("in");
  }
  if (e.key === "-") {
    e.preventDefault();
    zoomMedia("out");
  }
});
for (const dialog of [projectDialog, mediaDialog, celebration])
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
projectDialog.addEventListener("close", () => {
  if (lastProjectOpener?.isConnected)
    lastProjectOpener.focus({ preventScroll: true });
});
mediaDialog.addEventListener("close", () => {
  if (media.opener?.isConnected) media.opener.focus({ preventScroll: true });
});
let drag = null;
mediaDialog.addEventListener("pointerdown", (e) => {
  const stage = e.target.closest(".media-stage");
  if (!stage || e.pointerType !== "mouse") return;
  drag = {
    stage,
    x: e.clientX,
    y: e.clientY,
    left: stage.scrollLeft,
    top: stage.scrollTop,
  };
  stage.setPointerCapture(e.pointerId);
  stage.classList.add("dragging");
});
mediaDialog.addEventListener("pointermove", (e) => {
  if (drag) {
    drag.stage.scrollLeft = drag.left - (e.clientX - drag.x);
    drag.stage.scrollTop = drag.top - (e.clientY - drag.y);
  }
});
function endDrag() {
  drag?.stage.classList.remove("dragging");
  drag = null;
}
mediaDialog.addEventListener("pointerup", endDrag);
mediaDialog.addEventListener("pointercancel", endDrag);
window.addEventListener("resize", () => {
  if (mediaDialog.open) resizeMedia();
});
window.addEventListener("hashchange", () => {
  projectDialog.close();
  mediaDialog.close();
  renderRoute();
});
async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Could not load ${path}`);
  return r.json();
}
try {
  [data, library, icons] = await Promise.all([
    loadJSON("assets/content/portfolio.json"),
    loadJSON("assets/photos/library.json"),
    loadJSON("assets/ui/icons.json"),
  ]);
  renderRoute();
} catch (error) {
  console.error(error);
  main.innerHTML = `<div class="loading"><h1>Binafsha Bakhramova</h1><p>The portfolio could not finish loading. Please refresh, or ${external(PDF, "download my résumé")}.</p><a href="mailto:${EMAIL}">Email me</a></div>`;
}
