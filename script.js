/* ==========================================================================
   Placement Preparation Portal — site behaviour (everything except the React home page).
   The home page lives in src/Home.jsx; this file owns the hash router, header,
   footer, the module / track / about pages, practice + quiz, and the auth forms.
   Accounts are stored in localStorage (see src/auth.js).
   ========================================================================== */
import { D } from "./src/data.js";
import * as accounts from "./src/auth.js";

(function () {
  "use strict";

  /* ------------------------------------------------------------ 3. auth -- */
  /* Thin wrapper over src/auth.js (localStorage JSON accounts). */
  var authApi = {
    user: accounts.getCurrentUser,
    login: accounts.login,
    register: accounts.register,
    logout: accounts.logout,
    requestReset: accounts.requestPasswordReset,
    isResetTokenValid: accounts.isResetTokenValid,
    resetPassword: accounts.resetPassword
  };

  /* --------------------------------------------- 4. theme + utilities ---- */
  var THEME_KEY = "cc-theme";
  var QUIZ_DURATION = 600; /* 10 minutes */

  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function setTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (e) { /* ignore */ }
    var btn = $("#themeToggle");
    if (btn) {
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  /* ------------------------------------------------- 5. header & footer -- */
  var NAV_ITEMS = [
    { route: "", label: "Home", key: "home" },
    { route: "aptitude", label: "Aptitude", key: "aptitude" },
    { route: "programming", label: "Programming", key: "programming" },
    { route: "core", label: "Core", key: "core" },
    { route: "hr", label: "HR", key: "hr" },
    { route: "about", label: "About", key: "about" }
  ];

  function buildChrome(key, authMode) {
    var header = $("#site-header");
    var footer = $("#site-footer");

    if (authMode) {
      /* Auth views stand alone: no navigation bar or footer around them. */
      if (header) header.innerHTML = "";
      if (footer) footer.innerHTML = "";
      return;
    }

    if (header) {
      header.innerHTML =
        '<header class="navbar"><div class="nav-inner">' +
        '<a class="brand" href="#/"><span class="brand-mark">P</span><span class="brand-name">Placement Preparation Portal</span></a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<div class="nav-right">' +
        '<nav class="nav-links" id="navLinks">' +
        NAV_ITEMS.map(function (item) {
          return '<a class="nav-link' + (item.key === key ? " active" : "") + '" href="#/' + item.route + '">' + item.label + "</a>";
        }).join("") +
        (authApi.user()
          ? '<button class="nav-link nav-auth-mobile js-logout" type="button">Log Out</button>'
          : '<a class="nav-link nav-auth-mobile" href="#/login">Log In</a><a class="nav-link nav-auth-mobile" href="#/register">Sign Up</a>') +
        "</nav>" +
        '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode"></button>' +
        (authApi.user()
          ? '<span class="nav-user" title="' + esc(authApi.user().email) + '">Hi, ' + esc(authApi.user().name) + '</span>' +
            '<button class="nav-cta js-logout" type="button">Log Out</button>'
          : '<a class="nav-cta" href="#/login">Log In</a><a class="nav-cta nav-cta-fill" href="#/register">Sign Up</a>') +
        "</div></div></header>";
    }

    if (footer) {
      footer.innerHTML =
        '<footer class="footer"><div class="container">' +
        '<div class="footer-grid">' +
        '<div><a class="brand" href="#/"><span class="brand-mark">P</span><span class="brand-name">Placement Preparation Portal</span></a>' +
        "<p>Prepare Smarter. Get Placed Faster.<br>Your all-in-one platform for placement preparation.</p></div>" +
        '<div><h3>Preparation</h3><a class="f-link" href="#/aptitude">Aptitude</a><a class="f-link" href="#/programming">Programming</a><a class="f-link" href="#/core">DSA</a></div>' +
        '<div><h3>Career</h3><a class="f-link" href="#/hr">HR Interview</a><a class="f-link" href="#/core">Core Subjects</a><a class="f-link" href="#/about">About</a></div>' +
        '<div><h3>Company</h3><a class="f-link" href="#/about">About</a><a class="f-link" href="#/about">Contact</a></div>' +
        "</div>" +
        '<div class="footer-bottom"><span>© 2026 Placement Preparation Portal. All Rights Reserved.</span>' +
        '<span><a href="#/about">Privacy</a><a href="#/about">Terms</a></span></div>' +
        "</div></footer>";
    }

    setTheme(document.documentElement.classList.contains("dark"));

    var toggle = $("#themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        setTheme(!document.documentElement.classList.contains("dark"));
      });
    }

    $$(".js-logout").forEach(function (btn) {
      btn.addEventListener("click", function () {
        authApi.logout();
        window.location.hash = "#/";
      });
    });

    var menu = $("#menuToggle");
    var links = $("#navLinks");
    if (menu && links) {
      menu.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        menu.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  /* ------------------------------------------------------------ scroll in */
  function initReveal() {
    var items = $$(".reveal").filter(function (el) { return !el.closest("#home-root"); });
    if (!items.length) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- 6. partials */
  function moduleCard(m, index) {
    return '<article class="card module-card reveal" style="transition-delay:' + (index * 70) + 'ms">' +
      '<div class="card-icon">' + m.icon + "</div>" +
      "<h3>" + esc(m.title) + "</h3>" +
      '<p class="desc">' + esc(m.description) + "</p>" +
      '<a class="card-link" href="#/module/' + m.id + '">View Module <span>→</span></a>' +
      "</article>";
  }

  function topicItem(topic) {
    return '<div class="topic-item">' + esc(topic) + "</div>";
  }

  function flowChart(flowchart) {
    return flowchart.steps.map(function (step, i) {
      var edge = i === 0 || i === flowchart.steps.length - 1 ? " edge" : "";
      return '<div class="flow-step' + edge + '"><span class="flow-num">' + (i + 1) + "</span>" +
        "<p>" + esc(step.title) + "</p><small>" + esc(step.detail) + "</small></div>" +
        (i < flowchart.steps.length - 1 ? '<div class="flow-arrow">↓</div>' : "");
    }).join("");
  }

  function categoryRoute(category) {
    var c = String(category || "").toLowerCase();
    if (c === "aptitude") return "#/aptitude";
    if (c === "programming") return "#/programming";
    if (c === "core") return "#/core";
    if (c === "hr") return "#/hr";
    return "#/";
  }

  /* ---------------------------------------------------- 6b. track pages -- */
  var TRACKS = {
    aptitude: {
      moduleId: "quantitative-aptitude",
      badge: "🧮 Aptitude",
      title: "Quantitative Aptitude",
      intro: "Practice quantitative aptitude, logical reasoning, verbal reasoning and data interpretation to ace the first round of every placement test.",
      headTitle: "Topics Covered",
      headText: "Comprehensive topic coverage across the aptitude section."
    },
    programming: {
      moduleId: "data-structures",
      badge: "💻 Programming",
      title: "Programming & DSA",
      intro: "Practice programming problems and strengthen your data structures and algorithms fundamentals across topic-wise questions.",
      headTitle: "Data Structures Topics",
      headText: "Master important data structures through topic-wise questions."
    },
    core: {
      moduleId: "dbms",
      badge: "💼 Core Subjects",
      title: "Core CS Subjects",
      intro: "Prepare for technical interviews with core computer science subjects — DBMS, Operating Systems, Computer Networks and OOP concepts.",
      headTitle: "DBMS Topics",
      headText: "Master database management systems with topic-wise practice."
    }
  };

  function renderTrack(key) {
    var cfg = TRACKS[key];
    if (!cfg) return;
    var m = D.modules[cfg.moduleId];
    $("#trackBadge").textContent = cfg.badge;
    $("#trackTitle").textContent = cfg.title;
    $("#trackIntro").textContent = cfg.intro;
    $("#trackHeadTitle").textContent = cfg.headTitle;
    $("#trackHeadText").textContent = cfg.headText;
    $("#trackTopics").innerHTML = m.topics.map(topicItem).join("");
    $("#trackAside").innerHTML = "<h3>" + esc(m.title) + "</h3><p>" + esc(m.description) + "</p>" +
      '<a class="btn btn-primary wfull" href="#/module/' + m.id + '">View Module →</a>';
  }

  /* ---------------------------------------------------- 6c. about page -- */
  function renderAbout() {
    var grid = $("#aboutModules");
    if (!grid) return;
    grid.innerHTML = D.moduleList.map(function (m) {
      return '<a class="link-tile" href="#/module/' + m.id + '"><span>' + m.icon + "</span>" +
        "<h3>" + esc(m.title) + "</h3><small>View Module →</small></a>";
    }).join("");
  }

  /* --------------------------------------------------- 6d. module page -- */
  function renderModule(id) {
    var m = D.modules[id];
    $("#moduleMain").hidden = !m;
    $("#moduleMissing").hidden = Boolean(m);
    if (!m) return;

    var content = D.moduleContent[id];
    var category = categoryRoute(m.category);

    $("#moduleCrumb").setAttribute("href", category);
    $("#moduleBack").setAttribute("href", category);
    $("#moduleIcon").textContent = m.icon;
    $("#moduleCategory").textContent = m.category;
    $("#moduleTitle").textContent = m.title;
    $("#moduleDescription").textContent = m.description;
    $("#moduleTopics").innerHTML = m.topics.map(topicItem).join("");

    if (content) {
      $("#guideOverview").textContent = content.overview;
      $("#guideFacts").innerHTML = content.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#guideFlowTitle").textContent = content.flowchart.title;
      $("#guideFlow").innerHTML = flowChart(content.flowchart);

      $$("#moduleActions [data-action]").forEach(function (btn) {
        btn.onclick = function (event) {
          event.preventDefault();
          var action = btn.getAttribute("data-action");
          if (action === "practice") openPractice(content.mcqs);
          else if (action === "quiz") openQuiz(content.quizMcqs);
          else document.getElementById("guide").scrollIntoView({ behavior: "smooth", block: "start" });
        };
      });
    }
  }

  /* --------------------------------------- 7. practice & quiz (panels) -- */
  var quizTimer = null;

  function stopQuizTimer() {
    if (quizTimer) { clearInterval(quizTimer); quizTimer = null; }
  }

  function closePanels() {
    stopQuizTimer();
    var mount = $("#actionPanel");
    if (mount) { mount.hidden = true; mount.innerHTML = ""; mount.onclick = null; }
  }

  function optionClass(index, question, state) {
    if (!state.answered) return "option";
    if (index === question.answer) return "option correct";
    if (index === state.selected) return "option wrong";
    return "option dim";
  }

  function practiceMarkup(state, mcqs) {
    var q = mcqs[state.idx];
    var head = '<div class="panel-head"><div class="panel-title"><span class="ico">✎</span>' +
      "<div><h3>Practice Mode</h3><p>Instant feedback after every answer</p></div></div>" +
      '<button class="icon-btn" type="button" data-close aria-label="Close practice">✕</button></div>';

    if (state.done) {
      var pct = Math.round((state.score / mcqs.length) * 100);
      return '<div class="panel">' + head + '<div class="center">' +
        '<p class="muted">Practice complete</p>' +
        '<p class="big-score">' + state.score + "<span>/" + mcqs.length + "</span></p>" +
        '<p class="muted">You scored ' + pct + "% correct.</p>" +
        '<div class="panel-actions end"><button class="btn btn-primary" type="button" data-restart>Practice Again</button>' +
        '<button class="btn btn-plain" type="button" data-close>Close</button></div></div></div>';
    }

    var answered = state.answered;
    var feedback = answered
      ? '<div class="feedback ' + (state.selected === q.answer ? "ok" : "bad") + '">' +
        "<span>" + (state.selected === q.answer ? "✓" : "✕") + "</span><span><b>" +
        (state.selected === q.answer ? "Correct!" : "Not quite.") + "</b> " + esc(q.explanation) + "</span></div>"
      : "";

    return '<div class="panel">' + head +
      '<div class="q-meta"><span>Question ' + (state.idx + 1) + " of " + mcqs.length + "</span>" +
      '<span>Score: <b>' + state.score + "</b></span></div>" +
      '<div class="q-bar"><i style="width:' + (((state.idx + (answered ? 1 : 0)) / mcqs.length) * 100) + '%"></i></div>' +
      '<p class="q-text">' + esc(q.q) + "</p>" +
      '<div class="options">' + q.options.map(function (opt, i) {
        return '<button class="' + optionClass(i, q, state) + '" type="button" data-opt="' + i + '">' + esc(opt) + "</button>";
      }).join("") + "</div>" + feedback +
      '<div class="panel-actions"><button class="btn btn-primary" type="button" data-next' + (answered ? "" : " disabled") + ">" +
      (state.idx + 1 >= mcqs.length ? "See Results" : "Next Question") + " →</button></div></div>";
  }

  function openPractice(mcqs) {
    if (!mcqs || !mcqs.length) return;
    var mount = $("#actionPanel");
    var state = { idx: 0, selected: null, answered: false, score: 0, done: false };

    function draw() { mount.innerHTML = practiceMarkup(state, mcqs); }

    mount.onclick = function (event) {
      var target = event.target;
      if (target.closest("[data-close]")) { closePanels(); return; }
      if (target.closest("[data-restart]")) {
        state = { idx: 0, selected: null, answered: false, score: 0, done: false };
        draw();
        return;
      }
      var opt = target.closest("[data-opt]");
      if (opt && !state.answered) {
        state.selected = Number(opt.getAttribute("data-opt"));
        state.answered = true;
        if (state.selected === mcqs[state.idx].answer) state.score += 1;
        draw();
        return;
      }
      if (target.closest("[data-next]") && state.answered) {
        if (state.idx + 1 >= mcqs.length) state.done = true;
        else { state.idx += 1; state.selected = null; state.answered = false; }
        draw();
      }
    };

    mount.hidden = false;
    draw();
    mount.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function formatTime(seconds) {
    var m = String(Math.floor(seconds / 60)).padStart(2, "0");
    var s = String(seconds % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function quizMarkup(state, mcqs) {
    var head = '<div class="panel-head"><div class="panel-title violet"><span class="ico">?</span>' +
      "<div><h3>Timed Quiz</h3><p>" + mcqs.length + " questions · " + QUIZ_DURATION / 60 + " minutes</p></div></div>" +
      '<button class="icon-btn" type="button" data-close aria-label="Close quiz">✕</button></div>';

    if (!state.started) {
      return '<div class="panel">' + head + '<div class="center">' +
        '<p class="muted">Answer all ' + mcqs.length + " questions before the timer runs out. Your score updates as you answer correctly, and the full results appear at the end.</p>" +
        '<button class="btn btn-violet" type="button" data-start style="margin-top:24px">Start Quiz →</button></div></div>';
    }

    if (state.finished) {
      var score = state.answers.reduce(function (acc, answer, i) {
        return acc + (answer !== null && answer === mcqs[i].answer ? 1 : 0);
      }, 0);
      var pct = Math.round((score / mcqs.length) * 100);
      var review = mcqs.map(function (item, i) {
        var chosen = state.answers[i];
        var right = chosen === item.answer;
        return '<div class="review-item"><p class="q">' + (right ? "✓" : "✕") + " " + (i + 1) + ". " + esc(item.q) + "</p>" +
          '<p class="a">Your answer: <b class="' + (right ? "ok" : "bad") + '">' +
          (chosen === null ? "Not answered" : esc(item.options[chosen])) + "</b></p>" +
          (right ? "" : '<p class="a">Correct answer: <b class="ok">' + esc(item.options[item.answer]) + "</b></p>") +
          '<p class="a">' + esc(item.explanation) + "</p></div>";
      }).join("");

      return '<div class="panel">' + head + '<div class="center">' +
        '<p style="font-size:28px">🏆</p><p class="muted">Quiz complete</p>' +
        '<p class="big-score violet">' + score + "<span>/" + mcqs.length + "</span></p>" +
        '<p class="muted">You scored ' + pct + "%.</p>" +
        '<div class="panel-actions end"><button class="btn btn-violet" type="button" data-restart>Retake Quiz</button>' +
        '<button class="btn btn-plain" type="button" data-close>Close</button></div></div>' +
        '<div class="review">' + review + "</div></div>";
    }

    var q = mcqs[state.idx];
    var committed = state.answers.reduce(function (acc, answer, i) {
      return acc + (answer !== null && answer === mcqs[i].answer ? 1 : 0);
    }, 0);
    var liveScore = committed + (state.selected !== null && state.selected === q.answer ? 1 : 0);

    return '<div class="panel">' + head +
      '<div class="timer-bar"><span class="clock">⏱ <span data-timer>' + formatTime(state.timeLeft) + "</span></span>" +
      '<span class="score">Score: <b>' + liveScore + "</b></span></div>" +
      '<div class="q-meta violet"><span>Question ' + (state.idx + 1) + " of " + mcqs.length + "</span></div>" +
      '<div class="q-bar"><i class="violet" style="width:' + ((state.idx / mcqs.length) * 100) + '%"></i></div>' +
      '<p class="q-text">' + esc(q.q) + "</p>" +
      '<div class="options">' + q.options.map(function (opt, i) {
        return '<button class="option violet-hover' + (state.selected === i ? " picked" : "") + '" type="button" data-pick="' + i + '">' + esc(opt) + "</button>";
      }).join("") + "</div>" +
      '<div class="panel-actions"><button class="btn btn-violet" type="button" data-next' + (state.selected === null ? " disabled" : "") + ">" +
      (state.idx + 1 >= mcqs.length ? "Submit Quiz" : "Next Question") + " →</button></div></div>";
  }

  function openQuiz(mcqs) {
    if (!mcqs || !mcqs.length) return;
    var mount = $("#actionPanel");
    var state = { started: false, finished: false, idx: 0, selected: null, timeLeft: QUIZ_DURATION, answers: mcqs.map(function () { return null; }) };

    function draw() { mount.innerHTML = quizMarkup(state, mcqs); }

    function tick() {
      state.timeLeft -= 1;
      var box = mount.querySelector("[data-timer]");
      if (box) box.textContent = formatTime(Math.max(state.timeLeft, 0));
      if (state.timeLeft <= 0) {
        if (state.selected !== null) state.answers[state.idx] = state.selected;
        state.finished = true;
        stopQuizTimer();
        draw();
      }
    }

    mount.onclick = function (event) {
      var target = event.target;
      if (target.closest("[data-close]")) { closePanels(); return; }
      if (target.closest("[data-start]")) {
        state.started = true;
        draw();
        stopQuizTimer();
        quizTimer = setInterval(tick, 1000);
        return;
      }
      if (target.closest("[data-restart]")) {
        state = { started: false, finished: false, idx: 0, selected: null, timeLeft: QUIZ_DURATION, answers: mcqs.map(function () { return null; }) };
        stopQuizTimer();
        draw();
        return;
      }
      var pick = target.closest("[data-pick]");
      if (pick) {
        state.selected = Number(pick.getAttribute("data-pick"));
        draw();
        return;
      }
      if (target.closest("[data-next]") && state.selected !== null) {
        state.answers[state.idx] = state.selected;
        if (state.idx + 1 >= mcqs.length) {
          state.finished = true;
          stopQuizTimer();
        } else {
          state.idx += 1;
          state.selected = null;
        }
        draw();
      }
    };

    mount.hidden = false;
    draw();
    mount.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* -------------------------------------------------------- 8. auth views */
  var resetToken = "";

  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function wireAuthViews() {
    /* login */
    var loginForm = $("#loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#loginError");
        var btn = $("#loginSubmit");
        error.hidden = true;
        btn.disabled = true;
        btn.textContent = "Logging in...";
        authApi.login($("#loginEmail").value, $("#loginPassword").value)
          .then(function () {
            loginForm.reset();
            window.location.hash = "#/";
          })
          .catch(function (err) {
            showError(error, (err && err.message) || "Invalid email or password. Please try again.");
          })
          .then(function () {
            btn.disabled = false;
            btn.textContent = "Log in";
          });
      });
    }

    /* register */
    var registerForm = $("#registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#registerError");
        var btn = $("#registerSubmit");
        error.hidden = true;

        if ($("#registerPassword").value !== $("#registerConfirm").value) {
          showError(error, "Passwords do not match");
          return;
        }

        btn.disabled = true;
        btn.textContent = "Creating account...";
        authApi.register($("#registerName").value, $("#registerEmail").value, $("#registerPassword").value)
          .then(function () {
            registerForm.reset();
            window.location.hash = "#/";
          })
          .catch(function (err) {
            showError(error, (err && err.message) || "Could not create account. Please try again.");
          })
          .then(function () {
            btn.disabled = false;
            btn.textContent = "Create account";
          });
      });
    }

    /* forgot password: no mail server in a prototype, so go straight to the reset form */
    var forgotForm = $("#forgotForm");
    if (forgotForm) {
      forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#forgotError");
        error.hidden = true;
        try {
          var token = authApi.requestReset($("#forgotEmail").value);
          forgotForm.reset();
          window.location.hash = "#/reset-password?token=" + encodeURIComponent(token);
        } catch (err) {
          showError(error, (err && err.message) || "Could not start password reset.");
        }
      });
    }

    /* new password */
    var resetForm = $("#resetForm");
    if (resetForm) {
      resetForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#resetError");
        var btn = $("#resetSubmit");
        error.hidden = true;

        if ($("#resetPassword").value !== $("#resetConfirm").value) {
          showError(error, "Passwords do not match");
          return;
        }

        btn.disabled = true;
        btn.textContent = "Resetting...";
        authApi.resetPassword(resetToken, $("#resetPassword").value)
          .then(function () {
            resetForm.reset();
            window.location.hash = "#/login";
          })
          .catch(function (err) {
            showError(error, (err && err.message) || "Failed to reset password");
          })
          .then(function () {
            btn.disabled = false;
            btn.textContent = "Reset password";
          });
      });
    }
  }

  function showResetView(token) {
    var block = $("#resetFormBlock");
    var invalid = $("#resetInvalid");
    resetToken = token || "";
    var ok = Boolean(resetToken) && authApi.isResetTokenValid(resetToken);
    block.hidden = !ok;
    invalid.hidden = ok;
  }

  /* ---------------------------------------------------------- 9. router -- */
  var AUTH_VIEWS = {
    "login": { view: "#view-login", title: "Log in" },
    "register": { view: "#view-register", title: "Create account" },
    "forgot-password": { view: "#view-forgot", title: "Reset password" },
    "reset-password": { view: "#view-reset", title: "New password" }
  };

  function parseHash() {
    var raw = window.location.hash.replace(/^#\/?/, "");
    var qi = raw.indexOf("?");
    var query = new URLSearchParams(qi >= 0 ? raw.slice(qi) : "");
    var path = qi >= 0 ? raw.slice(0, qi) : raw;
    var parts = path.split("/").filter(Boolean);
    return { name: parts[0] || "", param: parts[1] || "", query: query };
  }

  function showView(selector) {
    $$("main .view").forEach(function (el) {
      el.hidden = "#" + el.id !== selector;
    });
  }

  var currentNavKey = "home";

  function activate() {
    var r = parseHash();
    var view = "#view-home";
    var title = "Placement Preparation Portal";
    var navKey = "home";
    var authMode = false;

    closePanels();

    if (TRACKS[r.name]) {
      view = "#view-track";
      title = TRACKS[r.name].title + " — Placement Preparation Portal";
      navKey = r.name;
      renderTrack(r.name);
    } else if (r.name === "hr") {
      view = "#view-hr";
      title = "HR Interview — Placement Preparation Portal";
      navKey = "hr";
    } else if (r.name === "about") {
      view = "#view-about";
      title = "About — Placement Preparation Portal";
      navKey = "about";
      renderAbout();
    } else if (r.name === "module") {
      view = "#view-module";
      var m = D.modules[r.param];
      title = (m ? m.title : "Module not found") + " — Placement Preparation Portal";
      navKey = m ? String(m.category).toLowerCase() : "home";
      renderModule(r.param);
    } else if (AUTH_VIEWS[r.name]) {
      if (authApi.user() && (r.name === "login" || r.name === "register")) {
        window.location.hash = "#/";
        return;
      }
      view = AUTH_VIEWS[r.name].view;
      title = AUTH_VIEWS[r.name].title + " — Placement Preparation Portal";
      authMode = true;
      if (r.name === "reset-password") showResetView(r.query.get("token"));
    }

    showView(view);
    document.title = title;
    document.body.classList.toggle("auth-mode", authMode);
    currentNavKey = navKey;
    buildChrome(navKey, authMode);
    initReveal();
    window.scrollTo(0, 0);
  }

  wireAuthViews();
  window.addEventListener("hashchange", activate);
  window.addEventListener(accounts.AUTH_EVENT, function () {
    /* Re-render the header so Log In / Log Out matches the session. */
    buildChrome(currentNavKey, document.body.classList.contains("auth-mode"));
  });
  activate();
})();
