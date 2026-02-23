import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CalculatorPage from './pages/CalculatorPage';
import FaqPage from './pages/FaqPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <CalculatorPage />,
      },
      {
        path: '/faq',
        element: <FaqPage />,
      },
    ],
  },
]);
