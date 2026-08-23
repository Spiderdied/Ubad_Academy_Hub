/* =========================================================
   UBAD ACADEMIC HUB — APPLICATION SCRIPT
   1.  Configuration
   2.  Default State
   3.  Application State
   4.  DOM References / Helpers
   5.  Storage
   6.  Theme
   7.  Modal System
   8.  Dashboard Rendering
   9.  Schedule Rendering
   10. Task Rendering
   11. Study Progress + Study Planner Rendering
   12. Course Manager
   13. Notes Manager
   14. Academic Calendar
   15. Grades / GPA Calculator
   16. Academic Analytics
   17. Study Tools (Flashcards + Quizzes)
   18. Global Search
   19. Navigation (main-section swipe / keyboard / history + mobile drawer)
   20. Settings
   21. Event Listeners
   22. Initialization

   NOTE: The AI Study Assistant feature described in a previous
   version of this project has been intentionally removed. The
   "aiAssistant" section in index.html (if present) is left
   untouched but is never activated or wired to any logic.
   ========================================================= */

/* =========================================================
   1. CONFIGURATION
   ========================================================= */
const CONFIG = {
  storageKey: "ubadAcademicHubState",
  stateVersion: 1,
  themeClass: "dark-mode",
  themeIcons: {
    light: "🌓",
    dark: "☀️",
  },
  gradePointMap: {
    "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0,
    "F": 0.0,
  },
  upcomingWindowDays: 7,
};

/* =========================================================
   2. DEFAULT STATE
   ========================================================= */
// Small, realistic placeholder data. Users are expected to
// replace this with their real academic information.
const DEFAULT_STATE = {
  version: CONFIG.stateVersion,
  courses: [
    {
      id: "c1", name: "Applied Linguistics", code: "ENGL201",
      instructor: "", creditHours: 3, status: "in-progress", progress: 45,
      resources: [], assignments: [],
    },
    {
      id: "c2", name: "World Literature", code: "ENGL204",
      instructor: "", creditHours: 3, status: "in-progress", progress: 60,
      resources: [], assignments: [],
    },
    {
      id: "c3", name: "Educational Psychology", code: "EDUC202",
      instructor: "", creditHours: 3, status: "in-progress", progress: 30,
      resources: [], assignments: [],
    },
  ],
  tasks: [
    {
      id: "t1", title: "Read Chapter 3 – Morphology",
      course: "Applied Linguistics", dueDate: "2026-08-22",
      priority: "high", completed: false,
    },
    {
      id: "t2", title: "Draft reflection essay",
      course: "World Literature", dueDate: "2026-08-24",
      priority: "medium", completed: false,
    },
    {
      id: "t3", title: "Submit lesson plan outline",
      course: "Educational Psychology", dueDate: "2026-08-20",
      priority: "low", completed: true,
    },
  ],
  schedule: [
    { id: "s1", time: "09:00", course: "Applied Linguistics", type: "Lecture", date: "2026-08-20" },
    { id: "s2", time: "13:00", course: "World Literature", type: "Seminar", date: "2026-08-20" },
  ],
  notes: [],
  calendarEvents: [],
  studySessions: [],
  grades: [],
  flashcardDecks: [],
  quizzes: [],
  settings: {
    theme: "light",
    currentSemester: "Current Semester",
    targetGpa: null,
  },
};

/* =========================================================
   3. APPLICATION STATE
   ========================================================= */
let state = cloneData(DEFAULT_STATE);

// Transient (non-persisted) UI state.
// ui.activeSection remains the single source of truth for the
// current main section ("currentMainSection"). isAnimating and
// isDragging were added to support the unified navigation
// architecture (swipe / keyboard / history) without introducing
// a second, competing state model.
const ui = {
  activeSection: "dashboard",
  currentCourseId: null,
  currentNoteId: null,
  currentCalendarEventId: null,
  calendarViewDate: new Date(),
  plannerView: "daily",
  activeCourseTab: "resources",
  activeToolsTab: "flashcards",
  activeFlashcardDeckId: null,
  flashcardIndex: 0,
  flashcardFlipped: false,
  activeQuizId: null,
  quizIndex: 0,
  quizScore: 0,
  quizAnswers: {},
  isAnimating: false,
  isDragging: false,
};

function cloneData(source) {
  return JSON.parse(JSON.stringify(source));
}

/* =========================================================
   4. DOM REFERENCES / HELPERS
   ========================================================= */
const dom = {};

function cacheDom() {
  const ids = [
    "themeToggle", "primaryNav", "mainContent",
    "globalSearch", "globalSearchForm", "globalSearchInput", "globalSearchButton",
    "searchResults", "searchResultsStatus", "searchResultsList", "searchEmptyState",

    "statCoursesValue", "statTasksValue", "statExamsValue", "statGpaValue",

    "scheduleList", "scheduleEmptyState",

    "taskList", "taskEmptyState", "addTaskButton",

    "progressList", "progressEmptyState",
    "studyPlanner", "addStudySessionButton", "studyPlanList", "studyPlanEmptyState",

    "dashboard", "courses", "notes", "calendar", "grades", "analytics", "studyTools", "settings",

    "coursesFilterInput", "addCourseButton", "courseList", "courseListEmptyState",
    "courseDetail", "courseDetailHeading", "courseDetailCode", "courseDetailInstructor",
    "courseDetailCredits", "courseDetailStatus", "courseDetailProgressBar", "courseDetailProgressValue",
    "courseResources", "courseNotes", "courseAssignments", "courseSchedule", "courseGrades",
    "courseResourcesList", "courseNotesList", "courseAssignmentsList", "courseScheduleList", "courseGradesList",

    "notesFilterInput", "notesCourseFilter", "addNoteButton", "notesList", "notesEmptyState",
    "noteDetail", "noteDetailTitle", "noteDetailCourse", "noteDetailDate", "noteDetailTags",
    "noteDetailBody", "editNoteButton", "deleteNoteButton",

    "calendarPrevButton", "calendarTodayButton", "calendarNextButton", "calendarCurrentLabel",
    "calendarGrid", "calendarEvents", "calendarEventsEmptyState",
    "calendarEventDetail", "calendarEventDetailTitle", "calendarEventType", "calendarEventDate",
    "calendarEventCourse", "calendarEventNotes",

    "gradesContent", "gpaSemesterValue", "gpaCumulativeValue", "gpaTargetValue", "gpaProjectionValue",
    "gpaTableBody", "gpaTargetForm", "gpaTargetInput",

    "analyticsContainer",
    "analyticsStudyProgress", "analyticsCourseProgress", "analyticsTaskCompletion",
    "analyticsStudyTime", "analyticsGpaTrend", "analyticsUpcomingWorkload",

    "flashcardDecks", "flashcardContainer", "flashcard", "flashcardFront", "flashcardBack",
    "flashcardPrevButton", "flashcardNextButton", "flashcardProgress",
    "quizList", "quizContainer", "quizTitle", "quizQuestionNumber", "quizQuestionText",
    "quizOptions", "quizSubmitButton", "quizResults", "quizScore",

    "settingsContent",
  ];

  ids.forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function qs(selector, root) {
  return (root || document).querySelector(selector);
}
function qsa(selector, root) {
  return Array.from((root || document).querySelectorAll(selector));
}

function createEl(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text !== undefined) el.textContent = options.text;
  if (options.html !== undefined) el.innerHTML = options.html; // only used for trusted static fragments
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined) return;
      el.setAttribute(key, value === true ? "" : value);
    });
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      el.dataset[key] = value;
    });
  }
  if (options.children) {
    options.children.forEach((child) => child && el.appendChild(child));
  }
  if (options.onClick) el.addEventListener("click", options.onClick);
  return el;
}

function clearChildren(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

/**
 * Clears dynamically rendered items from a list, keeping the
 * designated empty-state element (identified by class) intact.
 */
function clearRenderedItems(listEl, itemSelector) {
  if (!listEl) return;
  qsa(itemSelector, listEl).forEach((item) => item.remove());
}

function setEmptyState(emptyEl, isEmpty) {
  if (!emptyEl) return;
  emptyEl.hidden = !isEmpty;
}

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function safePercentage(value) {
  return Math.min(100, Math.max(0, safeNumber(value, 0)));
}

function capitalize(text) {
  if (!text) return "";
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ---- Local-calendar-safe date helpers (avoid UTC shift bugs) ---- */
function todayISO() {
  return formatLocalISODate(new Date());
}
function formatLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseLocalDate(isoStr) {
  if (!isoStr || typeof isoStr !== "string") return null;
  const parts = isoStr.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]) - 1;
  const d = Number(parts[2]);
  if ([y, m, d].some((n) => Number.isNaN(n))) return null;
  const date = new Date(y, m, d);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDateDisplay(isoStr) {
  const date = parseLocalDate(isoStr);
  if (!date) return isoStr || "--";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function daysBetween(isoA, isoB) {
  const a = parseLocalDate(isoA);
  const b = parseLocalDate(isoB);
  if (!a || !b) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}
function isWithinNextDays(isoDate, days) {
  if (!isoDate) return false;
  const diff = daysBetween(todayISO(), isoDate);
  return diff !== null && diff >= 0 && diff <= days;
}

/* =========================================================
   5. STORAGE
   ========================================================= */
function isStorageAvailable() {
  try {
    const testKey = "__ubad_storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

function loadState() {
  if (!storageAvailable) {
    console.warn("UBAD Academic Hub: localStorage unavailable, using in-memory defaults.");
    state = cloneData(DEFAULT_STATE);
    return;
  }

  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) {
      state = cloneData(DEFAULT_STATE);
      return;
    }

    const parsed = JSON.parse(raw);
    state = migrateAndValidateState(parsed);
  } catch (error) {
    console.warn("UBAD Academic Hub: failed to load saved state, using defaults.", error);
    state = cloneData(DEFAULT_STATE);
  }
}

function migrateAndValidateState(parsed) {
  const safe = (value, fallback) => (Array.isArray(value) ? value : fallback);

  const merged = {
    version: CONFIG.stateVersion,
    courses: safe(parsed.courses, DEFAULT_STATE.courses).map(normalizeCourse),
    tasks: safe(parsed.tasks, DEFAULT_STATE.tasks),
    schedule: safe(parsed.schedule, DEFAULT_STATE.schedule),
    notes: safe(parsed.notes, DEFAULT_STATE.notes),
    calendarEvents: safe(parsed.calendarEvents, DEFAULT_STATE.calendarEvents),
    studySessions: safe(parsed.studySessions, DEFAULT_STATE.studySessions),
    grades: safe(parsed.grades, DEFAULT_STATE.grades),
    flashcardDecks: safe(parsed.flashcardDecks, DEFAULT_STATE.flashcardDecks),
    quizzes: safe(parsed.quizzes, DEFAULT_STATE.quizzes),
    settings:
      parsed.settings && typeof parsed.settings === "object"
        ? { ...cloneData(DEFAULT_STATE.settings), ...parsed.settings }
        : cloneData(DEFAULT_STATE.settings),
  };

  return merged;
}

function normalizeCourse(course) {
  return {
    id: course.id || generateId("c"),
    name: course.name || "Untitled course",
    code: course.code || "",
    instructor: course.instructor || "",
    creditHours: safeNumber(course.creditHours, 3),
    status: course.status || "in-progress",
    progress: safePercentage(course.progress),
    resources: Array.isArray(course.resources) ? course.resources : [],
    assignments: Array.isArray(course.assignments) ? course.assignments : [],
  };
}

function saveState() {
  if (!storageAvailable) return;
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("UBAD Academic Hub: failed to save state.", error);
  }
}

function resetState() {
  state = cloneData(DEFAULT_STATE);
  saveState();
  renderAll();
}

/* =========================================================
   6. THEME
   ========================================================= */
function initializeTheme() {
  applyTheme(state.settings.theme === "dark" ? "dark" : "light");
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle(CONFIG.themeClass, isDark);

  if (dom.themeToggle) {
    dom.themeToggle.setAttribute("aria-pressed", String(isDark));
    const icon = qs(".icon-button__icon", dom.themeToggle);
    if (icon) icon.textContent = isDark ? CONFIG.themeIcons.dark : CONFIG.themeIcons.light;
  }

  state.settings.theme = isDark ? "dark" : "light";
  renderSettings();
}

function toggleTheme() {
  const currentlyDark = document.body.classList.contains(CONFIG.themeClass);
  applyTheme(currentlyDark ? "light" : "dark");
  saveState();
}

/* =========================================================
   7. MODAL SYSTEM
   (Dynamically created — index.html is never modified)
   ========================================================= */
let activeModalCleanup = null;

function closeActiveModal() {
  if (activeModalCleanup) {
    activeModalCleanup();
    activeModalCleanup = null;
  }
}

/**
 * Opens a generic form modal.
 * fields: [{ name, label, type, options, required, min, max, step, value }]
 */
function openFormModal({ title, fields, initialValues = {}, submitLabel = "Save", onSubmit }) {
  closeActiveModal();

  const overlay = createEl("div", { className: "modal-overlay", attrs: { role: "presentation" } });
  const modal = createEl("div", {
    className: "modal",
    attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "modalTitle" },
  });

  const header = createEl("div", { className: "modal__header" });
  const heading = createEl("h2", { className: "modal__title", text: title, attrs: { id: "modalTitle" } });
  const closeBtn = createEl("button", {
    className: "modal__close icon-button",
    attrs: { type: "button", "aria-label": "Close dialog" },
    text: "✕",
    onClick: () => closeActiveModal(),
  });
  header.appendChild(heading);
  header.appendChild(closeBtn);

  const form = createEl("form", { className: "modal__form" });
  const body = createEl("div", { className: "modal__body" });
  const fieldRefs = {};

  fields.forEach((field) => {
    const fieldWrap = createEl("div", { className: "modal__field" });
    const inputId = `modalField_${field.name}`;
    const label = createEl("label", { text: field.label, attrs: { for: inputId } });
    fieldWrap.appendChild(label);

    let input;
    const currentValue = initialValues[field.name] ?? field.value ?? "";

    if (field.type === "textarea") {
      input = createEl("textarea", { attrs: { id: inputId, name: field.name, rows: field.rows || 4 } });
      input.value = currentValue;
    } else if (field.type === "select") {
      input = createEl("select", { attrs: { id: inputId, name: field.name } });
      (field.options || []).forEach((opt) => {
        const optionEl = createEl("option", {
          text: opt.label,
          attrs: { value: opt.value },
        });
        if (String(opt.value) === String(currentValue)) optionEl.selected = true;
        input.appendChild(optionEl);
      });
    } else if (field.type === "checkbox") {
      input = createEl("input", { attrs: { id: inputId, name: field.name, type: "checkbox" } });
      input.checked = Boolean(currentValue);
    } else {
      input = createEl("input", {
        attrs: {
          id: inputId,
          name: field.name,
          type: field.type || "text",
          min: field.min,
          max: field.max,
          step: field.step,
          placeholder: field.placeholder,
        },
      });
      input.value = currentValue;
    }

    if (field.required) input.required = true;
    fieldRefs[field.name] = input;
    fieldWrap.appendChild(input);

    const errorEl = createEl("p", { className: "modal__field-error", attrs: { role: "alert" } });
    fieldWrap.appendChild(errorEl);
    field._errorEl = errorEl;

    body.appendChild(fieldWrap);
  });

  const footer = createEl("div", { className: "modal__footer" });
  const cancelBtn = createEl("button", {
    className: "button",
    text: "Cancel",
    attrs: { type: "button" },
    onClick: () => closeActiveModal(),
  });
  const submitBtn = createEl("button", {
    className: "button button--primary",
    text: submitLabel,
    attrs: { type: "submit" },
  });
  footer.appendChild(cancelBtn);
  footer.appendChild(submitBtn);

  form.appendChild(body);
  form.appendChild(footer);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let hasError = false;
    const values = {};

    fields.forEach((field) => {
      const input = fieldRefs[field.name];
      let value;
      if (field.type === "checkbox") {
        value = input.checked;
      } else if (field.type === "number") {
        value = input.value === "" ? null : Number(input.value);
      } else {
        value = input.value.trim();
      }

      field._errorEl.textContent = "";

      if (field.required && (value === "" || value === null || value === undefined)) {
        field._errorEl.textContent = "This field is required.";
        hasError = true;
      } else if (field.type === "number" && value !== null && Number.isNaN(value)) {
        field._errorEl.textContent = "Please enter a valid number.";
        hasError = true;
      } else if (field.type === "number" && value !== null && field.min !== undefined && value < field.min) {
        field._errorEl.textContent = `Minimum value is ${field.min}.`;
        hasError = true;
      } else if (field.type === "number" && value !== null && field.max !== undefined && value > field.max) {
        field._errorEl.textContent = `Maximum value is ${field.max}.`;
        hasError = true;
      }

      values[field.name] = value;
    });

    if (hasError) return;

    onSubmit(values);
    closeActiveModal();
  });

  modal.appendChild(header);
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeActiveModal();
  });

  function onKeydown(event) {
    if (event.key === "Escape") closeActiveModal();
  }
  document.addEventListener("keydown", onKeydown);

  const firstInput = qs("input, select, textarea", form);
  if (firstInput) firstInput.focus();

  activeModalCleanup = () => {
    document.removeEventListener("keydown", onKeydown);
    overlay.remove();
  };
}

