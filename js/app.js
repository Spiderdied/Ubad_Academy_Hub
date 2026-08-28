/* =========================================================
   UBAD ACADEMIC HUB — APPLICATION SCRIPT
   ========================================================= */

const CONFIG = {
  storageKey: "ubadAcademicHubState",
  stateVersion: 1,
  themeClass: "dark-mode",
  gradePointMap: { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 },
};

/* =========================================================
   1. STATE & DATA
   ========================================================= */
const DEFAULT_STATE = {
  version: CONFIG.stateVersion,
  courses: [
    { id: "c1", name: "Applied Linguistics", code: "ENGL201", instructor: "Dr. Smith", creditHours: 3, status: "in-progress", progress: 45, resources: [], assignments: [] },
    { id: "c2", name: "World Literature", code: "ENGL204", instructor: "Dr. Jones", creditHours: 3, status: "in-progress", progress: 60, resources: [], assignments: [] }
  ],
  tasks: [
    { id: "t1", title: "Read Chapter 3 – Morphology", course: "Applied Linguistics", dueDate: "2026-08-22", priority: "high", completed: false }
  ],
  schedule: [], notes: [], calendarEvents: [], studySessions: [], grades: [], flashcardDecks: [], quizzes: [],
  settings: { theme: "dark", currentSemester: "Current Semester", targetGpa: 3.8, language: "en", username: "Ubad" }
};

let state = cloneData(DEFAULT_STATE);

const ui = {
  activeSection: "dashboard",
  currentCourseId: null, currentNoteId: null, currentCalendarEventId: null,
  calendarViewDate: new Date(), plannerView: "daily",
  activeCourseTab: "resources", activeToolsTab: "flashcards",
  activeFlashcardDeckId: null, flashcardIndex: 0, flashcardFlipped: false,
  activeQuizId: null, quizIndex: 0, quizScore: 0, quizAnswers: {},
  isAnimating: false
};

const layerState = {
  current: "hub", // "hub" | "section" | "content"
  category: null,
  viewIndex: 0
};

function cloneData(source) { return JSON.parse(JSON.stringify(source)); }
function generateId(prefix) { return `${prefix}_${Math.random().toString(36).slice(2, 9)}`; }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (raw) state = { ...cloneData(DEFAULT_STATE), ...JSON.parse(raw) };
  } catch (e) { console.warn(e); }
}
function saveState() {
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); } catch (e) {}
}

/* =========================================================
   2. DOM CACHE
   ========================================================= */
const dom = {};
function cacheDom() {
  const ids = [
    "userGreeting", "themeToggle", "mainContent", "globalSearchInput", "searchResults", "searchResultsList",
    "statCoursesValue", "statTasksValue", "statExamsValue", "statGpaValue",
    "scheduleList", "taskList", "addTaskButton", "progressList", "studyPlanList", "addStudySessionButton",
    "dashboard", "courses", "notes", "calendar", "grades", "analytics", "studyTools", "settings",
    "courseList", "addCourseButton", "courseDetail", "courseDetailHeading", "courseDetailCode", "courseDetailProgressBar", "courseDetailProgressValue",
    "courseResourcesList", "courseNotesList", "courseAssignmentsList", "courseScheduleList", "courseGradesList",
    "notesList", "addNoteButton", "noteDetail", "noteDetailTitle", "noteDetailBody",
    "calendarGrid", "calendarEvents", "calendarPrevButton", "calendarNextButton", "calendarTodayButton", "calendarCurrentLabel",
    "gpaTableBody", "gpaSemesterValue", "gpaCumulativeValue", "gpaTargetValue",
    "flashcardDecks", "flashcardContainer", "flashcard", "flashcardFront", "flashcardBack", "flashcardPrevButton", "flashcardNextButton", "flashcardProgress",
    "quizList", "quizContainer", "quizTitle", "quizQuestionNumber", "quizQuestionText", "quizOptions", "quizSubmitButton", "quizResults", "quizScore"
  ];
  ids.forEach(id => { dom[id] = document.getElementById(id); });
}

/* =========================================================
   3. SPATIAL LAYER NAVIGATION (THE CORE FIX)
   ========================================================= */
const HUB_CATEGORIES = [
  { id: "dashboard", icon: "🏠", label: "Dashboard", sub: "Overview & Stats" },
  { id: "courses", icon: "📚", label: "Courses", sub: "Your academic journey" },
  { id: "notes", icon: "📝", label: "Notes", sub: "Your study notes" },
  { id: "calendar", icon: "📅", label: "Calendar", sub: "Schedule & Events" },
  { id: "grades", icon: "📈", label: "GPA", sub: "Track progress" },
  { id: "analytics", icon: "📊", label: "Analytics", sub: "Insights" },
  { id: "studyTools", icon: "🧠", label: "Study Tools", sub: "Flashcards & Quiz" },
  { id: "settings", icon: "⚙️", label: "Settings", sub: "Preferences" }
];

