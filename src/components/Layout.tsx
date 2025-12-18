import { Link, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

const navItems = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/ask-test', label: 'Test İste' },
  { path: '/test-cases', label: 'Test Senaryoları' }
];

const Layout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Yapay Zeka Destekli Otomatik Test Sistemi
          </Link>
          <nav className="flex gap-3 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
};

export default Layout;
