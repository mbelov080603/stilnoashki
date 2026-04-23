import { companyDetails, documentLinks } from "@/lib/site-config";
import type {
  Article,
  City,
  FAQItem,
  LeadField,
  LeadFormSchema,
  LegalPage,
  PageHeroContract,
  PageStat,
  Partner,
  PartnershipScenario,
  SectionContract,
  Store,
  Vacancy,
} from "@/lib/site-types";

export const cities: City[] = [];
export const stores: Store[] = [];
export const partners: Partner[] = [];
export const vacancies: Vacancy[] = [];
export const articles: Article[] = [];

const retailFields: LeadField[] = [
  {
    name: "city",
    label: "Город",
    required: true,
    placeholder: "Укажите ваш город",
    autoComplete: "address-level2",
  },
  {
    name: "name",
    label: "Имя",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "requestType",
    label: "Тип запроса",
    type: "select",
    required: true,
    options: [
      { value: "availability", label: "наличие в городе" },
      { value: "retail-point", label: "розничная точка" },
      { value: "partnership", label: "партнёрство" },
      { value: "other", label: "другое" },
    ],
    halfWidth: false,
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "При необходимости уточните запрос.",
    halfWidth: false,
  },
];

const retailCheckboxes = [
  {
    name: "ageConfirmed",
    required: true,
    label: "Подтверждаю, что мне исполнилось 18 лет.",
  },
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
];

