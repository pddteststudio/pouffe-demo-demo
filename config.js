/* Настраиваемые данные проекта POUFFE. До официального запуска сверить с владельцем. */
window.POUFFE_CONFIG = {
  demoMode: true,
  company: {
    name: 'POUFFE', city: 'Пермь', phone: '+7 (992) 238-86-88',
    phoneHref: '+79922388688', address: 'ул. Маяковского, 19/2, бокс 99',
    email: 'pouffe.perm@yandex.ru',
    telegram: 'https://t.me/pouufe', vk: 'https://vk.com/pouffe.perm',
    publicProfile: 'https://uslugi.yandex.ru/profile/Pouffe-467241'
  },
  // Цены — только отдельные опубликованные ПРИМЕРЫ, НЕ тарифы.
  projects: [
    {id:'vintage',type:'restoration',tag:'РЕСТАВРАЦИЯ',name:'Винтажное кресло',image:'assets/work-vintage.svg',price:6000,description:'В опубликованном примере мастерская описывает восстановление деревянных деталей, замену наполнителя и перетяжку.',scope:'Восстановление древесины, ремней, наполнителя и обивки.'},
    {id:'upholstery',type:'upholstery',tag:'ПЕРЕТЯЖКА',name:'Новая обивка мебели',image:'assets/work-reupholstery.svg',price:8000,description:'Пример работ по обновлению обивки и замене внутренних элементов мебели.',scope:'Работа с обивкой, наполнителем и механизмами.'},
    {id:'custom',type:'custom',tag:'НА ЗАКАЗ',name:'Диван под нестандартную нишу',image:'assets/work-custom.svg',price:12000,description:'Пример индивидуального дивана с необычной трапециевидной геометрией.',scope:'Проектирование под размеры пространства и изготовление каркаса.'},
    {id:'chair',type:'restoration',tag:'РЕСТАВРАЦИЯ',name:'Обновление стула',image:'assets/work-chair.svg',price:2200,description:'Пример обновления стула: обивка, укрепление основы и декоративные детали.',scope:'Замена обивки, проклейка каркаса, декоративная тесьма.'}
  ],
  services: [
    {id:'Перетяжка мебели',title:'Перетяжка мебели',subtitle:'Обновление цвета, фактуры и ощущения от привычного предмета.',image:'assets/service-upholstery.svg',num:'01'},
    {id:'Ремонт мебели',title:'Ремонт и восстановление',subtitle:'Наполнитель, детали каркаса и механизмы трансформации.',image:'assets/service-repair.svg',num:'02'},
    {id:'Изготовление мебели на заказ',title:'Изготовление на заказ',subtitle:'Индивидуальные формы и решения под размеры пространства.',image:'assets/service-custom.svg',num:'03'},
    {id:'Изголовья и мягкие панели',title:'Изголовья и панели',subtitle:'Мягкие детали, которые создают настроение в комнате.',image:'assets/service-headboard.svg',num:'04'},
    {id:'Чехлы и подушки',title:'Чехлы и подушки',subtitle:'Текстильные детали для завершённого интерьера.',image:'assets/service-cushion.svg',num:'05'},
    {id:'Подбор ткани',title:'Подбор обивки',subtitle:'Велюр, фактурные ткани и другие варианты по согласованию.',image:'assets/service-fabric.svg',num:'06'}
  ],
  steps: [
    {title:'Расскажите об идее',text:'Опишите мебель, задачу и приложите фото в согласованном канале.',image:'assets/step-1.svg'},
    {title:'Уточните детали',text:'Материалы, размеры, состояние и предварительную оценку работ.',image:'assets/step-2.svg'},
    {title:'Согласуйте работу',text:'Стоимость, объём, сроки и формат выполнения напрямую с мастерской.',image:'assets/step-3.svg'},
    {title:'Обновлённая мебель',text:'Получите результат после завершения согласованного заказа.',image:'assets/step-4.svg'}
  ],
  developer: {telegram:'https://t.me/milmak11',username:'@milmak11'}
};
