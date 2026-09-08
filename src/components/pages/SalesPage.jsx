import { useEffect } from 'react';
import { useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import PageHeader from '../common/PageHeader.jsx';
import { getOrganizerById } from '../../services/organizers.js';
import { getProductById } from '../../services/products.js';
import { getSalesByWorkdayId } from '../../services/sales.js';
import { getOldestWorkdays } from '../../services/workdays.js';
import { getRecentWorkdays } from '../../services/workdays.js';
import Formats from '../../utils/Formats.jsx';
import phrases from '../../utils/Phrases.jsx';


function SalesPage() {
    const [workdays, setWorkdays] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentWorkday = workdays[currentIndex];
    const [currentOrganizer, setCurrentOrganizer] = useState(null);

    useEffect(function() {
        loadWorkdays();
    }, []);

    useEffect(function() {
        if (!currentWorkday) {
            return;
        }

        loadSales(currentWorkday);
    }, [currentWorkday]);

    async function loadWorkdays() {
        try {
            setLoading(true);

            const result = await getRecentWorkdays(10);
            // const result = await getOldestWorkdays(10);

            setWorkdays(result);
            setCurrentIndex(0);
        } catch (error) {
            console.error(error);
            setError(phrases.get('components.pages.SalesPage.error.workdays'));
        } finally {
            setLoading(false);
        }
    }

    async function loadSales(workday) {
        try {
            setLoading(true);

            const [result, organizer] = await Promise.all([
                getSalesByWorkdayId(workday.id),
                getOrganizerById(workday.organizerId)
            ]);

            const enrichedSales = await Promise.all(
                result.map(async function(sale) {
                    const product = await getProductById(sale.productId);

                    return {
                        ...sale,
                        product
                    };
                })
            );

            setSales(enrichedSales);
            setCurrentOrganizer(organizer);
        } catch (error) {
            console.error(error);
            setError(phrases.get('components.pages.SalesPage.error.sales'));
        } finally {
            setLoading(false);
        }
    }

    function goPrevious() {
        setCurrentIndex(function(index) {
            return Math.min(index + 1, workdays.length - 1);
        });
    }

    function goNext() {
        setCurrentIndex(function(index) {
            return Math.max(index - 1, 0);
        });
    }

    const totalQuantity = sales.reduce(function(sum, sale) {
        return sum + Number(sale.quantity);
    }, 0);

    const totalPrice = sales.reduce(function(sum, sale) {
        return sum + Number(sale.totalPrice);
    }, 0);

    const header = <PageHeader
        icon='cart-plus'
        title={phrases.get('components.pages.SalesPage.title')}
        subtitle={phrases.get('components.pages.SalesPage.subtitle')} />;

    const loader = <div className='text-center py-5'>
        <Spinner animation='border' variant='primary' />
    </div>;

    const empty = <div className='text-center text-body-secondary py-5'>
        <i className='bi bi-cart-plus fs-1 d-block mb-3'></i>
        <span>{phrases.get('components.pages.SalesPage.empty')}</span>
    </div>;

    var navigator = null;
    if (!error && !loading && currentWorkday) {
        navigator = <div className='d-flex justify-content-between align-items-center mb-3'>
            <Button
                variant='outline-secondary'
                onClick={goPrevious}
                disabled={currentIndex === workdays.length - 1}
            >
                <i className='bi bi-chevron-left me-2'></i>
                <span>{phrases.get('components.pages.SalesPage.table.previous')}</span>
            </Button>

            <div className='text-center'>
                <div className='h4 mb-1'>{Formats.asDate(currentWorkday.date)}</div>

                <div className='text-body-secondary'>
                    <span className='fw-semibold'>{Formats.asOrganizer(currentOrganizer)}</span>

                    {currentWorkday.description && (
                        <>
                            <span className='mx-2'>·</span>
                            <span>{currentWorkday.description}</span>
                        </>
                    )}
                </div>
            </div>

            <Button
                variant='outline-secondary'
                onClick={goNext}
                disabled={currentIndex === 0}
            >
                <span>{phrases.get('components.pages.SalesPage.table.next')}</span>
                <i className='bi bi-chevron-right ms-2'></i>
            </Button>
        </div>;
    }

    const table = <SalesTable sales={sales} totalQuantity={totalQuantity} totalPrice={totalPrice} />

    return (
        <>
            {header}

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {error && (
                            <Alert variant='danger'>{error}</Alert>
                        )}

                        {loading ? (
                            loader
                        ) : !currentWorkday ? (
                            empty
                        ) : (
                            <>
                                {navigator}

                                {sales.length === 0 ? (
                                    empty
                                ) : (
                                    table
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}


function SalesTable({ sales, totalQuantity, totalPrice }) {
    var table = null;

    if (sales && sales.length > 0) {
        table = <Table responsive hover size='sm' className='mb-4 small'>
            <thead>
                <tr>
                    <th scope='col' className='col-1'></th>
                    <th scope='col' className='col-6'>{phrases.get('components.pages.SalesPage.table.name')}</th>
                    <th scope='col' className='col-2'>{phrases.get('components.pages.SalesPage.table.note')}</th>
                    <th scope='col' className='col-3'>{phrases.get('components.pages.SalesPage.table.price')}</th>
                </tr>
            </thead>

            <tbody className='table-group-divider'>
                {sales.map(function(sale) {
                    return (
                        <tr key={sale.id}>
                            <td className='text-end fw-bold'>{sale.quantity}</td>
                            <td className='text-start'>{sale.product?.name}</td>
                            <td className='text-body-secondary'>{sale.note || '—'}</td>
                            <td className='text-end'>{Formats.asMoney(sale.totalPrice)}</td>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot className='table-group-divider'>
                <tr>
                    <td className='text-end fw-bold'>
                        <span>{totalQuantity}</span>
                    </td>
                    <td className='text-start fw-bold'>
                        {phrases.get('components.pages.SalesPage.total.name')}
                    </td>
                    <td></td>
                    <td className='text-end fw-bold'>
                        <span className='text-nowrap'>{Formats.asMoney(totalPrice)}</span>
                    </td>
                </tr>
            </tfoot>
        </Table>;
    }

    return table;
}


export default SalesPage;