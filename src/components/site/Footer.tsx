import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-hero-bg py-12">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-head text-xl font-extrabold text-hero-text">
                ХО-ХО-ХА-ХА
              </span>
              <span className="text-[0.55rem] font-medium uppercase tracking-[0.28em] text-hero-muted">
                йога&nbsp;смеха
              </span>
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-hero-muted">
              Йога смеха в Екатеринбурге. Садись на мягкий пол · дыши ·
              «хо-хо, ха-ха».
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { icon: 'Send', href: '#book' },
              { icon: 'Phone', href: '#book' },
              { icon: 'Instagram', href: '#book' },
            ].map((s) => (
              <a
                key={s.icon}
                href={s.href}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--hero-x-ho)] text-hero-accent transition-transform hover:-translate-y-1"
              >
                <Icon name={s.icon} size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-hero-line pt-6 text-xs font-medium uppercase tracking-wide text-hero-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} ХО-ХО-ХА-ХА · Екатеринбург</span>
          <span>Ржать полезно</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
