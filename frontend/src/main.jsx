import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RouterProvider } from 'react-router-dom';
import routes from './Router';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <>
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={routes} />
      </DndProvider>
      <Toaster 
        position="bottom-right"
        gutter={8}
        containerStyle={{ top: 80, left: 20, paddingTop: 20, zIndex: 50 }}
    />
    </>
  // </StrictMode>
);
