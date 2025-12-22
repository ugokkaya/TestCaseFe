import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5041/api'
});

export interface GeneratedTestCase {
  title: string;
  steps: string[];
  expected: string;
}

export interface GenerateRequest {
  requirement: string;
  framework: string;
  model?: string;
}

export interface GenerateResponse {
  model_used: string;
  result: unknown | null;
  test_case: GeneratedTestCase;
  script: string;
  script_code: string;
}

export interface TestCaseEntity {
  id: number;
  requirement: string;
  title: string;
  steps: string[] | string;
  expected: string;
  framework: string;
  scriptCode: string;
  createdAt: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalDurationMs: number;
  promptEvalDurationMs: number;
  evalDurationMs: number;
}

export const decodeEscapedText = (value: string): string => {
  if (!value) return value;
  let decoded = value;
  decoded = decoded.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  decoded = decoded.replace(/\\r\\n/g, '\n');
  decoded = decoded.replace(/\\n/g, '\n');
  decoded = decoded.replace(/\\t/g, '\t');
  decoded = decoded.replace(/\\"/g, '"');
  decoded = decoded.replace(/\\'/g, "'");
  decoded = decoded.replace(/\\\\/g, '\\');
  return decoded.trim();
};

export const normalizeSteps = (steps: string[] | string): string[] => {
  if (Array.isArray(steps)) return steps;
  try {
    const parsed = JSON.parse(steps);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const fetchTestCases = async (): Promise<TestCaseEntity[]> => {
  const { data } = await api.get<TestCaseEntity[]>('/Ai/list');
  return data.map((item: any) => ({
    ...item,
    requirement: decodeEscapedText(item.requirement ?? item.Requirement),
    title: decodeEscapedText(item.title ?? item.Title),
    expected: decodeEscapedText(item.expected ?? item.Expected),
    steps: normalizeSteps((item.steps ?? item.Steps) as any),
    scriptCode: decodeEscapedText((item.scriptCode ?? item.ScriptCode) ?? ''),
    latencyMs: Number(item.latencyMs ?? item.LatencyMs ?? 0),
    promptTokens: Number(item.promptTokens ?? item.PromptTokens ?? 0),
    completionTokens: Number(item.completionTokens ?? item.CompletionTokens ?? 0),
    totalTokens: Number(item.totalTokens ?? item.TotalTokens ?? 0),
    totalDurationMs: Number(item.totalDurationMs ?? item.TotalDurationMs ?? 0),
    promptEvalDurationMs: Number(item.promptEvalDurationMs ?? item.PromptEvalDurationMs ?? 0),
    evalDurationMs: Number(item.evalDurationMs ?? item.EvalDurationMs ?? 0)
  }));
};

export const generateTestCase = async (payload: GenerateRequest): Promise<GenerateResponse> => {
  const { data } = await api.post<GenerateResponse>('/Ai/generate', payload);
  return data;
};

export const apiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ||
      error.response?.statusText ||
      error.message ||
      'İstek başarısız oldu'
    );
  }
  return 'Beklenmeyen bir hata oluştu';
};

const apiTestCase = {
  fetchTestCases,
  generateTestCase
};

export default apiTestCase;
