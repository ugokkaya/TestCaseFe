import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AskTestPage from './pages/AskTestPage';
import TestCaseListPage from './pages/TestCaseListPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ask-test" element={<AskTestPage />} />
        <Route path="/test-cases" element={<TestCaseListPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
};

export default App;
