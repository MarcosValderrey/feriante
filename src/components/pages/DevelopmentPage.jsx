import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import PageHeader from '../common/PageHeader.jsx';
import { clearDatabase } from '../../backend/database.js';
import { openDatabase } from '../../backend/database.js';
import { importSemanticData } from '../../backend/migration.js';
import developmentSmallFixture from '../../assets/fixtures/development-small.json';
import developmentLargeFixture from '../../assets/fixtures/development-large.json';
import phrases from '../../utils/Phrases';


function DeveloperPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function importData(data) {
        setLoading(true);
        setMessage(null);

        try {
            const database = await openDatabase();
            await clearDatabase(database);

            await importSemanticData(data);

            setMessage({
                type: 'success',
                text: 'Datos importados correctamente.'
            });
        } catch (error) {
            console.error(error);

            setMessage({
                type: 'danger',
                text: 'No se pudieron importar los datos.'
            });
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function() {
            try {
                const data = JSON.parse(reader.result);
                importData(data);
            } catch (error) {
                console.error(error);

                setMessage({
                    type: 'danger',
                    text: 'El archivo no contiene JSON válido.'
                });
            }
        };

        reader.onerror = function() {
            setMessage({
                type: 'danger',
                text: 'No se pudo leer el archivo.'
            });
        };

        reader.readAsText(file);
    }

    function handleDevelopmentSmallImport() {
        importData(developmentSmallFixture);
    }

    function handleDevelopmentLargeImport() {
        importData(developmentLargeFixture);
    }

    async function handleDeleteDatabase() {
        try {
            setDeleting(true);

            const database = await openDatabase();
            await clearDatabase(database);

            setShowDeleteModal(false);

            setMessage({
                type: 'success',
                text: phrases.get('components.pages.DevelopmentPage.delete.success')
            });
        } catch (error) {
            console.error(error);

            setMessage({
                type: 'danger',
                text: phrases.get('components.pages.DevelopmentPage.delete.error')
            });
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <PageHeader
                icon={'code-slash'}
                title={phrases.get('components.pages.DevelopmentPage.title')}
                subtitle={phrases.get('components.pages.DevelopmentPage.subtitle')}>
            </PageHeader>

            <Container fluid>
                <Row className='g-3 justify-content-center'>
                    <Col xs={12} sm={6} lg={6}>
                        <Card className='shadow-sm'>
                            <Card.Body>
                                <Card.Title>{phrases.get('components.pages.DevelopmentPage.import.title')}</Card.Title>

                                <Card.Text className='text-body-secondary'>
                                    {phrases.get('components.pages.DevelopmentPage.import.description')}
                                </Card.Text>

                                <Form.Group controlId='databaseFile'>
                                    <Form.Control
                                        type='file'
                                        accept='.json,application/json'
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/*
                    <Col xs={12} sm={6} lg={6}>
                        <Card className='shadow-sm'>
                            <Card.Body>
                                <Card.Title>{phrases.get('components.pages.DevelopmentPage.data.development.small.title')}</Card.Title>

                                <Card.Text className='text-body-secondary'>
                                    {phrases.get('components.pages.DevelopmentPage.data.development.small.description')}
                                </Card.Text>

                                <Button
                                    variant='primary'
                                    onClick={handleDevelopmentSmallImport}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size='sm' className='me-2' />
                                            <span>{phrases.get('components.pages.DevelopmentPage.data.development.small.importing')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className='bi bi-database-add me-2'></i>
                                            <span>{phrases.get('components.pages.DevelopmentPage.data.development.small.button')}</span>
                                        </>
                                    )}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    */}

                    <Col xs={12} sm={6} lg={6}>
                        <Card className='shadow-sm'>
                            <Card.Body>
                                <Card.Title>{phrases.get('components.pages.DevelopmentPage.data.development.small.title')}</Card.Title>

                                <Card.Text className='text-body-secondary'>
                                    {phrases.get('components.pages.DevelopmentPage.data.development.small.description')}
                                </Card.Text>

                                <Button
                                    variant='primary'
                                    onClick={handleDevelopmentLargeImport}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size='sm' className='me-2' />
                                            <span>{phrases.get('components.pages.DevelopmentPage.data.development.large.importing')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className='bi bi-database-add me-2'></i>
                                            <span>{phrases.get('components.pages.DevelopmentPage.data.development.large.button')}</span>
                                        </>
                                    )}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} sm={12} lg={12}>
                        <Card className='shadow-sm' border='danger'>
                            <Card.Body>
                                <Card.Title>{phrases.get('components.pages.DevelopmentPage.delete.title')}</Card.Title>

                                <Card.Text className='text-body-secondary'>
                                    {phrases.get('components.pages.DevelopmentPage.delete.description')}
                                </Card.Text>

                                <Button
                                    variant='outline-danger'
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <i className='bi bi-trash me-2'></i>
                                    <span>{phrases.get('components.pages.DevelopmentPage.delete.button')}</span>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} sm={12} lg={12}>
                        {message && (
                            <Alert
                                variant={message.type}
                                dismissible
                                onClose={() => setMessage(null)}
                            >
                                {message.text}
                            </Alert>
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{phrases.get('components.pages.DevelopmentPage.delete.modal.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{phrases.get('components.pages.DevelopmentPage.delete.modal.question')}</p>
                    <p className='mb-0 fw-bold text-danger'>{phrases.get('components.pages.DevelopmentPage.delete.modal.warning')}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={() => setShowDeleteModal(false)}
                        disabled={deleting}
                    >
                        {phrases.get('components.pages.DevelopmentPage.delete.modal.cancel')}
                    </Button>

                    <Button
                        variant='danger'
                        onClick={handleDeleteDatabase}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Spinner size='sm' className='me-2' />
                                <span>{phrases.get('components.pages.DevelopmentPage.delete.modal.deleting')}</span>
                            </>
                        ) : (
                            <>
                                <i className='bi bi-trash me-2'></i>
                                <span>{phrases.get('components.pages.DevelopmentPage.delete.modal.confirm')}</span>
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default DeveloperPage;