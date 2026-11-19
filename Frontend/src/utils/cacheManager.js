/**
 * cacheManager.js
 * Handles client-side caching and background prefetching of Courses and Questions.
 * Enables 0ms instant loading on /acads, /questions, and course detail pages.
 */

const COURSES_KEY = 'kgp_cached_courses';
const QUESTIONS_KEY = 'kgp_cached_questions';
const TIMESTAMP_KEY = 'kgp_cache_timestamp';

export const getCachedCourses = () => {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading cached courses from localStorage:', e);
    return [];
  }
};

export const setCachedCourses = (courses) => {
  try {
    if (Array.isArray(courses) && courses.length > 0) {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    }
  } catch (e) {
    console.warn('Error saving courses to localStorage:', e);
  }
};

export const getCachedCoursesByCategory = (category) => {
  const allCourses = getCachedCourses();
  if (!category || !allCourses.length) return [];
  const target = category.toLowerCase().trim();
  return allCourses.filter(
    (c) => (c.category || c.section || '').toLowerCase().trim() === target
  );
};

export const getCachedCourseBySlugOrCode = (identifier) => {
  const allCourses = getCachedCourses();
  if (!identifier || !allCourses.length) return null;
  const cleanId = identifier.toLowerCase().trim();
  return (
    allCourses.find((c) => {
      const slug = (c.slug || c.title || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      const code = (c.code || '').toLowerCase().trim();
      return slug === cleanId || code === cleanId;
    }) || null
  );
};

export const getCachedQuestions = () => {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading cached questions from localStorage:', e);
    return [];
  }
};

export const setCachedQuestions = (questions) => {
  try {
    if (Array.isArray(questions) && questions.length > 0) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    }
  } catch (e) {
    console.warn('Error saving questions to localStorage:', e);
  }
};

export const prefetchAllData = async (apiBaseUrl) => {
  const base = apiBaseUrl || process.env.REACT_APP_API_URL || 'http://localhost:5000';

  try {
    const [coursesRes, questionsRes] = await Promise.allSettled([
      fetch(`${base}/api/courses`),
      fetch(`${base}/api/questions`),
    ]);

    if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
      const data = await coursesRes.value.json();
      const courses = data.courses || data.subjects || (Array.isArray(data) ? data : []);
      if (Array.isArray(courses) && courses.length > 0) {
        setCachedCourses(courses);
        window.dispatchEvent(new CustomEvent('kgp_courses_updated', { detail: courses }));
      }
    }

    if (questionsRes.status === 'fulfilled' && questionsRes.value.ok) {
      const questions = await questionsRes.value.json();
      if (Array.isArray(questions) && questions.length > 0) {
        setCachedQuestions(questions);
        window.dispatchEvent(new CustomEvent('kgp_questions_updated', { detail: questions }));
      }
    }
  } catch (error) {
    // Non-blocking background sync failure is caught silently
    console.debug('Background prefetch notice:', error);
  }
};
