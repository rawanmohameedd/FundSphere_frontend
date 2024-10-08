import Layout from './Router/layout';
import { Joinus } from './pages/joinus'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Verify } from './pages/verfiy';
import { Profile } from './pages/Profile';
import CreateEditCampaign from './pages/editCampaign';
import Campaign from './pages/showCampign';
import { Dashboard } from './pages/dashboard';
import { CampaignsbyCat } from './pages/CampaignsCat';
import { Donations } from './pages/Donations';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='/create' element={<CreateEditCampaign />} />
        <Route path='/edit/:campaign_id' element={<CreateEditCampaign />} />
        <Route path='/campain/:camaign_id' element={<Campaign />} />
        <Route path='/category/:category_id' element={<CampaignsbyCat/>}/>
        <Route path='/donate/:campaign_id' element={<Donations/>}/>
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