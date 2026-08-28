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
   1b. LOCALIZATION
   ========================================================= */
const SUPPORTED_LANGUAGES = ["en", "ar"];
const DEFAULT_LANGUAGE = "en";

// Flat dot-path key -> translated string, per language.
// Add a new language by adding another top-level object here;
// t() and translateStaticUI() need no changes to support it.
const TRANSLATIONS = {
  en: {
    "common.cancel": "Cancel", "common.save": "Save", "common.add": "Add",
    "common.delete": "Delete", "common.edit": "Edit", "common.view": "View",
    "common.close": "Close", "common.closeDialog": "Close dialog",
    "common.confirmTitle": "Please confirm", "common.viewDetails": "View details",
    "common.completed": "Completed", "common.date": "Date", "common.type": "Type",
    "common.noCourse": "No course", "common.open": "Open", "common.previous": "Previous",
    "common.next": "Next", "common.submit": "Submit", "common.noDataYet": "No data yet.",
    "common.skipToContent": "Skip to main content",
    "header.program": "Year 2 · English Education",
    "header.searchLabel": "Search courses, notes, tasks, schedule, calendar, study plans and grades",
    "header.searchPlaceholder": "Search everything…", "header.runSearch": "Run search",
    "header.toggleTheme": "Toggle dark and light theme", "header.openNav": "Open navigation menu",
    "header.noResults": "No results found.", "header.greeting": "Hello, {{name}}",
    "nav.dashboard": "Dashboard", "nav.courses": "Courses", "nav.study": "Study",
    "nav.notes": "Notes", "nav.tasks": "Tasks", "nav.schedule": "Schedule",
    "nav.calendar": "Calendar", "nav.grades": "Grades", "nav.analytics": "Analytics",
    "nav.studyTools": "Study Tools", "nav.settings": "Settings",
    "dashboard.overview": "Academic Overview", "dashboard.pendingTasks": "Pending Tasks",
    "dashboard.upcomingExams": "Upcoming Exams", "dashboard.gpa": "GPA",
    "dashboard.todaySchedule": "Today's Schedule",
    "dashboard.noSchedule": "No schedule items yet. Your classes will appear here.",
    "tasks.empty": "No tasks yet. Add a task to get started.", "tasks.add": "Add Task",
    "tasks.edit": "Edit Task", "tasks.titleField": "Task title", "tasks.dueDate": "Due date",
    "tasks.priority": "Priority", "tasks.high": "High", "tasks.medium": "Medium", "tasks.low": "Low",
    "study.progress": "Study Progress",
    "study.noProgress": "Course progress will appear here once your courses are loaded.",
    "study.planner": "Study Planner", "study.addSession": "Add Study Session",
    "study.daily": "Daily", "study.weekly": "Weekly", "study.noSessions": "No study sessions planned yet.",
    "study.duration": "Duration (minutes)", "study.goal": "Study goal",
    "study.goalPlaceholder": "e.g. Review Chapter 4",
    "study.flashcards": "Flashcards", "study.quizzes": "Quizzes",
    "study.noDecks": "No flashcard decks yet.", "study.noQuizzes": "No quizzes yet.",
    "study.addDeck": "Add Flashcard Deck", "study.deckTitle": "Deck title",
    "study.questionFront": "Question (front)", "study.answerBack": "Answer (back)",
    "study.addQuiz": "Add Quiz", "study.quizTitle": "Quiz title", "study.question": "Question",
    "study.optionA": "Option A", "study.optionB": "Option B", "study.optionC": "Option C",
    "study.optionD": "Option D", "study.correctOption": "Correct option",
    "schedule.add": "Add Schedule Item", "schedule.startTime": "Start time",
    "schedule.typePlaceholder": "Lecture, Seminar, Lab…",
    "courses.filterPlaceholder": "Filter courses…", "courses.add": "Add Course",
    "courses.edit": "Edit Course", "courses.empty": "No courses loaded yet.",
    "courses.code": "Course code", "courses.instructor": "Instructor",
    "courses.creditHours": "Credit hours", "courses.creditHoursShort": "Credit Hours",
    "courses.status": "Status", "courses.progress": "Progress", "courses.resources": "Resources",
    "courses.assignments": "Assignments", "courses.noResources": "No resources added yet.",
    "courses.noNotes": "No notes for this course yet.", "courses.noAssignments": "No assignments yet.",
    "courses.noScheduleEntries": "No schedule entries yet.", "courses.singular": "Course",
    "courses.name": "Course name", "courses.notStarted": "Not started",
    "courses.inProgress": "In progress", "courses.progressPercent": "Progress (%)",
    "courses.addResource": "Add Resource", "courses.resourceTitle": "Resource title",
    "courses.linkOptional": "Link (optional)", "courses.linkPlaceholder": "https://…",
    "courses.addAssignment": "Add Assignment", "courses.assignmentTitle": "Assignment title",
    "notes.searchPlaceholder": "Search notes…", "notes.allCourses": "All courses",
    "notes.add": "Add Note", "notes.edit": "Edit Note", "notes.empty": "No notes yet.",
    "notes.titleField": "Note title", "notes.tags": "Tags (comma separated)",
    "notes.content": "Note content",
    "calendar.title": "Academic Calendar", "calendar.today": "Today",
    "calendar.upcomingEvents": "Upcoming Events", "calendar.noEvents": "No upcoming events.",
    "calendar.type": "Type", "calendar.date": "Date", "calendar.addEvent": "Add Calendar Event",
    "calendar.eventTitle": "Event title", "calendar.addEventBtn": "＋ Add Event",
    "grades.empty": "No grades recorded yet.", "grades.summary": "GPA Summary",
    "grades.semesterGpa": "Semester GPA", "grades.cumulativeGpa": "Cumulative GPA",
    "grades.targetGpa": "Target GPA", "grades.projectedGpa": "Projected GPA",
    "grades.courseGrades": "Course Grades", "grades.grade": "Grade", "grades.gradePoints": "Grade Points",
    "grades.setTarget": "Set Target", "grades.add": "Add Grade", "grades.letterGrade": "Letter grade",
    "grades.semester": "Semester", "grades.addBtn": "＋ Add Grade",
    "analytics.courseProgress": "Course Progress", "analytics.taskCompletion": "Task Completion",
    "analytics.studyTime": "Study Time", "analytics.gpaTrend": "GPA Trend",
    "analytics.upcomingWorkload": "Upcoming Workload",
    "settings.theme": "Theme", "settings.light": "Light", "settings.dark": "Dark",
    "settings.language": "Language", "settings.currentSemester": "Current Semester",
    "settings.semesterLabel": "Semester label used for new grades", "settings.data": "Data",
    "settings.resetButton": "Reset all application data", "settings.resetTitle": "Reset all data",
    "settings.resetWarning": "This will permanently erase all courses, notes, tasks, schedule, calendar events, study sessions, grades, and study tools. This cannot be undone.",
    "settings.resetConfirm": "Reset everything",
    "confirm.deleteSchedule": "Delete this schedule item?",
    "confirm.deleteSession": "Delete this study session?",
    "confirm.deleteNamed": 'Delete "{{name}}"?',
    "confirm.deleteCourse": 'Delete "{{name}}"? This will not delete related notes, tasks, or grades.',
    "confirm.deleteGrade": 'Delete grade record for "{{name}}"?',
    "validation.required": "This field is required.",
    "validation.number": "Please enter a valid number.",
    "validation.min": "Minimum value is {{min}}.",
    "validation.max": "Maximum value is {{max}}.",
    "study.questionOf": "Question {{current}} of {{total}}",
    "study.scoreOf": "Score: {{score}} / {{total}}",
    "study.studyButton": "Study", "study.deleteDeck": "Delete Deck", "study.start": "Start",
  },
  ar: {
    "common.cancel": "إلغاء", "common.save": "حفظ", "common.add": "إضافة",
    "common.delete": "حذف", "common.edit": "تعديل", "common.view": "عرض",
    "common.close": "إغلاق", "common.closeDialog": "إغلاق النافذة",
    "common.confirmTitle": "يرجى التأكيد", "common.viewDetails": "عرض التفاصيل",
    "common.completed": "مكتمل", "common.date": "التاريخ", "common.type": "النوع",
    "common.noCourse": "بدون مقرر", "common.open": "فتح", "common.previous": "السابق",
    "common.next": "التالي", "common.submit": "إرسال", "common.noDataYet": "لا توجد بيانات بعد.",
    "common.skipToContent": "الانتقال إلى المحتوى الرئيسي",
    "header.program": "الفرقة الثانية · تعليم اللغة الإنجليزية",
    "header.searchLabel": "ابحث في المقررات والملاحظات والمهام والجدول والتقويم وخطط الدراسة والدرجات",
    "header.searchPlaceholder": "ابحث في كل شيء…", "header.runSearch": "تشغيل البحث",
    "header.toggleTheme": "التبديل بين الوضع الفاتح والداكن", "header.openNav": "فتح قائمة التنقل",
    "header.noResults": "لا توجد نتائج.", "header.greeting": "مرحبًا، {{name}}",
    "nav.dashboard": "الرئيسية", "nav.courses": "المقررات", "nav.study": "الدراسة",
    "nav.notes": "الملاحظات", "nav.tasks": "المهام", "nav.schedule": "الجدول",
    "nav.calendar": "التقويم", "nav.grades": "الدرجات", "nav.analytics": "التحليلات",
    "nav.studyTools": "أدوات الدراسة", "nav.settings": "الإعدادات",
    "dashboard.overview": "نظرة عامة أكاديمية", "dashboard.pendingTasks": "المهام المعلقة",
    "dashboard.upcomingExams": "الاختبارات القادمة", "dashboard.gpa": "المعدل التراكمي",
    "dashboard.todaySchedule": "جدول اليوم",
    "dashboard.noSchedule": "لا توجد عناصر في الجدول بعد. ستظهر محاضراتك هنا.",
    "tasks.empty": "لا توجد مهام بعد. أضف مهمة للبدء.", "tasks.add": "إضافة مهمة",
    "tasks.edit": "تعديل المهمة", "tasks.titleField": "عنوان المهمة", "tasks.dueDate": "تاريخ الاستحقاق",
    "tasks.priority": "الأولوية", "tasks.high": "عالية", "tasks.medium": "متوسطة", "tasks.low": "منخفضة",
    "study.progress": "تقدم الدراسة",
    "study.noProgress": "سيظهر تقدم المقررات هنا بعد تحميلها.",
    "study.planner": "مخطط الدراسة", "study.addSession": "إضافة جلسة دراسة",
    "study.daily": "يومي", "study.weekly": "أسبوعي", "study.noSessions": "لا توجد جلسات دراسة مخططة بعد.",
    "study.duration": "المدة (بالدقائق)", "study.goal": "هدف الدراسة",
    "study.goalPlaceholder": "مثال: مراجعة الفصل الرابع",
    "study.flashcards": "البطاقات التعليمية", "study.quizzes": "الاختبارات القصيرة",
    "study.noDecks": "لا توجد مجموعات بطاقات بعد.", "study.noQuizzes": "لا توجد اختبارات بعد.",
    "study.addDeck": "إضافة مجموعة بطاقات", "study.deckTitle": "عنوان المجموعة",
    "study.questionFront": "السؤال (الوجه الأمامي)", "study.answerBack": "الإجابة (الوجه الخلفي)",
    "study.addQuiz": "إضافة اختبار", "study.quizTitle": "عنوان الاختبار", "study.question": "السؤال",
    "study.optionA": "الخيار أ", "study.optionB": "الخيار ب", "study.optionC": "الخيار ج",
    "study.optionD": "الخيار د", "study.correctOption": "الخيار الصحيح",
    "schedule.add": "إضافة عنصر إلى الجدول", "schedule.startTime": "وقت البدء",
    "schedule.typePlaceholder": "محاضرة، سيمينار، معمل…",
    "courses.filterPlaceholder": "تصفية المقررات…", "courses.add": "إضافة مقرر",
    "courses.edit": "تعديل المقرر", "courses.empty": "لم يتم تحميل أي مقررات بعد.",
    "courses.code": "رمز المقرر", "courses.instructor": "أستاذ المقرر",
    "courses.creditHours": "الساعات المعتمدة", "courses.creditHoursShort": "الساعات المعتمدة",
    "courses.status": "الحالة", "courses.progress": "التقدم", "courses.resources": "المصادر",
    "courses.assignments": "الواجبات", "courses.noResources": "لا توجد مصادر مضافة بعد.",
    "courses.noNotes": "لا توجد ملاحظات لهذا المقرر بعد.", "courses.noAssignments": "لا توجد واجبات بعد.",
    "courses.noScheduleEntries": "لا توجد عناصر في الجدول بعد.", "courses.singular": "المقرر",
    "courses.name": "اسم المقرر", "courses.notStarted": "لم يبدأ",
    "courses.inProgress": "قيد التقدم", "courses.progressPercent": "التقدم (%)",
    "courses.addResource": "إضافة مصدر", "courses.resourceTitle": "عنوان المصدر",
    "courses.linkOptional": "رابط (اختياري)", "courses.linkPlaceholder": "https://…",
    "courses.addAssignment": "إضافة واجب", "courses.assignmentTitle": "عنوان الواجب",
    "notes.searchPlaceholder": "ابحث في الملاحظات…", "notes.allCourses": "كل المقررات",
    "notes.add": "إضافة ملاحظة", "notes.edit": "تعديل الملاحظة", "notes.empty": "لا توجد ملاحظات بعد.",
    "notes.titleField": "عنوان الملاحظة", "notes.tags": "الوسوم (مفصولة بفواصل)",
    "notes.content": "محتوى الملاحظة",
    "calendar.title": "التقويم الأكاديمي", "calendar.today": "اليوم",
    "calendar.upcomingEvents": "الأحداث القادمة", "calendar.noEvents": "لا توجد أحداث قادمة.",
    "calendar.type": "النوع", "calendar.date": "التاريخ", "calendar.addEvent": "إضافة حدث للتقويم",
    "calendar.eventTitle": "عنوان الحدث", "calendar.addEventBtn": "＋ إضافة حدث",
    "grades.empty": "لا توجد درجات مسجلة بعد.", "grades.summary": "ملخص المعدل التراكمي",
    "grades.semesterGpa": "معدل الفصل", "grades.cumulativeGpa": "المعدل التراكمي",
    "grades.targetGpa": "المعدل المستهدف", "grades.projectedGpa": "المعدل المتوقع",
    "grades.courseGrades": "درجات المقررات", "grades.grade": "الدرجة", "grades.gradePoints": "نقاط الدرجة",
    "grades.setTarget": "تحديد الهدف", "grades.add": "إضافة درجة", "grades.letterGrade": "التقدير",
    "grades.semester": "الفصل الدراسي", "grades.addBtn": "＋ إضافة درجة",
    "analytics.courseProgress": "تقدم المقررات", "analytics.taskCompletion": "إنجاز المهام",
    "analytics.studyTime": "وقت الدراسة", "analytics.gpaTrend": "اتجاه المعدل",
    "analytics.upcomingWorkload": "الأعباء القادمة",
    "settings.theme": "المظهر", "settings.light": "فاتح", "settings.dark": "داكن",
    "settings.language": "اللغة", "settings.currentSemester": "الفصل الدراسي الحالي",
    "settings.semesterLabel": "تسمية الفصل الدراسي المستخدمة للدرجات الجديدة", "settings.data": "البيانات",
    "settings.resetButton": "إعادة تعيين جميع بيانات التطبيق", "settings.resetTitle": "إعادة تعيين جميع البيانات",
    "settings.resetWarning": "سيؤدي هذا إلى حذف جميع المقررات والملاحظات والمهام والجدول وأحداث التقويم وجلسات الدراسة والدرجات وأدوات الدراسة نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
    "settings.resetConfirm": "إعادة تعيين كل شيء",
    "confirm.deleteSchedule": "هل تريد حذف عنصر الجدول هذا؟",
    "confirm.deleteSession": "هل تريد حذف جلسة الدراسة هذه؟",
    "confirm.deleteNamed": 'هل تريد حذف "{{name}}"؟',
    "confirm.deleteCourse": 'هل تريد حذف "{{name}}"؟ لن يؤدي هذا إلى حذف الملاحظات أو المهام أو الدرجات المرتبطة به.',
    "confirm.deleteGrade": 'هل تريد حذف سجل درجة "{{name}}"؟',
    "validation.required": "هذا الحقل مطلوب.",
    "validation.number": "يرجى إدخال رقم صحيح.",
    "validation.min": "الحد الأدنى للقيمة هو {{min}}.",
    "validation.max": "الحد الأقصى للقيمة هو {{max}}.",
    "study.questionOf": "السؤال {{current}} من {{total}}",
    "study.scoreOf": "النتيجة: {{score}} / {{total}}",
    "study.studyButton": "دراسة", "study.deleteDeck": "حذف المجموعة", "study.start": "ابدأ",
  },
};

