import { useEffect } from 'react';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import { useNavigate } from 'react-router-dom';

import PageHeader from '../../common/PageHeader';
import { deleteProduct, getProducts } from '../../../services/products';
import { getSalesByProductId } from '../../../services/sales';
import phrases from '../../../utils/Phrases';


function ProductsListPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [productToDelete, setProductToDelete] = useState(null);
    const [productDeleteBlocked, setProductDeleteBlocked] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function loadProducts() {
        setLoading(true);

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
    }

    useEffect(function() {
        loadProducts();
    }, []);

    function handleDeleteRequest(product) {
        setProductDeleteBlocked(null);
        setProductToDelete(product);
    }

    function handleDeleteCancel() {
        if (deleting) {
            return;
        }

        setProductToDelete(null);
    }

    function handleDeleteBlockedClose() {
        setProductDeleteBlocked(null);
    }

    async function handleDeleteConfirm() {
        setDeleting(true);
        // setProductDeleteBlocked(null);

        try {
            const sales = await getSalesByProductId(productToDelete.id);

            if (sales.length > 0) {
                setProductToDelete(null);
                setProductDeleteBlocked(productToDelete);
                return;
            }

            await deleteProduct(productToDelete.id);

            setProductToDelete(null);
            loadProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setDeleting(false);
        }
    }

    function AddButton() {
        return (
            <Button
                variant='primary'
                onClick={function() {
                    navigate(phrases.get('App.paths.products.new'));
                }}>
                <i className='bi bi-plus-lg me-1'></i>
                <span>{phrases.get('components.pages.ProductsListPage.new')}</span>
            </Button>
        );
    }

    function EditButton({ productId }) {
        return (
            <Button
                variant='outline-secondary'
                size='sm'
                className='me-1'
                title={phrases.get('components.pages.ProductsListPage.edit.tooltip')}
                onClick={function() {
                    navigate(`${phrases.get('App.paths.products.edit')}${productId}`);
                }}>
                <i className='bi bi-pencil'></i>
            </Button>
        );
    }

    function DeleteButton({ product }) {
        return (
            <Button
                variant='outline-danger'
                size='sm'
                title={phrases.get('components.pages.ProductsListPage.delete.tooltip')}
                onClick={function() {
                    handleDeleteRequest(product);
                }}>
                <i className='bi bi-trash'></i>
            </Button>
        );
    }

    function Header() {
        return (
            <PageHeader
                icon='box-seam'
                title={phrases.get('components.pages.ProductsListPage.title')}
                subtitle={phrases.get('components.pages.ProductsListPage.subtitle')}
                action={<AddButton />} />
        );
    }

    function Loader() {
        return (
            <div className='text-center py-5'>
                <Spinner animation='border' variant='primary' />
            </div>
        );
    }

    function Empty() {
        return (
            <div className='text-center text-body-secondary py-5'>
                <i className='bi bi-box-seam fs-1 d-block mb-3'></i>
                <span>{phrases.get('components.pages.ProductsListPage.empty')}</span>
            </div>
        );
    }

    function ProductsTable() {
        return (
            <Table responsive hover size='sm' className='mb-4 small'>
                <thead>
                    <tr className='align-middle'>
                        <th scope='col' className='col-6'>
                            {phrases.get('components.pages.ProductsListPage.table.name')}
                        </th>

                        <th scope='col' className='col-4'>
                            {phrases.get('components.pages.ProductsListPage.table.description')}
                        </th>

                        <th scope='col' className='col-2 text-end'>
                            {phrases.get('components.pages.ProductsListPage.table.actions')}
                        </th>
                    </tr>
                </thead>

                <tbody className='table-group-divider'>
                    {products.map(function(product) {
                        return (
                            <tr key={product.id} className='align-middle'>
                                <td>{product.name}</td>

                                <td className='text-body-secondary'>
                                    {product.description || '—'}
                                </td>

                                <td className='text-end text-nowrap'>
                                    <EditButton productId={product.id} />
                                    <DeleteButton product={product} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    function DeleteConfirmationModal() {
        if (!productToDelete) {
            return null;
        }

        var buttonText = null;
        if (deleting) {
            buttonText = phrases.get('components.pages.ProductsListPage.delete.popup.processing');
        } else {
            buttonText = phrases.get('components.pages.ProductsListPage.delete.popup.confirm');
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteCancel}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>{phrases.get('components.pages.ProductsListPage.delete.popup.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        {phrases.get('components.pages.ProductsListPage.delete.popup.question')}{' '}
                        <strong>{productToDelete.name}</strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteCancel}
                        disabled={deleting}>
                        {phrases.get('components.pages.ProductsListPage.delete.popup.cancel')}
                    </Button>

                    <Button
                        variant='danger'
                        onClick={handleDeleteConfirm}
                        disabled={deleting}>
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function DeleteBlockedModal() {
        if (!productDeleteBlocked) {
            return null;
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteBlockedClose}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>{phrases.get('components.pages.ProductsListPage.delete.blocked.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className='mb-0'>
                        {phrases.get('components.pages.ProductsListPage.delete.blocked.subtitle.1')}{' '}
                        <strong>{productDeleteBlocked.name}</strong>{' '}
                        {phrases.get('components.pages.ProductsListPage.delete.blocked.subtitle.2')}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteBlockedClose}>
                        {phrases.get('components.pages.ProductsListPage.delete.blocked.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    var table = null;

    if (products && products.length > 0) {
        table = <ProductsTable />;
    }

    return (
        <>
            <Header />

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {loading ? (
                            <Loader />
                        ) : products.length === 0 ? (
                            <Empty />
                        ) : (
                            table
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <DeleteConfirmationModal />
            <DeleteBlockedModal />
        </>
    );
}


export default ProductsListPage;