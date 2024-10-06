import Layout from './Router/layout';
import { Navbar } from './Components/navbar'
import { Joinus } from './pages/joinus'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Verify } from './pages/verfiy';
import { Profile } from './pages/Profile';
import CreateEditCampaign from './pages/editCampaign';
import Campaign from './pages/showCampign';
import { Campaigns } from './Components/campaigns';
import { Dashboard } from './pages/dashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='/create' element={<CreateEditCampaign />} />
        <Route path='/edit/:campaign_id' element={<CreateEditCampaign />} />
        <Route path='/campain' element={<Campaign />} />
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
    </>
  )
}

export default App