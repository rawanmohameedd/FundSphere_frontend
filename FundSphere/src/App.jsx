import Layout from './Router/layout';
import { Navbar } from './Components/navbar'
import { Joinus } from './pages/joinus'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Verify } from './pages/verfiy';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
       <Route element={<Layout />}>
        <Route path='/' element={<Navbar/>} /> 
      </Route>
      <Route path='/join' element={<Joinus />} />
      <Route path='/verfiy' element={<Verify />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App