/**
 * Translation lookup with {{placeholder}} interpolation.
 * Falls back to English, then to the raw key, per the required
 * "missing translation key -> fallback to English key/value" rule.
 */
function t(key, vars) {
  const lang = (state && state.settings && state.settings.language) || DEFAULT_LANGUAGE;
  let str = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key])
    ?? (TRANSLATIONS[DEFAULT_LANGUAGE] && TRANSLATIONS[DEFAULT_LANGUAGE][key])
    ?? key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(vars[k]));
    });
  }
  return str;
}

function applyDirection(lang) {
  const isRtl = lang === "ar";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.body.classList.toggle("is-rtl", isRtl);
}

/** Translates every element carrying data-i18n / data-i18n-placeholder / data-i18n-aria-label. */
function translateStaticUI() {
  qsa("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  qsa("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  qsa("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
  });
  document.title = "UBAD Academic Hub";
  updateGreeting();
}

function updateGreeting() {
  if (!dom.userGreeting) return;
  const name = state.settings.username || "Ubad";
  dom.userGreeting.textContent = t("header.greeting", { name });
}

/**
 * Switches the active language: persists it, flips document
 * direction/lang, re-translates static markup, and re-renders
 * every dynamic section so JS-generated text (modal labels,
 * card buttons, empty states, etc.) picks up the new language too.
 */