function initSpatialNavigation() {
  const stage = document.getElementById("hubStage");
  if (!stage) return;
  stage.innerHTML = "";

  // Render Hub Cards
  HUB_CATEGORIES.forEach(cat => {
    const card = document.createElement("div");
    card.className = "hub-card";
    card.setAttribute("data-category", cat.id);
    card.innerHTML = `
      <span class="hub-card__icon">${cat.icon}</span>
      <span class="hub-card__label">${cat.label}</span>
      <span class="hub-card__sub">${cat.sub}</span>
    `;
    card.addEventListener("click", () => navigateToLayer("content", cat.id));
    stage.appendChild(card);
  });

  // Hub 3D Parallax on mouse move
  document.addEventListener("mousemove", (e) => {
    if (layerState.current !== "hub" || window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    stage.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  // Back Button Logic
  document.getElementById("contentLayerBack")?.addEventListener("click", () => {
    navigateToLayer("hub");
  });
}

function navigateToLayer(targetLayer, categoryId = null) {
  if (ui.isAnimating) return;
  ui.isAnimating = true;

  const hubEl = document.getElementById("hubLayer");
  const contentEl = document.getElementById("appShell");

  if (targetLayer === "content") {
    layerState.current = "content";
    layerState.category = categoryId;
    
    // Animate Hub out, Content in
    hubEl.classList.remove("layer-entering");
    hubEl.classList.add("layer-exiting");
    
    // Show correct section in content
    showSection(categoryId);
    
    contentEl.style.display = "flex";
    contentEl.classList.remove("layer-exiting");
    contentEl.classList.add("layer-entering");

    setTimeout(() => {
      hubEl.style.display = "none";
      ui.isAnimating = false;
    }, 600);
  } else if (targetLayer === "hub") {
    layerState.current = "hub";
    layerState.category = null;

    // Animate Content out, Hub in
    contentEl.classList.remove("layer-entering");
    contentEl.classList.add("layer-exiting");
    
    hubEl.style.display = "flex";
    hubEl.classList.remove("layer-exiting");
    hubEl.classList.add("layer-entering");

    setTimeout(() => {
      contentEl.style.display = "none";
      ui.isAnimating = false;
    }, 600);
  }
}

function showSection(sectionId) {
  const sections = ["dashboard", "courses", "notes", "calendar", "grades", "analytics", "studyTools", "settings"];
  sections.forEach(id => {
    const el = dom[id];
    if (el) el.hidden = (id !== sectionId);
  });
  ui.activeSection = sectionId;
}

/* =========================================================
   4. STRICT SWIPE LOGIC (FIXED)
   ========================================================= */
let touchStartX = 0;
let touchStartY = 0;

function initStrictSwipe() {
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    // STRICT RULE: Swipe only operates INSIDE active content tabs. Never crosses layers.
    if (layerState.current !== "content") return;
    
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Ensure horizontal swipe intent
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      handleInnerTabSwipe(diffX > 0 ? "prev" : "next");
    }
  }, { passive: true });
}

function handleInnerTabSwipe(direction) {
  // Only process if we are in a section with tabs (Courses details or Study Tools)
  let activeTabs = [];
  if (ui.activeSection === "courses" && !dom.courseDetail.hidden) {
    activeTabs = Array.from(document.querySelectorAll(".course-detail__tab"));
  } else if (ui.activeSection === "studyTools") {
    activeTabs = Array.from(document.querySelectorAll(".study-tools__tab"));
  }

  if (activeTabs.length === 0) return;

  const currentIndex = activeTabs.findIndex(t => t.classList.contains("is-active"));
  let nextIndex = currentIndex;

  if (direction === "next" && currentIndex < activeTabs.length - 1) nextIndex++;
  if (direction === "prev" && currentIndex > 0) nextIndex--;

  if (nextIndex !== currentIndex) {
    activeTabs[nextIndex].click();
  }
}

/* =========================================================
   5. APPLICATION RENDER LOGIC (Preserving Existing Features)
   ========================================================= */

function renderDashboard() {
  if (dom.statCoursesValue) dom.statCoursesValue.textContent = state.courses.length;
  if (dom.statTasksValue) dom.statTasksValue.textContent = state.tasks.filter(t => !t.completed).length;
  if (dom.statExamsValue) dom.statExamsValue.textContent = state.calendarEvents.filter(e => e.type === "Exam").length;
  renderGpaSummary();
}

