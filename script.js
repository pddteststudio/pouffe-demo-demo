(() => {
  'use strict';
  const data = window.POUFFE_CONFIG;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const rub = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const safe = value => String(value).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // Reveal is progressive enhancement: without JS all content remains visible.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .045, rootMargin: '0px 0px -22px 0px' });
  }
  function observeReveals(root = document) {
    $$('.reveal', root).forEach(el => {
      if (el.dataset.delay) el.style.setProperty('--reveal-delay', `${el.dataset.delay}ms`);
      if (observer) observer.observe(el);
    });
  }
  observeReveals();

  // Sticky header, mobile menu and smooth in-page navigation.
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const menuGraphic = $('.menu-graphic', menuToggle);
  const setScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
  function setMenu(open) {
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    $('use', menuGraphic).setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  menuToggle.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  document.addEventListener('click', e => { if (!menu.hidden && !header.contains(e.target)) setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 990 && !menu.hidden) setMenu(false); });

  // Portfolio sourced from publicly listed individual examples, not a tariff table.
  const projectGrid = $('#project-grid');
  projectGrid.innerHTML = data.projects.map((p, index) => `
    <article class="project-card reveal" data-kind="${safe(p.type)}" style="--reveal-delay:${index * 65}ms">
      <div class="project-media"><img src="${safe(p.image)}" width="720" height="540" alt="Авторская иллюстрация: ${safe(p.name.toLowerCase())}. Не фото работы POUFFE"><span class="project-chip">${safe(p.tag)}</span></div>
      <div class="project-info"><div><h3>${safe(p.name)}</h3><p>Опубликованный пример проекта · иллюстрация</p></div><div class="project-price"><strong>${rub(p.price)}</strong><span>цена отдельного проекта</span></div></div>
      <button type="button" class="project-detail" data-project="${safe(p.id)}">Подробнее о примере ${icon('arrow-up')}</button>
    </article>`).join('');
  observeReveals(projectGrid);
  const filters = $$('.filter-btn');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    const type = button.dataset.filter;
    $$('.project-card').forEach(card => card.hidden = type !== 'all' && card.dataset.kind !== type);
  }));
  const dlg = $('#project-dialog');
  const dlgBody = $('#dialog-content');
  let dialogInvoker = null;
  projectGrid.addEventListener('click', e => {
    const button = e.target.closest('[data-project]');
    if (!button) return;
    const project = data.projects.find(p => p.id === button.dataset.project);
    if (!project) return;
    dialogInvoker = button;
    dlgBody.innerHTML = `<img src="${safe(project.image)}" width="720" height="540" alt="Авторская иллюстрация направления работ. Не фотография проекта"><div class="dialog-text"><span class="tag">${safe(project.tag)} · ИЗ ОТКРЫТОГО ПРОФИЛЯ</span><h3 id="dialog-title">${safe(project.name)}</h3><p>${safe(project.description)}</p><p><strong>Содержание опубликованного примера:</strong> ${safe(project.scope)}</p><p class="price">${rub(project.price)} <small style="font-size:12px;font-weight:400;color:#768078">— цена этого примера, не тариф</small></p><p style="font-size:11px">Иллюстрация создана для независимой демонстрации и не является фотографией работы мастерской.</p><a href="${safe(data.company.publicProfile)}" class="source-link" target="_blank" rel="noopener noreferrer">Открыть профиль с реальными работами ${icon('external')}</a></div>`;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  });
  const closeDialog = () => { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); if (dialogInvoker) dialogInvoker.focus(); };
  $('#dialog-close').addEventListener('click', closeDialog);
  dlg.addEventListener('click', e => { if (e.target === dlg) closeDialog(); });
  dlg.addEventListener('close', () => { if (dialogInvoker) dialogInvoker.focus(); });

  // Service illustrations link directly to the working enquiry composer.
  const servicesGrid = $('#services-grid');
  servicesGrid.innerHTML = data.services.map((s, i) => `
    <article class="service-card reveal" style="--reveal-delay:${(i%3)*75}ms">
      <div class="service-image"><img src="${safe(s.image)}" width="420" height="320" alt="Векторная иллюстрация: ${safe(s.title.toLowerCase())}"></div>
      <div class="service-top"><span>${safe(s.num)} / МАСТЕРСКАЯ</span>${icon('arrow-up')}</div>
      <h3>${safe(s.title)}</h3><p>${safe(s.subtitle)}</p>
      <button type="button" data-service="${safe(s.id)}">Обсудить работу ${icon('arrow')}</button>
    </article>`).join('');
  observeReveals(servicesGrid);

  const stepsGrid = $('#steps-grid');
  stepsGrid.innerHTML = data.steps.map((s, i) => `<article class="step-card reveal" style="--reveal-delay:${i*75}ms"><div class="step-art"><img src="${safe(s.image)}" width="370" height="320" alt="Иллюстрация: ${safe(s.title.toLowerCase())}"></div><p class="step-no">ШАГ 0${i+1}</p><h3>${safe(s.title)}</h3><p>${safe(s.text)}</p></article>`).join('');
  observeReveals(stepsGrid);

  // Fully illustrative before/after (never presented as real work).
  const range = $('#compare-range');
  range.addEventListener('input', () => $('#comparison').style.setProperty('--split', `${range.value}%`));

  // Materials swatches double as convenient presets for the enquiry.
  const materialDescriptions = {
    'Велюр':'Велюр — мягкая фактура с деликатным переливом.',
    'Рогожка':'Рогожка — заметное плетение и спокойный тактильный рельеф.',
    'Экокожа':'Экокожа — гладкая поверхность с лаконичным характером.',
    'Помощь с выбором':'Если сомневаетесь, лучше описать интерьер и задачу — материал подберут при согласовании.'
  };
  const fabricSelect = $('#fabric');
  $$('.swatch').forEach(button => button.addEventListener('click', () => {
    $$('.swatch').forEach(s => {const active = s === button;s.classList.toggle('active',active);s.setAttribute('aria-pressed',String(active));});
    const value = button.dataset.material;
    $('#material-description').textContent = materialDescriptions[value];
    fabricSelect.value = value === 'Помощь с выбором' ? 'Нужна консультация' : value;
    updateRequest();
  }));

  // Enquiry composer: no network transmission. Photos never leave the device.
  const form = $('#estimate-form');
  const formStatus = $('#form-status');
  const itemSelect = $('#furniture');
  const widthField = $('#width-input');
  const qtyField = $('#qty-input');
  const commentField = $('#description');
  const photoInput = $('#photo-files');
  $('.upload-btn').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); photoInput.click(); } });
  const preview = $('#photo-preview');
  const summary = $('#request-text');
  let mode = 'Перетяжка';
  let photos = [];
  const maxPhotos = 3;
  const maxFileBytes = 10 * 1024 * 1024;
  function valid() {
    const qty = Number(qtyField.value);
    const width = widthField.value.trim() ? Number(widthField.value) : null;
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return 'Укажите количество от 1 до 20.';
    if (width !== null && (!Number.isFinite(width) || width < 1 || width > 1000 || !Number.isInteger(width))) return 'Ширина должна быть целым числом от 1 до 1000 см.';
    return '';
  }
  function getRequest() {
    const qty = Number(qtyField.value);
    const width = widthField.value.trim() ? Number(widthField.value) : null;
    const lines = [
      'Здравствуйте! Интересует услуга POUFFE.',
      `Вид работы: ${mode}.`,
      `Предмет мебели: ${itemSelect.value}.`,
      `Количество: ${valid() ? 'уточню' : qty + ' шт.'}`,
      `Материал: ${fabricSelect.value}.`
    ];
    if (width !== null && !valid()) lines.push(`Ширина: ${width} см.`);
    if (commentField.value.trim()) lines.push(`Пожелания: ${commentField.value.trim().replace(/\s+/g,' ')}.`);
    lines.push('Подскажите ориентировочную стоимость, сроки и условия выполнения.');
    lines.push('При необходимости пришлю фотографии отдельно.');
    return lines.join('\n');
  }
  function updateRequest() {
    summary.textContent = getRequest();
    if (formStatus.classList.contains('is-error')) { formStatus.textContent = ''; formStatus.classList.remove('is-error'); }
  }
  $$('.segment').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    $$('.segment').forEach(s => { const active = s === b; s.classList.toggle('active',active); s.setAttribute('aria-pressed',String(active)); });
    updateRequest();
  }));
  [itemSelect,fabricSelect,widthField,qtyField,commentField].forEach(el => {
    el.addEventListener('input',updateRequest); el.addEventListener('change',updateRequest);
  });
  servicesGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-service]');
    if (!btn) return;
    const name = btn.dataset.service;
    if (name.includes('Ремонт')) mode = 'Ремонт';
    else if (name.includes('Изготовление')) mode = 'Изготовление';
    else mode = 'Перетяжка';
    $$('.segment').forEach(s => {const active=s.dataset.mode===mode;s.classList.toggle('active',active);s.setAttribute('aria-pressed',String(active));});
    if (name.includes('подушки') || name.includes('Чехлы')) itemSelect.value='Другое';
    else if (name.includes('Изголовья')) itemSelect.value='Кровать / изголовье';
    else itemSelect.value='Диван';
    updateRequest();
    $('#estimate').scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
  });
  function message(msg,error=false) {formStatus.textContent=msg;formStatus.classList.toggle('is-error',error);}
  const copyButton = $('#copy-request');
  copyButton.addEventListener('click', async () => {
    const error = valid();
    if (error) { message(error,true); (!qtyField.value || !(Number(qtyField.value)>=1 && Number(qtyField.value)<=20)) ? qtyField.focus() : widthField.focus(); return; }
    const text = getRequest();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('No clipboard API');
      await navigator.clipboard.writeText(text);
      message('Описание скопировано. Фото при необходимости приложите отдельно.');
    } catch (_) {
      const field = document.createElement('textarea');
      field.value=text;field.setAttribute('readonly','');field.style.cssText='position:fixed;top:0;left:-9999px;opacity:0';document.body.append(field);field.select();
      let copied=false;
      try { copied=document.execCommand('copy'); } catch (_) {copied=false;}
      field.remove();
      if (copied) message('Описание скопировано. Фото при необходимости приложите отдельно.');
      else {
        message('Автокопирование недоступно. Выделите текст запроса справа и скопируйте вручную.',true);
        summary.setAttribute('tabindex','-1');summary.focus();
      }
    }
  });
  function showPhotos() {
    preview.innerHTML='';
    photos.forEach((p, idx) => {
      const container=document.createElement('div');container.className='photo-thumb';
      const img=document.createElement('img');img.src=p.url;img.alt=`Локальный предпросмотр: ${p.file.name}`;
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Удалить фотографию ${idx+1}`);button.innerHTML=icon('close');
      button.addEventListener('click', () => {URL.revokeObjectURL(p.url);photos.splice(idx,1);showPhotos();message('Фотография удалена из локального предпросмотра.');});
      container.append(img,button);preview.append(container);
    });
  }
  photoInput.addEventListener('change', () => {
    const files=[...photoInput.files];
    let rejected=0;
    for (const file of files) {
      if (photos.length>=maxPhotos) {rejected++;continue;}
      if (!file.type.startsWith('image/') || file.size>maxFileBytes) {rejected++;continue;}
      photos.push({file,url:URL.createObjectURL(file)});
    }
    photoInput.value='';showPhotos();
    message(rejected ? `Добавлено фото: ${photos.length}. Некоторые файлы пропущены (максимум 3 изображения по 10 МБ).` : `Фотографий для локального предпросмотра: ${photos.length}.`);
  });
  form.addEventListener('reset', () => {
    photos.forEach(p => URL.revokeObjectURL(p.url));photos=[];showPhotos();
    mode='Перетяжка';
    $$('.segment').forEach(s => {const active=s.dataset.mode===mode;s.classList.toggle('active',active);s.setAttribute('aria-pressed',String(active));});
    setTimeout(() => { updateRequest(); message('Поля очищены.'); },0);
  });
  // Prevent accidental submit if a user presses Enter inside the form.
  form.addEventListener('submit',e=>e.preventDefault());
  window.addEventListener('pagehide', () => photos.forEach(p => URL.revokeObjectURL(p.url)));
  updateRequest();
})();
