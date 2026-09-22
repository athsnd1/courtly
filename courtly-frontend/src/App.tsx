import { RouterProvider } from 'react-router-dom';
import router from './routes/routes.tsx';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div>
        <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
      className: "font-brains text-sm"
    }}/>
    </div>
  )
}
