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
import SalesPage from './components/pages/SalesPage';
import SummaryPage from './components/pages/SummaryPage';


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
            <Route path='/organizers/:id' element={<OrganizersFormPage />}/>
            <Route path='/organizadores' element={<OrganizersListPage />}/>
            <Route path='/organizadores/nuevo' element={<OrganizersFormPage />}/>
            <Route path='/organizadores/:id' element={<OrganizersFormPage />}/>

            <Route path='/products/new' element={<ProductsFormPage />}/>
            <Route path='/products' element={<ProductsListPage />}/>
            <Route path='/products/:id' element={<ProductsFormPage />}/>
            <Route path='/productos' element={<ProductsListPage />}/>
            <Route path='/productos/nuevo' element={<ProductsFormPage />}/>
            <Route path='/productos/:id' element={<ProductsFormPage />}/>

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