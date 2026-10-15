import Icon from '@/components/ui/icon';

const Footer = ({ data, contacts = [] }: { data: any; contacts?: { icon: string; label: string; sub: string }[] }) => {
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
              {data.description}
            </p>
            <p className="mt-3 whitespace-pre-line text-xs font-medium leading-relaxed text-hero-muted">
              {data.legal}
            </p>
          </div>

          <ul id="contacts" className="flex flex-col gap-4">
            {contacts.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--hero-x-ho)] text-hero-accent">
                  <Icon name={c.icon} fallback="Phone" size={20} />
                </span>
                <div>
                  <div className="font-head text-sm font-extrabold text-hero-text">{c.label}</div>
                  <div className="text-sm font-medium text-hero-muted">{c.sub}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-hero-line pt-6 text-xs font-medium uppercase tracking-wide text-hero-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} ХО-ХО-ХА-ХА · Екатеринбург</span>
          <span>{data.tagline}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
