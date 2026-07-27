import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const NAV = [
  { href: '#what', label: 'Что это' },
  { href: '#how', label: 'Как идёт' },
  { href: '#benefits', label: 'Польза' },
  { href: '#coach', label: 'Ведущий' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#price', label: 'Цены' },
  { href: '#faq', label: 'Вопросы' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-hero-bg/95 backdrop-blur-sm shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-head text-lg font-extrabold tracking-tight text-hero-text md:text-xl">
            ХО-ХО-ХА-ХА
          </span>
          <span className="hidden text-[0.55rem] font-medium uppercase tracking-[0.28em] text-hero-muted sm:inline">
            йога&nbsp;смеха
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs font-medium uppercase tracking-[0.16em] text-hero-muted transition-colors hover:text-hero-text"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#book"
            className="rounded-full bg-hero-accent px-5 py-2 font-head text-sm font-extrabold text-hero-contrast transition-transform hover:-translate-y-0.5 hover:rotate-1"
          >
            Записаться
          </a>
        </nav>

        <button
          aria-label="Меню"
          className="text-hero-text lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'X' : 'Menu'} size={30} />
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-white/10 bg-hero-accent px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium uppercase tracking-[0.16em] text-hero-muted transition-colors hover:text-hero-text"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-[var(--hero-x-ho)] py-3 text-center font-head font-extrabold text-hero-accent"
            >
              Записаться
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;