function openConfirmModal({ title = "Please confirm", message, confirmLabel = "Confirm", danger = false, onConfirm }) {
  closeActiveModal();

  const overlay = createEl("div", { className: "modal-overlay" });
  const modal = createEl("div", {
    className: "modal modal--confirm",
    attrs: { role: "alertdialog", "aria-modal": "true" },
  });

  const heading = createEl("h2", { className: "modal__title", text: title });
  const messageEl = createEl("p", { className: "modal__message", text: message });

  const footer = createEl("div", { className: "modal__footer" });
  const cancelBtn = createEl("button", {
    className: "button",
    text: "Cancel",
    attrs: { type: "button" },
    onClick: () => closeActiveModal(),
  });
  const confirmBtn = createEl("button", {
    className: danger ? "button button--danger" : "button button--primary",
    text: confirmLabel,
    attrs: { type: "button" },
    onClick: () => {
      onConfirm();
      closeActiveModal();
    },
  });
  footer.appendChild(cancelBtn);
  footer.appendChild(confirmBtn);

  modal.appendChild(heading);
  modal.appendChild(messageEl);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeActiveModal();
  });

  function onKeydown(event) {
    if (event.key === "Escape") closeActiveModal();
  }
  document.addEventListener("keydown", onKeydown);

  confirmBtn.focus();

  activeModalCleanup = () => {
    document.removeEventListener("keydown", onKeydown);
    overlay.remove();
  };
}

function courseSelectOptions(selectedName) {
  const options = [{ value: "", label: "No course" }];
  state.courses.forEach((c) => options.push({ value: c.name, label: c.name }));
  return options;
}

/* =========================================================
   8. DASHBOARD RENDERING
   ========================================================= */
function renderDashboard() {
  renderStat(dom.statCoursesValue, state.courses.length);
  renderStat(dom.statTasksValue, countPendingTasks());
  renderStat(dom.statExamsValue, countUpcomingExams());
  const gpa = calculateSemesterGpa(state.grades);
  renderStat(dom.statGpaValue, gpa === null ? "--" : gpa.toFixed(2));
}

function renderStat(el, value) {
  if (!el) return;
  el.textContent = String(value);
}

function countPendingTasks() {
  return state.tasks.filter((task) => !task.completed).length;
}

function countUpcomingExams() {
  const examLike = (text) => typeof text === "string" && /exam|midterm|final/i.test(text);
  const fromSchedule = state.schedule.filter(
    (item) => examLike(item.type) && item.date >= todayISO()
  ).length;
  const fromEvents = state.calendarEvents.filter(
    (event) => examLike(event.type) && isWithinNextDays(event.date, 60)
  ).length;
  return fromSchedule + fromEvents;
}

/* =========================================================
   9. SCHEDULE RENDERING
   ========================================================= */
function renderSchedule() {
  const listEl = dom.scheduleList;
  if (!listEl) return;

  clearRenderedItems(listEl, ".schedule-item");

  const today = todayISO();
  const todaysItems = state.schedule
    .filter((item) => item.date === today)
    .slice()
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  setEmptyState(dom.scheduleEmptyState, todaysItems.length === 0);
  if (!todaysItems.length) return;

  const fragment = document.createDocumentFragment();
  todaysItems.forEach((item) => fragment.appendChild(createScheduleItemElement(item)));
  listEl.appendChild(fragment);
}

function createScheduleItemElement(item) {
  const time = createEl("span", { className: "schedule-item__time", text: item.time || "--:--" });

  const course = createEl("p", { className: "schedule-item__course", text: item.course || "Untitled course" });
  const type = createEl("span", { className: "schedule-item__type", text: item.type || "Class" });
  const body = createEl("div", { className: "schedule-item__body", children: [course, type] });

  const deleteBtn = createEl("button", {
    className: "schedule-item__delete icon-button",
    text: "✕",
    attrs: { type: "button", "aria-label": `Delete schedule item: ${item.course || "class"}` },
    onClick: () => {
      openConfirmModal({
        message: "Delete this schedule item?",
        danger: true,
        onConfirm: () => {
          state.schedule = state.schedule.filter((s) => s.id !== item.id);
          saveState();
          renderSchedule();
          renderDashboard();
          renderAnalytics();
        },
      });
    },
  });

  return createEl("li", {
    className: "schedule-item",
    dataset: { scheduleId: item.id || "" },
    children: [time, body, deleteBtn],
  });
}

function openAddScheduleModal(defaults = {}) {
  openFormModal({
    title: "Add Schedule Item",
    submitLabel: "Add",
    initialValues: defaults,
    fields: [
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "type", label: "Type", type: "text", placeholder: "Lecture, Seminar, Lab…" },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Start time", type: "time", required: true },
    ],
    onSubmit: (values) => {
      state.schedule.push({
        id: generateId("s"),
        course: values.course,
        type: values.type || "Class",
        date: values.date,
        time: values.time,
      });
      saveState();
      renderSchedule();
      renderDashboard();
      renderAnalytics();
    },
  });
}

/* =========================================================
   10. TASK RENDERING
   ========================================================= */
const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };

function renderTasks() {
  const listEl = dom.taskList;
  if (!listEl) return;

  clearRenderedItems(listEl, ".task-item");
  setEmptyState(dom.taskEmptyState, state.tasks.length === 0);
  if (!state.tasks.length) return;

  const sortedTasks = state.tasks.slice().sort((a, b) => {
    if (Boolean(a.completed) !== Boolean(b.completed)) {
      return a.completed ? 1 : -1;
    }
    const weightDiff = (PRIORITY_WEIGHT[a.priority] ?? 1) - (PRIORITY_WEIGHT[b.priority] ?? 1);
    if (weightDiff !== 0) return weightDiff;
    return (a.dueDate || "9999-99-99").localeCompare(b.dueDate || "9999-99-99");
  });

  const fragment = document.createDocumentFragment();
  sortedTasks.forEach((task) => fragment.appendChild(createTaskItemElement(task)));
  listEl.appendChild(fragment);
}

function createTaskItemElement(task) {
  const priorityClass = getPriorityClass(task.priority);
  const stateClass = task.completed ? "task-item--completed" : "task-item--pending";

  const checkbox = createEl("input", {
    className: "task-item__checkbox",
    attrs: {
      type: "checkbox",
      "aria-label": `Mark "${task.title || "task"}" as ${task.completed ? "not completed" : "completed"}`,
    },
  });
  checkbox.checked = Boolean(task.completed);

  const title = createEl("p", { className: "task-item__title", text: task.title || "Untitled task" });
  const courseText = task.course ? task.course : "General";
  const dueText = task.dueDate ? formatDateDisplay(task.dueDate) : "No due date";
  const meta = createEl("p", { className: "task-item__meta", text: `${courseText} · Due ${dueText}` });
  const badge = createEl("span", { className: "task-item__badge", text: capitalize(task.priority || "medium") });

  const content = createEl("div", { className: "task-item__content", children: [title, meta, badge] });

  const actions = createEl("div", { className: "task-item__actions" });
  const editBtn = createEl("button", {
    className: "task-item__edit icon-button",
    text: "✎",
    attrs: { type: "button", "aria-label": `Edit task: ${task.title || "task"}` },
    onClick: () => openEditTaskModal(task),
  });
  const deleteBtn = createEl("button", {
    className: "task-item__delete icon-button",
    text: "✕",
    attrs: { type: "button", "aria-label": `Delete task: ${task.title || "task"}` },
    onClick: () => {
      openConfirmModal({
        message: `Delete task "${task.title}"?`,
        danger: true,
        onConfirm: () => {
          state.tasks = state.tasks.filter((t) => t.id !== task.id);
          saveState();
          renderTasks();
          renderDashboard();
          renderAnalytics();
        },
      });
    },
  });
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  return createEl("li", {
    className: `task-item ${priorityClass} ${stateClass}`,
    dataset: { taskId: task.id || "" },
    children: [checkbox, content, actions],
  });
}

function getPriorityClass(priority) {
  switch (priority) {
    case "high": return "task-item--priority-high";
    case "low": return "task-item--priority-low";
    default: return "task-item--priority-medium";
  }
}

function toggleTaskCompletion(taskId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveState();
  renderTasks();
  renderDashboard();
  renderAnalytics();
}

function openAddTaskModal() {
  openFormModal({
    title: "Add Task",
    submitLabel: "Add",
    fields: [
      { name: "title", label: "Task title", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "dueDate", label: "Due date", type: "date" },
      {
        name: "priority", label: "Priority", type: "select",
        options: [{ value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }],
        value: "medium",
      },
    ],
    onSubmit: (values) => {
      state.tasks.push({
        id: generateId("t"),
        title: values.title,
        course: values.course || "",
        dueDate: values.dueDate || "",
        priority: values.priority || "medium",
        completed: false,
      });
      saveState();
      renderTasks();
      renderDashboard();
      renderAnalytics();
    },
  });
}

