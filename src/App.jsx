import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import Header from './components/common/Header';
import DevelopmentPage from './components/pages/DevelopmentPage';
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
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

            <Route path='/products' element={<ProductsPage />}/>
            <Route path='/productos' element={<ProductsPage />}/>

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