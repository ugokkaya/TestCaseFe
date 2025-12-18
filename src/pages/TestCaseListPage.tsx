import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { fetchTestCases, TestCaseEntity, apiErrorMessage, normalizeSteps } from '../services/apiTestCase';

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
};

const TestCaseListPage = () => {
  const [testCases, setTestCases] = useState<TestCaseEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseEntity | null>(null);

  useEffect(() => {
    const loadTestCases = async () => {
      try {
        const data = await fetchTestCases();
        setTestCases(data);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadTestCases();
  }, []);

  const rows = useMemo(() => testCases, [testCases]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Test Senaryoları</h1>
        <p className="text-slate-600">Sistemin ürettiği tüm senaryoları ve onlara ait script kodlarını bu panelde inceleyin.</p>
      </div>

      {isLoading && (
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          Test senaryoları yükleniyor…
        </div>
      )}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {!isLoading && !error && (
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Gereksinim</th>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Çatı</th>
                <th className="px-4 py-3">Oluşturulma</th>
                <th className="px-4 py-3" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                    Henüz test senaryosu yok. Test İste sayfasından yeni kayıtlar oluşturun.
                  </td>
                </tr>
              )}
              {rows.map((testCase) => (
                <tr key={testCase.id} className="border-t border-slate-100">
                  <td className="px-4 py-4 font-semibold text-slate-900">#{testCase.id}</td>
                  <td className="px-4 py-4 text-slate-900">{testCase.requirement}</td>
                  <td className="px-4 py-4 text-slate-900">{testCase.title}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                      {testCase.framework}
                    </span>
                  </td>
                  <td className="px-4 py-4">{formatDate(testCase.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelectedTestCase(testCase)}
                      className="rounded-full border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                      Detayları Gör
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Test Senaryosu Detayları" isOpen={selectedTestCase != null} onClose={() => setSelectedTestCase(null)}>
        {selectedTestCase && (
          <dl className="space-y-4">
            <div>
              <dt className="text-xs uppercase text-slate-500">ID</dt>
              <dd className="text-lg font-semibold text-slate-900">#{selectedTestCase.id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Gereksinim</dt>
              <dd className="text-base text-slate-700">{selectedTestCase.requirement}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Başlık</dt>
              <dd className="text-base text-slate-700">{selectedTestCase.title}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Çatı</dt>
              <dd className="text-base text-slate-700">{selectedTestCase.framework}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Oluşturulma</dt>
              <dd className="text-base text-slate-700">{formatDate(selectedTestCase.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Beklenen Sonuç</dt>
              <dd className="text-base text-slate-700">{selectedTestCase.expected}</dd>
            </div>
            {normalizeSteps(selectedTestCase.steps).length > 0 && (
              <div>
                <dt className="text-xs uppercase text-slate-500">Adımlar</dt>
                <dd className="mt-2 space-y-2 text-base text-slate-700">
                  {normalizeSteps(selectedTestCase.steps).map((step, index) => (
                    <div key={`${selectedTestCase.id}-${index}`} className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-indigo-500">{index + 1}.</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </dd>
              </div>
            )}
            {selectedTestCase.scriptCode && (
              <div>
                <dt className="text-xs uppercase text-slate-500">Script Kodu</dt>
                <dd className="mt-2">
                  <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100 whitespace-pre-wrap">
                    <code>{selectedTestCase.scriptCode}</code>
                  </pre>
                </dd>
              </div>
            )}
          </dl>
        )}
      </Modal>
    </section>
  );
};

export default TestCaseListPage;