function openEditTaskModal(task) {
  openFormModal({
    title: "Edit Task",
    submitLabel: "Save",
    initialValues: {
      title: task.title, course: task.course, dueDate: task.dueDate,
      priority: task.priority, completed: task.completed,
    },
    fields: [
      { name: "title", label: "Task title", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "dueDate", label: "Due date", type: "date" },
      {
        name: "priority", label: "Priority", type: "select",
        options: [{ value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }],
      },
      { name: "completed", label: "Completed", type: "checkbox" },
    ],
    onSubmit: (values) => {
      task.title = values.title;
      task.course = values.course || "";
      task.dueDate = values.dueDate || "";
      task.priority = values.priority || "medium";
      task.completed = Boolean(values.completed);
      saveState();
      renderTasks();
      renderDashboard();
      renderAnalytics();
    },
  });
}

/* =========================================================
   11. STUDY PROGRESS + STUDY PLANNER
   ========================================================= */
function renderProgress() {
  const listEl = dom.progressList;
  if (!listEl) return;

  clearRenderedItems(listEl, ".progress-item");
  setEmptyState(dom.progressEmptyState, state.courses.length === 0);
  if (!state.courses.length) return;

  const fragment = document.createDocumentFragment();
  state.courses.forEach((course) => fragment.appendChild(createProgressItemElement(course)));
  listEl.appendChild(fragment);
}

function createProgressItemElement(course) {
  const percentValue = safePercentage(course.progress);

  const name = createEl("span", { className: "progress-item__name", text: course.name || "Untitled course" });
  const percent = createEl("span", { className: "progress-item__percent", text: `${percentValue}%` });
  const header = createEl("div", { className: "progress-item__header", children: [name, percent] });

  const bar = createEl("progress", {
    className: "progress-item__bar",
    attrs: { max: 100, "aria-label": `${course.name || "Course"} progress: ${percentValue}%` },
  });
  bar.value = percentValue;

  return createEl("li", { className: "progress-item", dataset: { courseId: course.id }, children: [header, bar] });
}

function renderStudyPlanner() {
  const listEl = dom.studyPlanList;
  if (!listEl) return;

  clearRenderedItems(listEl, ".study-session");

  const today = todayISO();
  let sessions = state.studySessions.slice();
  if (ui.plannerView === "daily") {
    sessions = sessions.filter((s) => s.date === today);
  } else {
    // weekly: next 7 days including today
    sessions = sessions.filter((s) => isWithinNextDays(s.date, 6) || s.date === today);
  }
  sessions.sort((a, b) => (a.date + (a.startTime || "")).localeCompare(b.date + (b.startTime || "")));

  setEmptyState(dom.studyPlanEmptyState, sessions.length === 0);
  if (!sessions.length) return;

  const fragment = document.createDocumentFragment();
  sessions.forEach((session) => fragment.appendChild(createStudySessionElement(session)));
  listEl.appendChild(fragment);
}

function createStudySessionElement(session) {
  const checkbox = createEl("input", {
    attrs: { type: "checkbox", "aria-label": `Mark study session for ${session.course || "study"} as complete` },
  });
  checkbox.checked = Boolean(session.completed);
  checkbox.addEventListener("change", () => {
    session.completed = checkbox.checked;
    saveState();
    renderStudyPlanner();
    renderAnalytics();
  });

  const title = createEl("p", { className: "study-session__title", text: session.course || "Study session" });
  const meta = createEl("p", {
    className: "study-session__meta",
    text: `${formatDateDisplay(session.date)} · ${session.startTime || "--:--"} · ${session.duration || 0} min`,
  });
  const goal = createEl("p", { className: "study-session__goal", text: session.goal || "" });

  const content = createEl("div", { className: "study-session__content", children: [title, meta, goal] });

  const deleteBtn = createEl("button", {
    className: "study-session__delete icon-button",
    text: "✕",
    attrs: { type: "button", "aria-label": "Delete study session" },
    onClick: () => {
      openConfirmModal({
        message: "Delete this study session?",
        danger: true,
        onConfirm: () => {
          state.studySessions = state.studySessions.filter((s) => s.id !== session.id);
          saveState();
          renderStudyPlanner();
          renderAnalytics();
        },
      });
    },
  });

  return createEl("li", {
    className: `study-session ${session.completed ? "study-session--completed" : ""}`.trim(),
    dataset: { sessionId: session.id },
    children: [checkbox, content, deleteBtn],
  });
}

function openAddStudySessionModal() {
  openFormModal({
    title: "Add Study Session",
    submitLabel: "Add",
    fields: [
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "date", label: "Date", type: "date", required: true, value: todayISO() },
      { name: "startTime", label: "Start time", type: "time" },
      { name: "duration", label: "Duration (minutes)", type: "number", min: 5, max: 600, step: 5, value: 30 },
      { name: "goal", label: "Study goal", type: "text", placeholder: "e.g. Review Chapter 4" },
    ],
    onSubmit: (values) => {
      state.studySessions.push({
        id: generateId("ss"),
        course: values.course || "",
        date: values.date,
        startTime: values.startTime || "",
        duration: safeNumber(values.duration, 30),
        goal: values.goal || "",
        completed: false,
      });
      saveState();
      renderStudyPlanner();
      renderAnalytics();
    },
  });
}

function setPlannerView(view) {
  ui.plannerView = view === "weekly" ? "weekly" : "daily";
  qsa(".study-planner__view-toggle").forEach((btn) => {
    const isActive = btn.dataset.plannerView === ui.plannerView;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  renderStudyPlanner();
}

/* =========================================================
   12. COURSE MANAGER
   ========================================================= */
function renderCourses() {
  const listEl = dom.courseList;
  if (!listEl) return;

  clearRenderedItems(listEl, ".course-card");

  const filterValue = (dom.coursesFilterInput?.value || "").trim().toLowerCase();
  const filtered = state.courses.filter((course) => {
    if (!filterValue) return true;
    return [course.name, course.code, course.instructor]
      .filter(Boolean)
      .some((text) => text.toLowerCase().includes(filterValue));
  });

  setEmptyState(dom.courseListEmptyState, filtered.length === 0);

  if (!filtered.length) return;

  const fragment = document.createDocumentFragment();
  filtered.forEach((course) => fragment.appendChild(createCourseCardElement(course)));
  listEl.appendChild(fragment);
}

function createCourseCardElement(course) {
  const name = createEl("h3", { className: "course-card__name", text: course.name });
  const code = createEl("p", { className: "course-card__code", text: course.code || "No course code" });
  const instructor = createEl("p", { className: "course-card__instructor", text: course.instructor || "Instructor not set" });
  const credits = createEl("p", { className: "course-card__credits", text: `${course.creditHours} credit hours` });
  const status = createEl("span", { className: "course-card__status", text: capitalize((course.status || "").replace("-", " ")) });

  const percentValue = safePercentage(course.progress);
  const bar = createEl("progress", { className: "course-card__progress-bar", attrs: { max: 100 } });
  bar.value = percentValue;
  const percentLabel = createEl("span", { className: "course-card__progress-label", text: `${percentValue}%` });
  const progressWrap = createEl("div", { className: "course-card__progress", children: [bar, percentLabel] });

  const viewBtn = createEl("button", {
    className: "button button--primary course-card__view",
    text: "View details",
    attrs: { type: "button" },
    onClick: () => openCourseDetail(course.id),
  });
  const editBtn = createEl("button", {
    className: "button course-card__edit",
    text: "Edit",
    attrs: { type: "button" },
    onClick: () => openEditCourseModal(course),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger course-card__delete",
    text: "Delete",
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: `Delete "${course.name}"? This will not delete related notes, tasks, or grades.`,
        danger: true,
        onConfirm: () => {
          state.courses = state.courses.filter((c) => c.id !== course.id);
          if (ui.currentCourseId === course.id) {
            ui.currentCourseId = null;
            if (dom.courseDetail) dom.courseDetail.hidden = true;
          }
          saveState();
          renderCourses();
          renderProgress();
          renderDashboard();
          renderAnalytics();
        },
      });
    },
  });

  const actions = createEl("div", { className: "course-card__actions", children: [viewBtn, editBtn, deleteBtn] });

  return createEl("li", {
    className: "course-card",
    dataset: { courseId: course.id },
    children: [name, code, instructor, credits, status, progressWrap, actions],
  });
}

function openAddCourseModal() {
  openFormModal({
    title: "Add Course",
    submitLabel: "Add",
    fields: [
      { name: "name", label: "Course name", type: "text", required: true },
      { name: "code", label: "Course code", type: "text" },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "creditHours", label: "Credit hours", type: "number", min: 0, max: 12, step: 1, value: 3 },
      {
        name: "status", label: "Status", type: "select",
        options: [
          { value: "not-started", label: "Not started" },
          { value: "in-progress", label: "In progress" },
          { value: "completed", label: "Completed" },
        ],
        value: "in-progress",
      },
      { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, step: 1, value: 0 },
    ],
    onSubmit: (values) => {
      state.courses.push({
        id: generateId("c"),
        name: values.name,
        code: values.code || "",
        instructor: values.instructor || "",
        creditHours: safeNumber(values.creditHours, 3),
        status: values.status || "in-progress",
        progress: safePercentage(values.progress),
        resources: [],
        assignments: [],
      });
      saveState();
      renderCourses();
      renderProgress();
      renderDashboard();
      renderAnalytics();
      renderGrades();
    },
  });
}

function openEditCourseModal(course) {
  openFormModal({
    title: "Edit Course",
    submitLabel: "Save",
    initialValues: {
      name: course.name, code: course.code, instructor: course.instructor,
      creditHours: course.creditHours, status: course.status, progress: course.progress,
    },
    fields: [
      { name: "name", label: "Course name", type: "text", required: true },
      { name: "code", label: "Course code", type: "text" },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "creditHours", label: "Credit hours", type: "number", min: 0, max: 12, step: 1 },
      {
        name: "status", label: "Status", type: "select",
        options: [
          { value: "not-started", label: "Not started" },
          { value: "in-progress", label: "In progress" },
          { value: "completed", label: "Completed" },
        ],
      },
      { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, step: 1 },
    ],
    onSubmit: (values) => {
      const previousName = course.name;
      course.name = values.name;
      course.code = values.code || "";
      course.instructor = values.instructor || "";
      course.creditHours = safeNumber(values.creditHours, course.creditHours);
      course.status = values.status || course.status;
      course.progress = safePercentage(values.progress);

      // Keep related records in sync if the course name changed.
      if (previousName !== course.name) {
        state.tasks.forEach((t) => { if (t.course === previousName) t.course = course.name; });
        state.schedule.forEach((s) => { if (s.course === previousName) s.course = course.name; });
        state.notes.forEach((n) => { if (n.course === previousName) n.course = course.name; });
        state.studySessions.forEach((s) => { if (s.course === previousName) s.course = course.name; });
        state.grades.forEach((g) => { if (g.course === previousName) g.course = course.name; });
      }

      saveState();
      renderCourses();
      renderProgress();
      renderDashboard();
      renderAnalytics();
      renderGrades();
      if (ui.currentCourseId === course.id) renderCourseDetail(course.id);
    },
  });
}