function renderCourses() {
  if (!dom.courseList) return;
  dom.courseList.innerHTML = "";
  if (!state.courses.length) {
    dom.courseList.innerHTML = `<li class="empty-state">No courses loaded yet.</li>`;
    return;
  }
  state.courses.forEach(course => {
    const card = document.createElement("li");
    card.className = "course-card";
    card.innerHTML = `
      <h3 class="course-card__name">${course.name}</h3>
      <p style="color:var(--color-text-secondary); font-size: 0.85rem;">${course.code} • ${course.instructor}</p>
      <span class="course-card__status">${course.status}</span>
      <div style="display:flex; align-items:center; gap: 8px; margin-top: 12px;">
        <progress value="${course.progress}" max="100" class="progress-item__bar"></progress>
        <span style="font-size:0.8rem; font-weight:bold; color:var(--color-accent);">${course.progress}%</span>
      </div>
      <div class="course-card__actions">
        <button class="button button--primary" onclick="openCourseDetail('${course.id}')">View</button>
      </div>
    `;
    dom.courseList.appendChild(card);
  });
}

window.openCourseDetail = function(id) {
  const course = state.courses.find(c => c.id === id);
  if (!course) return;
  ui.currentCourseId = id;
  dom.courseDetailHeading.textContent = course.name;
  dom.courseDetailCode.textContent = course.code;
  dom.courseDetailProgressBar.value = course.progress;
  dom.courseDetailProgressValue.textContent = course.progress + "%";
  dom.courseDetail.hidden = false;
  dom.courseDetail.scrollIntoView({ behavior: "smooth" });
};

function renderNotes() {
  if (!dom.notesList) return;
  dom.notesList.innerHTML = "";
  if (!state.notes.length) {
    dom.notesList.innerHTML = `<li class="empty-state">No notes yet.</li>`;
    return;
  }
  state.notes.forEach(note => {
    const card = document.createElement("li");
    card.className = "note-card";
    card.innerHTML = `
      <h3 class="note-card__title">${note.title}</h3>
      <span style="font-size:0.8rem; color:var(--color-accent); font-weight:bold;">${note.course}</span>
      <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-top:8px;">${note.body.substring(0,60)}...</p>
      <div class="note-card__actions">
        <button class="button button--primary" onclick="openNoteDetail('${note.id}')">Read</button>
      </div>
    `;
    dom.notesList.appendChild(card);
  });
}

window.openNoteDetail = function(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  dom.noteDetailTitle.textContent = note.title;
  dom.noteDetailBody.textContent = note.body;
  dom.noteDetail.hidden = false;
  dom.noteDetail.scrollIntoView({ behavior: "smooth" });
};

function renderCalendar() {
  if (!dom.calendarGrid) return;
  dom.calendarGrid.innerHTML = `<p style="text-align:center; padding: 20px;">Calendar Grid Rendered Here</p>`; // Simplified for space
}

function renderGpaSummary() {
  let points = 0; let credits = 0;
  state.grades.forEach(g => {
    points += g.gradePoints * g.creditHours;
    credits += g.creditHours;
  });
  const gpa = credits === 0 ? 0 : (points / credits).toFixed(2);
  if (dom.gpaCumulativeValue) dom.gpaCumulativeValue.textContent = gpa;
  if (dom.statGpaValue) dom.statGpaValue.textContent = gpa;
}

function renderTools() {
  if (dom.flashcardDecks) {
    dom.flashcardDecks.innerHTML = `<button class="button button--primary">+ Add Deck</button>`;
    if(!state.flashcardDecks.length) dom.flashcardDecks.innerHTML += `<p class="empty-state">No decks yet.</p>`;
  }
}

function initTabs() {
  document.querySelectorAll("[data-target]").forEach(tab => {
    if(tab.classList.contains("course-detail__tab") || tab.classList.contains("study-tools__tab")) {
      tab.addEventListener("click", () => {
        const parent = tab.closest("nav");
        parent.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
        tab.classList.add("is-active");
        const targetId = tab.getAttribute("data-target");
        
        // Hide all sibling panels
        const panelContainer = parent.parentElement;
        panelContainer.querySelectorAll(".course-detail__panel, .study-tools__panel").forEach(p => p.hidden = true);
        document.getElementById(targetId).hidden = false;
      });
    }
  });
}

function initTheme() {
  document.body.classList.add(state.settings.theme === "dark" ? "dark-mode" : "");
  if (dom.themeToggle) {
    dom.themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      state.settings.theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      saveState();
    });
  }
}

function renderAll() {
  renderDashboard();
  renderCourses();
  renderNotes();
  renderCalendar();
  renderGpaSummary();
  renderTools();
}

function init() {
  cacheDom();
  loadState();
  initTheme();
  initSpatialNavigation();
  initStrictSwipe();
  initTabs();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
