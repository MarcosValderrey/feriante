import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../common/PageHeader.jsx';
import { createSale } from '../../../services/sales.js';
import { getSaleById } from '../../../services/sales.js';
import { updateSale } from '../../../services/sales.js';
import { getProducts } from '../../../services/products.js';
import Links from '../../../utils/Links.jsx';
import phrases from '../../../utils/Phrases';


function SaleFormPage() {
    const { id, saleId } = useParams();
    const navigate = useNavigate();

    const editing = saleId !== undefined;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        totalPrice: '',
        note: ''
    });

    useEffect(function() {
        loadForm();
    }, [saleId]);

    async function loadForm() {
        try {
            const loadedProducts = await getProducts();
            setProducts(loadedProducts);

            if (editing) {
                const sale = await getSaleById(Number(saleId));

                if (!sale) {
                    navigate(Links.getFullWorkday(id));
                    return;
                }

                setFormData({
                    productId: String(sale.productId),
                    quantity: String(sale.quantity),
                    totalPrice: String(sale.totalPrice),
                    note: sale.note ?? ''
                });
            }
        } catch (error) {
            console.error('Failed to load sale form:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(function(current) {
            return {
                ...current,
                [name]: value
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);

        try {
            const data = {
                workdayId: Number(id),
                productId: Number(formData.productId),
                quantity: Number(formData.quantity),
                totalPrice: Number(formData.totalPrice),
                note: formData.note
            };

            if (editing) {
                await updateSale(Number(saleId), data);
            } else {
                await createSale(data);
            }

            navigate(Links.getFullWorkday(id));
        } catch (error) {
            console.error('Failed to save sale:', error);
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        navigate(Links.getFullWorkday(id));
    }

    function Header() {
        var title = null;
        var subtitle = null;

        if (editing) {
            title = phrases.get('components.pages.SalesFormPage.edit.title');
            subtitle = phrases.get('components.pages.SalesFormPage.edit.subtitle');
        } else {
            title = phrases.get('components.pages.SalesFormPage.new.title');
            subtitle = phrases.get('components.pages.SalesFormPage.new.subtitle');
        }

        return (
            <PageHeader
                icon='cart'
                title={title}
                subtitle={subtitle} />
        );
    }

    if (loading) {
        return (
            <Container className='py-5 text-center'>
                <Spinner />
            </Container>
        );
    }

    return (
        <>
            <Header />

            <Container className='pb-4'>
                <Row>
                    <Col xs={12} md={8} lg={6} xl={5}>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group className='mb-3'>
                                <Form.Label>{phrases.get('components.pages.SalesFormPage.product.label')}</Form.Label>

                                <Form.Select
                                    name='productId'
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required>

                                    <option value=''>{phrases.get('components.pages.SalesFormPage.product.select')}</option>

                                    {products.map(function(product) {
                                        return (
                                            <option
                                                key={product.id}
                                                value={product.id}>

                                                {product.name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <Form.Label>{phrases.get('components.pages.SalesFormPage.quantity')}</Form.Label>

                                <Form.Control
                                    type='number'
                                    min='1'
                                    step='1'
                                    name='quantity'
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <Form.Label>{phrases.get('components.pages.SalesFormPage.price')}</Form.Label>

                                <Form.Control
                                    type='number'
                                    min='0'
                                    step='0.01'
                                    name='totalPrice'
                                    value={formData.totalPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className='mb-4'>
                                <Form.Label>{phrases.get('components.pages.SalesFormPage.note')}</Form.Label>

                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    name='note'
                                    value={formData.note}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className='d-flex gap-2'>
                                <Button
                                    variant='outline-secondary'
                                    type='button'
                                    onClick={handleCancel}
                                    disabled={saving}>

                                    {phrases.get('components.pages.SalesFormPage.cancel')}
                                </Button>

                                <Button
                                    type='submit'
                                    disabled={saving}>

                                    {saving ? (
                                        <>
                                            <Spinner size='sm' className='me-2' />
                                            {phrases.get('components.pages.SalesFormPage.save.processing')}
                                        </>
                                    ) : (
                                        phrases.get('components.pages.SalesFormPage.save.submit')
                                    )}
                                </Button>
                            </div>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


export default SaleFormPage;