function openCourseDetail(courseId) {
  ui.currentCourseId = courseId;
  renderCourseDetail(courseId);
  if (dom.courseDetail) {
    dom.courseDetail.hidden = false;
    dom.courseDetail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderCourseDetail(courseId) {
  const course = state.courses.find((c) => c.id === courseId);
  if (!course || !dom.courseDetail) return;

  if (dom.courseDetailHeading) dom.courseDetailHeading.textContent = course.name;
  if (dom.courseDetailCode) dom.courseDetailCode.textContent = course.code || "--";
  if (dom.courseDetailInstructor) dom.courseDetailInstructor.textContent = course.instructor || "--";
  if (dom.courseDetailCredits) dom.courseDetailCredits.textContent = String(course.creditHours);
  if (dom.courseDetailStatus) dom.courseDetailStatus.textContent = capitalize((course.status || "").replace("-", " "));

  const percentValue = safePercentage(course.progress);
  if (dom.courseDetailProgressBar) dom.courseDetailProgressBar.value = percentValue;
  if (dom.courseDetailProgressValue) dom.courseDetailProgressValue.textContent = `${percentValue}%`;

  renderCourseResourcesPanel(course);
  renderCourseAssignmentsPanel(course);
  renderCourseNotesPanel(course);
  renderCourseSchedulePanel(course);
  renderCourseGradesPanel(course);
}

function ensureAddButton(container, label, onClick, marker) {
  // Ensures a single "+ Add" trigger exists at the top of a dynamically
  // rendered panel, without needing to modify index.html.
  let btn = qs(`[data-add-marker="${marker}"]`, container.parentElement);
  if (!btn) {
    btn = createEl("button", {
      className: "button button--primary course-detail__add-button",
      text: label,
      attrs: { type: "button" },
      dataset: { addMarker: marker },
    });
    container.parentElement.insertBefore(btn, container);
  }
  // Always rebind the handler (even on a reused button) so it closes over
  // the CURRENT course rather than whichever course first created the
  // button. Assigning .onclick (instead of addEventListener) guarantees
  // the previous handler is replaced rather than stacked.
  btn.onclick = onClick;
  return btn;
}

function renderCourseResourcesPanel(course) {
  const listEl = dom.courseResourcesList;
  if (!listEl) return;
  ensureAddButton(listEl, "＋ Add Resource", () => openAddResourceModal(course), "resources");

  clearChildren(listEl);
  if (!course.resources.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No resources added yet." }));
    return;
  }
  course.resources.forEach((res) => {
    const label = createEl("span", { text: res.title });
    const link = res.url
      ? createEl("a", { text: "Open", attrs: { href: res.url, target: "_blank", rel: "noopener noreferrer" } })
      : null;
    const deleteBtn = createEl("button", {
      className: "icon-button", text: "✕",
      attrs: { type: "button", "aria-label": `Delete resource: ${res.title}` },
      onClick: () => {
        course.resources = course.resources.filter((r) => r.id !== res.id);
        saveState();
        renderCourseResourcesPanel(course);
      },
    });
    const li = createEl("li", { className: "course-resource-item", children: [label] });
    if (link) li.appendChild(link);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}

function openAddResourceModal(course) {
  openFormModal({
    title: "Add Resource",
    submitLabel: "Add",
    fields: [
      { name: "title", label: "Resource title", type: "text", required: true },
      { name: "url", label: "Link (optional)", type: "text", placeholder: "https://…" },
    ],
    onSubmit: (values) => {
      course.resources.push({ id: generateId("res"), title: values.title, url: values.url || "" });
      saveState();
      renderCourseResourcesPanel(course);
    },
  });
}

function renderCourseAssignmentsPanel(course) {
  const listEl = dom.courseAssignmentsList;
  if (!listEl) return;
  ensureAddButton(listEl, "＋ Add Assignment", () => openAddAssignmentModal(course), "assignments");

  clearChildren(listEl);
  if (!course.assignments.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No assignments yet." }));
    return;
  }
  course.assignments.forEach((assignment) => {
    const checkbox = createEl("input", { attrs: { type: "checkbox", "aria-label": `Mark "${assignment.title}" complete` } });
    checkbox.checked = Boolean(assignment.completed);
    checkbox.addEventListener("change", () => {
      assignment.completed = checkbox.checked;
      saveState();
    });
    const title = createEl("span", { text: assignment.title });
    const due = createEl("span", {
      className: "course-assignment-item__due",
      text: assignment.dueDate ? ` · Due ${formatDateDisplay(assignment.dueDate)}` : "",
    });
    const deleteBtn = createEl("button", {
      className: "icon-button", text: "✕",
      attrs: { type: "button", "aria-label": `Delete assignment: ${assignment.title}` },
      onClick: () => {
        course.assignments = course.assignments.filter((a) => a.id !== assignment.id);
        saveState();
        renderCourseAssignmentsPanel(course);
      },
    });
    listEl.appendChild(createEl("li", {
      className: "course-assignment-item",
      children: [checkbox, title, due, deleteBtn],
    }));
  });
}

function openAddAssignmentModal(course) {
  openFormModal({
    title: "Add Assignment",
    submitLabel: "Add",
    fields: [
      { name: "title", label: "Assignment title", type: "text", required: true },
      { name: "dueDate", label: "Due date", type: "date" },
    ],
    onSubmit: (values) => {
      course.assignments.push({
        id: generateId("asg"), title: values.title, dueDate: values.dueDate || "", completed: false,
      });
      saveState();
      renderCourseAssignmentsPanel(course);
    },
  });
}

function renderCourseNotesPanel(course) {
  const listEl = dom.courseNotesList;
  if (!listEl) return;
  clearChildren(listEl);
  const related = state.notes.filter((n) => n.course === course.name);
  if (!related.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No notes for this course yet." }));
    return;
  }
  related.forEach((note) => {
    const btn = createEl("button", {
      className: "course-note-link", text: note.title || "Untitled note",
      attrs: { type: "button" },
      onClick: () => { navigateTo("notes"); openNoteDetail(note.id); },
    });
    listEl.appendChild(createEl("li", { children: [btn] }));
  });
}

function renderCourseSchedulePanel(course) {
  const listEl = dom.courseScheduleList;
  if (!listEl) return;
  clearChildren(listEl);
  const related = state.schedule.filter((s) => s.course === course.name);
  if (!related.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No schedule entries yet." }));
    return;
  }
  related
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .forEach((item) => {
      listEl.appendChild(createEl("li", {
        text: `${formatDateDisplay(item.date)} · ${item.time || "--:--"} · ${item.type || "Class"}`,
      }));
    });
}

function renderCourseGradesPanel(course) {
  const listEl = dom.courseGradesList;
  if (!listEl) return;
  clearChildren(listEl);
  const related = state.grades.filter((g) => g.course === course.name);
  if (!related.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No grades recorded yet." }));
    return;
  }
  related.forEach((grade) => {
    listEl.appendChild(createEl("li", {
      text: `${grade.semester || "Semester"}: ${grade.letterGrade} (${grade.gradePoints.toFixed(1)} pts, ${grade.creditHours} credits)`,
    }));
  });
}

function initializeCourseTabs() {
  const tabs = qsa(".course-detail__tab");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("aria-controls");
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      qsa(".course-detail__panel").forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
      ui.activeCourseTab = tab.dataset.courseTab;
    });
  });
}

/* =========================================================
   13. NOTES MANAGER
   ========================================================= */
function renderNotes() {
  const listEl = dom.notesList;
  if (!listEl) return;

  populateNotesCourseFilter();

  clearRenderedItems(listEl, ".note-card");

  const query = (dom.notesFilterInput?.value || "").trim().toLowerCase();
  const courseFilter = dom.notesCourseFilter?.value || "";

  const filtered = state.notes.filter((note) => {
    if (courseFilter && note.course !== courseFilter) return false;
    if (!query) return true;
    const haystack = [note.title, note.course, note.body, (note.tags || []).join(" ")]
      .filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query);
  });

  setEmptyState(dom.notesEmptyState, filtered.length === 0);
  if (!filtered.length) return;

  const fragment = document.createDocumentFragment();
  filtered
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach((note) => fragment.appendChild(createNoteCardElement(note)));
  listEl.appendChild(fragment);
}

function populateNotesCourseFilter() {
  const select = dom.notesCourseFilter;
  if (!select) return;
  const currentValue = select.value;
  clearChildren(select);
  select.appendChild(createEl("option", { text: "All courses", attrs: { value: "" } }));
  state.courses.forEach((c) => {
    const opt = createEl("option", { text: c.name, attrs: { value: c.name } });
    select.appendChild(opt);
  });
  if ([...select.options].some((o) => o.value === currentValue)) {
    select.value = currentValue;
  }
}

function createNoteCardElement(note) {
  const title = createEl("h3", { className: "note-card__title", text: note.title || "Untitled note" });
  const course = createEl("p", { className: "note-card__course", text: note.course || "General" });
  const date = createEl("p", { className: "note-card__date", text: note.date ? formatDateDisplay(note.date) : "" });

  const tagsList = createEl("ul", { className: "note-card__tags" });
  (note.tags || []).forEach((tag) => tagsList.appendChild(createEl("li", { text: tag })));

  const preview = createEl("p", {
    className: "note-card__preview",
    text: (note.body || "").slice(0, 140) + ((note.body || "").length > 140 ? "…" : ""),
  });

  const viewBtn = createEl("button", {
    className: "button button--primary", text: "View",
    attrs: { type: "button" },
    onClick: () => openNoteDetail(note.id),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger", text: "Delete",
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: `Delete note "${note.title}"?`,
        danger: true,
        onConfirm: () => {
          state.notes = state.notes.filter((n) => n.id !== note.id);
          if (ui.currentNoteId === note.id) {
            ui.currentNoteId = null;
            if (dom.noteDetail) dom.noteDetail.hidden = true;
          }
          saveState();
          renderNotes();
          renderAnalytics();
        },
      });
    },
  });
  const actions = createEl("div", { className: "note-card__actions", children: [viewBtn, deleteBtn] });

  return createEl("li", {
    className: "note-card",
    dataset: { noteId: note.id },
    children: [title, course, date, tagsList, preview, actions],
  });
}

function openNoteDetail(noteId) {
  const note = state.notes.find((n) => n.id === noteId);
  if (!note || !dom.noteDetail) return;
  ui.currentNoteId = noteId;

  if (dom.noteDetailTitle) dom.noteDetailTitle.textContent = note.title || "Untitled note";
  if (dom.noteDetailCourse) dom.noteDetailCourse.textContent = note.course || "General";
  if (dom.noteDetailDate) dom.noteDetailDate.textContent = note.date ? formatDateDisplay(note.date) : "--";

  if (dom.noteDetailTags) {
    clearChildren(dom.noteDetailTags);
    (note.tags || []).forEach((tag) => dom.noteDetailTags.appendChild(createEl("li", { text: tag })));
  }
  if (dom.noteDetailBody) dom.noteDetailBody.textContent = note.body || "";

  dom.noteDetail.hidden = false;
  dom.noteDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openAddNoteModal() {
  openFormModal({
    title: "Add Note",
    submitLabel: "Add",
    fields: [
      { name: "title", label: "Note title", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "date", label: "Date", type: "date", value: todayISO() },
      { name: "tags", label: "Tags (comma separated)", type: "text" },
      { name: "body", label: "Note content", type: "textarea", rows: 6 },
    ],
    onSubmit: (values) => {
      state.notes.push({
        id: generateId("n"),
        title: values.title,
        course: values.course || "",
        date: values.date || todayISO(),
        tags: (values.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        body: values.body || "",
      });
      saveState();
      renderNotes();
      renderAnalytics();
    },
  });
}

function openEditNoteModal(note) {
  openFormModal({
    title: "Edit Note",
    submitLabel: "Save",
    initialValues: {
      title: note.title, course: note.course, date: note.date,
      tags: (note.tags || []).join(", "), body: note.body,
    },
    fields: [
      { name: "title", label: "Note title", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "date", label: "Date", type: "date" },
      { name: "tags", label: "Tags (comma separated)", type: "text" },
      { name: "body", label: "Note content", type: "textarea", rows: 6 },
    ],
    onSubmit: (values) => {
      note.title = values.title;
      note.course = values.course || "";
      // Use the submitted value directly (not `values.date || note.date`):
      // that fallback made it impossible to clear a date, since an
      // intentionally-emptied field ("") is just as falsy as an unset one.
      note.date = values.date;
      note.tags = (values.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      note.body = values.body || "";
      saveState();
      renderNotes();
      openNoteDetail(note.id);
    },
  });
}

/* =========================================================
   14. ACADEMIC CALENDAR
   ========================================================= */
const EVENT_TYPES = ["Lecture", "Assignment", "Midterm", "Final", "Exam", "Deadline", "Other"];

function renderCalendar() {
  renderCalendarGrid();
  renderCalendarEventsList();
}

function renderCalendarGrid() {
  const grid = dom.calendarGrid;
  if (!grid) return;

  clearChildren(grid);

  const viewDate = ui.calendarViewDate;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  if (dom.calendarCurrentLabel) {
    dom.calendarCurrentLabel.textContent = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  const weekdayHeader = createEl("div", { className: "calendar__weekdays" });
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
    weekdayHeader.appendChild(createEl("span", { text: d }));
  });
  grid.appendChild(weekdayHeader);

  const daysGrid = createEl("div", { className: "calendar__days" });
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();

  for (let i = 0; i < startOffset; i += 1) {
    daysGrid.appendChild(createEl("div", { className: "calendar__day calendar__day--empty" }));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cellDate = new Date(year, month, day);
    const iso = formatLocalISODate(cellDate);
    const dayEvents = state.calendarEvents.filter((event) => event.date === iso);

    const dayNumber = createEl("span", { className: "calendar__day-number", text: String(day) });
    const dot = dayEvents.length
      ? createEl("span", { className: "calendar__day-dot", attrs: { "aria-hidden": "true" } })
      : null;

    const cell = createEl("button", {
      className: `calendar__day ${iso === today ? "calendar__day--today" : ""}`.trim(),
      attrs: { type: "button", "aria-label": `${formatDateDisplay(iso)}${dayEvents.length ? `, ${dayEvents.length} event(s)` : ""}` },
      children: dot ? [dayNumber, dot] : [dayNumber],
      onClick: () => openAddOrViewDayModal(iso, dayEvents),
    });
    daysGrid.appendChild(cell);
  }

  grid.appendChild(daysGrid);
}

function openAddOrViewDayModal(iso, dayEvents) {
  if (dayEvents.length) {
    // Show first matching event's details, plus an option to add another.
    openCalendarEventDetail(dayEvents[0].id);
  }
  openAddEventModal({ date: iso });
}

function renderCalendarEventsList() {
  const listEl = dom.calendarEvents;
  if (!listEl) return;

  clearRenderedItems(listEl, ".calendar-event");

  const upcoming = state.calendarEvents
    .filter((event) => event.date >= todayISO())
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  setEmptyState(dom.calendarEventsEmptyState, upcoming.length === 0);
  if (!upcoming.length) return;

  const fragment = document.createDocumentFragment();
  upcoming.forEach((event) => fragment.appendChild(createCalendarEventElement(event)));
  listEl.appendChild(fragment);
}

function createCalendarEventElement(event) {
  const title = createEl("p", { className: "calendar-event__title", text: event.title });
  const meta = createEl("p", {
    className: "calendar-event__meta",
    text: `${event.type || "Event"} · ${formatDateDisplay(event.date)}${event.course ? ` · ${event.course}` : ""}`,
  });

  const viewBtn = createEl("button", {
    className: "button", text: "View", attrs: { type: "button" },
    onClick: () => openCalendarEventDetail(event.id),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger", text: "Delete", attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: `Delete event "${event.title}"?`,
        danger: true,
        onConfirm: () => {
          state.calendarEvents = state.calendarEvents.filter((e) => e.id !== event.id);
          if (ui.currentCalendarEventId === event.id && dom.calendarEventDetail) {
            dom.calendarEventDetail.hidden = true;
          }
          saveState();
          renderCalendar();
          renderDashboard();
          renderAnalytics();
        },
      });
    },
  });

  return createEl("li", {
    className: "calendar-event",
    dataset: { eventId: event.id },
    children: [title, meta, viewBtn, deleteBtn],
  });
}

