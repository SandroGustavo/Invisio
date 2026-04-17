/* ═══════════════════════════════════════════
   INVISIO v2 — interactions
   ═══════════════════════════════════════════ */

(() => {

  /* ── MOBILE DETECT ── */
  const IS_TOUCH = matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)').matches;

  /* shared cursor coords (used by eye-tracking logic lower down) */
  let mx = innerWidth / 2, my = innerHeight / 2;

  if (!IS_TOUCH) {
    /* ── CURSOR ── */
    const cdot = document.getElementById('cdot');
    const cring = document.getElementById('cring');
    let rx = mx, ry = my;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cdot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    function ringLoop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    const hoverables = 'a, button, .faq-q, .world, .plan, .pain, .result, [data-magnetic]';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) {
        cring.classList.add('hover');
        cdot.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) {
        cring.classList.remove('hover');
        cdot.classList.remove('hover');
      }
    });

    /* ── MAGNETIC BUTTONS ── */
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  } else {
    /* hide custom cursor on touch — keep system cursor */
    const cdot = document.getElementById('cdot');
    const cring = document.getElementById('cring');
    if (cdot) cdot.style.display = 'none';
    if (cring) cring.style.display = 'none';
    /* auto-drift eye target on mobile so eyes still feel alive */
    let t = 0;
    (function drift() {
      t += 0.015;
      mx = innerWidth / 2 + Math.sin(t) * innerWidth * 0.25;
      my = innerHeight / 2 + Math.cos(t * 0.7) * innerHeight * 0.2;
      requestAnimationFrame(drift);
    })();
  }

  /* ── PARTICLE FIELD ── */
  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width = innerWidth * devicePixelRatio;
    H = canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    const count = Math.floor(innerWidth * innerHeight / (IS_TOUCH ? 60000 : 22000));
    nodes = Array.from({length: count}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      r: (Math.random() * 1.2 + 0.4) * devicePixelRatio
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  function tick() {
    ctx.clearRect(0, 0, W, H);
    const mxp = mx * devicePixelRatio, myp = my * devicePixelRatio;

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      const dx = n.x - mxp, dy = n.y - myp;
      const d = Math.hypot(dx, dy);
      if (d < 160 * devicePixelRatio) {
        n.x += dx / d * 0.6 * devicePixelRatio;
        n.y += dy / d * 0.6 * devicePixelRatio;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(199,255,59,.35)';
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140 * devicePixelRatio) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / (140 * devicePixelRatio)) * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();

  /* ── TICKER ── */
  const names = ['Camila R.', 'Diego M.', 'Ana P.', 'Lucas F.', 'Juliana S.', 'Marcos O.', 'Paula T.', 'Ricardo V.', 'Beatriz M.', 'Fernanda L.'];
  const cities = ['São Paulo', 'Rio', 'Curitiba', 'BH', 'Salvador', 'Porto Alegre', 'Fortaleza', 'Recife', 'Brasília', 'Campinas'];
  const actions = [
    'completou missão diária',
    'publicou primeiro Reel',
    'desbloqueou Mundo 03',
    'gerou legenda com IA',
    'subiu para nível Executor',
    'primeira comissão R$ 47',
    'streak de 7 dias',
    'completou Mundo 02'
  ];
  const tt = document.getElementById('tickerTrack');
  const ticks = [];
  for (let i = 0; i < 30; i++) {
    const n = names[Math.floor(Math.random() * names.length)];
    const c = cities[Math.floor(Math.random() * cities.length)];
    const a = actions[Math.floor(Math.random() * actions.length)];
    ticks.push(`<span class="tick-ok">●</span><span>${n} · ${c}</span><span>${a}</span><span class="tick-sep">//</span>`);
  }
  tt.innerHTML = ticks.join(' ').repeat(2);

  /* ── TYPED OUTPUT ── */
  const typedEl = document.getElementById('typedText');
  const lines = [
    '✨ 5 ingredientes do café da manhã que estão',
    'sabotando seu emagrecimento (o nº 3 está na',
    'sua cozinha hoje).',
    '',
    '→ deslize pra descobrir →'
  ];
  const fullText = lines.join('\n');
  let typed = 0;
  function typeLoop() {
    if (typed <= fullText.length) {
      typedEl.innerHTML = fullText.substring(0, typed).replace(/\n/g, '<br>') + '<span class="caret"></span>';
      typed++;
      setTimeout(typeLoop, 30 + Math.random() * 40);
    } else {
      setTimeout(() => { typed = 0; typeLoop(); }, 5000);
    }
  }
  typeLoop();

  /* ── WORLDS MAP ── */
  const worlds = [
    { n: '00', t: 'Despertar',         s: 'Mindset, visão e primeira conta criada.', xp: 150,  c: '#C7FF3B', locked: false },
    { n: '01', t: 'Central de Comando', s: 'Setup das ferramentas e Shado ativado.', xp: 200,  c: '#8B5CF6', locked: false },
    { n: '02', t: 'Vale de Nichos',     s: 'Escolha e validação do nicho anônimo.',  xp: 250,  c: '#38E0FF', locked: false },
    { n: '03', t: 'Mina de Produtos',   s: 'Seleção estratégica de afiliados.',      xp: 300,  c: '#F59E0B', locked: false },
    { n: '04', t: 'Lab de Prompts',     s: 'Bancos de prompts e templates IA.',      xp: 350,  c: '#10B981', locked: false },
    { n: '05', t: 'Fábrica de Conteúdo',s: 'Reels, carrosséis, stories no piloto.',  xp: 400,  c: '#C7FF3B', locked: true },
    { n: '06', t: 'Perfil que Converte',s: 'Bio, layout, e primeiros 100 seguidores.', xp: 350, c: '#F472B6', locked: true },
    { n: '07', t: 'Máquina de Vendas',  s: 'Funil, link mágico e primeira comissão.',xp: 500,  c: '#FF5A5F', locked: true },
    { n: '08', t: 'Invisibilidade Total',s:'Voz IA, perfis paralelos, escala anônima.',xp: 450, c: '#8B5CF6', locked: true },
    { n: '09', t: 'Modo Automação',     s: 'Operação 100% automatizada e escalável.', xp: 600, c: '#10B981', locked: true }
  ];
  const wt = document.getElementById('worldmapTrack');
  wt.innerHTML = worlds.map(w => `
    <div class="world ${w.locked ? 'world--locked' : ''}" style="--c:${w.c}">
      <div class="world-badge">MUNDO ${w.n}</div>
      <div class="world-icon" style="color:${w.c}">
        <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="1.4">
          <circle cx="26" cy="26" r="24" opacity=".35"/>
          <ellipse cx="26" cy="26" rx="17" ry="11"/>
          <circle cx="26" cy="26" r="6"/>
          <circle cx="26" cy="26" r="2.5" fill="currentColor"/>
        </svg>
      </div>
      <div class="world-title">${w.t}</div>
      <div class="world-sub">${w.s}</div>
      <div class="world-foot">
        <span>+${w.xp} XP</span>
        <span>${w.locked ? 'locked' : 'live'}</span>
      </div>
    </div>
  `).join('');

  /* ── COUNTERS ── */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const target = parseInt(e.target.dataset.counter, 10);
      const duration = 2000;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(step);
        else e.target.textContent = target.toLocaleString('pt-BR');
      }
      requestAnimationFrame(step);
    });
  }, { threshold: .3 });
  counters.forEach(c => counterObs.observe(c));

  /* ── FAQ ── */
  const faqs = [
    ['Preciso aparecer na câmera?', 'Absolutamente não. Um dos pilares do método é a invisibilidade total. Você aprende a criar perfis anônimos com conteúdo gerado por IA, textos animados, vozes sintéticas e personas digitais. Nunca precisa mostrar o rosto.'],
    ['Funciona pra quem nunca vendeu nada online?', 'O INVISIO foi desenhado para iniciantes absolutos. O Mundo 0 começa do básico: criar contas nas ferramentas, primeiro prompt, entender o que é ser afiliado. As missões te guiam passo a passo.'],
    ['Quanto tempo por dia preciso dedicar?', 'O mínimo é 30 minutos por dia. Com 1 hora/dia você completa o plano de 7 dias e publica regularmente. As ferramentas de IA reduzem drasticamente o tempo de criação — 3h de trabalho viram 20 minutos.'],
    ['Em quanto tempo posso fazer a primeira venda?', 'Alunos mais rápidos vendem entre o dia 7 e o dia 14. A média é 3 a 4 semanas para quem segue o método com consistência. Depende da sua execução, do nicho e da frequência de publicação.'],
    ['Preciso pagar outras ferramentas além da mensalidade?', 'Não para começar. ChatGPT, Canva, CapCut, Linktree e Hotmart têm planos gratuitos suficientes para as primeiras vendas. Você só considera pagar quando já está gerando renda e quer escalar.'],
    ['E se eu não gostar?', '7 dias de garantia total. Se por qualquer motivo não gostar, envia um e-mail e devolvemos 100% sem pergunta. Acreditamos tanto no método que não precisamos de contrato.'],
    ['Posso acessar no celular?', 'Sim. A plataforma é responsiva. Muitos alunos fazem missões pelo celular durante o dia e criam conteúdo à noite no computador.']
  ];
  const faqEl = document.getElementById('faqList');
  faqEl.innerHTML = faqs.map((f, i) => `
    <div class="faq-item" data-i="${i}">
      <div class="faq-q">
        ${f[0]}
        <div class="faq-chev">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="faq-a"><div class="faq-a-inner">${f[1]}</div></div>
    </div>
  `).join('');
  faqEl.addEventListener('click', e => {
    const item = e.target.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    faqEl.querySelectorAll('.faq-item').forEach(x => {
      x.classList.remove('open');
      x.querySelector('.faq-a').style.maxHeight = '0px';
    });
    if (!isOpen) {
      item.classList.add('open');
      const a = item.querySelector('.faq-a');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });

  /* ── PRICING TOGGLE ── */
  const toggle = document.querySelector('.ptoggle');
  const btnM = document.getElementById('btnMonthly');
  const btnA = document.getElementById('btnAnnual');
  const priceS = document.getElementById('price-starter');
  const priceP = document.getElementById('price-pro');
  function setMode(mode) {
    btnM.classList.toggle('pt-active', mode === 'monthly');
    btnA.classList.toggle('pt-active', mode === 'annual');
    toggle.classList.toggle('annual', mode === 'annual');
    const prices = mode === 'annual' ? {s:40, p:58} : {s:67, p:97};
    priceS.textContent = prices.s;
    priceP.textContent = prices.p;
  }
  btnM.addEventListener('click', () => setMode('monthly'));
  btnA.addEventListener('click', () => setMode('annual'));

  /* ── REVEAL ── */
  const revealEls = document.querySelectorAll('.hero-left, .hero-right, .big-title, .big-sub, .pain, .bridge, .step, .world, .gamif-left, .gamif-right, .result, .plan, .faq-item, .fc-card');
  revealEls.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .08 });
  revealEls.forEach(el => obs.observe(el));

  /* ── NAV SHRINK ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── WORLDMAP HORIZONTAL SCROLL WITH WHEEL ── */
  const wm = document.getElementById('worldmap');
  wm.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      // only hijack if horizontal is more natural
      const scrollable = wm.scrollWidth > wm.clientWidth;
      if (scrollable && wm.scrollLeft + e.deltaY >= 0 && wm.scrollLeft + e.deltaY <= wm.scrollWidth - wm.clientWidth) {
        wm.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }
  }, { passive: false });

  /* ── EYE TRACKING MOUSE (hero big eye + level card + logo) ── */
  const pupils = [
    { el: document.querySelector('.hero-eye-pupil'), cx: 60, cy: 30, r: 8 },
    { el: document.querySelector('.lc-av-pupil'),    cx: 30, cy: 30, r: 4 },
    { el: document.querySelector('.fc-pupil'),       cx: 120, cy: 60, r: 10 },
    { el: document.querySelector('.logo-pupil'),     cx: 22, cy: 22, r: 1.5 }
  ].filter(p => p.el);
  function trackEyes() {
    pupils.forEach(p => {
      const svg = p.el.ownerSVGElement;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const sx = r.left + r.width / 2;
      const sy = r.top + r.height / 2;
      const ang = Math.atan2(my - sy, mx - sx);
      const dx = Math.cos(ang) * p.r;
      const dy = Math.sin(ang) * p.r;
      p.el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    requestAnimationFrame(trackEyes);
  }
  trackEyes();

})();
