import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../common/PageHeader.jsx';

import { getWorkdayById } from '../../../services/workdays.js';
import { getOrganizerById } from '../../../services/organizers.js';
import { deleteSale } from '../../../services/sales.js';
import { getSalesByWorkdayId } from '../../../services/sales.js';
import { getProducts } from '../../../services/products.js';
import Formats from '../../../utils/Formats.jsx';
import Links from '../../../utils/Links.jsx';
import phrases from '../../../utils/Phrases';


function WorkdayDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [workday, setWorkday] = useState(null);
    const [organizer, setOrganizer] = useState(null);
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(function() {
        loadWorkday();
    }, [id]);

    async function loadWorkday() {
        setLoading(true);

        try {
            const workdayId = Number(id);

            const [
                loadedWorkday,
                loadedSales,
                loadedProducts
            ] = await Promise.all([
                getWorkdayById(workdayId),
                getSalesByWorkdayId(workdayId),
                getProducts()
            ]);

            setWorkday(loadedWorkday);
            setSales(loadedSales);

            const productMap = {};

            loadedProducts.forEach(function(product) {
                productMap[product.id] = product;
            });

            setProducts(productMap);

            if (loadedWorkday) {
                const loadedOrganizer = await getOrganizerById(
                    loadedWorkday.organizerId
                );

                setOrganizer(loadedOrganizer);
            }
        } catch (error) {
            console.error('Failed to load workday:', error);
        } finally {
            setLoading(false);
        }
    }

    function getProductName(productId) {
        return products[productId]?.name ?? 'Unknown product';
    }

    function getTotalQuantity() {
        return sales.reduce(function(total, sale) {
            return total + Number(sale.quantity);
        }, 0);
    }

    function getTotalRevenue() {
        return sales.reduce(function(total, sale) {
            return total + Number(sale.totalPrice);
        }, 0);
    }

    function handleDeleteRequest(sale) {
        setSaleToDelete(sale);
    }

    function handleDeleteCancel() {
        setSaleToDelete(null);
    }

    async function handleDeleteConfirm() {
        setDeleting(true);

        try {
            await deleteSale(saleToDelete.id);
            setSaleToDelete(null);
            await loadWorkday();
        } catch (error) {
            console.error('Failed to delete sale:', error);
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <Container className='py-5 text-center'>
                <Spinner />
            </Container>
        );
    }

    if (!workday) {
        return (
            <Container className='py-5'>
                <div className='text-center'>
                    <h1 className='h4'>{phrases.get('components.pages.WorkdayDetailPage.empty.message')}</h1>

                    <Button
                        variant='outline-primary'
                        onClick={() => navigate(Links.getWorkdayList())}>

                        {phrases.get('components.pages.WorkdayDetailPage.empty.back')}
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <>
            <PageHeader
                title={Formats.asDate(workday.date)}
                subtitle={organizer?.name ?? 'Unknown organizer'}
                icon='calendar-event'
                action={
                    <Button
                        variant='outline-primary'
                        onClick={() => navigate(Links.getEditWorkday(id))}>
                        <i className='bi bi-pencil me-2'></i>
                        {phrases.get('components.pages.WorkdayDetailPage.editWorkday')}
                    </Button>
                }
            />

            <Container fluid className='pb-4'>

                {workday.description && (
                    <Card className='mb-4'>
                        <Card.Body>
                            <div className='text-body-secondary'>{workday.description}</div>
                        </Card.Body>
                    </Card>
                )}

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h2 className='h5 mb-0'>{phrases.get('components.pages.WorkdayDetailPage.sales.title')}</h2>

                    <Button
                        onClick={() => navigate(Links.getNewSale(id))}>
                        <i className='bi bi-plus-lg me-2'></i>
                        {phrases.get('components.pages.WorkdayDetailPage.recordSale')}
                    </Button>
                </div>

                {sales.length === 0 ? (
                    <Card>
                        <Card.Body className='text-center text-body-secondary py-5'>
                            {phrases.get('components.pages.WorkdayDetailPage.empty.noSales')}
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <Table responsive hover size='sm' className='mb-4 small'>
                            <thead>
                                <tr className='align-middle'>
                                    <th>{phrases.get('components.pages.WorkdayDetailPage.sales.table.product')}</th>
                                    <th>{phrases.get('components.pages.WorkdayDetailPage.sales.table.note')}</th>
                                    <th className='text-end'>{phrases.get('components.pages.WorkdayDetailPage.sales.table.quantity')}</th>
                                    <th className='text-end'>{phrases.get('components.pages.WorkdayDetailPage.sales.table.total')}</th>
                                    <th className='text-end'>{phrases.get('components.pages.WorkdayDetailPage.sales.table.actions')}</th>
                                </tr>
                            </thead>

                            <tbody className='table-group-divider'>
                                {sales.map(function(sale) {
                                    return (
                                        <tr key={sale.id} className='align-middle'>
                                            <td>{getProductName(sale.productId)}</td>
                                            <td>{sale.note}</td>
                                            <td className='text-end'>{sale.quantity}</td>
                                            <td className='text-end text-nowrap'>{Formats.asMoney(sale.totalPrice)}</td>

                                            <td className='text-end'>
                                                <Button
                                                    variant='outline-primary'
                                                    size='sm'
                                                    className='me-1'
                                                    title={phrases.get('components.pages.WorkdayDetailPage.edit.tooltip')}
                                                    onClick={() => navigate(Links.getEditSale(id, sale.id))}>

                                                    <i className='bi bi-pencil'></i>
                                                </Button>

                                                <Button
                                                    variant='outline-danger'
                                                    size='sm'
                                                    title={phrases.get('components.pages.WorkdayDetailPage.delete.tooltip')}
                                                    onClick={() => handleDeleteRequest(sale)}>

                                                    <i className='bi bi-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot className='table-group-divider'>
                                <tr>
                                    <th>{phrases.get('components.pages.WorkdayDetailPage.total')}</th>
                                    <th></th>
                                    <th className='text-end'>{getTotalQuantity()}</th>
                                    <th className='text-end'>{Formats.asMoney(getTotalRevenue())}</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </Table>
                    </>
                )}
            </Container>

            <Modal
                show={saleToDelete !== null}
                onHide={handleDeleteCancel}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>{phrases.get('components.pages.WorkdayDetailPage.delete.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{phrases.get('components.pages.WorkdayDetailPage.delete.question')}</Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='outline-secondary'
                        onClick={handleDeleteCancel}
                        disabled={deleting}>

                        {phrases.get('components.pages.WorkdayDetailPage.delete.cancel')}
                    </Button>

                    <Button
                        variant='danger'
                        onClick={handleDeleteConfirm}
                        disabled={deleting}>

                        {deleting ? (
                            <>
                                <Spinner
                                    size='sm'
                                    className='me-2'
                                />
                                {phrases.get('components.pages.WorkdayDetailPage.delete.processing')}
                            </>
                        ) : (
                            phrases.get('components.pages.WorkdayDetailPage.delete.confirm')
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default WorkdayDetailPage;