import { useEffect } from 'react';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';


import PageHeader from '../common/PageHeader';
import { getProducts } from '../../services/products';
import phrases from '../../utils/Phrases';


function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(function() {
        getProducts()
            .then(function(result) {
                setProducts(result);
            })
            .catch(function(error) {
                console.error('Failed to load products:', error);
            })
            .finally(function() {
                setLoading(false);
            });
    }, []);

    const header = <PageHeader
        icon='box-seam'
        title={phrases.get('components.pages.ProductsPage.title')}
        subtitle={phrases.get('components.pages.ProductsPage.subtitle')} />;

    const loader = <div className='text-center py-5'>
        <Spinner animation='border' variant='primary' />
    </div>;

    const empty = <div className='text-center text-body-secondary py-5'>
        <i className='bi bi-box-seam fs-1 d-block mb-3'></i>
        <span>{phrases.get('components.pages.ProductsPage.empty')}</span>
    </div>;

    var table = null;
    if (products && products.length > 0) {
        table = <Table responsive hover size='sm' className='mb-4 small'>
            <thead>
                <tr>
                    <th scope='col' className='col-6'>{phrases.get('components.pages.ProductsPage.table.name')}</th>
                    <th scope='col' className='col-6'>{phrases.get('components.pages.ProductsPage.table.description')}</th>
                </tr>
            </thead>

            <tbody className='table-group-divider'>
                {products.map(function(product) {
                    return (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td className='text-body-secondary'>{product.description || '—'}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>;
    }

    return (
        <>
            {header}

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {loading ? (
                            loader
                        ) : products.length === 0 ? (
                            empty
                        ) : (
                            table
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}


export default ProductsPage;