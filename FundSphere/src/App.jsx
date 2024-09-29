import Layout from './Router/layout';
import { Navbar } from './Components/navbar'
import { Joinus } from './pages/joinus'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
       <Route element={<Layout />}>
        <Route path='/' element={<Navbar/>} /> 
      </Route>
      <Route path='/join' element={<Joinus />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App