// Hero перенесён 1-в-1 из hero-исходника варианта «Пола Шер / стена смеха».
// Разметка, эффекты (float/breathe), --hero-* токены сохранены.

const SYLLABLES = [
  { text: 'ХО', cls: 'text-[var(--hero-x-ho)] text-[8rem] md:text-[15rem]', pos: 'top-16 -left-4', anim: 'float' },
  { text: 'ХА', cls: 'text-[var(--hero-x-ha)] text-[6rem] md:text-[12rem]', pos: 'top-20 left-1/2 md:left-[420px]', anim: 'float f2' },
  { text: 'ХО', cls: 'text-stroke text-[5rem] md:text-[9rem] r180', pos: 'top-24 right-2 md:right-8', anim: 'float f3' },
  { text: 'ХА', cls: 'text-[var(--hero-x-tilt)] text-[6rem] md:text-[12rem]', pos: 'top-[46%] left-2', anim: 'float f4' },
  { text: 'ХО', cls: 'text-stroke text-[5rem] md:text-[9rem]', pos: 'bottom-24 right-4 md:right-24', anim: 'float f2' },
  { text: 'ХА', cls: 'text-[var(--hero-x-ho)] text-[5rem] md:text-[9rem]', pos: 'bottom-8 left-6 md:left-10', anim: 'float f3' },
];

const Hero = () => {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-hero-bg pt-20"
    >
      {/* Стена смеха */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {SYLLABLES.map((s, i) => (
          <span
            key={i}
            className={`absolute select-none font-head font-black leading-[0.78] tracking-[-0.045em] ${s.pos} ${s.cls} ${s.anim}`}
          >
            {s.text}
          </span>
        ))}
      </div>

      {/* Врезка с оффером */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5">
        <div className="flex max-w-2xl -rotate-2 flex-col items-center gap-5 text-center">
          <span className="animate-fade-in rounded bg-hero-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text md:text-sm">
            в группе — 15–20&nbsp;человек · Екатеринбург
          </span>

          <h1 className="animate-fade-in font-head text-4xl font-black uppercase leading-[0.95] tracking-tight text-hero-text drop-shadow-[0_3px_0_var(--hero-x-line)] sm:text-5xl md:text-7xl">
            Ржать полезно
          </h1>

          <p
            className="animate-fade-in max-w-lg text-lg font-medium leading-snug text-hero-text [text-shadow:0_2px_0_var(--hero-x-line)] md:text-xl"
            style={{ animationDelay: '0.1s' }}
          >
            100 минут хохота вместо ещё&nbsp;одного вечера с телефоном. Диафрагма
            включается&nbsp;— мозг сам меняет кортизол на&nbsp;эндорфины.
          </p>

          <a
            href="#book"
            className="animate-fade-in mt-2 inline-flex items-center gap-3 rounded-full bg-hero-accent px-8 py-4 font-head text-lg font-extrabold text-hero-contrast transition-all duration-200 hover:-translate-y-1 hover:rotate-2 hover:shadow-xl hover:shadow-black/30"
            style={{ animationDelay: '0.2s' }}
          >
            Хочу смеяться <span aria-hidden>→</span>
          </a>

          <span
            className="animate-fade-in text-sm font-medium text-hero-text/85"
            style={{ animationDelay: '0.3s' }}
          >
            Пробное занятие — 900&nbsp;₽. Не смешно — второе бесплатно.
          </span>
        </div>
      </div>

      <span className="relative z-10 px-5 pb-6 text-center text-xs font-medium uppercase tracking-[0.14em] text-hero-muted md:px-10 md:text-left">
        садись на мягкий пол · дыши · «хо-хо, ха-ха»
      </span>
    </section>
  );
};

export default Hero;