import { FormEvent, useMemo, useState } from 'react';
import { generateTestCase, apiErrorMessage, GenerateResponse, decodeEscapedText } from '../services/apiTestCase';

const testTools = ['Playwright', 'Cypress', 'Selenium'];
const modelOptions = [
  { label: 'Qwen 2.5 Coder 7B', value: 'qwen' },
  { label: 'Llama 3.1', value: 'llama' },
  { label: 'Deepseek', value: 'deepseek' }
];

const AskTestPage = () => {
  const [requirement, setRequirement] = useState('');
  const [framework, setFramework] = useState(testTools[0]);
  const [model, setModel] = useState(modelOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const isDisabled = useMemo(() => !requirement.trim() || !framework || isLoading, [framework, isLoading, requirement]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateTestCase({
        requirement: requirement.trim(),
        framework,
        model
      });
      setResult(response);
      setRequirement('');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Yapay zekâdan test senaryosu üretmesini isteyin</h1>
        <p className="text-slate-600">
          Özelliği ya da gereksinimi yazın, hedef test aracını seçin ve sistemin ürettiği senaryoları script kodlarıyla birlikte alın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Özellik açıklaması
            <textarea
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              rows={6}
              placeholder="Örnek: Bir kullanıcı e-posta bağlantısı ile şifresini sıfırlamak istiyor..."
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Test aracı
            <select
              value={framework}
              onChange={(event) => setFramework(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-indigo-400 focus:outline-none"
            >
              {testTools.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Model seçimi
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-indigo-400 focus:outline-none"
            >
              {modelOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          disabled={isDisabled}
          type="submit"
          className={`rounded-full px-6 py-3 font-semibold transition ${isDisabled
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400'
            }`}
        >
          {isLoading ? 'Gönderiliyor…' : 'İstek Gönder'}
        </button>
      </form>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {result && (
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Önerilen Test Senaryosu</p>
            <h2 className="text-2xl font-semibold text-slate-900">{result.test_case.title || 'Başlık bulunamadı'}</h2>
            {result.model_used && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                Kullanılan model: {result.model_used}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Adımlar</h3>
            <ol className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700">
              {result.test_case.steps.map((step, index) => (
                <li key={`${step}-${index}`} className="flex gap-2">
                  <span className="font-semibold text-indigo-500">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">Beklenen sonuç</h3>
            <p className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700">
              {result.test_case.expected || 'Beklenen sonuç açıklaması gelmedi.'}
            </p>
          </div>

          {result.script && (
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
              <summary className="cursor-pointer text-sm font-semibold text-indigo-600">Üretilen Test Scripti ({result.script})</summary>
              <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-4 text-slate-100 whitespace-pre-wrap">
                <code>{result.script_code || result.script}</code>
              </pre>
            </details>
          )}
        </article>
      )}
    </section>
  );
};

export default AskTestPage;
