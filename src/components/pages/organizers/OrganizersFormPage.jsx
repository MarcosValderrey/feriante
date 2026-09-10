import { useEffect } from 'react';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import PageHeader from '../../common/PageHeader';
import { createOrganizer } from '../../../services/organizers';
import { getOrganizerById } from '../../../services/organizers';
import { updateOrganizer } from '../../../services/organizers';
import phrases from '../../../utils/Phrases';


function OrganizersFormPage() {
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

        getOrganizerById(Number(id))
            .then(function(organizer) {
                if (!organizer) {
                    setError(phrases.get('components.pages.OrganizersFormPage.error.organization.notFound'));
                    return;
                }

                setName(organizer.name || '');
                setDescription(organizer.description || '');
            })
            .catch(function(error) {
                console.error('Failed to load organizer:', error);
                setError(phrases.get('components.pages.OrganizersFormPage.error.organization.cannotLoad'));
            })
            .finally(function() {
                setLoading(false);
            });
    }, [editing, id]);

    function handleCancel() {
        navigate(phrases.get('App.paths.organizers.list'));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError(null);

        const organizer = {
            name: name.trim(),
            description: description.trim() || null
        };

        try {
            if (editing) {
                await updateOrganizer(Number(id), organizer);
            } else {
                await createOrganizer(organizer);
            }

            navigate(phrases.get('App.paths.organizers.list'));
        } catch (error) {
            console.error('Failed to save organizer:', error);
            setError(phrases.get('components.pages.OrganizersFormPage.error.organization.cannotSave'));
        } finally {
            setSaving(false);
        }
    }

    function Header() {
        var title = null;
        var subtitle = null;

        if (editing) {
            title = phrases.get('components.pages.OrganizersFormPage.edit.title');
            subtitle = phrases.get('components.pages.OrganizersFormPage.edit.subtitle');
        } else {
            title = phrases.get('components.pages.OrganizersFormPage.new.title');
            subtitle = phrases.get('components.pages.OrganizersFormPage.new.subtitle');
        }

        return (
            <PageHeader
                icon='shop'
                title={title}
                subtitle={subtitle} />
        );
    }

    function Loader() {
        return (
            <div className='text-center py-5'>
                <Spinner animation='border' variant='primary' />
            </div>
        );
    }

    function FormCancelButton() {
        return (
            <Button
                variant='secondary'
                onClick={handleCancel}
                disabled={saving}>
                {phrases.get('components.pages.OrganizersFormPage.form.cancel')}
            </Button>
        );
    }

    function FormSaveButton() {
        var buttonText = null;
        if (saving) {
            buttonText = phrases.get('components.pages.OrganizersFormPage.form.saving');
        } else {
            buttonText = phrases.get('components.pages.OrganizersFormPage.form.save');
        }

        return (
            <Button
                variant='primary'
                type='submit'
                disabled={saving}>
                {buttonText}
            </Button>
        );
    }

    return (
        <>
            <Header />

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {loading ? (
                            <Loader />
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className='mb-3' controlId='name'>
                                            <Form.Label>{phrases.get('components.pages.OrganizersFormPage.form.name')}</Form.Label>

                                            <Form.Control
                                                type='text'
                                                value={name}
                                                onChange={function(event) {
                                                    setName(event.target.value);
                                                }}
                                                required
                                                autoFocus
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className='mb-3' controlId='description'>
                                    <Form.Label>{phrases.get('components.pages.OrganizersFormPage.form.description')}</Form.Label>

                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        value={description}
                                        onChange={function(event) {
                                            setDescription(event.target.value);
                                        }}
                                    />
                                </Form.Group>

                                {error && (
                                    <div className='alert alert-danger'>{error}</div>
                                )}

                                <div className='d-flex justify-content-end gap-2'>
                                    <FormCancelButton />
                                    <FormSaveButton />
                                </div>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}


export default OrganizersFormPage;