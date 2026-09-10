import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import PageHeader from '../../../components/common/PageHeader';
import { createProduct } from '../../../services/products';
import { getProductById } from '../../../services/products';
import { updateProduct } from '../../../services/products';
import phrases from '../../../utils/Phrases';


function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = id !== undefined;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(function() {
        if (!editing) {
            return;
        }

        getProductById(Number(id))
            .then(function(product) {
                if (!product) {
                    setError(phrases.get('components.pages.ProductsFormPage.error.product.notFound'));
                    return;
                }

                setName(product.name || '');
                setDescription(product.description || '');
            })
            .catch(function(error) {
                console.error('Failed to load product:', error);
                setError(phrases.get('components.pages.ProductsFormPage.error.product.cannotLoad'));
            })
            .finally(function() {
                setLoading(false);
            });
    }, [editing, id]);

    function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError(phrases.get('components.pages.ProductsFormPage.error.nameRequired'));
            return;
        }

        setSaving(true);
        setError(null);

        const data = {
            name: trimmedName,
            description: description.trim() || null
        };

        const operation = editing
            ? updateProduct(Number(id), data)
            : createProduct(data);

        operation
            .then(function() {
                navigate(phrases.get('App.paths.products.list'));
            })
            .catch(function(error) {
                console.error('Failed to save product:', error);
                setError('No se pudo guardar el producto.');
                setSaving(false);
            });
    }

    function handleCancel() {
        navigate(phrases.get('App.paths.products.list'));
    }

    function Header() {
        var title = null;
        var subtitle = null;

        if (editing) {
            title = phrases.get('components.pages.ProductsFormPage.edit.title');
            subtitle = phrases.get('components.pages.ProductsFormPage.edit.subtitle');
        } else {
            title = phrases.get('components.pages.ProductsFormPage.new.title');
            subtitle = phrases.get('components.pages.ProductsFormPage.new.subtitle');
        }

        return (
            <PageHeader
                icon='box-seam'
                title={title}
                subtitle={subtitle} />
        );
    }

    if (loading) {
        return (
            <>
                <PageHeader
                    icon='box-seam'
                    title={phrases.get('components.pages.ProductsFormPage.title')}
                    subtitle='Cargando producto...' />

                <Container fluid>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <div className='text-center py-5'>
                                <Spinner animation='border' variant='primary' />
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group
                                className='mb-3'
                                controlId='product-name'>

                                <Form.Label>Nombre</Form.Label>

                                <Form.Control
                                    type='text'
                                    value={name}
                                    onChange={function(event) {
                                        setName(event.target.value);
                                    }}
                                    disabled={saving}
                                    autoFocus />
                            </Form.Group>

                            <Form.Group
                                className='mb-3'
                                controlId='product-description'>

                                <Form.Label>Descripción</Form.Label>

                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    value={description}
                                    onChange={function(event) {
                                        setDescription(event.target.value);
                                    }}
                                    disabled={saving} />
                            </Form.Group>

                            {error && (
                                <div className='alert alert-danger'>
                                    {error}
                                </div>
                            )}

                            <div className='d-flex justify-content-end gap-2'>
                                <Button
                                    variant='secondary'
                                    onClick={handleCancel}
                                    disabled={saving}>
                                    Cancelar
                                </Button>

                                <Button
                                    variant='primary'
                                    type='submit'
                                    disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}


export default ProductFormPage;