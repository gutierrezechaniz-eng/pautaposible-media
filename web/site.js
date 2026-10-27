(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabecera: menús desplegables y menú móvil ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const items = [...header.querySelectorAll('[data-nav-item]')];
    const toggle = header.querySelector('[data-menu-toggle]');
    const desktop = window.matchMedia('(min-width: 961px)');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let closeTimer;

    const setOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      item.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
    };
    const closeAll = (except) => items.forEach((item) => { if (item !== except) setOpen(item, false); });

    items.forEach((item) => {
      const trigger = item.querySelector('.nav-trigger');
      trigger.addEventListener('click', (event) => {
        // Con ratón, pasar por encima ya abre el menú: el clic encima no lo cierra.
        // Con teclado (detail 0) el botón sigue abriendo y cerrando.
        const hovering = desktop.matches && canHover.matches && event.detail > 0 && item.matches(':hover');
        const open = hovering || !item.classList.contains('is-open');
        if (desktop.matches) closeAll(item);
        setOpen(item, open);
      });
      item.addEventListener('mouseenter', () => {
        if (!desktop.matches || !canHover.matches) return;
        window.clearTimeout(closeTimer);
        closeAll(item);
        setOpen(item, true);
      });
      item.addEventListener('mouseleave', () => {
        if (!desktop.matches || !canHover.matches) return;
        closeTimer = window.setTimeout(() => setOpen(item, false), 160);
      });
    });

    document.addEventListener('click', (event) => {
      if (desktop.matches && !event.target.closest('[data-nav-item]')) closeAll();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = items.find((item) => item.classList.contains('is-open'));
      if (open) { setOpen(open, false); open.querySelector('.nav-trigger').focus(); }
      if (header.classList.contains('menu-open')) setMenu(false);
    });

    function setMenu(open) {
      header.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
      if (!open) closeAll();
    }
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    desktop.addEventListener('change', () => { setMenu(false); closeAll(); });

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Portada: pausar las animaciones (WCAG 2.2.2) ---------- */
  // Un botón para parar la banda, las etiquetas flotantes, la palabra que rota y las cantidades.
  // Se recuerda en este navegador; si el almacenamiento no está disponible, solo dura esta visita.
  const motionToggle = document.querySelector('[data-motion-toggle]');
  let motionPaused = false;
  try { motionPaused = localStorage.getItem('pp-motion-paused') === '1'; } catch { motionPaused = false; }
  const applyMotion = () => {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    if (motionToggle) motionToggle.textContent = motionPaused ? 'Reanudar animaciones' : 'Pausar animaciones';
  };
  if (motionToggle && !reduceMotion) {
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', () => {
      motionPaused = !motionPaused;
      try { localStorage.setItem('pp-motion-paused', motionPaused ? '1' : '0'); } catch { /* sin almacenamiento */ }
      applyMotion();
    });
  }
  if (!reduceMotion) applyMotion();

  /* ---------- Portada: palabra que rota y cantidades del móvil ---------- */
  // Todas las palabras están en el HTML, apiladas en la misma celda: el titular siempre ocupa
  // lo que la más larga y no mueve los botones al cambiar de palabra.
  const rotator = document.querySelector('[data-rotator]');
  if (rotator && !reduceMotion) {
    const words = [...rotator.querySelectorAll('.rot-word')];
    let index = Math.max(0, words.findIndex((word) => word.classList.contains('is-on')));
    if (words.length > 1) {
      window.setInterval(() => {
        if (motionPaused) return;
        words[index].classList.remove('is-on');
        index = (index + 1) % words.length;
        words[index].classList.add('is-on');
      }, 2600);
    }
  }
  const quantities = [...document.querySelectorAll('[data-qty]')];
  if (quantities.length && !reduceMotion) {
    let step = 0;
    window.setInterval(() => {
      if (motionPaused) return;
      step += 1;
      quantities.forEach((element) => {
        const values = element.dataset.qty.split(',');
        element.textContent = `${values[step % values.length]} g`;
      });
    }, 2000);
  }

  /* ---------- Portada: test de 1 minuto ---------- */
  const quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    const steps = [...document.querySelectorAll('[data-quiz-steps] i')];
    const questions = [
      { q: '¿Qué te gustaría cambiar primero?', o: ['Cocinar más sano sin complicarme', 'Entender qué es verdad en redes', 'Cuidar un tema de salud concreto', 'Cuidar mi peso con calma'] },
      { q: '¿Cuánto tiempo tienes para cocinar entre semana?', o: ['Menos de 15 minutos', 'Entre 15 y 30 minutos', 'Más de 30 minutos', 'Cocino el domingo para toda la semana'] },
      { q: '¿Cómo prefieres aprender?', o: ['Vídeos cortos', 'Recetas paso a paso', 'Leer guías con calma', 'Que alguien me acompañe'] },
    ];
    let answers = [];
    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text) node.textContent = text;
      return node;
    };
    const link = (href, className, text) => {
      const a = el('a', className, text);
      a.href = href;
      return a;
    };
    const renderQuiz = (focus = false) => {
      steps.forEach((stepEl, i) => stepEl.classList.toggle('on', i <= Math.min(answers.length, steps.length - 1)));
      quiz.replaceChildren();
      if (answers.length < questions.length) {
        const item = questions[answers.length];
        const title = el('h3', '', item.q);
        title.tabIndex = -1;
        const opts = el('div', 'opts');
        item.o.forEach((option, i) => {
          const button = el('button', 'opt', option);
          button.type = 'button';
          button.addEventListener('click', () => { answers.push(i); renderQuiz(true); });
          opts.append(button);
        });
        quiz.append(el('p', 'eyebrow', `Pregunta ${answers.length + 1} de ${questions.length}`), title, opts);
        if (focus) title.focus({ preventScroll: true });
        return;
      }
      // Un tema de salud concreto va primero a su profesional sanitario de referencia (aviso legal, apartados 3 y 5).
      const healthTopic = answers[0] === 2;
      const wantsCare = !healthTopic && (answers[0] === 3 || answers[2] === 3);
      const wantsScience = !healthTopic && (answers[0] === 1 || (answers[2] === 2 && !wantsCare));
      const title = el('h3');
      title.tabIndex = -1;
      if (healthTopic) {
        title.append('Para un tema de salud concreto, lo primero es ', el('b', '', 'tu profesional sanitario de referencia'), '.');
      } else {
        // «es» con singular y «son» con plural: «Lo que más te va a servir son las recetas…».
        const [verb, result] = wantsCare
          ? ['es', 'el seguimiento conmigo']
          : wantsScience
            ? ['son', 'Ciencia sin ruido y los mitos de cada semana']
            : ['son', 'las recetas con tus cantidades'];
        title.append(`Lo que más te va a servir ${verb} `, el('b', '', result), '.');
      }
      const tip = [
        'Empieza por las recetas de 15 minutos o menos, sobre todo ensaladas y salsas.',
        'Prueba esta semana una receta nueva de 20 a 30 minutos.',
        'Anímate con una de las recetas de 35 a 45 minutos.',
        'Elige dos o tres recetas que aguanten bien en la nevera y cocínalas el domingo.',
      ][answers[1]] || '';
      const detail = healthTopic
        ? 'Aquí puedes complementar lo que te indique con recetas sencillas y guías que explican la evidencia.'
        : wantsCare
          ? 'Tendrás tu carpeta con tus pautas y PDF, WhatsApp directo conmigo para dudas cortas y tu evolución en una gráfica.'
          : 'Con tu espacio gratis cada receta te dice cuánto poner según tu perfil.';
      const actions = el('div', 'q-actions');
      if (healthTopic) {
        actions.append(
          link('/aprende/', 'btn btn-main', 'Ver las guías'),
          link('/recetas/', 'btn btn-ghost', 'Ver recetas'),
        );
      } else {
        actions.append(
          wantsCare
            ? link('/app/?mode=care', 'btn btn-main', 'Pedir seguimiento')
            : link('/app/?mode=register', 'btn btn-main', 'Crear mi espacio gratis'),
          link(wantsScience ? '/ciencia/' : '/recetas/', 'btn btn-ghost', wantsScience ? 'Ir a Ciencia sin ruido' : 'Ver recetas'),
        );
      }
      const restart = el('button', 'btn btn-ghost', 'Repetir el test');
      restart.type = 'button';
      restart.addEventListener('click', () => { answers = []; renderQuiz(true); });
      actions.append(restart);
      const extras = [];
      if (answers[2] === 2) {
        const more = el('p', 'q-more', 'Para leer con calma: ');
        more.append(link('/aprende/', '', 'las guías breves de Aprende'), '.');
        extras.push(more);
      }
      if (answers[2] === 0) {
        const more = el('p', 'q-more', 'Si prefieres vídeos cortos: ');
        const ig = link('https://www.instagram.com/pautaposible/', '', 'Instagram');
        const yt = link('https://www.youtube.com/@pautaposible', '', 'YouTube');
        [ig, yt].forEach((a) => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
        more.append(ig, ' y ', yt, '.');
        extras.push(more);
      }
      if (healthTopic) {
        const care = el('p', 'q-more', 'Si además quieres seguimiento conmigo para organizar tu alimentación, puedes ');
        care.append(link('/app/?mode=care', '', 'pedirlo aquí'), '. No sustituye la consulta médica ni el tratamiento que te hayan indicado.');
        extras.push(care);
      }
      quiz.append(el('p', 'eyebrow', 'Tu resultado'), title, el('p', '', `${detail} ${tip}`), ...extras, actions);
      if (focus) title.focus({ preventScroll: true });
    };
    renderQuiz();
  }

  /* ---------- Portada: tarjetas «¿Mito o realidad?» ---------- */
  // El nombre del botón es siempre la pregunta (no cambia al pulsar). La respuesta se anuncia en una
  // región aparte y queda como descripción del botón mientras la tarjeta está girada.
  const mythButtons = [...document.querySelectorAll('[data-myth] .myth-in')];
  let mythAnnouncer = null;
  const srOnly = (tag) => { const node = document.createElement(tag); node.className = 'sr-only'; return node; };
  if (mythButtons.length) {
    mythAnnouncer = srOnly('p');
    mythAnnouncer.setAttribute('aria-live', 'polite');
    mythButtons[0].closest('[data-myth]').parentElement.after(mythAnnouncer);
  }
  mythButtons.forEach((button, index) => {
    const front = button.querySelector('.myth-front');
    const back = button.querySelector('.myth-back');
    const question = front.querySelector('strong');
    const answer = srOnly('span');
    answer.id = `myth-answer-${index + 1}`;
    answer.textContent = [...back.children].filter((child) => !child.classList.contains('tap')).map((child) => child.textContent.trim()).join('. ');
    answer.setAttribute('aria-hidden', 'true');
    button.after(answer);
    if (question) {
      question.id = `myth-question-${index + 1}`;
      button.setAttribute('aria-labelledby', question.id);
    }
    const sync = () => {
      const flipped = button.getAttribute('aria-pressed') === 'true';
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
      if (flipped) button.setAttribute('aria-describedby', answer.id);
      else button.removeAttribute('aria-describedby');
    };
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      sync();
      if (mythAnnouncer) {
        mythAnnouncer.textContent = '';
        if (button.getAttribute('aria-pressed') === 'true') window.setTimeout(() => { mythAnnouncer.textContent = answer.textContent; }, 60);
      }
    });
    sync();
  });

  /* ---------- Cabecera: página actual en enlaces directos ---------- */
  document.querySelectorAll('.nav-direct').forEach((anchor) => {
    if (location.pathname.startsWith(new URL(anchor.href).pathname)) anchor.setAttribute('aria-current', 'page');
  });

  /* ---------- Sesión: la misma en todas las páginas ---------- */
  async function rememberAccount() {
    const links = [...document.querySelectorAll('.nav-login')];
    if (!links.length && !document.querySelector('[data-app-link]')) return;
    try {
      const [{ auth }, firebaseAuthModule] = await Promise.all([
        import('/auth.js'),
        import('https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js'),
      ]);
      firebaseAuthModule.onAuthStateChanged(auth, (user) => {
        links.forEach((link) => {
          link.textContent = user ? 'Mi espacio' : 'Iniciar sesión';
          link.href = user ? '/app/' : '/app/?mode=login';
          link.classList.toggle('is-signed-in', Boolean(user));
        });
        // Quien ya tiene cuenta entra directo a la app desde los botones «App».
        if (user) {
          try {
            localStorage.setItem('pp-app-direct', '1');
          } catch {
            // Sin almacenamiento, basta con cambiar los enlaces de esta página.
          }
          document.querySelectorAll('[data-app-link]').forEach((link) => { link.href = '/app/?vista=app'; });
        }
      });
    } catch {
      // El acceso sigue disponible aunque el estado de la cuenta no pueda comprobarse.
    }
  }
  rememberAccount();

  // Los botones «App» llevan a /instalar/ hasta que la persona instala la app o elige usarla sin
  // instalar; desde entonces van directos a la app.
  function routeAppLinks() {
    let direct = false;
    try {
      direct = localStorage.getItem('pp-app-direct') === '1';
    } catch {
      // Sin almacenamiento, los botones siguen llevando a /instalar/.
    }
    if (window.matchMedia('(display-mode: standalone)').matches) direct = true;
    if (!direct) return;
    document.querySelectorAll('[data-app-link]').forEach((link) => { link.href = '/app/?vista=app'; });
  }
  routeAppLinks();
})();
