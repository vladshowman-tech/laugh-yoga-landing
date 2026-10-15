export type Field =
  | { kind: 'text'; key: string; label: string; hint?: string }
  | { kind: 'textarea'; key: string; label: string }
  | { kind: 'image'; key: string; label: string }
  | { kind: 'bool'; key: string; label: string }
  | { kind: 'strings'; key: string; label: string; addLabel: string }
  | {
      kind: 'list';
      key: string;
      label: string;
      addLabel: string;
      itemTitleKey: string;
      fields: Field[];
      empty: Record<string, unknown>;
    };

export interface SectionDef {
  key: string;
  title: string;
  icon: string;
  fields: Field[];
}

const ICON_HINT = 'Название иконки из lucide, например Heart, Users, Smile';

export const SECTIONS: SectionDef[] = [
  {
    key: 'hero',
    title: 'Главный экран',
    icon: 'Home',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка над заголовком' },
      { kind: 'text', key: 'title', label: 'Заголовок' },
      { kind: 'textarea', key: 'text', label: 'Подзаголовок' },
      { kind: 'text', key: 'button', label: 'Текст кнопки' },
      { kind: 'text', key: 'note', label: 'Строка под кнопкой' },
      { kind: 'text', key: 'hint', label: 'Нижняя строка' },
    ],
  },
  {
    key: 'what',
    title: 'Что это',
    icon: 'HelpCircle',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок (обычная часть)' },
      { kind: 'text', key: 'title_accent', label: 'Заголовок (жёлтая часть)' },
      { kind: 'textarea', key: 'text', label: 'Описание' },
      {
        kind: 'list',
        key: 'points',
        label: 'Карточки',
        addLabel: 'Добавить карточку',
        itemTitleKey: 'title',
        empty: { icon: 'Sparkles', title: '', text: '' },
        fields: [
          { kind: 'text', key: 'icon', label: 'Иконка', hint: ICON_HINT },
          { kind: 'text', key: 'title', label: 'Заголовок' },
          { kind: 'textarea', key: 'text', label: 'Текст' },
        ],
      },
    ],
  },
  {
    key: 'how',
    title: 'Как проходит занятие',
    icon: 'ListOrdered',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок' },
      { kind: 'textarea', key: 'text', label: 'Описание' },
      { kind: 'image', key: 'image', label: 'Фото' },
      {
        kind: 'list',
        key: 'steps',
        label: 'Этапы занятия',
        addLabel: 'Добавить этап',
        itemTitleKey: 't',
        empty: { t: '', time: '', text: '' },
        fields: [
          { kind: 'text', key: 't', label: 'Название этапа' },
          { kind: 'text', key: 'time', label: 'Время (например, 0–15 мин)' },
          { kind: 'textarea', key: 'text', label: 'Описание' },
        ],
      },
    ],
  },
  {
    key: 'benefits',
    title: 'Польза',
    icon: 'HeartPulse',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок (обычная часть)' },
      { kind: 'text', key: 'title_accent', label: 'Заголовок (жёлтая часть)' },
      {
        kind: 'list',
        key: 'stats',
        label: 'Цифры',
        addLabel: 'Добавить цифру',
        itemTitleKey: 'n',
        empty: { n: '', s: '' },
        fields: [
          { kind: 'text', key: 'n', label: 'Число' },
          { kind: 'text', key: 's', label: 'Подпись' },
        ],
      },
      {
        kind: 'list',
        key: 'items',
        label: 'Преимущества',
        addLabel: 'Добавить преимущество',
        itemTitleKey: 't',
        empty: { icon: 'Heart', t: '', d: '' },
        fields: [
          { kind: 'text', key: 'icon', label: 'Иконка', hint: ICON_HINT },
          { kind: 'text', key: 't', label: 'Заголовок' },
          { kind: 'textarea', key: 'd', label: 'Текст' },
        ],
      },
    ],
  },
  {
    key: 'coach',
    title: 'Ведущий',
    icon: 'User',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'name', label: 'Имя' },
      { kind: 'image', key: 'photo', label: 'Фото' },
      { kind: 'textarea', key: 'quote', label: 'Цитата / о себе' },
      { kind: 'strings', key: 'facts', label: 'Факты', addLabel: 'Добавить факт' },
      { kind: 'text', key: 'button', label: 'Текст кнопки' },
    ],
  },
  {
    key: 'schedule',
    title: 'Расписание',
    icon: 'CalendarDays',
    fields: [
      { kind: 'bool', key: 'enabled', label: 'Показывать раздел на сайте' },
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок' },
      { kind: 'textarea', key: 'text', label: 'Описание (сами занятия добавляются во вкладке «Расписание»)' },
    ],
  },
  {
    key: 'reviews',
    title: 'Отзывы',
    icon: 'MessageSquareQuote',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок (начало)' },
      { kind: 'text', key: 'title_accent', label: 'Заголовок (жёлтое слово)' },
      { kind: 'text', key: 'title_end', label: 'Заголовок (конец)' },
      {
        kind: 'list',
        key: 'items',
        label: 'Отзывы',
        addLabel: 'Добавить отзыв',
        itemTitleKey: 'name',
        empty: { name: '', role: '', text: '' },
        fields: [
          { kind: 'text', key: 'name', label: 'Имя' },
          { kind: 'text', key: 'role', label: 'Кто это (например, бухгалтер, 34)' },
          { kind: 'textarea', key: 'text', label: 'Текст отзыва' },
        ],
      },
    ],
  },
  {
    key: 'pricing',
    title: 'Цены и тарифы',
    icon: 'Wallet',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок' },
      { kind: 'text', key: 'button', label: 'Текст кнопок' },
      {
        kind: 'list',
        key: 'plans',
        label: 'Тарифы',
        addLabel: 'Добавить тариф',
        itemTitleKey: 'name',
        empty: { name: '', price: '', unit: '', note: '', features: [], highlight: false },
        fields: [
          { kind: 'text', key: 'name', label: 'Название' },
          { kind: 'text', key: 'price', label: 'Цена (например, 700 ₽)' },
          { kind: 'text', key: 'unit', label: 'За что (например, одно занятие)' },
          { kind: 'text', key: 'note', label: 'Пометка' },
          { kind: 'bool', key: 'highlight', label: 'Выделить тариф' },
          { kind: 'strings', key: 'features', label: 'Что входит', addLabel: 'Добавить пункт' },
        ],
      },
    ],
  },
  {
    key: 'faq',
    title: 'Вопросы и ответы',
    icon: 'CircleHelp',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок' },
      {
        kind: 'list',
        key: 'items',
        label: 'Вопросы',
        addLabel: 'Добавить вопрос',
        itemTitleKey: 'q',
        empty: { q: '', a: '' },
        fields: [
          { kind: 'text', key: 'q', label: 'Вопрос' },
          { kind: 'textarea', key: 'a', label: 'Ответ' },
        ],
      },
    ],
  },
  {
    key: 'contacts',
    title: 'Запись и контакты',
    icon: 'Phone',
    fields: [
      { kind: 'text', key: 'badge', label: 'Плашка' },
      { kind: 'text', key: 'title', label: 'Заголовок (обычная часть)' },
      { kind: 'text', key: 'title_accent', label: 'Заголовок (жёлтая часть)' },
      { kind: 'textarea', key: 'text', label: 'Описание' },
      {
        kind: 'list',
        key: 'items',
        label: 'Контакты',
        addLabel: 'Добавить контакт',
        itemTitleKey: 'label',
        empty: { icon: 'Phone', label: '', sub: '' },
        fields: [
          { kind: 'text', key: 'icon', label: 'Иконка', hint: 'MapPin, Phone, Send, Mail, Instagram' },
          { kind: 'text', key: 'label', label: 'Основной текст' },
          { kind: 'text', key: 'sub', label: 'Подпись' },
        ],
      },
    ],
  },
  {
    key: 'footer',
    title: 'Футер',
    icon: 'PanelBottom',
    fields: [
      { kind: 'textarea', key: 'description', label: 'Описание' },
      { kind: 'textarea', key: 'legal', label: 'Данные юридического лица' },
      { kind: 'text', key: 'tagline', label: 'Фраза справа внизу' },
    ],
  },
];