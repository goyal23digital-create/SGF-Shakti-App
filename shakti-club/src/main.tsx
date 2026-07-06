import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import DealerApp from './app/DealerApp';
import AdminPanel from './admin/AdminPanel';
import './styles/tokens.css';
import './styles/global.css';

/* Hash routing so the built app also works from a static file server
   with no rewrite rules: /            → dealer app
                          /#/admin     → admin web panel */
const router = createHashRouter([
  { path: '/', element: <DealerApp /> },
  { path: '/admin', element: <AdminPanel /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
