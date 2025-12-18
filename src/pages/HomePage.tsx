import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">YAPAY ZEKA DESTEKLİ OTOMATİK TEST SENARYOSU VE KOD ÜRETİM SİSTEMİ</p>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Test senaryolarınızı ve scriptlerinizi yapay zekâ desteğiyle dakikalar içinde üretin.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Gereksinimi yazın, hedef test aracını seçin ve sistemin ürettiği senaryolarla otomasyon kodlarını birlikte teslim edin.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/ask-test"
          className="rounded-full bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
        >
          Test Senaryosu İste
        </Link>
        <Link
          to="/test-cases"
          className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Test Senaryolarını Görüntüle
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['Yapay zeka destekli üretim', 'Test aracı uyumlu script', 'Detaylı içgörüler'].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-indigo-500">{item}</p>
            <p className="mt-2 text-sm text-slate-600">
              Otomasyonu akıllı önerilerle, insan kontrolünü ise anlaşılır özetlerle birleştirerek daha güvenli test
              süreçleri oluşturun.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
