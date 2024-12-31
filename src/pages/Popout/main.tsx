import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popout } from './Popout';
import '@natural/assets/css/tailwind.css';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Popout />
  </React.StrictMode>
);