function openCalendarEventDetail(eventId) {
  const event = state.calendarEvents.find((e) => e.id === eventId);
  if (!event || !dom.calendarEventDetail) return;
  ui.currentCalendarEventId = eventId;

  if (dom.calendarEventDetailTitle) dom.calendarEventDetailTitle.textContent = event.title;
  if (dom.calendarEventType) dom.calendarEventType.textContent = event.type || "--";
  if (dom.calendarEventDate) dom.calendarEventDate.textContent = formatDateDisplay(event.date);
  if (dom.calendarEventCourse) dom.calendarEventCourse.textContent = event.course || "--";
  if (dom.calendarEventNotes) dom.calendarEventNotes.textContent = event.notes || "";

  dom.calendarEventDetail.hidden = false;
}

function openAddEventModal(defaults = {}) {
  openFormModal({
    title: "Add Calendar Event",
    submitLabel: "Add",
    initialValues: defaults,
    fields: [
      { name: "title", label: "Event title", type: "text", required: true },
      {
        name: "type", label: "Type", type: "select",
        options: EVENT_TYPES.map((t) => ({ value: t, label: t })), value: "Lecture",
      },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "course", label: "Course", type: "select", options: courseSelectOptions() },
      { name: "notes", label: "Notes", type: "textarea", rows: 3 },
    ],
    onSubmit: (values) => {
      state.calendarEvents.push({
        id: generateId("ev"),
        title: values.title,
        type: values.type || "Other",
        date: values.date,
        course: values.course || "",
        notes: values.notes || "",
      });
      saveState();
      renderCalendar();
      renderDashboard();
      renderAnalytics();
    },
  });
}

function calendarShiftMonth(delta) {
  const d = ui.calendarViewDate;
  ui.calendarViewDate = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  renderCalendarGrid();
}

function calendarGoToToday() {
  ui.calendarViewDate = new Date();
  renderCalendarGrid();
}

function ensureCalendarAddButton() {
  const toolbar = dom.calendarTodayButton?.parentElement;
  if (!toolbar || qs('[data-add-marker="calendar-event"]', toolbar)) return;
  const addBtn = createEl("button", {
    className: "button button--primary",
    text: "＋ Add Event",
    attrs: { type: "button" },
    dataset: { addMarker: "calendar-event" },
    onClick: () => openAddEventModal({ date: todayISO() }),
  });
  toolbar.appendChild(addBtn);
}

/* =========================================================
   15. GRADES / GPA CALCULATOR
   ========================================================= */
function calculateSemesterGpa(grades) {
  const currentSemester = state.settings.currentSemester;
  const relevant = grades.filter((g) => (g.semester || currentSemester) === currentSemester);
  return computeWeightedGpa(relevant);
}

function calculateCumulativeGpa(grades) {
  return computeWeightedGpa(grades);
}

function computeWeightedGpa(grades) {
  if (!grades.length) return null;
  let totalPoints = 0;
  let totalCredits = 0;
  grades.forEach((g) => {
    const credits = safeNumber(g.creditHours, 0);
    const points = safeNumber(g.gradePoints, 0);
    totalPoints += points * credits;
    totalCredits += credits;
  });
  if (totalCredits <= 0) return null;
  return totalPoints / totalCredits;
}

function renderGrades() {
  renderGpaTable();
  renderGpaSummary();
  populateGpaTargetInput();
}

function renderGpaTable() {
  const tbody = dom.gpaTableBody;
  if (!tbody) return;
  clearChildren(tbody);

  if (!state.grades.length) {
    const row = createEl("tr", { className: "gpa-table__empty-row" });
    row.appendChild(createEl("td", { text: "No grades recorded yet.", attrs: { colspan: "5" } }));
    tbody.appendChild(row);
    return;
  }

  state.grades
    .slice()
    .sort((a, b) => (b.semester || "").localeCompare(a.semester || ""))
    .forEach((grade) => tbody.appendChild(createGpaTableRow(grade)));
}

function createGpaTableRow(grade) {
  const row = createEl("tr", { dataset: { gradeId: grade.id } });
  row.appendChild(createEl("td", { text: grade.course || "--" }));
  row.appendChild(createEl("td", { text: String(grade.creditHours) }));
  row.appendChild(createEl("td", { text: grade.letterGrade }));
  row.appendChild(createEl("td", { text: grade.gradePoints.toFixed(1) }));

  const actionsCell = createEl("td");
  const deleteBtn = createEl("button", {
    className: "icon-button", text: "✕",
    attrs: { type: "button", "aria-label": `Delete grade for ${grade.course}` },
    onClick: () => {
      openConfirmModal({
        message: `Delete grade record for "${grade.course}"?`,
        danger: true,
        onConfirm: () => {
          state.grades = state.grades.filter((g) => g.id !== grade.id);
          saveState();
          renderGrades();
          renderDashboard();
          renderAnalytics();
        },
      });
    },
  });
  actionsCell.appendChild(deleteBtn);
  row.appendChild(actionsCell);

  return row;
}

function renderGpaSummary() {
  const semesterGpa = calculateSemesterGpa(state.grades);
  const cumulativeGpa = calculateCumulativeGpa(state.grades);
  const targetGpa = state.settings.targetGpa;

  if (dom.gpaSemesterValue) dom.gpaSemesterValue.textContent = semesterGpa === null ? "No data yet." : semesterGpa.toFixed(2);
  if (dom.gpaCumulativeValue) dom.gpaCumulativeValue.textContent = cumulativeGpa === null ? "No data yet." : cumulativeGpa.toFixed(2);
  if (dom.gpaTargetValue) dom.gpaTargetValue.textContent = targetGpa ? Number(targetGpa).toFixed(2) : "Not set";

  if (dom.gpaProjectionValue) {
    dom.gpaProjectionValue.textContent = calculateProjection(cumulativeGpa, targetGpa);
  }
}

function calculateProjection(cumulativeGpa, targetGpa) {
  if (!targetGpa) return "Set a target GPA";
  const gradedCourseNames = new Set(state.grades.map((g) => g.course));
  const remainingCourses = state.courses.filter((c) => !gradedCourseNames.has(c.name));
  const remainingCredits = remainingCourses.reduce((sum, c) => sum + safeNumber(c.creditHours, 0), 0);

  if (remainingCredits <= 0) {
    if (cumulativeGpa === null) return "No data yet.";
    return cumulativeGpa >= targetGpa ? "Target already reached" : "No remaining courses to raise GPA";
  }

  const existingCredits = state.grades.reduce((sum, g) => sum + safeNumber(g.creditHours, 0), 0);
  const currentPoints = cumulativeGpa === null ? 0 : cumulativeGpa * existingCredits;
  const totalCreditsAtEnd = existingCredits + remainingCredits;
  const neededPoints = targetGpa * totalCreditsAtEnd - currentPoints;
  const neededGpa = neededPoints / remainingCredits;

  if (neededGpa <= 0) return "Target already reached";
  if (neededGpa > 4.0) return "Target not achievable with remaining courses";
  return `Need ${neededGpa.toFixed(2)} avg in remaining courses`;
}

function populateGpaTargetInput() {
  if (dom.gpaTargetInput && state.settings.targetGpa) {
    dom.gpaTargetInput.value = state.settings.targetGpa;
  }
}

function letterGradeOptions() {
  return Object.keys(CONFIG.gradePointMap).map((letter) => ({ value: letter, label: letter }));
}

function openAddGradeModal() {
  openFormModal({
    title: "Add Grade",
    submitLabel: "Add",
    initialValues: { semester: state.settings.currentSemester },
    fields: [
      { name: "course", label: "Course", type: "select", options: courseSelectOptions(), required: true },
      { name: "creditHours", label: "Credit hours", type: "number", min: 0, max: 12, step: 1, value: 3, required: true },
      { name: "letterGrade", label: "Letter grade", type: "select", options: letterGradeOptions(), required: true },
      { name: "semester", label: "Semester", type: "text", required: true },
    ],
    onSubmit: (values) => {
      const gradePoints = CONFIG.gradePointMap[values.letterGrade];
      if (gradePoints === undefined) return;
      state.grades.push({
        id: generateId("g"),
        course: values.course,
        creditHours: safeNumber(values.creditHours, 3),
        letterGrade: values.letterGrade,
        gradePoints,
        semester: values.semester || state.settings.currentSemester,
      });
      saveState();
      renderGrades();
      renderDashboard();
      renderAnalytics();
    },
  });
}

function ensureAddGradeButton() {
  const section = dom.gpaTargetForm?.parentElement;
  if (!section || qs('[data-add-marker="grade"]', section)) return;
  const addBtn = createEl("button", {
    className: "button button--primary",
    text: "＋ Add Grade",
    attrs: { type: "button" },
    dataset: { addMarker: "grade" },
    onClick: () => openAddGradeModal(),
  });
  section.insertBefore(addBtn, dom.gpaTargetForm);
}

/* =========================================================
   16. ACADEMIC ANALYTICS
   ========================================================= */
function renderAnalytics() {
  renderAnalyticsStudyProgress();
  renderAnalyticsCourseProgress();
  renderAnalyticsTaskCompletion();
  renderAnalyticsStudyTime();
  renderAnalyticsGpaTrend();
  renderAnalyticsUpcomingWorkload();
}

function analyticsBody(sectionEl) {
  return sectionEl ? qs(".analytics-card__body", sectionEl) : null;
}

function setAnalyticsBody(sectionEl, children) {
  const body = analyticsBody(sectionEl);
  if (!body) return;
  clearChildren(body);
  children.forEach((child) => body.appendChild(child));
}

function renderAnalyticsStudyProgress() {
  const body = dom.analyticsStudyProgress;
  if (!state.courses.length) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }
  const average = state.courses.reduce((sum, c) => sum + safePercentage(c.progress), 0) / state.courses.length;
  const bar = createEl("div", { className: "analytics-bar" });
  const fill = createEl("div", { className: "analytics-bar__fill" });
  fill.style.width = `${average}%`;
  bar.appendChild(fill);
  const label = createEl("p", { text: `${average.toFixed(0)}% average across ${state.courses.length} course(s)` });
  setAnalyticsBody(body, [label, bar]);
}

function renderAnalyticsCourseProgress() {
  const body = dom.analyticsCourseProgress;
  if (!state.courses.length) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }
  const list = createEl("ul", { className: "analytics-list" });
  state.courses.forEach((c) => {
    list.appendChild(createEl("li", { text: `${c.name}: ${safePercentage(c.progress)}%` }));
  });
  setAnalyticsBody(body, [list]);
}

function renderAnalyticsTaskCompletion() {
  const body = dom.analyticsTaskCompletion;
  if (!state.tasks.length) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }
  const completed = state.tasks.filter((t) => t.completed).length;
  const percentage = (completed / state.tasks.length) * 100;
  const bar = createEl("div", { className: "analytics-bar" });
  const fill = createEl("div", { className: "analytics-bar__fill" });
  fill.style.width = `${percentage}%`;
  bar.appendChild(fill);
  const label = createEl("p", { text: `${completed} of ${state.tasks.length} tasks completed (${percentage.toFixed(0)}%)` });
  setAnalyticsBody(body, [label, bar]);
}

