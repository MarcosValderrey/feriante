import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../common/PageHeader.jsx';

import { createWorkday } from '../../../services/workdays.js';
import { getWorkdayById } from '../../../services/workdays.js';
import { updateWorkday } from '../../../services/workdays.js';
import { getOrganizers } from '../../../services/organizers.js';
import phrases from '../../../utils/Phrases';


function WorkdayFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = id !== undefined;

    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        organizerId: '',
        date: '',
        description: ''
    });

    useEffect(function() {
        loadForm();
    }, [id]);

    async function loadForm() {
        try {
            const loadedOrganizers = await getOrganizers();
            setOrganizers(loadedOrganizers);

            if (editing) {
                const workday = await getWorkdayById(Number(id));

                if (!workday) {
                    navigate('/workdays');
                    return;
                }

                setFormData({
                    organizerId: String(workday.organizerId),
                    date: formatDateForInput(workday.date),
                    description: workday.description ?? ''
                });
            }
        } catch (error) {
            console.error('Failed to load workday form:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
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
                organizerId: Number(formData.organizerId),
                date: new Date(`${formData.date}T00:00:00`),
                description: formData.description
            };

            if (editing) {
                await updateWorkday(Number(id), data);
            } else {
                await createWorkday(data);
            }

            navigate(phrases.get('App.paths.workdays.list'));
        } catch (error) {
            console.error('Failed to save workday:', error);
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        navigate(phrases.get('App.paths.workdays.list'));
    }

    function Header() {
        var title = null;
        var subtitle = null;

        if (editing) {
            title = phrases.get('components.pages.WorkdaysFormPage.edit.title');
            subtitle = phrases.get('components.pages.WorkdaysFormPage.edit.subtitle');
        } else {
            title = phrases.get('components.pages.WorkdaysFormPage.new.title');
            subtitle = phrases.get('components.pages.WorkdaysFormPage.new.subtitle');
        }

        return (
            <PageHeader
                icon='calendar-event'
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
                                <Form.Label>{phrases.get('components.pages.WorkdaysFormPage.organizer.label')}</Form.Label>

                                <Form.Select
                                    name='organizerId'
                                    value={formData.organizerId}
                                    onChange={handleChange}
                                    required>

                                    <option value=''>{phrases.get('components.pages.WorkdaysFormPage.organizer.select')}</option>

                                    {organizers.map(function(organizer) {
                                        return (
                                            <option
                                                key={organizer.id}
                                                value={organizer.id}>
                                                {organizer.name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <Form.Label>{phrases.get('components.pages.WorkdaysFormPage.date')}</Form.Label>

                                <Form.Control
                                    type='date'
                                    name='date'
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className='mb-4'>
                                <Form.Label>{phrases.get('components.pages.WorkdaysFormPage.description')}</Form.Label>

                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className='d-flex gap-2'>
                                <Button
                                    variant='outline-secondary'
                                    type='button'
                                    onClick={handleCancel}
                                    disabled={saving}>

                                    {phrases.get('components.pages.WorkdaysFormPage.cancel')}
                                </Button>

                                <Button
                                    type='submit'
                                    disabled={saving}>

                                    {saving ? (
                                        <>
                                            <Spinner
                                                size='sm'
                                                className='me-2'
                                            />
                                            {phrases.get('components.pages.WorkdaysFormPage.save.processing')}
                                        </>
                                    ) : (
                                        phrases.get('components.pages.WorkdaysFormPage.save.submit')
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


export default WorkdayFormPage;