const franchiseFields: LeadField[] = [
  {
    name: "name",
    label: "Имя / ФИО",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    required: true,
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "city",
    label: "Город / регион",
    required: true,
    placeholder: "Укажите город / регион",
  },
  {
    name: "businessStatus",
    label: "Статус",
    type: "select",
    required: true,
    options: [
      { value: "legal-entity", label: "есть ИП/юрлицо" },
      { value: "planning", label: "планирую открыть" },
      { value: "existing-store", label: "действующий магазин" },
      { value: "distributor", label: "дистрибьютор" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "retailExperience",
    label: "Опыт в рознице",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "есть" },
      { value: "no", label: "нет" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "interestFormat",
    label: "Интересующий формат",
    type: "select",
    required: true,
    options: [
      { value: "franchise", label: "франчайзинг" },
      { value: "wholesale", label: "опт" },
      { value: "regional", label: "региональное партнёрство" },
      { value: "retail", label: "розничная точка" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "projectStage",
    label: "Стадия проекта",
    type: "select",
    required: true,
    options: [
      { value: "research", label: "изучаю" },
      { value: "location", label: "есть помещение" },
      { value: "ready", label: "готов к запуску" },
      { value: "existing-business", label: "действующий бизнес" },
    ],
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Опишите запрос, город или формат сотрудничества.",
    halfWidth: false,
  },
];

const franchiseCheckboxes = [
  {
    name: "ageConfirmed",
    required: true,
    label: "Подтверждаю, что мне исполнилось 18 лет.",
  },
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
  {
    name: "marketing",
    label: "Согласен получать информационные сообщения по моему запросу о партнёрстве.",
  },
];

const partnerCheckboxes = [
  {
    name: "ageConfirmed",
    required: true,
    label: "Подтверждаю, что мне исполнилось 18 лет.",
  },
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
];

const partnerFields: LeadField[] = [
  {
    name: "name",
    label: "Имя / ФИО",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    required: true,
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "city",
    label: "Город / регион",
    required: true,
    placeholder: "Укажите регион работы",
  },
  {
    name: "requestType",
    label: "Направление",
    type: "select",
    required: true,
    options: [
      { value: "wholesale", label: "опт" },
      { value: "regional", label: "регион" },
      { value: "retail", label: "розница" },
      { value: "franchise", label: "франчайзинг" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Опишите формат сотрудничества или задачу.",
    halfWidth: false,
  },
];

const careerFields: LeadField[] = [
  { name: "name", label: "Имя / ФИО", required: true, placeholder: "Как к вам обращаться" },
  { name: "phone", label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "name@company.ru", autoComplete: "email" },
  { name: "city", label: "Город", required: true, placeholder: "Город проживания" },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Кратко расскажите о своём опыте и интересе к STILNO.",
    halfWidth: false,
  },
];

const careerCheckboxes = [
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
];

export const formSchemas = {
  retailBase: {
    title: "Розничный запрос",
    description: "Запрос о наличии в городе, розничной точке или партнёрском контакте.",
    submitLabel: "Отправить запрос",
    successMessage:
      "Запрос отправлен. Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.",
    disclaimer:
      "Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции. Информация предназначена для лиц старше 18 лет.",
    theme: "light",
    fields: retailFields,
    checkboxes: retailCheckboxes,
  } satisfies LeadFormSchema,
  partnerBase: {
    title: "Партнёрский запрос",
    description: "Форма для оптовых, региональных и B2B-обращений по бренду STILNO.",
    submitLabel: "Отправить запрос",
    successMessage:
      "Запрос отправлен. Мы свяжемся с вами по указанным контактам для уточнения формата сотрудничества.",
    disclaimer: "Информация на сайте носит справочный характер. Условия обсуждаются индивидуально.",
    theme: "light",
    fields: partnerFields,
    checkboxes: partnerCheckboxes,
  } satisfies LeadFormSchema,
  franchiseBase: {
    title: "Заявка на франчайзинг",
    description: "Укажите город, формат и стадию проекта. Условия обсуждаются индивидуально после заявки.",
    submitLabel: "Отправить заявку",
    successMessage:
      "Заявка отправлена. Мы свяжемся с вами по указанным контактам. Обращаем внимание: условия партнёрства обсуждаются индивидуально и не являются публичной офертой.",
    disclaimer:
      "Информация на сайте носит справочный характер. Условия партнёрства и франчайзинга обсуждаются индивидуально.",
    theme: "dark",
    fields: franchiseFields,
    checkboxes: franchiseCheckboxes,
  } satisfies LeadFormSchema,
  careerBase: {
    title: "Карьерный отклик",
    description: "Оставьте контакты и кратко расскажите о своём опыте.",
    submitLabel: "Отправить отклик",
    successMessage:
      "Отклик отправлен. Мы свяжемся с вами, если ваш профиль подойдёт под текущие или будущие задачи команды.",
    theme: "light",
    fields: careerFields,
    checkboxes: careerCheckboxes,
  } satisfies LeadFormSchema,
};

export const homeContent = {
  hero: {
    eyebrow: "Официальный сайт STILNO · 18+",
    title: "STILNO CLICK ONE",
    body:
      "Никотинсодержащая линия для совершеннолетних пользователей. Сайт содержит справочную информацию о продукте, партнёрстве и франчайзинге.",
    detailLine: "10 мл · 850 мА·ч · Type-C · 10–22 Вт · 20 мг/см³ · до 15 000 затяжек*",
    note: "*Показатель зависит от режима использования.",
    actions: [
      { label: "Смотреть продукт", href: "/products/stilno-click-one", variant: "primary" },
      { label: "Стать партнёром", href: "/franchise", variant: "secondary" },
      {
        label: "Скачать презентацию для партнёров",
        href: documentLinks.franchisePresentation,
        variant: "secondary",
        target: "_blank",
      },
    ],
  } satisfies PageHeroContract,
  productSection: {
    eyebrow: "Продукт",
    title: "Одна актуальная линия. Ясная продуктовая подача.",
    body:
      "Сайт показывает только ту продуктовую информацию, которая подтверждена текущими упаковочными материалами и документами бренда.",
    actions: [{ label: "Смотреть продукт", href: "/products/stilno-click-one", variant: "secondary" }],
  } satisfies SectionContract,
  partnersSection: {
    eyebrow: "Партнёрам",
    title: "Раздельные обращения для опта, регионального сотрудничества и франчайзинга.",
    body:
      "STILNO не обещает доходность и не заменяет переговоры витринными цифрами. Сайт помогает быстро понять формат сотрудничества и отправить корректный запрос.",
    actions: [
      { label: "Партнёрам STILNO", href: "/partners", variant: "secondary" },
      { label: "Франчайзинг STILNO", href: "/franchise", variant: "secondary" },
    ],
  } satisfies SectionContract,
  storesSection: {
    eyebrow: "Где купить",
    title: "Розничная карта публикуется после подтверждения городов и партнёрских точек.",
    body:
      "До публикации списка можно отправить запрос по вашему городу, уточнить наличие или обсудить партнёрский запуск.",
    actions: [
      { label: "Оставить запрос", href: "/stores#stores-request", variant: "secondary" },
      { label: "Стать партнёром", href: "/franchise", variant: "secondary" },
    ],
  } satisfies SectionContract,
  responsibleSection: {
    eyebrow: "Ответственное потребление",
    title: "Информация о продукте отделена от правовых ограничений и возрастного режима 18+.",
    body:
      "Информация о STILNO CLICK ONE адресована совершеннолетним пользователям и не заменяет инструкцию к продукту.",
  } satisfies SectionContract,
  faqSection: {
    eyebrow: "FAQ",
    title: "Частые вопросы о продукте, розничных запросах и партнёрстве.",
    body: "Краткие ответы на базовые вопросы, которые должен закрывать официальный сайт STILNO.",
  } satisfies SectionContract,
  formsSection: {
    eyebrow: "Форма заявки",
    title: "Основные обращения принимаются через сайт: розничный запрос и заявка на партнёрство.",
    body:
      "Формы разделены по типам обращения и не смешивают розничный запрос с партнёрским запуском.",
  } satisfies SectionContract,
};

export const storesContent = {
  hero: {
    eyebrow: "Розничная карта",
    title: "Где купить STILNO",
    body:
      "Розничная карта STILNO будет опубликована после подтверждения городов и партнёрских точек. До публикации списка вы можете оставить запрос по вашему городу или обсудить партнёрский запуск.",
    actions: [
      { label: "Оставить запрос", href: "#stores-request", variant: "primary" },
      { label: "Стать партнёром", href: "/franchise", variant: "secondary" },
    ],
  } satisfies PageHeroContract,
  statusSection: {
    eyebrow: "Статус",
    title: "Текущий статус покрытия",
    body:
      "Мы не публикуем неподтверждённые адреса. Если вы хотите уточнить наличие в городе или предложить партнёрский запуск, отправьте запрос через форму.",
  } satisfies SectionContract,
  statusCards: [
    {
      value: "Розничные точки",
      label: "список готовится к публикации",
      note: "Публикация происходит только после подтверждения.",
    },
    {
      value: "Города",
      label: "публикуются только после подтверждения",
      note: "Сайт не показывает неподтверждённые локации.",
    },
    {
      value: "Запросы",
      label: "город · розница · опт · партнёрство",
      note: "Все обращения проходят через единую форму.",
    },
  ] satisfies PageStat[],
  supportTitle: "Розничные запросы",
  supportBody:
    "Эта страница не заменяет карту подтверждённых точек. Она помогает собрать корректный запрос по городу до публикации розничной карты.",
  disclaimer:
    "Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции. Информация предназначена для лиц старше 18 лет.",
};

export const productPageContent = {
  hero: {
    eyebrow: "Продукт",
    title: "STILNO CLICK ONE",
    body:
      "Никотинсодержащая продуктовая линия для совершеннолетних пользователей. Характеристики указаны по подтверждённым упаковочным материалам.",
    detailLine: "10 мл · 850 мА·ч · Type-C · 10–22 Вт · 20 мг/см³ · до 15 000 затяжек*",
    note: "*Показатель зависит от режима использования.",
    actions: [
      { label: "Оставить розничный запрос", href: "/stores#stores-request", variant: "primary" },
      { label: "Запросить партнёрство", href: "/partners", variant: "secondary" },
      {
        label: "Скачать презентацию для партнёров",
        href: documentLinks.franchisePresentation,
        variant: "secondary",
        target: "_blank",
      },
    ],
  } satisfies PageHeroContract,
  detailSection: {
    eyebrow: "Характеристики",
    title: "Подтверждённые параметры и продуктовая логика текущей линии.",
    body:
      "Показатель количества затяжек зависит от режима использования. Формат текущей линии указан по упаковочным материалам.",
  } satisfies SectionContract,
  packagingSection: {
    eyebrow: "Серия",
    title: "Подтверждённые вкусовые и упаковочные варианты.",
    body:
      "Визуалы и названия вкусов публикуются только по подтверждённым упаковочным материалам текущей линии STILNO CLICK ONE.",
  } satisfies SectionContract,
};

export const franchiseContent = {
  hero: {
    eyebrow: "Франчайзинг",
    title: "Франчайзинг STILNO",
    body:
      "Партнёрский запуск бренда STILNO в регионах. Условия обсуждаются индивидуально после заявки и не являются публичной офертой.",
    actions: [
      { label: "Оставить заявку", href: "#franchise-form", variant: "primary" },
      {
        label: "Скачать презентацию для партнёров",
        href: documentLinks.franchisePresentation,
        variant: "secondary",
        target: "_blank",
      },
      { label: "Задать вопрос", href: "/contacts", variant: "secondary" },
    ],
  } satisfies PageHeroContract,
  supportSection: {
    eyebrow: "Поддержка",
    title: "Что получает партнёр",
    body:
      "STILNO обсуждает запуск через понятный набор материалов, продуктовой базы, контакта с менеджером и дисциплины категории 18+.",
  } satisfies SectionContract,
  audienceSection: {
    eyebrow: "Кому подходит",
    title: "Франчайзинг рассчитан на тех, кто готов работать в категории дисциплинированно.",
    body:
      "Без публичных обещаний доходности, без упрощённых цифр и без давления витринной риторикой.",
  } satisfies SectionContract,
  audienceItems: [
    "предпринимателям с опытом в рознице;",
    "владельцам действующих точек в смежных категориях;",
    "региональным партнёрам;",
    "оптовым компаниям;",
    "предпринимателям, готовым соблюдать правила категории 18+.",
  ],
  processItems: [
    "1. Заявка.",
    "2. Первичный контакт.",
    "3. Обсуждение города.",
    "4. Выбор формата.",
    "5. Согласование условий.",
    "6. Договор.",
    "7. Подготовка запуска.",
    "8. Старт работы.",
  ],
};

export const partnersPageContent = {
  hero: {
    eyebrow: "Партнёрам",
    title: "Партнёрам STILNO",
    body:
      "Оптовые, региональные и партнёрские запросы по бренду STILNO принимаются через форму сайта. Условия обсуждаются индивидуально.",
  } satisfies PageHeroContract,
  directionsSection: {
    eyebrow: "Направления",
    title: "Отдельные B2B-направления без смешения с франчайзинговым запуском.",
    body:
      "Страница помогает быстро выбрать формат обращения: опт, регион, действующая розница или запуск под брендом.",
  } satisfies SectionContract,
  contactFlowSection: {
    eyebrow: "Как проходит контакт",
    title: "Сначала запрос, потом короткая квалификация и следующий шаг по формату.",
    body:
      "Маршрут общения одинаково подходит для B2B-запросов, действующей розницы и регионального партнёрства.",
  } satisfies SectionContract,
  directions: [
    { title: "Опт", body: "Запросы по оптовым поставкам и B2B-взаимодействию." },
    { title: "Регион", body: "Работа по конкретному городу или региону после первичного контакта." },
    { title: "Розница", body: "Подключение действующей точки или обсуждение формата присутствия." },
    { title: "Франчайзинг", body: "Отдельный путь запуска под брендом STILNO." },
  ],
  contactFlow: [
    "1. Вы оставляете запрос через форму сайта.",
    "2. Менеджер STILNO связывается по указанным контактам.",
    "3. Уточняется формат: опт, регион, розница или франчайзинг.",
    "4. Следующий этап обсуждается индивидуально.",
  ],
};

export const contactsPageContent = {
  hero: {
    eyebrow: "Контакты",
    title: "Контакты STILNO",
    body:
      "Сайт не подменяет переговоры телефонным справочником. Он направляет запрос в нужный раздел: розница, партнёрство, франчайзинг или карьера.",
    actions: [
      { label: "Розничный запрос", href: "#contacts-retail", variant: "primary" },
      { label: "Партнёрский запрос", href: "#contacts-partner", variant: "secondary" },
    ],
  } satisfies PageHeroContract,
  routingCards: [
    {
      value: "Компания",
      label: companyDetails.companyName,
      note: "Юридическое лицо бренда.",
    },
    {
      value: "Юридический адрес",
      label: "подтверждён",
      note: companyDetails.legalAddress,
    },
    {
      value: "Производство",
      label: "подтверждённый адрес",
      note: companyDetails.productionAddress,
    },
    {
      value: "Формы сайта",
      label: "розница · партнёрство · франчайзинг",
      note: "Основной способ первичного контакта.",
    },
  ] satisfies PageStat[],
};

export const faqPageGroups = [
  { id: "product", title: "Продукт", scopes: ["products"] as FAQItem["scope"][] },
  { id: "stores", title: "Где купить", scopes: ["stores"] as FAQItem["scope"][] },
  { id: "partner", title: "Партнёрство и франчайзинг", scopes: ["franchise"] as FAQItem["scope"][] },
  { id: "responsible", title: "Ответственное потребление", scopes: ["responsible"] as FAQItem["scope"][] },
  { id: "career", title: "Карьера", scopes: ["careers"] as FAQItem["scope"][] },
];

export const launchMetrics: PageStat[] = [
  {
    value: "STILNO CLICK ONE",
    label: "текущая линия",
    note: "На сайте опубликована подтверждённая никотинсодержащая линия STILNO CLICK ONE.",
  },
  {
    value: "10",
    label: "вкусов в линии",
    note: "Названия и визуалы вкусов показываются только по подтверждённым упаковочным материалам.",
  },
  {
    value: "до 15 000",
    label: "затяжек*",
    note: "Показатель зависит от режима использования и указывается по упаковочным материалам.",
  },
  {
    value: "850 мА·ч",
    label: "аккумулятор",
    note: "Перезаряжаемое устройство с разъёмом Type-C.",
  },
];

export const partnershipScenarios: PartnershipScenario[] = [
  {
    title: "Опт",
    body: "Оптовые запросы по бренду STILNO принимаются через форму сайта и обсуждаются индивидуально после первичного контакта.",
  },
  {
    title: "Региональное сотрудничество",
    body: "Запросы по регионам и действующим точкам проходят через отдельный B2B-контакт с публикацией данных только после подтверждения.",
  },
  {
    title: "Франчайзинг",
    body: "Партнёрский запуск STILNO в регионах обсуждается после заявки, оценки города и выбора формата без обещаний доходности и публичной оферты.",
  },
];

export const homeSignals = [
  "STILNO CLICK ONE",
  "10 мл · 20 мг/см³ · до 15 000 затяжек*",
  "850 мА·ч · Type-C · 10–22 Вт",
  "Партнёрство · франчайзинг · розничные запросы",
];

export const brandNarrative = [
  "STILNO — официальный сайт бренда с продуктовой, партнёрской и франчайзинговой информацией для аудитории 18+.",
  "В основе сайта — подтверждённые данные о STILNO CLICK ONE, аккуратная юридическая подача и взрослый визуальный язык без шума и категорийной гиперболы.",
  "Сайт не продаёт никотинсодержащую продукцию дистанционно. Он помогает изучить продукт, отправить розничный запрос, обсудить партнёрство и найти правовую информацию.",
];

export const franchisePillars = [
  "Брендовые материалы и презентация для первичного знакомства с форматом STILNO.",
  "Продуктовая база с подтверждёнными характеристиками текущей линии STILNO CLICK ONE.",
  "Пошаговый запуск: от заявки и обсуждения города до согласования условий и старта работы.",
  "Юридически аккуратная коммуникация без обещаний доходности, медицинских заявлений и неподтверждённых показателей.",
];

export const faqItems: FAQItem[] = [
  {
    id: "faq-products-current-line",
    scope: "products",
    question: "Какая модель опубликована на сайте сейчас?",
    answer:
      "На сайте опубликована линия STILNO CLICK ONE и вкусовые варианты, подтверждённые текущими упаковочными материалами.",
  },
  {
    id: "faq-products-facts",
    scope: "products",
    question: "Откуда взяты технические характеристики продукта?",
    answer:
      "Характеристики STILNO CLICK ONE собраны по подтверждённым упаковочным материалам и текущим PDF-документам линейки.",
  },
  {
    id: "faq-stores-prelaunch",
    scope: "stores",
    question: "Почему на сайте нет списка магазинов по городам?",
    answer:
      "Розничная карта публикуется только после подтверждения городов и партнёрских точек. До этого сайт принимает запросы по наличию и запуску.",
  },
  {
    id: "faq-franchise-no-promises",
    scope: "franchise",
    question: "Есть ли на сайте финансовые обещания по франшизе?",
    answer:
      "Нет. Франчайзинговый раздел описывает формат сотрудничества, документы и каналы связи без заявлений по выручке, прибыли или окупаемости.",
  },
  {
    id: "faq-responsible-split",
    scope: "responsible",
    question: "Как сайт разделяет никотиновую и безникотиновую продукцию?",
    answer:
      "Текущая линия STILNO CLICK ONE относится к никотинсодержащей категории. Безникотиновые продукты, если будут опубликованы, должны иметь отдельные предупреждения и самостоятельную подачу.",
  },
  {
    id: "faq-careers-public",
    scope: "careers",
    question: "Можно ли отправить отклик, если открытых ролей пока нет?",
    answer:
      "Да. Страница вакансий принимает общий отклик для будущих запусков и операционных ролей, даже если конкретная позиция ещё не опубликована.",
  },
];

export const responsibilityNotes = [
  "18+ доступ обязателен для всего сайта и применяется до просмотра продуктового контента.",
  "STILNO CLICK ONE относится к никотинсодержащей категории и маркируется отдельно.",
  "Безникотиновые продукты, если они будут опубликованы, должны иметь собственные предупреждения, разделы и самостоятельную подачу.",
  "Сайт не использует медицинские обещания и не подменяет инструкцию по использованию продукта.",
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Политика обработки персональных данных",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Порядок обработки данных, отправленных через формы сайта STILNO.",
    body: [
      `${companyDetails.companyName} обрабатывает только те данные, которые пользователь самостоятельно передаёт через формы сайта: имя, телефон, email, город или регион, тип запроса и комментарий.`,
      "Данные используются для обратной связи по розничным, партнёрским, франчайзинговым и карьерным обращениям. Сайт не публикует пользовательские данные и не использует их для медицинских или рекламных обещаний.",
      "Передача данных через формы возможна только после отдельного согласия пользователя. Для уточнения или отзыва согласия пользователь может использовать страницу контактов сайта.",
    ],
  },
  {
    slug: "terms",
    title: "Пользовательское соглашение",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Условия доступа к сайту STILNO и использования его сервисов.",
    body: [
      "Сайт STILNO является информационным брендовым ресурсом и lead-формой для розничных, партнёрских, франчайзинговых и карьерных обращений.",
      "Контент сайта адресован совершеннолетней аудитории. Переход в продуктовые разделы допускается только после подтверждения возраста 18+.",
      "Информация о продукте публикуется по подтверждённым упаковочным материалам. Сайт не заменяет инструкцию к продукту и не предоставляет медицинских рекомендаций.",
    ],
  },
  {
    slug: "cookies",
    title: "Политика использования cookies",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Описание cookie-файлов, возрастного подтверждения и аналитики сайта.",
    body: [
      "Cookie-файлы используются для сохранения возрастного подтверждения, настроек согласия и работы необходимых функций сайта.",
      "Аналитические инструменты подключаются только после согласия пользователя. Формы обратной связи не передаются в аналитику как персональные данные.",
      "Пользователь может ограничить cookies в настройках браузера, но это может повлиять на отдельные сервисные функции сайта.",
    ],
  },
  {
    slug: "consent",
    title: "Согласие на обработку персональных данных",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Согласие на обработку данных, отправляемых через формы STILNO.",
    body: [
      "Отправляя форму на сайте, пользователь подтверждает достоверность введённых данных и даёт согласие на их обработку для ответа по запросу.",
      "Согласие распространяется на имя, телефон, email, город или регион, тип запроса и комментарий, переданные через соответствующую форму.",
      "Пользователь вправе отозвать согласие, направив запрос через страницу контактов сайта.",
    ],
  },
  {
    slug: "age-18",
    title: "18+ и доступ к контенту",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Пояснение к возрастному ограничению и возрастному подтверждению на сайте STILNO.",
    body: [
      "Сайт STILNO содержит информацию о никотиновой продукции и доступен только совершеннолетней аудитории.",
      "Возрастное подтверждение используется как обязательное ограничение доступа. При отказе от подтверждения возраста доступ к сайту блокируется.",
      "Подтверждение возраста не отменяет необходимости соблюдать ограничения, указанные на упаковке и в документации продукта.",
    ],
  },
  {
    slug: "disclaimer",
    title: "Ответственное потребление и предупреждения",
    effectiveDate: "16.04.2026",
    version: "1.1",
    summary: "Правила продуктовой коммуникации на сайте STILNO.",
    body: [
      "Сайт не делает медицинских заявлений, не обещает отсутствие риска и не подменяет официальную инструкцию.",
      "Для никотиновой продукции публикуются предупреждения, состав, условия хранения, срок годности и сведения об изготовителе.",
      "Если на сайте будут опубликованы безникотиновые продукты, они должны получить отдельные предупреждения и самостоятельную коммуникацию.",
    ],
  },
  {
    slug: "not-public-offer",
    title: "Не является публичной офертой",
    effectiveDate: "21.04.2026",
    version: "1.0",
    summary: "Разъяснение о статусе информации, размещённой на сайте STILNO.",
    body: [
      "Информация на сайте носит справочный характер. Условия партнёрства и франчайзинга обсуждаются индивидуально.",
      "Заявка через форму не создаёт договорных обязательств и не является акцептом публичной оферты.",
      "Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.",
    ],
  },
];