function renderAnalyticsStudyTime() {
  const body = dom.analyticsStudyTime;
  const completedSessions = state.studySessions.filter((s) => s.completed);
  if (!completedSessions.length) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }
  const totalMinutes = completedSessions.reduce((sum, s) => sum + safeNumber(s.duration, 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const label = createEl("p", {
    text: `${hours}h ${minutes}m logged across ${completedSessions.length} completed session(s)`,
  });
  setAnalyticsBody(body, [label]);
}

function renderAnalyticsGpaTrend() {
  const body = dom.analyticsGpaTrend;
  if (!state.grades.length) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }
  const semesters = Array.from(new Set(state.grades.map((g) => g.semester || state.settings.currentSemester)));
  const list = createEl("ul", { className: "analytics-list" });
  semesters.forEach((semester) => {
    const semGrades = state.grades.filter((g) => (g.semester || state.settings.currentSemester) === semester);
    const gpa = computeWeightedGpa(semGrades);
    list.appendChild(createEl("li", { text: `${semester}: ${gpa === null ? "--" : gpa.toFixed(2)}` }));
  });
  setAnalyticsBody(body, [list]);
}

function renderAnalyticsUpcomingWorkload() {
  const body = dom.analyticsUpcomingWorkload;
  const windowDays = CONFIG.upcomingWindowDays;

  const upcomingTasks = state.tasks.filter((t) => !t.completed && t.dueDate && isWithinNextDays(t.dueDate, windowDays));
  const upcomingEvents = state.calendarEvents.filter((e) => isWithinNextDays(e.date, windowDays));
  const upcomingSessions = state.studySessions.filter((s) => !s.completed && isWithinNextDays(s.date, windowDays));

  const total = upcomingTasks.length + upcomingEvents.length + upcomingSessions.length;
  if (!total) {
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: "No data yet." })]);
    return;
  }

  const list = createEl("ul", { className: "analytics-list" });
  list.appendChild(createEl("li", { text: `${upcomingTasks.length} task(s) due in the next ${windowDays} days` }));
  list.appendChild(createEl("li", { text: `${upcomingEvents.length} calendar event(s) in the next ${windowDays} days` }));
  list.appendChild(createEl("li", { text: `${upcomingSessions.length} planned study session(s) in the next ${windowDays} days` }));
  setAnalyticsBody(body, [list]);
}

/* =========================================================
   17. STUDY TOOLS (FLASHCARDS + QUIZZES)
   ========================================================= */
function renderStudyTools() {
  renderFlashcardDecks();
  renderQuizList();
}

function initializeStudyToolsTabs() {
  const tabs = qsa(".study-tools__tab");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("aria-controls");
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      qsa(".study-tools__panel").forEach((panel) => { panel.hidden = panel.id !== targetId; });
      ui.activeToolsTab = tab.dataset.toolsTab;
    });
  });
}

/* ---- Flashcards ---- */
function renderFlashcardDecks() {
  const container = dom.flashcardDecks;
  if (!container) return;
  clearChildren(container);

  const addDeckBtn = createEl("button", {
    className: "button button--primary", text: "＋ Add Deck",
    attrs: { type: "button" },
    onClick: () => openAddDeckModal(),
  });
  container.appendChild(addDeckBtn);

  if (!state.flashcardDecks.length) {
    container.appendChild(createEl("p", { className: "empty-state", text: "No flashcard decks yet." }));
    return;
  }

  state.flashcardDecks.forEach((deck) => {
    const title = createEl("h3", { text: deck.title });
    const count = createEl("p", { text: `${deck.cards.length} card(s)` });

    const studyBtn = createEl("button", {
      className: "button button--primary", text: "Study",
      attrs: { type: "button" },
      onClick: () => startFlashcardStudy(deck.id),
    });
    const addCardBtn = createEl("button", {
      className: "button", text: "＋ Add Card",
      attrs: { type: "button" },
      onClick: () => openAddFlashcardModal(deck),
    });
    const deleteBtn = createEl("button", {
      className: "button button--danger", text: "Delete Deck",
      attrs: { type: "button" },
      onClick: () => {
        openConfirmModal({
          message: `Delete deck "${deck.title}"?`,
          danger: true,
          onConfirm: () => {
            state.flashcardDecks = state.flashcardDecks.filter((d) => d.id !== deck.id);
            saveState();
            renderFlashcardDecks();
          },
        });
      },
    });

    const card = createEl("article", {
      className: "flashcard-deck",
      dataset: { deckId: deck.id },
      children: [title, count, studyBtn, addCardBtn, deleteBtn],
    });
    container.appendChild(card);
  });
}

function openAddDeckModal() {
  openFormModal({
    title: "Add Flashcard Deck",
    submitLabel: "Add",
    fields: [{ name: "title", label: "Deck title", type: "text", required: true }],
    onSubmit: (values) => {
      state.flashcardDecks.push({ id: generateId("deck"), title: values.title, cards: [] });
      saveState();
      renderFlashcardDecks();
    },
  });
}

function openAddFlashcardModal(deck) {
  openFormModal({
    title: `Add Card to "${deck.title}"`,
    submitLabel: "Add",
    fields: [
      { name: "front", label: "Question (front)", type: "textarea", rows: 2, required: true },
      { name: "back", label: "Answer (back)", type: "textarea", rows: 2, required: true },
    ],
    onSubmit: (values) => {
      deck.cards.push({ id: generateId("card"), front: values.front, back: values.back });
      saveState();
      renderFlashcardDecks();
    },
  });
}

function startFlashcardStudy(deckId) {
  const deck = state.flashcardDecks.find((d) => d.id === deckId);
  if (!deck || !deck.cards.length || !dom.flashcardContainer) return;

  ui.activeFlashcardDeckId = deckId;
  ui.flashcardIndex = 0;
  ui.flashcardFlipped = false;

  if (dom.flashcardDecks) dom.flashcardDecks.hidden = true;
  dom.flashcardContainer.hidden = false;

  ensureBackToDecksButton();
  renderFlashcardCard();
}

function ensureBackToDecksButton() {
  if (qs('[data-add-marker="back-to-decks"]', dom.flashcardContainer)) return;
  const backBtn = createEl("button", {
    className: "button", text: "← Back to decks",
    attrs: { type: "button" },
    dataset: { addMarker: "back-to-decks" },
    onClick: () => {
      dom.flashcardContainer.hidden = true;
      if (dom.flashcardDecks) dom.flashcardDecks.hidden = false;
      ui.activeFlashcardDeckId = null;
    },
  });
  dom.flashcardContainer.insertBefore(backBtn, dom.flashcardContainer.firstChild);
}

function renderFlashcardCard() {
  const deck = state.flashcardDecks.find((d) => d.id === ui.activeFlashcardDeckId);
  if (!deck || !deck.cards.length) return;

  const card = deck.cards[ui.flashcardIndex];
  if (dom.flashcardFront) dom.flashcardFront.textContent = card.front;
  if (dom.flashcardBack) dom.flashcardBack.textContent = card.back;
  if (dom.flashcardBack) dom.flashcardBack.hidden = !ui.flashcardFlipped;
  if (dom.flashcardProgress) dom.flashcardProgress.textContent = `${ui.flashcardIndex + 1} / ${deck.cards.length}`;
}

function flipFlashcard() {
  if (!ui.activeFlashcardDeckId) return;
  ui.flashcardFlipped = !ui.flashcardFlipped;
  renderFlashcardCard();
}

function flashcardStep(delta) {
  const deck = state.flashcardDecks.find((d) => d.id === ui.activeFlashcardDeckId);
  if (!deck || !deck.cards.length) return;
  ui.flashcardIndex = (ui.flashcardIndex + delta + deck.cards.length) % deck.cards.length;
  ui.flashcardFlipped = false;
  renderFlashcardCard();
}

/* ---- Quizzes ---- */
function renderQuizList() {
  const listEl = dom.quizList;
  if (!listEl) return;
  clearChildren(listEl);

  const addQuizBtn = createEl("button", {
    className: "button button--primary", text: "＋ Add Quiz",
    attrs: { type: "button" },
    onClick: () => openAddQuizModal(),
  });
  listEl.appendChild(createEl("li", { className: "quiz-list__toolbar", children: [addQuizBtn] }));

  if (!state.quizzes.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: "No quizzes yet." }));
    return;
  }

  state.quizzes.forEach((quiz) => {
    const title = createEl("span", { text: `${quiz.title} (${quiz.questions.length} question(s))` });
    const startBtn = createEl("button", {
      className: "button button--primary", text: "Start",
      attrs: { type: "button" },
      onClick: () => startQuiz(quiz.id),
    });
    const addQBtn = createEl("button", {
      className: "button", text: "＋ Add Question",
      attrs: { type: "button" },
      onClick: () => openAddQuestionModal(quiz),
    });
    const deleteBtn = createEl("button", {
      className: "button button--danger", text: "Delete",
      attrs: { type: "button" },
      onClick: () => {
        openConfirmModal({
          message: `Delete quiz "${quiz.title}"?`,
          danger: true,
          onConfirm: () => {
            state.quizzes = state.quizzes.filter((q) => q.id !== quiz.id);
            saveState();
            renderQuizList();
          },
        });
      },
    });
    listEl.appendChild(createEl("li", {
      className: "quiz-card", dataset: { quizId: quiz.id },
      children: [title, startBtn, addQBtn, deleteBtn],
    }));
  });
}

function openAddQuizModal() {
  openFormModal({
    title: "Add Quiz",
    submitLabel: "Add",
    fields: [{ name: "title", label: "Quiz title", type: "text", required: true }],
    onSubmit: (values) => {
      state.quizzes.push({ id: generateId("quiz"), title: values.title, questions: [] });
      saveState();
      renderQuizList();
    },
  });
}

function openAddQuestionModal(quiz) {
  openFormModal({
    title: `Add Question to "${quiz.title}"`,
    submitLabel: "Add",
    fields: [
      { name: "text", label: "Question", type: "textarea", rows: 2, required: true },
      { name: "optionA", label: "Option A", type: "text", required: true },
      { name: "optionB", label: "Option B", type: "text", required: true },
      { name: "optionC", label: "Option C", type: "text" },
      { name: "optionD", label: "Option D", type: "text" },
      {
        name: "correctOption", label: "Correct option", type: "select",
        options: [
          { value: "0", label: "Option A" }, { value: "1", label: "Option B" },
          { value: "2", label: "Option C" }, { value: "3", label: "Option D" },
        ],
        required: true,
      },
    ],
    onSubmit: (values) => {
      const options = [values.optionA, values.optionB, values.optionC, values.optionD].filter(
        (opt) => opt && opt.trim()
      );
      const correctIndex = Math.min(Number(values.correctOption), options.length - 1);
      quiz.questions.push({
        id: generateId("q"),
        text: values.text,
        options,
        correctIndex,
      });
      saveState();
      renderQuizList();
    },
  });
}

function startQuiz(quizId) {
  const quiz = state.quizzes.find((q) => q.id === quizId);
  if (!quiz || !quiz.questions.length || !dom.quizContainer) return;

  ui.activeQuizId = quizId;
  ui.quizIndex = 0;
  ui.quizScore = 0;
  ui.quizAnswers = {};

  if (dom.quizList) dom.quizList.hidden = true;
  dom.quizContainer.hidden = false;
  if (dom.quizResults) dom.quizResults.hidden = true;

  ensureQuizBackButton();
  renderQuizQuestion();
}

function ensureQuizBackButton() {
  if (qs('[data-add-marker="back-to-quizzes"]', dom.quizContainer)) return;
  const backBtn = createEl("button", {
    className: "button", text: "← Back to quizzes",
    attrs: { type: "button" },
    dataset: { addMarker: "back-to-quizzes" },
    onClick: () => {
      dom.quizContainer.hidden = true;
      if (dom.quizList) dom.quizList.hidden = false;
      ui.activeQuizId = null;
    },
  });
  dom.quizContainer.insertBefore(backBtn, dom.quizContainer.firstChild);
}

function renderQuizQuestion() {
  const quiz = state.quizzes.find((q) => q.id === ui.activeQuizId);
  if (!quiz) return;
  const question = quiz.questions[ui.quizIndex];

  if (dom.quizTitle) dom.quizTitle.textContent = quiz.title;
  if (dom.quizQuestionNumber) dom.quizQuestionNumber.textContent = `Question ${ui.quizIndex + 1} of ${quiz.questions.length}`;
  if (dom.quizQuestionText) dom.quizQuestionText.textContent = question.text;

  if (dom.quizOptions) {
    const legend = qs("legend", dom.quizOptions);
    clearChildren(dom.quizOptions);
    if (legend) dom.quizOptions.appendChild(legend);

    question.options.forEach((option, index) => {
      const inputId = `quizOption_${question.id}_${index}`;
      const input = createEl("input", {
        attrs: { type: "radio", name: "quizAnswer", id: inputId, value: String(index) },
      });
      if (ui.quizAnswers[question.id] === index) input.checked = true;
      const label = createEl("label", { attrs: { for: inputId }, children: [input, document.createTextNode(` ${option}`)] });
      dom.quizOptions.appendChild(label);
    });
  }

  if (dom.quizSubmitButton) {
    dom.quizSubmitButton.textContent = ui.quizIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question";
  }
}

