/* =========================================================
   Мова з Оксаною — інтерактивність сайту
   Чистий JavaScript (ES6+), без бібліотек
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initHeaderOnScroll();
  initActiveLinks();
  initReveal();
  initCounters();
  initCalculator();
  initQuiz();
  initWordOfDay();
  initHoliday();
  initForm();
  initToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- 1. Мобільне меню (бургер) ---------- */
function initMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  const toggleMenu = (open) => {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  };

  burger.addEventListener('click', () => {
    toggleMenu(!nav.classList.contains('is-open'));
  });

  // закриваємо меню після переходу за посиланням
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // закриваємо меню клавішею Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
}

/* ---------- 2. Тінь шапки при прокручуванні ---------- */
function initHeaderOnScroll() {
  const topbar = document.querySelector('.topbar');
  const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 3. Підсвічування активного пункту меню ---------- */
function initActiveLinks() {
  const links = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 4. Анімація появи блоків ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

/* ---------- 5. Лічильники статистики ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

/* ---------- 6. Калькулятор вартості ---------- */
function initCalculator() {
  const form = document.getElementById('calcForm');
  const type = document.getElementById('calcType');
  const lessons = document.getElementById('calcLessons');
  const lessonsOut = document.getElementById('calcLessonsOut');
  const total = document.getElementById('calcTotal');
  const note = document.getElementById('calcNote');

  const formatMoney = (value) => Math.round(value).toLocaleString('uk-UA');

  const getDiscount = (count) => {
    if (count >= 16) return 0.1;
    if (count >= 8) return 0.05;
    return 0;
  };

  const calculate = () => {
    const price = Number(type.value);
    const count = Number(lessons.value);
    const format = Number(form.querySelector('input[name="calcFormat"]:checked').value);
    const discount = getDiscount(count);

    const sum = price * count * format * (1 - discount);

    lessonsOut.textContent = count;
    total.textContent = formatMoney(sum);
    note.textContent = discount
      ? `Знижка ${discount * 100}% за пакет від ${discount === 0.1 ? 16 : 8} занять`
      : 'Візьміть пакет від 8 занять — отримайте знижку 5%';
  };

  form.addEventListener('input', calculate);
  form.addEventListener('submit', (e) => e.preventDefault());
  calculate();
}

/* ---------- 7. Тест «Перевір себе» ---------- */
const QUIZ = [
  {
    question: 'Де правильно поставлено наголос?',
    options: ['кро́пива', 'кропи́ва', 'кропива́'],
    answer: 2,
    explain: 'Правильно: кропива́ — наголос на останньому складі.'
  },
  {
    question: 'Яке слово пишеться з апострофом?',
    options: ['св’ято', 'м’ята', 'цв’ях'],
    answer: 1,
    explain: 'М’ята: апостроф ставимо після губного [м] перед я. Але «свято», «цвях» — без апострофа, бо перед губним є інший приголосний.'
  },
  {
    question: 'Як правильно вибачитися українською?',
    options: ['Вибачаюсь', 'Вибачте', 'Звиняюсь'],
    answer: 1,
    explain: 'Правильно: «Вибачте» або «Перепрошую». Форма «вибачаюсь» — ненормативна.'
  },
  {
    question: 'Як правильно написати?',
    options: ['пів Європи', 'пів-Європи', 'півЄвропи'],
    answer: 1,
    explain: 'Пів з власною назвою пишемо через дефіс: пів-Європи, пів-Києва.'
  },
  {
    question: 'Оберіть правильну форму кличного відмінка імені Ігор:',
    options: ['Ігор', 'Ігоре', 'Ігорю'],
    answer: 2,
    explain: 'Ігор належить до м’якої групи, тому в кличному відмінку — Ігорю.'
  },
  {
    question: 'Скільки букв в українському алфавіті?',
    options: ['32', '33', '34'],
    answer: 1,
    explain: 'В українському алфавіті 33 букви.'
  }
];

function initQuiz() {
  const quiz = document.getElementById('quiz');
  const counter = document.getElementById('quizCounter');
  const progress = document.getElementById('quizProgress');
  const question = document.getElementById('quizQuestion');
  const options = document.getElementById('quizOptions');
  const feedback = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNext');

  let current = 0;
  let score = 0;
  let finished = false;

  const render = () => {
    const item = QUIZ[current];
    counter.textContent = `Питання ${current + 1} з ${QUIZ.length}`;
    progress.style.width = `${(current / QUIZ.length) * 100}%`;
    question.textContent = item.question;
    feedback.textContent = '';
    nextBtn.disabled = true;
    nextBtn.textContent = current === QUIZ.length - 1 ? 'Показати результат' : 'Далі';

    options.innerHTML = '';
    item.options.forEach((text, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz__option';
      btn.textContent = text;
      btn.addEventListener('click', () => choose(index));
      options.appendChild(btn);
    });
  };

  const choose = (index) => {
    const item = QUIZ[current];
    const buttons = options.querySelectorAll('.quiz__option');

    buttons.forEach((btn) => { btn.disabled = true; });
    buttons[item.answer].classList.add('is-correct');

    if (index === item.answer) {
      score++;
      feedback.style.color = 'var(--c-success)';
      feedback.textContent = `Правильно! ${item.explain}`;
    } else {
      buttons[index].classList.add('is-wrong');
      feedback.style.color = 'var(--c-red)';
      feedback.textContent = `Помилка. ${item.explain}`;
    }
    nextBtn.disabled = false;
  };

  const showResult = () => {
    progress.style.width = '100%';
    counter.textContent = 'Тест завершено';

    let text;
    if (score === QUIZ.length) text = 'Чудово! Ваш рівень високий — пропоную поглиблену підготовку до НМТ.';
    else if (score >= 4) text = 'Добрий результат! Кілька занять допоможуть закрити прогалини.';
    else text = 'Варто повторити основи — почнімо з безкоштовного пробного заняття.';

    question.textContent = '';
    feedback.textContent = '';
    options.innerHTML = `
      <div class="quiz__result">
        <p class="quiz__score">${score}/${QUIZ.length}</p>
        <p>${text}</p>
      </div>`;

    nextBtn.textContent = 'Пройти ще раз';
    nextBtn.disabled = false;
    finished = true;
  };

  nextBtn.addEventListener('click', () => {
    if (finished) { // режим «Пройти ще раз»
      current = 0;
      score = 0;
      finished = false;
      render();
      return;
    }
    current++;
    if (current < QUIZ.length) render();
    else showResult();
  });

  quiz.setAttribute('data-ready', 'true');
  render();
}

/* ---------- 8. Слово дня (Web Speech API) ---------- */
const WORDS = [
  { word: 'Ґречний', stress: 'ґре́чний — прикметник', meaning: 'Чемний, ввічливий, люб’язний.', example: 'Він завжди був ґречним із сусідами.' },
  { word: 'Обіцянка', stress: 'обіця́нка — іменник', meaning: 'Слово, яким людина зобов’язується щось зробити.', example: 'Обіцянка — цяцянка, а дурневі радість.' },
  { word: 'Вподобайка', stress: 'вподоба́йка — іменник', meaning: 'Позначка «подобається» в соціальних мережах.', example: 'Допис зібрав сотню вподобайок.' },
  { word: 'Затишок', stress: 'за́тишок — іменник', meaning: 'Спокійне, приємне, комфортне місце чи стан.', example: 'У бабусиній хаті завжди панував затишок.' },
  { word: 'Кропив’янка', stress: 'кропив’я́нка — іменник', meaning: 'Невелика співоча пташка; також — висип на шкірі.', example: 'У кущах щебетала кропив’янка.' },
  { word: 'Хмарочос', stress: 'хмарочо́с — іменник', meaning: 'Дуже високий багатоповерховий будинок.', example: 'З вікна хмарочоса видно все місто.' },
  { word: 'Пательня', stress: 'пате́льня — іменник', meaning: 'Кухонний посуд для смаження.', example: 'Мама смажила деруни на чавунній пательні.' },
  { word: 'Чарівливий', stress: 'чарівли́вий — прикметник', meaning: 'Який зачаровує, привабливий.', example: 'Над рікою лунав чарівливий спів.' },
  { word: 'Завбачливий', stress: 'завба́чливий — прикметник', meaning: 'Який передбачає наслідки і заздалегідь готується.', example: 'Завбачливий турист узяв дощовик.' },
  { word: 'Цвіркун', stress: 'цвірку́н — іменник', meaning: 'Комаха, що видає характерні звуки.', example: 'Вечорами за піччю співав цвіркун.' }
];

function initWordOfDay() {
  const valueEl = document.getElementById('wordValue');
  const stressEl = document.getElementById('wordStress');
  const meaningEl = document.getElementById('wordMeaning');
  const exampleEl = document.getElementById('wordExample');
  const speakBtn = document.getElementById('wordSpeak');
  const nextBtn = document.getElementById('wordNext');

  // номер слова залежить від дня року — щодня нове слово
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  let index = dayOfYear % WORDS.length;

  const show = () => {
    const w = WORDS[index];
    valueEl.textContent = w.word;
    stressEl.textContent = w.stress;
    meaningEl.textContent = w.meaning;
    exampleEl.textContent = `«${w.example}»`;
  };

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % WORDS.length;
    show();
  });

  show();

  // озвучення слова за допомогою Web Speech API
  if (!('speechSynthesis' in window)) {
    speakBtn.hidden = true;
    return;
  }

  speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(WORDS[index].word);
    utterance.lang = 'uk-UA';
    utterance.rate = 0.85;
    utterance.onstart = () => speakBtn.classList.add('is-speaking');
    utterance.onend = () => speakBtn.classList.remove('is-speaking');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

/* ---------- 9. Найближче свято (зовнішній REST API Nager.Date) ---------- */
async function initHoliday() {
  const nameEl = document.getElementById('holidayName');
  const dateEl = document.getElementById('holidayDate');
  const API_URL = 'https://date.nager.at/api/v3/NextPublicHolidays/UA';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const holidays = await response.json();
    if (!holidays.length) throw new Error('Порожня відповідь');

    const next = holidays[0];
    const date = new Date(`${next.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((date - today) / 86400000);

    nameEl.textContent = next.localName;
    dateEl.textContent = `${date.toLocaleDateString('uk-UA', {
      day: 'numeric', month: 'long', year: 'numeric'
    })} — ${daysLeft === 0 ? 'сьогодні!' : `через ${daysLeft} ${plural(daysLeft, ['день', 'дні', 'днів'])}`}`;
  } catch (error) {
    nameEl.textContent = 'Не вдалося завантажити дані';
    dateEl.textContent = 'Спробуйте оновити сторінку пізніше.';
  }
}

/* відмінювання слова після числівника: 1 день, 2 дні, 5 днів */
function plural(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/* ---------- 10. Валідація форми запису ---------- */
function initForm() {
  const form = document.getElementById('signupForm');
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modalText');

  const rules = {
    name: {
      test: (v) => /^[A-Za-zА-Яа-яІіЇїЄєҐґ’'\- ]{2,40}$/.test(v.trim()),
      message: 'Введіть ім’я (від 2 літер)'
    },
    phone: {
      test: (v) => /^\+?380\d{9}$/.test(v.replace(/[\s()-]/g, '')),
      message: 'Формат: +380XXXXXXXXX'
    },
    email: {
      test: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      message: 'Некоректна адреса email'
    }
  };

  const validateField = (field) => {
    const rule = rules[field.name];
    if (!rule) return true;
    const valid = rule.test(field.value);
    field.classList.toggle('is-invalid', !valid);
    document.getElementById(`${field.name}Error`).textContent = valid ? '' : rule.message;
    return valid;
  };

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    Object.keys(rules).forEach((name) => {
      if (!validateField(form.elements[name])) valid = false;
    });

    const agree = form.elements.agree;
    document.getElementById('agreeError').textContent = agree.checked ? '' : 'Потрібна ваша згода';
    if (!agree.checked) valid = false;

    if (!valid) {
      form.querySelector('.is-invalid')?.focus();
      return;
    }

    const name = form.elements.name.value.trim();
    modalText.textContent = `${name}, я зателефоную вам найближчим часом, щоб узгодити час пробного заняття.`;

    // зберігаємо заявку локально (демонстрація роботи з Web Storage API)
    try {
      const requests = JSON.parse(localStorage.getItem('requests') || '[]');
      requests.push({
        name,
        phone: form.elements.phone.value,
        goal: form.elements.goal.value,
        date: new Date().toISOString()
      });
      localStorage.setItem('requests', JSON.stringify(requests));
    } catch (err) {
      /* localStorage може бути недоступним — це не критично */
    }

    form.reset();
    modal.showModal();
  });
}

/* ---------- 11. Кнопка «Нагору» ---------- */
function initToTop() {
  const btn = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