function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;
  state.settings.language = lang;
  applyDirection(lang);
  translateStaticUI();
  saveState();
  renderAll();
}

function initializeLocalization() {
  const lang = SUPPORTED_LANGUAGES.includes(state.settings.language)
    ? state.settings.language
    : DEFAULT_LANGUAGE;
  state.settings.language = lang;
  applyDirection(lang);
  translateStaticUI();
}

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
    language: "en",
    username: "",
  },
};

/* =========================================================
   3. APPLICATION STATE
   ========================================================= */
let state = cloneData(DEFAULT_STATE);

// Transient (non-persisted) UI state.
// ui.activeSection remains the single source of truth for the
// current main section ("currentMainSection"). isAnimating and
// isDragging support the swipe/keyboard navigation below.
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
    "userGreeting", "themeToggle", "mainContent",
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
    text: t("common.cancel"),
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
        field._errorEl.textContent = t("validation.min", { min: field.min });
        hasError = true;
      } else if (field.type === "number" && value !== null && field.max !== undefined && value > field.max) {
        field._errorEl.textContent = t("validation.max", { max: field.max });
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
    text: t("common.cancel"),
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
  const options = [{ value: "", label: t("common.noCourse") }];
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
        message: t("confirm.deleteSchedule"),
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
    title: t("schedule.add"),
    submitLabel: t("common.add"),
    initialValues: defaults,
    fields: [
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "type", label: t("common.type"), type: "text", placeholder: t("schedule.typePlaceholder") },
      { name: "date", label: t("common.date"), type: "date", required: true },
      { name: "time", label: t("schedule.startTime"), type: "time", required: true },
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
        message: t("confirm.deleteNamed", { name: task.title }),
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
    title: t("tasks.add"),
    submitLabel: t("common.add"),
    fields: [
      { name: "title", label: t("tasks.titleField"), type: "text", required: true },
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "dueDate", label: t("tasks.dueDate"), type: "date" },
      {
        name: "priority", label: t("tasks.priority"), type: "select",
        options: [{ value: "high", label: t("tasks.high") }, { value: "medium", label: t("tasks.medium") }, { value: "low", label: t("tasks.low") }],
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
    title: t("tasks.edit"),
    submitLabel: t("common.save"),
    initialValues: {
      title: task.title, course: task.course, dueDate: task.dueDate,
      priority: task.priority, completed: task.completed,
    },
    fields: [
      { name: "title", label: t("tasks.titleField"), type: "text", required: true },
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "dueDate", label: t("tasks.dueDate"), type: "date" },
      {
        name: "priority", label: t("tasks.priority"), type: "select",
        options: [{ value: "high", label: t("tasks.high") }, { value: "medium", label: t("tasks.medium") }, { value: "low", label: t("tasks.low") }],
      },
      { name: "completed", label: t("common.completed"), type: "checkbox" },
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
        message: t("confirm.deleteSession"),
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
    title: t("study.addSession"),
    submitLabel: t("common.add"),
    fields: [
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "date", label: t("common.date"), type: "date", required: true, value: todayISO() },
      { name: "startTime", label: t("schedule.startTime"), type: "time" },
      { name: "duration", label: t("study.duration"), type: "number", min: 5, max: 600, step: 5, value: 30 },
      { name: "goal", label: t("study.goal"), type: "text", placeholder: t("study.goalPlaceholder") },
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
    text: t("common.viewDetails"),
    attrs: { type: "button" },
    onClick: () => openCourseDetail(course.id),
  });
  const editBtn = createEl("button", {
    className: "button course-card__edit",
    text: t("common.edit"),
    attrs: { type: "button" },
    onClick: () => openEditCourseModal(course),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger course-card__delete",
    text: t("common.delete"),
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: t("confirm.deleteCourse", { name: course.name }),
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
    title: t("courses.add"),
    submitLabel: t("common.add"),
    fields: [
      { name: "name", label: t("courses.name"), type: "text", required: true },
      { name: "code", label: t("courses.code"), type: "text" },
      { name: "instructor", label: t("courses.instructor"), type: "text" },
      { name: "creditHours", label: t("courses.creditHours"), type: "number", min: 0, max: 12, step: 1, value: 3 },
      {
        name: "status", label: t("courses.status"), type: "select",
        options: [
          { value: "not-started", label: t("courses.notStarted") },
          { value: "in-progress", label: t("courses.inProgress") },
          { value: "completed", label: t("common.completed") },
        ],
        value: "in-progress",
      },
      { name: "progress", label: t("courses.progressPercent"), type: "number", min: 0, max: 100, step: 1, value: 0 },
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
    title: t("courses.edit"),
    submitLabel: t("common.save"),
    initialValues: {
      name: course.name, code: course.code, instructor: course.instructor,
      creditHours: course.creditHours, status: course.status, progress: course.progress,
    },
    fields: [
      { name: "name", label: t("courses.name"), type: "text", required: true },
      { name: "code", label: t("courses.code"), type: "text" },
      { name: "instructor", label: t("courses.instructor"), type: "text" },
      { name: "creditHours", label: t("courses.creditHours"), type: "number", min: 0, max: 12, step: 1 },
      {
        name: "status", label: t("courses.status"), type: "select",
        options: [
          { value: "not-started", label: t("courses.notStarted") },
          { value: "in-progress", label: t("courses.inProgress") },
          { value: "completed", label: t("common.completed") },
        ],
      },
      { name: "progress", label: t("courses.progressPercent"), type: "number", min: 0, max: 100, step: 1 },
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
      onClick,
    });
    container.parentElement.insertBefore(btn, container);
  }
  return btn;
}