function submitQuizAnswer() {
  const quiz = state.quizzes.find((q) => q.id === ui.activeQuizId);
  if (!quiz) return;
  const question = quiz.questions[ui.quizIndex];

  const selected = qs('input[name="quizAnswer"]:checked', dom.quizOptions);
  if (!selected) return;

  const selectedIndex = Number(selected.value);
  ui.quizAnswers[question.id] = selectedIndex;
  if (selectedIndex === question.correctIndex) ui.quizScore += 1;

  if (ui.quizIndex < quiz.questions.length - 1) {
    ui.quizIndex += 1;
    renderQuizQuestion();
  } else {
    finishQuiz(quiz);
  }
}

function finishQuiz(quiz) {
  if (dom.quizResults) dom.quizResults.hidden = false;
  if (dom.quizScore) {
    dom.quizScore.textContent = `Score: ${ui.quizScore} / ${quiz.questions.length}`;
  }
}

/* =========================================================
   18. GLOBAL SEARCH
   ========================================================= */
function runGlobalSearch(query) {
  const trimmed = (query || "").trim().toLowerCase();
  if (!dom.searchResults) return;

  if (!trimmed) {
    dom.searchResults.hidden = true;
    return;
  }

  const results = buildSearchResults(trimmed);

  dom.searchResults.hidden = false;
  clearChildren(dom.searchResultsList);

  if (dom.searchResultsStatus) {
    dom.searchResultsStatus.textContent = `${results.length} result(s) for "${query}"`;
  }
  setEmptyState(dom.searchEmptyState, results.length === 0);

  results.forEach((result) => {
    const label = createEl("span", { className: "global-search__result-title", text: result.title });
    const type = createEl("span", { className: "global-search__result-type", text: result.type });
    const button = createEl("button", {
      className: "global-search__result", attrs: { type: "button" },
      children: [label, type],
      onClick: () => {
        dom.searchResults.hidden = true;
        if (dom.globalSearchInput) dom.globalSearchInput.value = "";
        result.onSelect();
      },
    });
    dom.searchResultsList.appendChild(createEl("li", { children: [button] }));
  });
}

function buildSearchResults(query) {
  const results = [];
  const matches = (text) => typeof text === "string" && text.toLowerCase().includes(query);

  state.courses.forEach((c) => {
    if (matches(c.name) || matches(c.code) || matches(c.instructor)) {
      results.push({ type: "Course", title: c.name, onSelect: () => { navigateTo("courses"); openCourseDetail(c.id); } });
    }
  });

  state.notes.forEach((n) => {
    if (matches(n.title) || matches(n.course) || matches(n.body) || (n.tags || []).some(matches)) {
      results.push({ type: "Note", title: n.title || "Untitled note", onSelect: () => { navigateTo("notes"); openNoteDetail(n.id); } });
    }
  });

  state.tasks.forEach((t) => {
    if (matches(t.title) || matches(t.course)) {
      results.push({ type: "Task", title: t.title, onSelect: () => navigateTo("tasks") });
    }
  });

  state.schedule.forEach((s) => {
    if (matches(s.course) || matches(s.type)) {
      results.push({ type: "Schedule", title: `${s.course} — ${s.type}`, onSelect: () => navigateTo("schedule") });
    }
  });

  state.calendarEvents.forEach((e) => {
    if (matches(e.title) || matches(e.type) || matches(e.course)) {
      results.push({ type: "Calendar Event", title: e.title, onSelect: () => { navigateTo("calendar"); openCalendarEventDetail(e.id); } });
    }
  });

  state.studySessions.forEach((s) => {
    if (matches(s.course) || matches(s.goal)) {
      results.push({ type: "Study Session", title: `${s.course || "Study"} — ${s.goal || "session"}`, onSelect: () => navigateTo("study") });
    }
  });

  state.grades.forEach((g) => {
    if (matches(g.course) || matches(g.letterGrade)) {
      results.push({ type: "Grade", title: `${g.course}: ${g.letterGrade}`, onSelect: () => navigateTo("grades") });
    }
  });

  state.flashcardDecks.forEach((d) => {
    if (matches(d.title)) {
      results.push({ type: "Flashcard Deck", title: d.title, onSelect: () => { navigateTo("studyTools"); startFlashcardStudy(d.id); } });
    }
  });

  state.quizzes.forEach((q) => {
    if (matches(q.title)) {
      results.push({ type: "Quiz", title: q.title, onSelect: () => { navigateTo("studyTools"); startQuiz(q.id); } });
    }
  });

  return results;
}

/* =========================================================
   19. NAVIGATION
   Unified main-section navigation (nav links + swipe + keyboard
   + browser history) plus the mobile nav drawer ("sidebar").
   ========================================================= */

// Sections that exist as independent top-level views (toggled via [hidden]).
// This is also the ordered list used for swipe / keyboard / history navigation.
const TOGGLEABLE_SECTIONS = ["dashboard", "courses", "notes", "calendar", "grades", "analytics", "studyTools", "settings"];

// Sections that live inside the dashboard as anchors (scrolled into view).
const DASHBOARD_ANCHORS = ["schedule", "tasks", "study"];

function initializeNavigation() {
  if (dom.primaryNav) {
    qsa(".primary-nav__link", dom.primaryNav).forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = link.dataset.nav;
        if (!target) return;
        event.preventDefault();
        navigateTo(target);
        setActiveNavLink(target);
      });
    });
  }

  initializeSwipeNavigation();
  initializeKeyboardNavigation();
  initializeHistoryNavigation();
  initializeResizeHandling();
}

function navigateTo(target, options = {}) {
  if (DASHBOARD_ANCHORS.includes(target)) {
    showSection("dashboard", options);
    scrollToAnchor(target);
    setActiveNavLink(target);
    return;
  }

  if (TOGGLEABLE_SECTIONS.includes(target)) {
    showSection(target, options);
    setActiveNavLink(target);
    return;
  }

  // Unknown/unimplemented section (e.g. "aiAssistant"): fall back gracefully.
  showSection("dashboard", options);
  setActiveNavLink("dashboard");
}

function showSection(sectionId, options = {}) {
  if (!TOGGLEABLE_SECTIONS.includes(sectionId)) return;
  const { pushHistory = true } = options;
  const isChanging = ui.activeSection !== sectionId;

  TOGGLEABLE_SECTIONS.forEach((id) => {
    const section = dom[id];
    if (!section) return;
    section.hidden = id !== sectionId;
  });
  ui.activeSection = sectionId;

  if (isChanging && pushHistory) {
    updateHistoryForSection(sectionId);
  }
}

function scrollToAnchor(anchorId) {
  const el = document.getElementById(anchorId);
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setActiveNavLink(target) {
  if (!dom.primaryNav) return;
  qsa(".primary-nav__link", dom.primaryNav).forEach((link) => {
    const isActive = link.dataset.nav === target;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

/* ---- Main-section stepping helpers (shared by swipe / keyboard) ---- */
function getMainSectionIndex(sectionId) {
  const index = TOGGLEABLE_SECTIONS.indexOf(sectionId);
  return index === -1 ? 0 : index;
}

function goToMainSectionByIndex(index, options = {}) {
  const clamped = Math.max(0, Math.min(TOGGLEABLE_SECTIONS.length - 1, index));
  const targetId = TOGGLEABLE_SECTIONS[clamped];
  if (targetId === ui.activeSection) return false;
  navigateTo(targetId, options);
  return true;
}

function goToNextMainSection(options) {
  const currentIndex = getMainSectionIndex(ui.activeSection);
  if (currentIndex >= TOGGLEABLE_SECTIONS.length - 1) return false;
  return goToMainSectionByIndex(currentIndex + 1, options);
}

function goToPreviousMainSection(options) {
  const currentIndex = getMainSectionIndex(ui.activeSection);
  if (currentIndex <= 0) return false;
  return goToMainSectionByIndex(currentIndex - 1, options);
}

/* ---- Keyboard navigation ---- */
function isKeyboardNavigationExempt(target) {
  if (!target) return false;
  const tagName = target.tagName ? target.tagName.toLowerCase() : "";
  // Includes input[type=radio/checkbox] so the existing quiz answer
  // radio group keeps its native Arrow-key roving behavior.
  if (tagName === "input" || tagName === "textarea" || tagName === "select") return true;
  if (target.isContentEditable) return true;
  return false;
}

function initializeKeyboardNavigation() {
  document.addEventListener("keydown", (event) => {
    if (isKeyboardNavigationExempt(event.target)) return;

    // Do not change the main section behind an open modal.
    if (activeModalCleanup) return;

    switch (event.key) {
      case "ArrowLeft":
        if (goToPreviousMainSection()) event.preventDefault();
        break;
      case "ArrowRight":
        if (goToNextMainSection()) event.preventDefault();
        break;
      case "Home":
        if (goToMainSectionByIndex(0)) event.preventDefault();
        break;
      case "End":
        if (goToMainSectionByIndex(TOGGLEABLE_SECTIONS.length - 1)) event.preventDefault();
        break;
      default:
        break;
    }
  });
}

/* ---- Browser history integration ---- */
function updateHistoryForSection(sectionId, { replace = false } = {}) {
  if (!window.history || typeof window.history.pushState !== "function") return;
  const url = `#${sectionId}`;
  const historyState = { ubadSection: sectionId };
  try {
    if (replace) {
      window.history.replaceState(historyState, "", url);
    } else {
      window.history.pushState(historyState, "", url);
    }
  } catch (error) {
    // History API may be restricted in some embedded/sandboxed contexts;
    // section navigation itself still works without URL/back-button sync.
  }
}

function sectionFromHash(hash) {
  const id = (hash || "").replace(/^#\/?/, "");
  return TOGGLEABLE_SECTIONS.includes(id) ? id : null;
}

function handlePopState(event) {
  const sectionId =
    (event.state && TOGGLEABLE_SECTIONS.includes(event.state.ubadSection) && event.state.ubadSection) ||
    sectionFromHash(window.location.hash) ||
    "dashboard";
  navigateTo(sectionId, { pushHistory: false });
}

function initializeHistoryNavigation() {
  if (!window.history || typeof window.history.replaceState !== "function") return;
  window.addEventListener("popstate", handlePopState);
}

/* ---- Swipe / drag navigation for main sections ----
   Only the currently visible section can be given drag feedback: the
   HTML toggles sections via [hidden] rather than laying them out on a
   horizontal track, so a hidden neighbor has no position to "follow"
   the pointer with. See the missing-hooks note in the change report
   for the CSS/HTML addition that would enable full two-panel dragging. */
const SWIPE_MIN_DISTANCE = 12; // px of movement before axis intent is decided
const SWIPE_COMPLETE_RATIO = 0.22; // fraction of container width to trigger navigation
const SWIPE_COMPLETE_MIN_PX = 64;
const SWIPE_TRANSITION_MS = 220;

const swipeState = {
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  axis: null, // "horizontal" | "vertical" | null (undetermined)
  containerWidth: 0,
  rafId: null,
  pendingX: null,
};

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getActiveSectionEl() {
  return dom[ui.activeSection] || null;
}

function isSwipeExemptTarget(target) {
  if (!target || !target.closest) return false;
  return Boolean(
    target.closest(
      "button, a, input, textarea, select, label, [contenteditable], [role='button'], .gpa-table-section, .study-tools__tabs ul"
    )
  );
}

function initializeSwipeNavigation() {
  const container = dom.mainContent;
  if (!container || typeof window.PointerEvent === "undefined") return;

  // Allow native vertical scrolling; horizontal intent is detected in JS.
  container.style.touchAction = "pan-y";

  container.addEventListener("pointerdown", onSwipePointerDown, { passive: true });
  container.addEventListener("pointermove", onSwipePointerMove, { passive: false });
  container.addEventListener("pointerup", onSwipePointerEnd, { passive: true });
  container.addEventListener("pointercancel", onSwipePointerEnd, { passive: true });
}

function onSwipePointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (ui.isAnimating || activeModalCleanup) return;
  if (isSwipeExemptTarget(event.target)) return;

  swipeState.pointerId = event.pointerId;
  swipeState.startX = event.clientX;
  swipeState.startY = event.clientY;
  swipeState.lastX = event.clientX;
  swipeState.axis = null;
  swipeState.containerWidth = dom.mainContent.clientWidth || window.innerWidth;
  ui.isDragging = true;
}

function onSwipePointerMove(event) {
  if (swipeState.pointerId === null || event.pointerId !== swipeState.pointerId) return;

  const deltaX = event.clientX - swipeState.startX;
  const deltaY = event.clientY - swipeState.startY;

  if (swipeState.axis === null) {
    if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE && Math.abs(deltaY) < SWIPE_MIN_DISTANCE) {
      return;
    }
    swipeState.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    if (swipeState.axis === "vertical") {
      // Vertical scrolling wins; stop tracking so we never fight the browser.
      resetSwipeState();
      return;
    }
  }

  if (swipeState.axis !== "horizontal") return;

  event.preventDefault();
  swipeState.lastX = event.clientX;
  scheduleSwipeFrame(deltaX);
}

function scheduleSwipeFrame(deltaX) {
  swipeState.pendingX = deltaX;
  if (swipeState.rafId !== null) return;
  swipeState.rafId = requestAnimationFrame(() => {
    swipeState.rafId = null;
    applySwipeVisualFeedback(swipeState.pendingX);
  });
}

function applySwipeVisualFeedback(deltaX) {
  const sectionEl = getActiveSectionEl();
  if (!sectionEl) return;

  const currentIndex = getMainSectionIndex(ui.activeSection);
  const atFirst = currentIndex === 0;
  const atLast = currentIndex === TOGGLEABLE_SECTIONS.length - 1;

  let translateX = deltaX;
  if ((deltaX > 0 && atFirst) || (deltaX < 0 && atLast)) {
    translateX = deltaX * 0.35; // subtle resistance at the first/last section
  }

  sectionEl.style.transition = "none";
  sectionEl.style.willChange = "transform";
  sectionEl.style.transform = `translateX(${translateX}px)`;
}

function onSwipePointerEnd(event) {
  if (swipeState.pointerId === null || event.pointerId !== swipeState.pointerId) return;

  const deltaX = swipeState.lastX - swipeState.startX;
  const axis = swipeState.axis;
  const containerWidth = swipeState.containerWidth || window.innerWidth;

  resetSwipeState();

  if (axis !== "horizontal") return;

  const threshold = Math.max(SWIPE_COMPLETE_MIN_PX, containerWidth * SWIPE_COMPLETE_RATIO);
  const currentIndex = getMainSectionIndex(ui.activeSection);
  const atFirst = currentIndex === 0;
  const atLast = currentIndex === TOGGLEABLE_SECTIONS.length - 1;

  if (deltaX <= -threshold && !atLast) {
    completeSwipeNavigation("next");
  } else if (deltaX >= threshold && !atFirst) {
    completeSwipeNavigation("previous");
  } else {
    snapSwipeBack();
  }
}

function resetSwipeState() {
  swipeState.pointerId = null;
  swipeState.axis = null;
  swipeState.pendingX = null;
  if (swipeState.rafId !== null) {
    cancelAnimationFrame(swipeState.rafId);
    swipeState.rafId = null;
  }
  ui.isDragging = false;
}

function snapSwipeBack() {
  const sectionEl = getActiveSectionEl();
  if (!sectionEl) return;
  const reduceMotion = prefersReducedMotion();
  sectionEl.style.transition = reduceMotion ? "none" : `transform ${SWIPE_TRANSITION_MS}ms ease`;
  sectionEl.style.transform = "translateX(0)";

  const clearInlineStyles = () => {
    sectionEl.style.transition = "";
    sectionEl.style.transform = "";
    sectionEl.style.willChange = "";
    sectionEl.removeEventListener("transitionend", clearInlineStyles);
  };

  if (reduceMotion) {
    clearInlineStyles();
  } else {
    sectionEl.addEventListener("transitionend", clearInlineStyles);
  }
}

function completeSwipeNavigation(direction) {
  const sectionEl = getActiveSectionEl();
  if (!sectionEl || !dom.mainContent) return;

  ui.isAnimating = true;
  const reduceMotion = prefersReducedMotion();
  const containerWidth = dom.mainContent.clientWidth || window.innerWidth;
  const exitX = direction === "next" ? -containerWidth : containerWidth;

  const finishNavigation = () => {
    sectionEl.style.transition = "";
    sectionEl.style.transform = "";
    sectionEl.style.willChange = "";
    sectionEl.removeEventListener("transitionend", finishNavigation);

    if (direction === "next") goToNextMainSection();
    else goToPreviousMainSection();

    const newSectionEl = getActiveSectionEl();
    if (!newSectionEl) {
      ui.isAnimating = false;
      return;
    }

    const entryX = direction === "next" ? containerWidth : -containerWidth;
    newSectionEl.style.transition = "none";
    newSectionEl.style.transform = `translateX(${entryX}px)`;
    // Force a reflow so the browser registers the starting position
    // before the transition below is applied.
    void newSectionEl.offsetWidth;
    newSectionEl.style.transition = reduceMotion ? "none" : `transform ${SWIPE_TRANSITION_MS}ms ease`;
    newSectionEl.style.transform = "translateX(0)";

    const clearEntryStyles = () => {
      newSectionEl.style.transition = "";
      newSectionEl.style.transform = "";
      newSectionEl.style.willChange = "";
      newSectionEl.removeEventListener("transitionend", clearEntryStyles);
      ui.isAnimating = false;
    };

    if (reduceMotion) {
      clearEntryStyles();
    } else {
      newSectionEl.addEventListener("transitionend", clearEntryStyles);
    }
  };

  if (reduceMotion) {
    finishNavigation();
    return;
  }

  sectionEl.style.transition = `transform ${SWIPE_TRANSITION_MS}ms ease`;
  sectionEl.style.transform = `translateX(${exitX}px)`;
  sectionEl.addEventListener("transitionend", finishNavigation);
}

/* ---- Resize / orientation handling ---- */
function initializeResizeHandling() {
  let resizeTimer = null;
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (dom.mainContent) {
        swipeState.containerWidth = dom.mainContent.clientWidth || window.innerWidth;
      }
      // If a drag/animation was interrupted by the resize, clear any
      // leftover inline transform so the layout doesn't get stuck.
      if (!ui.isDragging && !ui.isAnimating) {
        const sectionEl = getActiveSectionEl();
        if (sectionEl) {
          sectionEl.style.transform = "";
          sectionEl.style.transition = "";
        }
      }
    }, 150);
  };
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
}

