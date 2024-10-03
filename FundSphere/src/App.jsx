import Layout from './Router/layout';
import { Navbar } from './Components/navbar'
import { Joinus } from './pages/joinus'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Verify } from './pages/verfiy';
import { Profile } from './pages/Profile';
import { Footer } from './Components/footer';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
       <Route element={<Layout />}>
        <Route path='/' element={<Navbar/>} /> 
      </Route>
      <Route path='/join' element={<Joinus />} />
      <Route path='/verfiy' element={<Verify />} />
      <Route path='/profile' element={<Profile />} />
    </>
  )
);

function App() {
  return (
    <>
    <RouterProvider router={router} />
    <Footer />
    </>
  )
}

export default App