function renderCourseResourcesPanel(course) {
  const listEl = dom.courseResourcesList;
  if (!listEl) return;
  ensureAddButton(listEl, "＋ Add Resource", () => openAddResourceModal(course), "resources");

  clearChildren(listEl);
  if (!course.resources.length) {
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("courses.noResources") }));
    return;
  }
  course.resources.forEach((res) => {
    const label = createEl("span", { text: res.title });
    const link = res.url
      ? createEl("a", { text: t("common.open"), attrs: { href: res.url, target: "_blank", rel: "noopener noreferrer" } })
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
    title: t("courses.addResource"),
    submitLabel: t("common.add"),
    fields: [
      { name: "title", label: t("courses.resourceTitle"), type: "text", required: true },
      { name: "url", label: t("courses.linkOptional"), type: "text", placeholder: t("courses.linkPlaceholder") },
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
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("courses.noAssignments") }));
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
    title: t("courses.addAssignment"),
    submitLabel: t("common.add"),
    fields: [
      { name: "title", label: t("courses.assignmentTitle"), type: "text", required: true },
      { name: "dueDate", label: t("tasks.dueDate"), type: "date" },
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
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("courses.noNotes") }));
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
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("courses.noScheduleEntries") }));
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
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("grades.empty") }));
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
  select.appendChild(createEl("option", { text: t("notes.allCourses"), attrs: { value: "" } }));
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
    className: "button button--primary", text: t("common.view"),
    attrs: { type: "button" },
    onClick: () => openNoteDetail(note.id),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger", text: t("common.delete"),
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: t("confirm.deleteNamed", { name: note.title }),
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
    title: t("notes.add"),
    submitLabel: t("common.add"),
    fields: [
      { name: "title", label: t("notes.titleField"), type: "text", required: true },
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "date", label: t("common.date"), type: "date", value: todayISO() },
      { name: "tags", label: t("notes.tags"), type: "text" },
      { name: "body", label: t("notes.content"), type: "textarea", rows: 6 },
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
    title: t("notes.edit"),
    submitLabel: t("common.save"),
    initialValues: {
      title: note.title, course: note.course, date: note.date,
      tags: (note.tags || []).join(", "), body: note.body,
    },
    fields: [
      { name: "title", label: t("notes.titleField"), type: "text", required: true },
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "date", label: t("common.date"), type: "date" },
      { name: "tags", label: t("notes.tags"), type: "text" },
      { name: "body", label: t("notes.content"), type: "textarea", rows: 6 },
    ],
    onSubmit: (values) => {
      note.title = values.title;
      note.course = values.course || "";
      note.date = values.date || note.date;
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
    className: "button", text: t("common.view"), attrs: { type: "button" },
    onClick: () => openCalendarEventDetail(event.id),
  });
  const deleteBtn = createEl("button", {
    className: "button button--danger", text: t("common.delete"), attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        message: t("confirm.deleteNamed", { name: event.title }),
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
    title: t("calendar.addEvent"),
    submitLabel: t("common.add"),
    initialValues: defaults,
    fields: [
      { name: "title", label: t("calendar.eventTitle"), type: "text", required: true },
      {
        name: "type", label: t("common.type"), type: "select",
        options: EVENT_TYPES.map((t) => ({ value: t, label: t })), value: "Lecture",
      },
      { name: "date", label: t("common.date"), type: "date", required: true },
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions() },
      { name: "notes", label: t("nav.notes"), type: "textarea", rows: 3 },
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
    text: t("calendar.addEventBtn"),
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
    row.appendChild(createEl("td", { text: t("grades.empty"), attrs: { colspan: "5" } }));
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
        message: t("confirm.deleteGrade", { name: grade.course }),
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
    title: t("grades.add"),
    submitLabel: t("common.add"),
    initialValues: { semester: state.settings.currentSemester },
    fields: [
      { name: "course", label: t("courses.singular"), type: "select", options: courseSelectOptions(), required: true },
      { name: "creditHours", label: t("courses.creditHours"), type: "number", min: 0, max: 12, step: 1, value: 3, required: true },
      { name: "letterGrade", label: t("grades.letterGrade"), type: "select", options: letterGradeOptions(), required: true },
      { name: "semester", label: t("grades.semester"), type: "text", required: true },
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
    text: t("grades.addBtn"),
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    setAnalyticsBody(body, [createEl("p", { className: "empty-state", text: t("common.noDataYet") })]);
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
    container.appendChild(createEl("p", { className: "empty-state", text: t("study.noDecks") }));
    return;
  }

  state.flashcardDecks.forEach((deck) => {
    const title = createEl("h3", { text: deck.title });
    const count = createEl("p", { text: `${deck.cards.length} card(s)` });

    const studyBtn = createEl("button", {
      className: "button button--primary", text: t("study.studyButton"),
      attrs: { type: "button" },
      onClick: () => startFlashcardStudy(deck.id),
    });
    const addCardBtn = createEl("button", {
      className: "button", text: "＋ Add Card",
      attrs: { type: "button" },
      onClick: () => openAddFlashcardModal(deck),
    });
    const deleteBtn = createEl("button", {
      className: "button button--danger", text: t("study.deleteDeck"),
      attrs: { type: "button" },
      onClick: () => {
        openConfirmModal({
          message: t("confirm.deleteNamed", { name: deck.title }),
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
    title: t("study.addDeck"),
    submitLabel: t("common.add"),
    fields: [{ name: "title", label: t("study.deckTitle"), type: "text", required: true }],
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
    submitLabel: t("common.add"),
    fields: [
      { name: "front", label: t("study.questionFront"), type: "textarea", rows: 2, required: true },
      { name: "back", label: t("study.answerBack"), type: "textarea", rows: 2, required: true },
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
    listEl.appendChild(createEl("li", { className: "empty-state", text: t("study.noQuizzes") }));
    return;
  }

  state.quizzes.forEach((quiz) => {
    const title = createEl("span", { text: `${quiz.title} (${quiz.questions.length} question(s))` });
    const startBtn = createEl("button", {
      className: "button button--primary", text: t("study.start"),
      attrs: { type: "button" },
      onClick: () => startQuiz(quiz.id),
    });
    const addQBtn = createEl("button", {
      className: "button", text: "＋ Add Question",
      attrs: { type: "button" },
      onClick: () => openAddQuestionModal(quiz),
    });
    const deleteBtn = createEl("button", {
      className: "button button--danger", text: t("common.delete"),
      attrs: { type: "button" },
      onClick: () => {
        openConfirmModal({
          message: t("confirm.deleteNamed", { name: quiz.title }),
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
    title: t("study.addQuiz"),
    submitLabel: t("common.add"),
    fields: [{ name: "title", label: t("study.quizTitle"), type: "text", required: true }],
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
    submitLabel: t("common.add"),
    fields: [
      { name: "text", label: t("study.question"), type: "textarea", rows: 2, required: true },
      { name: "optionA", label: t("study.optionA"), type: "text", required: true },
      { name: "optionB", label: t("study.optionB"), type: "text", required: true },
      { name: "optionC", label: t("study.optionC"), type: "text" },
      { name: "optionD", label: t("study.optionD"), type: "text" },
      {
        name: "correctOption", label: t("study.correctOption"), type: "select",
        options: [
          { value: "0", label: t("study.optionA") }, { value: "1", label: t("study.optionB") },
          { value: "2", label: t("study.optionC") }, { value: "3", label: t("study.optionD") },
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
  if (dom.quizQuestionNumber) dom.quizQuestionNumber.textContent = t("study.questionOf", { current: ui.quizIndex + 1, total: quiz.questions.length });
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
    dom.quizScore.textContent = t("study.scoreOf", { score: ui.quizScore, total: quiz.questions.length });
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
  initializeSwipeNavigation();
  initializeKeyboardNavigation();
  initializeHistoryNavigation();
  initializeResizeHandling();
}

function navigateTo(target, options = {}) {
  ensureContentLayerFor(target);

  if (DASHBOARD_ANCHORS.includes(target)) {
    showSection("dashboard", options);
    scrollToAnchor(target);
    return;
  }

  if (TOGGLEABLE_SECTIONS.includes(target)) {
    showSection(target, options);
    return;
  }

  // Unknown/unimplemented section (e.g. "aiAssistant"): fall back gracefully.
  showSection("dashboard", options);
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

/* ---- Layer-scoped view stepping (swipe / keyboard) ----
   IMPORTANT: this intentionally does NOT step through
   TOGGLEABLE_SECTIONS (the main hub categories). Swipe/keyboard must
   never cross from one hub category into another — that hierarchical
   move only happens via explicit hub/back navigation. Instead this
   steps between the *subsections* of the CURRENT category only,
   reusing the exact same HUB_CATEGORIES.subsections list that Layer 2
   renders — a single source of truth for both the section cards and
   the in-layer swipe order. Categories with 0-1 subsections simply
   have nothing to step between, so swipe safely does nothing there. */
function getCurrentLayerViews() {
  const category = findHubCategory(layerState.category);
  if (!category || !category.subsections || category.subsections.length < 2) return [];
  return category.subsections;
}

function getCurrentLayerViewIndex() {
  const views = getCurrentLayerViews();
  if (!views.length) return 0;
  return Math.max(0, Math.min(views.length - 1, layerState.viewIndex || 0));
}

function activateLayerView(subsection) {
  if (!subsection) return;
  if (subsection.tab) {
    const tabBtn = document.querySelector(`[data-tools-tab="${subsection.tab}"]`);
    if (tabBtn) tabBtn.click();
  } else if (subsection.anchor) {
    scrollToAnchor(subsection.anchor);
  }
}

function goToLayerViewByIndex(index) {
  const views = getCurrentLayerViews();
  if (!views.length) return false;
  const clamped = Math.max(0, Math.min(views.length - 1, index));
  if (clamped === getCurrentLayerViewIndex()) return false;
  layerState.viewIndex = clamped;
  activateLayerView(views[clamped]);
  return true;
}

function goToNextLayerView() {
  return goToLayerViewByIndex(getCurrentLayerViewIndex() + 1);
}

function goToPreviousLayerView() {
  return goToLayerViewByIndex(getCurrentLayerViewIndex() - 1);
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

    // Do not change the current layer's view behind an open modal.
    if (activeModalCleanup) return;

    switch (event.key) {
      case "ArrowLeft":
        if (goToPreviousLayerView()) { event.preventDefault(); playUISound("spatialMove"); }
        break;
      case "ArrowRight":
        if (goToNextLayerView()) { event.preventDefault(); playUISound("spatialMove"); }
        break;
      case "Home":
        if (goToLayerViewByIndex(0)) event.preventDefault();
        break;
      case "End":
        if (goToLayerViewByIndex(getCurrentLayerViews().length - 1)) event.preventDefault();
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
      "button, a, input, textarea, select, label, [contenteditable], [role='button'], .gpa-table-section"
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

  const currentIndex = getCurrentLayerViewIndex();
  const viewCount = getCurrentLayerViews().length;
  const atFirst = viewCount === 0 || currentIndex === 0;
  const atLast = viewCount === 0 || currentIndex === viewCount - 1;

  let translateX = deltaX;
  if ((deltaX > 0 && atFirst) || (deltaX < 0 && atLast)) {
    translateX = deltaX * 0.35; // subtle resistance at the first/last view in this layer
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
  const currentIndex = getCurrentLayerViewIndex();
  const viewCount = getCurrentLayerViews().length;
  const atFirst = viewCount === 0 || currentIndex === 0;
  const atLast = viewCount === 0 || currentIndex === viewCount - 1;

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

    if (direction === "next") goToNextLayerView();
    else goToPreviousLayerView();
    playUISound("spatialMove");

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

  const languageSection = createEl("section", { className: "settings-block" });
  languageSection.appendChild(createEl("h2", { className: "section-subtitle", text: t("settings.language") }));
  const languageGroup = createEl("div", { className: "settings-block__actions", attrs: { role: "group", "aria-label": t("settings.language") } });
  const enBtn = createEl("button", {
    className: `button ${state.settings.language === "en" ? "button--primary" : ""}`.trim(),
    text: "English", attrs: { type: "button" },
    onClick: () => setLanguage("en"),
  });
  const arBtn = createEl("button", {
    className: `button ${state.settings.language === "ar" ? "button--primary" : ""}`.trim(),
    text: "العربية", attrs: { type: "button" },
    onClick: () => setLanguage("ar"),
  });
  languageGroup.appendChild(enBtn);
  languageGroup.appendChild(arBtn);
  languageSection.appendChild(languageGroup);

  const themeSection = createEl("section", { className: "settings-block" });
  themeSection.appendChild(createEl("h2", { className: "section-subtitle", text: t("settings.theme") }));
  const themeGroup = createEl("div", { className: "settings-block__actions", attrs: { role: "group", "aria-label": t("settings.theme") } });
  const lightBtn = createEl("button", {
    className: `button ${state.settings.theme === "light" ? "button--primary" : ""}`.trim(),
    text: t("settings.light"), attrs: { type: "button" },
    onClick: () => { applyTheme("light"); saveState(); },
  });
  const darkBtn = createEl("button", {
    className: `button ${state.settings.theme === "dark" ? "button--primary" : ""}`.trim(),
    text: t("settings.dark"), attrs: { type: "button" },
    onClick: () => { applyTheme("dark"); saveState(); },
  });
  themeGroup.appendChild(lightBtn);
  themeGroup.appendChild(darkBtn);
  themeSection.appendChild(themeGroup);

  const semesterSection = createEl("section", { className: "settings-block" });
  semesterSection.appendChild(createEl("h2", { className: "section-subtitle", text: t("settings.currentSemester") }));
  const semesterLabel = createEl("label", { text: t("settings.semesterLabel"), attrs: { for: "settingsSemesterInput" } });
  const semesterInput = createEl("input", {
    attrs: { type: "text", id: "settingsSemesterInput", value: state.settings.currentSemester },
  });
  semesterInput.addEventListener("change", () => {
    state.settings.currentSemester = semesterInput.value.trim() || t("settings.currentSemester");
    saveState();
    renderGrades();
    renderDashboard();
  });
  semesterSection.appendChild(semesterLabel);
  semesterSection.appendChild(semesterInput);

  const dataSection = createEl("section", { className: "settings-block" });
  dataSection.appendChild(createEl("h2", { className: "section-subtitle", text: t("settings.data") }));
  const resetBtn = createEl("button", {
    className: "button button--danger", text: t("settings.resetButton"),
    attrs: { type: "button" },
    onClick: () => {
      openConfirmModal({
        title: t("settings.resetTitle"),
        message: t("settings.resetWarning"),
        confirmLabel: t("settings.resetConfirm"),
        danger: true,
        onConfirm: () => resetState(),
      });
    },
  });
  dataSection.appendChild(resetBtn);

  container.appendChild(languageSection);
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
        message: t("confirm.deleteNamed", { name: note.title }),
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
   22. LAYERED 3D HUB NAVIGATION
   Adds a spatial "hub → category → content" experience on top of
   the existing section navigation. It does NOT replace or duplicate
   navigateTo() / showSection() / TOGGLEABLE_SECTIONS — it gates them
   behind two extra full-screen layers and reuses them for the actual
   content, so all existing rendering/state logic keeps working as-is.
   ========================================================= */

// Main hub categories map 1:1 to TOGGLEABLE_SECTIONS. Categories with
// more than one subsection get their own Layer 2 (section) screen;
// categories with a single (or no) subsection skip straight from the
// hub into Layer 3 content, since there is nothing meaningful to pick.
const HUB_CATEGORIES = [
  {
    id: "dashboard", icon: "🏠", label: "Dashboard", section: "dashboard",
    subsections: [
      { id: "overview", icon: "📊", label: "Overview", anchor: "overview" },
      { id: "schedule", icon: "🗓️", label: "Today's Schedule", anchor: "schedule" },
      { id: "tasks", icon: "✅", label: "Tasks", anchor: "tasks" },
      { id: "study", icon: "📖", label: "Study Progress", anchor: "study" },
    ],
  },
  { id: "courses", icon: "📚", label: "Courses", section: "courses", subsections: [] },
  { id: "notes", icon: "📝", label: "Notes", section: "notes", subsections: [] },
  { id: "calendar", icon: "📅", label: "Calendar", section: "calendar", subsections: [] },
  {
    id: "grades", icon: "🎓", label: "Grades / GPA", section: "grades",
    subsections: [
      { id: "gpaSummary", icon: "📈", label: "GPA Summary", anchor: "gpaSummarySection" },
      { id: "gpaTable", icon: "📋", label: "Course Grades", anchor: "gpaTableSection" },
    ],
  },
  { id: "analytics", icon: "📊", label: "Analytics", section: "analytics", subsections: [] },
  {
    id: "studyTools", icon: "🧠", label: "Study Tools", section: "studyTools",
    subsections: [
      { id: "flashcards", icon: "🗂️", label: "Flashcards", tab: "flashcards" },
      { id: "quizzes", icon: "❓", label: "Quizzes", tab: "quizzes" },
    ],
  },
  { id: "settings", icon: "⚙️", label: "Settings", section: "settings", subsections: [] },
];

const layerState = {
  current: "hub", // "hub" | "section" | "content"
  category: null,
  viewIndex: 0, // index into the current category's subsections, used by layer-scoped swipe/keyboard stepping
  reducedMotion: false,
};

function findHubCategory(id) {
  return HUB_CATEGORIES.find((c) => c.id === id) || null;
}

/* ---- Centralized, optional UI sound system ----
   Three reserved slots, matching the three interaction types this
   spatial navigation produces: a tap/click, a spatial/3D swipe move,
   and a layer transition (entering/leaving hub, section, or content).
   Audio files are NOT included yet; every play() is wrapped so a
   missing/undropped file fails silently and never breaks navigation
   or logs a blocking error. Drop files at the paths below later —
   no other code needs to change. */
const SOUND_ASSETS = {
  click: "assets/audio/click.mp3",
  spatialMove: "assets/audio/spatial-move.mp3",
  navigation: "assets/audio/navigation.mp3",
  back: "assets/audio/back.mp3",
};
const audioCache = {};
function playUISound(type) {
  try {
    if (!SOUND_ASSETS[type]) return;
    let audio = audioCache[type];
    if (!audio) {
      audio = new Audio(SOUND_ASSETS[type]);
      audio.volume = 0.35;
      audioCache[type] = audio;
    }
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {}); // file missing / autoplay blocked — ignore silently
    }
  } catch (error) {
    // Audio must never interfere with navigation.
  }
}

function setBodyLayerClass(layer) {
  document.body.classList.remove("layer-hub", "layer-section", "layer-content");
  document.body.classList.add(`layer-${layer}`);
}

function renderHubStage() {
  const stage = document.getElementById("hubStage");
  if (!stage) return;
  clearChildren(stage);

  HUB_CATEGORIES.forEach((cat, index) => {
    const isFeatured = cat.id === "courses";
    const card = createEl("div", {
      className: isFeatured ? "hub-card hub-card--featured" : "hub-card",
      attrs: {
        role: "listitem",
        tabindex: "0",
        "data-category": cat.id,
        style: `--float-delay:${(index % 5) * 0.35}s`,
      },
    });
    const float = createEl("div", { className: "hub-card__float" });
    float.appendChild(createEl("span", { className: "hub-card__icon", text: cat.icon, attrs: { "aria-hidden": "true" } }));
    float.appendChild(createEl("span", { className: "hub-card__label", text: cat.label }));
    card.appendChild(float);

    card.addEventListener("click", () => selectHubCategory(cat.id, card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectHubCategory(cat.id, card);
      }
    });
    stage.appendChild(card);
  });
}

function selectHubCategory(categoryId, cardEl) {
  if (ui.isAnimating) return; // ignore taps while a layer transition is mid-flight
  const category = findHubCategory(categoryId);
  if (!category) return;
  playUISound("click");

  const stage = document.getElementById("hubStage");
  const cards = stage ? qsa(".hub-card", stage) : [];
  cards.forEach((c) => {
    if (c === cardEl) c.classList.add("is-selected");
    else c.classList.add("is-receding");
  });

  const proceed = () => {
    cards.forEach((c) => c.classList.remove("is-selected", "is-receding"));
    playUISound("navigation");
    if (category.subsections && category.subsections.length > 1) {
      goToSectionLayer(category.id);
    } else {
      goToContentLayer(category.id, category.subsections && category.subsections[0]);
    }
  };

  if (layerState.reducedMotion) proceed();
  else window.setTimeout(proceed, 320);
}

function renderSectionStage(categoryId) {
  const category = findHubCategory(categoryId);
  const stage = document.getElementById("sectionLayerStage");
  const title = document.getElementById("sectionLayerTitle");
  if (!stage || !category) return;
  if (title) title.textContent = category.label;
  clearChildren(stage);

  category.subsections.forEach((sub) => {
    const card = createEl("div", {
      className: "section-card",
      attrs: { role: "listitem", tabindex: "0", "data-subsection": sub.id },
    });
    card.appendChild(createEl("span", { className: "section-card__icon", text: sub.icon, attrs: { "aria-hidden": "true" } }));
    card.appendChild(createEl("span", { className: "section-card__label", text: sub.label }));

    const activate = () => {
      if (ui.isAnimating) return; // ignore taps while a layer transition is mid-flight
      playUISound("click");
      playUISound("navigation");
      goToContentLayer(category.id, sub);
    };
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
    });
    stage.appendChild(card);
  });
}

/* ---- Layer transition orchestrator ----
   Drives the actual "identify -> focus -> recede outgoing layer ->
   activate child -> bring child forward -> update state -> guard
   inactive layers" sequence described by the navigation spec, instead
   of just toggling [hidden] instantly. hub/section already carry a
   built-in CSS entrance animation (layer-fade-in / layer-slide-in)
   that fires automatically whenever their [hidden] attribute is
   removed, so this orchestrator only needs to (a) explicitly animate
   whichever layer is being LEFT, using the generic .layer-exiting /
   .layer-entering hooks already defined in the CSS for exactly this
   purpose, and (b) give the content layer (app-shell) an equivalent
   explicit entrance, since unlike hub/section it has no [hidden]
   toggle of its own to hang a CSS animation off of.
   Falls back to an instant swap (no animation) when reduced-motion is
   active, when instant:true is passed (initial load / deep links /
   silent layer alignment from search etc.), or when the relevant
   layer elements aren't in the DOM (defensive — never block nav). */
const LAYER_TRANSITION_FALLBACK_MS = 340;

function getLayerElement(layer) {
  if (layer === "hub") return document.getElementById("hubLayer");
  if (layer === "section") return document.getElementById("sectionLayer");
  if (layer === "content") return document.getElementById("appShell");
  return null;
}

// Resolves once the element's CSS animation/transition ends, or after
// fallbackMs regardless — guards against navigation getting stuck if a
// class change doesn't actually trigger an animation for any reason
// (e.g. the animation-duration token resolves to 0 in some theme).
function waitForLayerAnimation(el, fallbackMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.removeEventListener("animationend", finish);
      el.removeEventListener("animationcancel", finish);
      resolve();
    };
    el.addEventListener("animationend", finish);
    el.addEventListener("animationcancel", finish);
    window.setTimeout(finish, fallbackMs);
  });
}

function applyLayerVisibility(layer) {
  const hubLayer = document.getElementById("hubLayer");
  const sectionLayer = document.getElementById("sectionLayer");
  // Guard optional elements: preserves DOM safety if markup is ever trimmed.
  if (hubLayer) hubLayer.hidden = layer !== "hub";
  if (sectionLayer) sectionLayer.hidden = layer !== "section";
  setBodyLayerClass(layer);
}

// layer: "hub" | "section" | "content"
// options.instant: skip animation (init, deep links, silent realignment)
// options.onSettled: called once the DOM has fully switched to `layer`
function goToLayer(layer, options = {}) {
  const instant = Boolean(options.instant);
  const onSettled = typeof options.onSettled === "function" ? options.onSettled : null;
  const previous = layerState.current;
  layerState.current = layer;

  const finish = () => {
    if (onSettled) onSettled();
  };

  if (previous === layer) {
    applyLayerVisibility(layer);
    finish();
    return;
  }

  if (instant || layerState.reducedMotion) {
    applyLayerVisibility(layer);
    finish();
    return;
  }

  const outgoingEl = getLayerElement(previous);
  const incomingEl = getLayerElement(layer);

  if (!outgoingEl || !incomingEl || outgoingEl === incomingEl) {
    applyLayerVisibility(layer);
    finish();
    return;
  }

  ui.isAnimating = true;
  // Prevent interaction with the layer that's on its way out while it recedes.
  // Same fade+shrink exit is used whether we're going deeper or back out —
  // the element is already fully visible either way, so re-running the
  // *entrance* keyframe on it would snap it to the entrance's start state
  // (a visible flash) instead of smoothly receding.
  outgoingEl.style.pointerEvents = "none";
  outgoingEl.classList.add("layer-exiting");

  waitForLayerAnimation(outgoingEl, LAYER_TRANSITION_FALLBACK_MS).then(() => {
    outgoingEl.classList.remove("layer-exiting");
    outgoingEl.style.pointerEvents = "";
    applyLayerVisibility(layer);

    // Fire the caller's callback (content-section swap, focus, subsection
    // activation) the moment the new layer becomes the active one — NOT
    // after its cosmetic entrance animation finishes. Otherwise the
    // content layer would visibly show its *previous* section for the
    // duration of the entrance animation before snapping to the new one.
    finish();

    // hub/section already animate in on their own the moment [hidden]
    // is removed; only the content layer (app-shell) needs an explicit
    // entrance hook applied here, since it has no [hidden] toggle to
    // trigger one automatically. This runs concurrently with (not
    // gating) the callback above.
    if (layer === "content") {
      incomingEl.classList.add("layer-entering");
      waitForLayerAnimation(incomingEl, LAYER_TRANSITION_FALLBACK_MS).then(() => {
        incomingEl.classList.remove("layer-entering");
        ui.isAnimating = false;
      });
    } else {
      ui.isAnimating = false;
    }
  });
}

function goToSectionLayer(categoryId) {
  layerState.category = categoryId;
  renderSectionStage(categoryId);
  goToLayer("section", {
    onSettled: () => {
      const backBtn = document.getElementById("sectionLayerBack");
      if (backBtn) backBtn.focus();
    },
  });
}

function goToContentLayer(categoryId, subsection) {
  const category = findHubCategory(categoryId);
  layerState.category = categoryId;
  updateContentBackButton(category);

  goToLayer("content", {
    onSettled: () => {
      if (!category) return;
      navigateTo(category.section);

      // Keep the layer-scoped swipe/keyboard index in sync with whichever
      // subsection we're entering on, so a subsequent swipe continues
      // from the right position instead of resetting to 0.
      const views = category.subsections && category.subsections.length > 1 ? category.subsections : [];
      const subsectionIndex = subsection ? views.indexOf(subsection) : -1;
      layerState.viewIndex = subsectionIndex >= 0 ? subsectionIndex : 0;

      if (subsection) {
        if (subsection.tab) {
          window.requestAnimationFrame(() => {
            const tabBtn = document.querySelector(`[data-tools-tab="${subsection.tab}"]`);
            if (tabBtn) tabBtn.click();
          });
        } else if (subsection.anchor) {
          window.requestAnimationFrame(() => scrollToAnchor(subsection.anchor));
        }
      }
    },
  });
}

// Called from navigateTo() so that ANY route into a section (nav
// links, search results, swipe, keyboard, browser back/forward)
// also brings Layer 3 to the front, even if the user hasn't gone
// through the hub yet in this interaction. This is a silent realignment
// rather than a deliberate spatial gesture, so it skips the 3D transition.
function ensureContentLayerFor(target) {
  let sectionId = target;
  if (typeof DASHBOARD_ANCHORS !== "undefined" && DASHBOARD_ANCHORS.includes(target)) sectionId = "dashboard";
  if (typeof TOGGLEABLE_SECTIONS === "undefined" || !TOGGLEABLE_SECTIONS.includes(sectionId)) return;

  const category = HUB_CATEGORIES.find((c) => c.section === sectionId);
  if (category) layerState.category = category.id;
  if (layerState.current !== "content") goToLayer("content", { instant: true });
  updateContentBackButton(category);
}

function updateContentBackButton(category) {
  const backBtn = document.getElementById("contentLayerBack");
  const label = document.getElementById("contentLayerBackLabel");
  if (!backBtn) return;
  backBtn.hidden = false;
  const hasSectionLayer = Boolean(category && category.subsections && category.subsections.length > 1);
  const text = hasSectionLayer ? `Back to ${category.label}` : "Back to Hub";
  if (label) label.textContent = text;
  backBtn.setAttribute("aria-label", text); // the text span collapses to icon-only on narrow headers
  backBtn.dataset.target = hasSectionLayer ? "section" : "hub";
}

function goBackALayer() {
  if (ui.isAnimating) return; // ignore repeat taps while a transition is mid-flight
  playUISound("back");
  if (layerState.current === "content") {
    const category = findHubCategory(layerState.category);
    if (category && category.subsections && category.subsections.length > 1) {
      goToSectionLayer(category.id);
    } else {
      goToLayer("hub");
    }
  } else if (layerState.current === "section") {
    goToLayer("hub");
  }
}

function initLayerBackButtons() {
  const sectionBack = document.getElementById("sectionLayerBack");
  if (sectionBack) {
    sectionBack.addEventListener("click", () => {
      if (ui.isAnimating) return;
      playUISound("back");
      goToLayer("hub");
    });
  }

  const contentBack = document.getElementById("contentLayerBack");
  if (contentBack) contentBack.addEventListener("click", goBackALayer);
}

function initLayerEscapeKey() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (isKeyboardNavigationExempt(event.target)) return;
    if (activeModalCleanup) return;
    if (layerState.current === "section" || layerState.current === "content") goBackALayer();
  });
}

/* ---- Reduced motion ---- */
function initReducedMotionWatch() {
  if (!window.matchMedia) return;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    layerState.reducedMotion = mq.matches;
    document.body.classList.toggle("reduce-motion", mq.matches);
  };
  update();
  if (mq.addEventListener) mq.addEventListener("change", update);
  else if (mq.addListener) mq.addListener(update); // older Safari
}

/* ---- Pointer parallax (hub stage) + per-card tilt (hover-capable only) ---- */
function initHubParallax() {
  const stage = document.getElementById("hubStage");
  if (!stage) return;
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let rafId = null;
  let pendingX = 0.5;
  let pendingY = 0.5;

  stage.addEventListener("pointermove", (event) => {
    if (layerState.reducedMotion) return;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pendingX = (event.clientX - rect.left) / rect.width;
    pendingY = (event.clientY - rect.top) / rect.height;
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      applyHubParallax(pendingX, pendingY);
    });
  }, { passive: true });

  stage.addEventListener("pointerleave", () => {
    applyHubParallax(0.5, 0.5);
  }, { passive: true });
}

function applyHubParallax(x, y) {
  const stage = document.getElementById("hubStage");
  if (!stage) return;
  const rotateY = (x - 0.5) * 10;
  const rotateX = (0.5 - y) * 8;
  stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

let tiltRafId = null;
function handleCardTilt(event, selector) {
  const card = event.target && event.target.closest ? event.target.closest(selector) : null;
  if (tiltRafId !== null) return;
  tiltRafId = window.requestAnimationFrame(() => {
    tiltRafId = null;
    qsa(selector).forEach((el) => {
      if (el === card) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `translateZ(24px) rotateY(${(px * 14).toFixed(2)}deg) rotateX(${(-py * 14).toFixed(2)}deg)`;
      } else if (el.style.transform && !el.classList.contains("is-selected") && !el.classList.contains("is-receding")) {
        el.style.transform = "";
      }
    });
  });
}

function initHubCardTilt() {
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.addEventListener("pointermove", (event) => {
    if (layerState.reducedMotion) return;
    if (layerState.current === "hub") handleCardTilt(event, ".hub-card");
    else if (layerState.current === "section") handleCardTilt(event, ".section-card");
  }, { passive: true });
}

function initLayerSystem(deepLinkedSection) {
  initReducedMotionWatch();
  renderHubStage();
  initLayerBackButtons();
  initLayerEscapeKey();
  initHubParallax();
  initHubCardTilt();

  // Deep link (e.g. #courses, or a link shared while inside the app):
  // skip straight to that section's content layer instead of the hub.
  if (deepLinkedSection) {
    const category = HUB_CATEGORIES.find((c) => c.section === deepLinkedSection) || HUB_CATEGORIES[0];
    layerState.category = category.id;
    goToLayer("content", { instant: true });
    updateContentBackButton(category);
  } else {
    goToLayer("hub", { instant: true });
  }
}

/* =========================================================
   23. INITIALIZATION
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
  initializeLocalization();
  initializeTheme();
  initializeNavigation();
  initializeEventListeners();
  renderAll();

  // Capture the hash as the page actually loaded with, BEFORE any
  // history.replaceState below rewrites window.location.hash — the
  // layer system needs to know whether this was a genuine deep link.
  const deepLinkedSection = sectionFromHash(window.location.hash);

  // Ensure the correct section is visible on first load, honoring a
  // deep-linked hash if one is present, and sync it into history
  // without creating an extra back-button entry.
  const initialSection = deepLinkedSection || "dashboard";
  showSection(initialSection, { pushHistory: false });
  updateHistoryForSection(initialSection, { replace: true });

  // Layered 3D hub sits on top of everything above; it decides on its
  // own whether to show the hub or jump straight into a deep-linked section.
  initLayerSystem(deepLinkedSection);
}

document.addEventListener("DOMContentLoaded", init);