/* =========================================================
   20. SETTINGS
   ========================================================= */
function renderSettings() {
  const container = dom.settingsContent;
  if (!container) return;
  clearChildren(container);

  const themeSection = createEl("section", { className: "settings-block" });
  themeSection.appendChild(createEl("h2", { className: "section-subtitle", text: "Theme" }));
  const themeGroup = createEl("div", { className: "settings-block__actions", attrs: { role: "group", "aria-label": "Theme" } });
  const lightBtn = createEl("button", {
    className: `button ${state.settings.theme === "light" ? "button--primary" : ""}`.trim(),
    text: "Light", attrs: { type: "button" },
    onClick: () => { applyTheme("light"); saveState(); },
  });
  const darkBtn = createEl("button", {
    className: `button ${state.settings.theme === "dark" ? "button--primary" : ""}`.trim(),
    text: "Dark", attrs: { type: "button" },
    onClick: () => { applyTheme("dark"); saveState(); },
  });
  themeGroup.appendChild(lightBtn);
  themeGroup.appendChild(darkBtn);
  themeSection.appendChild(themeGroup);

  const semesterSection = createEl("section", { className: "settings-block" });
  semesterSection.appendChild(createEl("h2", { className: "section-subtitle", text: "Current Semester" }));
  const semesterLabel = createEl("label", { text: "Semester label used for new grades", attrs: { for: "settingsSemesterInput" } });
  const semesterInput = createEl("input", {
    attrs: { type: "text", id: "settingsSemesterInput", value: state.settings.currentSemester },
  });
  semesterInput.addEventListener("change", () => {
    state.settings.currentSemester = semesterInput.value.trim() || "Current Semester";
    saveState();
    renderGrades();
    renderDashboard();
  });
  semesterSection.appendChild(semesterLabel);
  semesterSection.appendChild(semesterInput);

  const dataSection = createEl("section", { className: "settings-block" });
  dataSection.appendChild(createEl("h2", { className: "section-subtitle", text: "Data" }));
  const resetBtn = createEl("button", {
    className: "button button--danger", text: "Reset all application data",
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        title: "Reset all data",
        message: "This will permanently erase all courses, notes, tasks, schedule, calendar events, study sessions, grades, and study tools. This cannot be undone.",
        confirmLabel: "Reset everything",
        danger: true,
        onConfirm: () => resetState(),
      });
    },
  });
  dataSection.appendChild(resetBtn);

  container.appendChild(themeSection);
  container.appendChild(semesterSection);
  container.appendChild(dataSection);
}

/* =========================================================
   21. EVENT LISTENERS
   ========================================================= */
function initializeEventListeners() {
  if (dom.themeToggle) dom.themeToggle.addEventListener("click", toggleTheme);

  // Tasks
  if (dom.taskList) {
    dom.taskList.addEventListener("change", (event) => {
      const checkbox = event.target;
      if (!checkbox.classList || !checkbox.classList.contains("task-item__checkbox")) return;
      const taskItem = checkbox.closest(".task-item");
      if (taskItem) toggleTaskCompletion(taskItem.dataset.taskId);
    });
  }
  if (dom.addTaskButton) dom.addTaskButton.addEventListener("click", openAddTaskModal);

  // Study planner
  if (dom.addStudySessionButton) dom.addStudySessionButton.addEventListener("click", openAddStudySessionModal);
  qsa(".study-planner__view-toggle").forEach((btn) => {
    btn.addEventListener("click", () => setPlannerView(btn.dataset.plannerView));
  });

  // Courses
  if (dom.addCourseButton) dom.addCourseButton.addEventListener("click", openAddCourseModal);
  if (dom.coursesFilterInput) dom.coursesFilterInput.addEventListener("input", renderCourses);
  initializeCourseTabs();

  // Notes
  if (dom.addNoteButton) dom.addNoteButton.addEventListener("click", openAddNoteModal);
  if (dom.notesFilterInput) dom.notesFilterInput.addEventListener("input", renderNotes);
  if (dom.notesCourseFilter) dom.notesCourseFilter.addEventListener("change", renderNotes);
  if (dom.editNoteButton) {
    dom.editNoteButton.addEventListener("click", () => {
      const note = state.notes.find((n) => n.id === ui.currentNoteId);
      if (note) openEditNoteModal(note);
    });
  }
  if (dom.deleteNoteButton) {
    dom.deleteNoteButton.addEventListener("click", () => {
      const note = state.notes.find((n) => n.id === ui.currentNoteId);
      if (!note) return;
      openConfirmModal({
        message: `Delete note "${note.title}"?`,
        danger: true,
        onConfirm: () => {
          state.notes = state.notes.filter((n) => n.id !== note.id);
          if (dom.noteDetail) dom.noteDetail.hidden = true;
          ui.currentNoteId = null;
          saveState();
          renderNotes();
          renderAnalytics();
        },
      });
    });
  }

  // Calendar
  if (dom.calendarPrevButton) dom.calendarPrevButton.addEventListener("click", () => calendarShiftMonth(-1));
  if (dom.calendarNextButton) dom.calendarNextButton.addEventListener("click", () => calendarShiftMonth(1));
  if (dom.calendarTodayButton) dom.calendarTodayButton.addEventListener("click", calendarGoToToday);
  ensureCalendarAddButton();

  // Grades
  if (dom.gpaTargetForm) {
    dom.gpaTargetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = Number(dom.gpaTargetInput?.value);
      if (Number.isFinite(value) && value >= 0 && value <= 4) {
        state.settings.targetGpa = value;
        saveState();
        renderGpaSummary();
      }
    });
  }
  ensureAddGradeButton();

  // Study tools
  initializeStudyToolsTabs();
  if (dom.flashcard) dom.flashcard.addEventListener("click", flipFlashcard);
  if (dom.flashcard) {
    dom.flashcard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        flipFlashcard();
      }
    });
  }
  if (dom.flashcardPrevButton) dom.flashcardPrevButton.addEventListener("click", () => flashcardStep(-1));
  if (dom.flashcardNextButton) dom.flashcardNextButton.addEventListener("click", () => flashcardStep(1));
  if (dom.quizSubmitButton) dom.quizSubmitButton.addEventListener("click", submitQuizAnswer);

  // Global search
  if (dom.globalSearchForm) {
    dom.globalSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runGlobalSearch(dom.globalSearchInput?.value || "");
    });
  }
  if (dom.globalSearchInput) {
    dom.globalSearchInput.addEventListener("input", () => runGlobalSearch(dom.globalSearchInput.value));
  }
  document.addEventListener("click", (event) => {
    if (dom.globalSearch && !dom.globalSearch.contains(event.target)) {
      if (dom.searchResults) dom.searchResults.hidden = true;
    }
  });
}

/* =========================================================
   22. INITIALIZATION
   =================================================*/
function renderAll() {
  renderDashboard();
  renderSchedule();
  renderTasks();
  renderProgress();
  renderStudyPlanner();
  renderCourses();
  renderNotes();
  renderCalendar();
  renderGrades();
  renderAnalytics();
  renderStudyTools();
  renderSettings();
}

function init() {
  cacheDom();
  loadState();
  initializeTheme();
  initializeNavigation();
  initializeEventListeners();
  renderAll();

  // Ensure the correct section is visible on first load, honoring a
  // deep-linked hash if one is present, and sync it into history
  // without creating an extra back-button entry.
  const initialSection = sectionFromHash(window.location.hash) || "dashboard";
  showSection(initialSection, { pushHistory: false });
  setActiveNavLink(initialSection);
  updateHistoryForSection(initialSection, { replace: true });
}

document.addEventListener("DOMContentLoaded", init);