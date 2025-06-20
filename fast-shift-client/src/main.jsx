import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routes/Routes.jsx'
import { RouterProvider } from 'react-router'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <div className='font-urbanist max-w-7xl mx-auto'>
      <RouterProvider router={router} />
     </div>
  </StrictMode>,
)
