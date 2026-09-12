import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import Header from './components/common/Header';
import DevelopmentPage from './components/pages/DevelopmentPage';
import HomePage from './components/pages/HomePage';
import OrganizersFormPage from './components/pages/organizers/OrganizersFormPage';
import OrganizersListPage from './components/pages/organizers/OrganizersListPage';
import ProductsFormPage from './components/pages/products/ProductsFormPage';
import ProductsListPage from './components/pages/products/ProductsListPage';
import SalesFormPage from './components/pages/sales/SalesFormPage';
import SalesPage from './components/pages/SalesPage';
import SummaryPage from './components/pages/SummaryPage';
import WorkdayDetailPage from './components/pages/workdays/WorkdayDetailPage';
import WorkdaysFormPage from './components/pages/workdays/WorkdaysFormPage';
import WorkdaysListPage from './components/pages/workdays/WorkdaysListPage';


function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <div>
          <Routes>
            <Route path='/' element={<HomePage />}/>

            <Route path='/development' element={<DevelopmentPage />}/>
            <Route path='/desarrollo' element={<DevelopmentPage />}/>

            <Route path='/organizers' element={<OrganizersListPage />}/>
            <Route path='/organizers/new' element={<OrganizersFormPage />}/>
            <Route path='/organizers/:id/edit' element={<OrganizersFormPage />}/>
            <Route path='/organizadores' element={<OrganizersListPage />}/>
            <Route path='/organizadores/nuevo' element={<OrganizersFormPage />}/>
            <Route path='/organizadores/:id/editar' element={<OrganizersFormPage />}/>

            <Route path='/products/new' element={<ProductsFormPage />}/>
            <Route path='/products' element={<ProductsListPage />}/>
            <Route path='/products/:id/edit' element={<ProductsFormPage />}/>
            <Route path='/productos' element={<ProductsListPage />}/>
            <Route path='/productos/nuevo' element={<ProductsFormPage />}/>
            <Route path='/productos/:id/editar' element={<ProductsFormPage />}/>

            <Route path='/workdays' element={<WorkdaysListPage />}/>
            <Route path='/workdays/:id/edit' element={<WorkdaysFormPage />}/>
            <Route path='/workdays/:id' element={<WorkdayDetailPage />}/>
            <Route path='/workdays/new' element={<WorkdaysFormPage />}/>
            <Route path='/workdays/:id/sales/:saleId' element={<SalesFormPage />}/>
            <Route path='/workdays/:id/sales/new' element={<SalesFormPage />}/>

            <Route path='/jornadas' element={<WorkdaysListPage />}/>
            <Route path='/jornadas/:id/editar' element={<WorkdaysFormPage />}/>
            <Route path='/jornadas/:id' element={<WorkdayDetailPage />}/>
            <Route path='/jornadas/nueva' element={<WorkdaysFormPage />}/>
            <Route path='/jornadas/:id/ventas/:saleId' element={<SalesFormPage />}/>
            <Route path='/jornadas/:id/ventas/nueva' element={<SalesFormPage />}/>

            <Route path='/sales' element={<SalesPage />}/>
            <Route path='/ventas' element={<SalesPage />}/>

            <Route path='/summary' element={<SummaryPage />}/>
            <Route path='/resumen' element={<SummaryPage />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
};


export default App;