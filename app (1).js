/* Builds the page from content.js. You normally don't need to edit this file. */
(function () {
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };
  var fmtDate = function (iso) {
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  /* top bar */
  var notices = S.notices.map(esc).join(" &nbsp;|&nbsp; ");
  $("topbar").innerHTML =
    "<span>📞 " + esc(S.phone) + "</span><span>✉ " + esc(S.email) + "</span>" +
    '<div class="ticker"><span>' + notices + "</span></div><span class='pay'>Pay Online Fee</span>";

  /* header + nav + mega menu */
  var nav = S.menu.map(function (m) {
    var cls = m === S.activeMenu ? "active" : "";
    return '<li><a href="#" class="' + cls + '" data-mega="' + (m === S.activeMenu) + '">' + esc(m) + "</a></li>";
  }).join("");
  var mega = Object.keys(S.societies).map(function (h) {
    return "<div><h4>" + esc(h.replace(/ \(\d\)$/, "")) + "</h4><ul>" +
      S.societies[h].map(function (n) { return '<li class="' + (n === "R&D Cell" ? "me" : "") + '">' + esc(n) + "</li>"; }).join("") +
      "</ul></div>";
  }).join("");
  $("header").innerHTML =
    '<div class="logo"><div class="seal">GTBIT<br>LOGO</div><div><b>GURU TEGH BAHADUR<br>INSTITUTE OF TECHNOLOGY</b><small>AFFILIATED TO GGSIPU &amp; APPROVED BY AICTE</small></div></div>' +
    '<button class="menu-btn" id="mb">☰</button>' +
    '<nav id="nav"><ul><li><a href="#" class="home">🏠</a></li>' + nav + "</ul></nav>" +
    '<div class="mega" id="mega">' + mega + "</div>";

  $("mb").onclick = function () { $("nav").classList.toggle("open"); };
  document.querySelectorAll("[data-mega=true]").forEach(function (a) {
    a.onclick = function (e) { e.preventDefault(); $("mega").classList.toggle("open"); };
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#mega") && !e.target.closest("[data-mega=true]")) $("mega").classList.remove("open");
  });

  /* banner / hero */
  $("pageTitle").textContent = S.pageTitle;
  $("crumb").textContent = "» " + S.pageTitle;
  document.title = S.pageTitle + " - GTBIT";
  if (S.bannerImage) $("banner").style.backgroundImage = "linear-gradient(rgba(10,70,90,.75),rgba(10,60,80,.8)),url(" + S.bannerImage + ")";
  var hero = $("hero");
  if (S.heroImage) { hero.style.backgroundImage = "url(" + S.heroImage + ")"; hero.innerHTML = ""; }
  else hero.innerHTML = "<div><h2>" + esc(S.tagline).replace(/AICTE/, "<em>AICTE</em>") + "</h2><p>" + esc(S.pageTitle) + " · GTBIT</p></div>";

  /* tabs */
  var tabs = [["overview", "Overview"], ["coordinators", "Faculty Coordinators"], ["webinars", "Webinars"], ["events", "Events"], ["achievements", "Achievements"]];
  $("tabs").innerHTML = tabs.map(function (t, i) { return '<button data-t="' + t[0] + '" class="' + (i ? "" : "on") + '">' + t[1] + "</button>"; }).join("");
  $("tabs").onclick = function (e) {
    var b = e.target.closest("button"); if (!b) return;
    document.querySelectorAll(".tabs button,.panel").forEach(function (x) { x.classList.remove("on"); });
    b.classList.add("on"); $(b.dataset.t).classList.add("on");
  };

  /* overview */
  var facts = Object.keys(S.facts).map(function (k) { return "<div><b>" + esc(k) + ":</b> " + esc(S.facts[k]) + "</div>"; }).join("");
  $("overview").innerHTML =
    "<h3>" + esc(S.fullName) + "</h3><div class='facts'><div class='tag'>\"" + esc(S.tagline) + "\"</div>" + facts + "</div>" +
    "<h3>" + esc(S.aboutTitle) + "</h3>" + S.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    '<div class="cards">' + S.pillars.map(function (p) { return '<div class="card"><b>' + esc(p.title) + "</b><span>" + esc(p.text) + "</span></div>"; }).join("") + "</div>" +
    "<h3>By the numbers</h3>" +
    '<div class="cards">' + S.stats.map(function (s) { return '<div class="card stat"><b>' + esc(s.value) + "</b> " + esc(s.label) + "<br><span>" + esc(s.text) + "</span></div>"; }).join("") + "</div>" +
    "<h3>How we got here</h3><div class='tl'>" +
    S.timeline.map(function (t) { return '<div><div class="y">' + esc(t.year) + "</div><div><b>" + esc(t.title) + "</b><span>" + esc(t.text) + "</span></div></div>"; }).join("") + "</div>";

  /* generic list panels */
  function list(id, items, build, empty) {
    $(id).innerHTML = items.length ? '<div class="list">' + items.map(build).join("") + "</div>" : "<p>" + empty + "</p>";
  }
  var link = function (l) { return l && l !== "#" ? ' <a href="' + esc(l) + '">View →</a>' : ""; };
  list("coordinators", S.coordinators, function (c) { return '<div class="item"><b>' + esc(c.name) + "</b><span>" + esc(c.role) + " · " + esc(c.dept) + "</span></div>"; }, "Coming soon.");
  list("webinars", S.webinars, function (w) { return '<div class="item"><div class="d">' + fmtDate(w.date) + "</div><b>" + esc(w.title) + "</b><span>" + esc(w.speaker) + "</span>" + link(w.link) + "</div>"; }, "No webinars yet.");
  list("events", S.events, function (e) { return '<div class="item"><div class="d">' + fmtDate(e.date) + "</div><b>" + esc(e.title) + "</b><span>" + esc(e.text) + "</span>" + link(e.link) + "</div>"; }, "No events yet.");
  list("achievements", S.achievements, function (a) { return '<div class="item"><div class="d">' + esc(a.year) + "</div><b>" + esc(a.title) + "</b><span>" + esc(a.text) + "</span></div>"; }, "Coming soon.");

  /* join */
  var ext = Object.keys(S.links).map(function (k) { return '<a href="' + esc(S.links[k]) + '">' + esc(k) + "</a>"; }).join("");
  $("join").innerHTML = "<h3>Want to be part of this story?</h3><p>Every member started exactly where you are now - curious, and one form away from getting involved.</p>" +
    '<a class="solid" href="' + esc(S.joinLink) + '">Join the Cell →</a><a href="mailto:' + esc(S.contactEmail) + '">Contact Us</a><br>' + ext;

  /* placed + footer */
  $("companies").innerHTML = S.companies.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("");
  var F = S.footer, ul = function (a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; };
  $("footer").innerHTML = '<div class="fgrid"><div><h5>ABOUT US</h5><p>' + esc(F.about) + "</p><p>📍 " + esc(F.address) + "</p><p>✉ " + esc(F.email) + "</p><p>📞 " + esc(F.phone) + "</p></div>" +
    "<div><h5>QUICK LINKS</h5>" + ul(F.quick) + "</div><div><h5>IMPORTANT LINKS</h5>" + ul(F.important) + "</div><div><h5>BRANCHES</h5>" + ul(F.branches) + "</div></div>";
})();
