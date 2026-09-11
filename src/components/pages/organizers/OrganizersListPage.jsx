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
import { deleteOrganizer } from '../../../services/organizers';
import { getOrganizers } from '../../../services/organizers';
import { getWorkdaysByOrganizerId } from '../../../services/workdays';
import phrases from '../../../utils/Phrases';


function OrganizersListPage() {
    const navigate = useNavigate();

    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organizerToDelete, setOrganizerToDelete] = useState(null);
    const [organizerDeleteBlocked, setOrganizerDeleteBlocked] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    function loadOrganizers() {
        setLoading(true);

        getOrganizers()
            .then(function(result) {
                setOrganizers(result);
            })
            .catch(function(error) {
                console.error('Failed to load organizers:', error);
            })
            .finally(function() {
                setLoading(false);
            });
    }

    useEffect(function() {
        loadOrganizers();
    }, []);

    function handleDeleteRequest(organizer) {
        setDeleteError(null);
        setOrganizerDeleteBlocked(null);
        setOrganizerToDelete(organizer);
    }

    function handleDeleteCancel() {
        if (!deleting) {
            setOrganizerToDelete(null);
            setDeleteError(null);
        }
    }

    function handleDeleteBlockedClose() {
        setOrganizerDeleteBlocked(null);
    }

    async function handleDelete() {
        setDeleting(true);
        setDeleteError(null);

        try {
            const workdays = await getWorkdaysByOrganizerId(organizerToDelete.id);

            if (workdays.length > 0) {
                setOrganizerToDelete(null);
                setOrganizerDeleteBlocked(organizerToDelete);
                return;
            }

            await deleteOrganizer(organizerToDelete.id);

            setOrganizerToDelete(null);
            loadOrganizers();
        } catch (error) {
            console.error('Failed to delete organizer:', error);
            setDeleteError(phrases.get('components.pages.OrganizersListPage.delete.fail'));
        } finally {
            setDeleting(false);
        }
    }

    function AddButton() {
        return (
            <Button
                variant='primary'
                onClick={function() {
                    navigate(phrases.get('App.paths.organizers.new'));
                }}>
                <i className='bi bi-plus-lg me-1'></i>
                <span>{phrases.get('components.pages.OrganizersListPage.new')}</span>
            </Button>
        );
    }

    function EditButton({ organizerId }) {
        return (
            <Button
                variant='outline-secondary'
                size='sm'
                className='me-1'
                title={phrases.get('components.pages.OrganizersListPage.edit.tooltip')}
                onClick={function() {
                    navigate(
                        `${phrases.get('App.paths.organizers.edit')}${organizerId}`
                    );
                }}>
                <i className='bi bi-pencil'></i>
            </Button>
        );
    }

    function DeleteButton({ organizer }) {
        return (
            <Button
                variant='outline-danger'
                size='sm'
                title={phrases.get('components.pages.OrganizersListPage.delete.tooltip')}
                onClick={function() {
                    handleDeleteRequest(organizer);
                }}>
                <i className='bi bi-trash'></i>
            </Button>
        );
    }

    function Header() {
        return (
            <PageHeader
                icon='shop'
                title={phrases.get('components.pages.OrganizersListPage.title')}
                subtitle={phrases.get('components.pages.OrganizersListPage.subtitle')}
                action={<AddButton />}
            />
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
                <i className='bi bi-shop fs-1 d-block mb-3'></i>
                <span>
                    {phrases.get('components.pages.OrganizersListPage.empty')}
                </span>
            </div>
        );
    }

    function OrganizersTable() {
        return (
            <Table responsive hover size='sm' className='mb-4 small'>
                <thead>
                    <tr className='align-middle'>
                        <th scope='col' className='col-6'>
                            {phrases.get(
                                'components.pages.OrganizersListPage.table.name'
                            )}
                        </th>

                        <th scope='col' className='col-5'>
                            {phrases.get(
                                'components.pages.OrganizersListPage.table.description'
                            )}
                        </th>

                        <th scope='col' className='col-1'></th>
                    </tr>
                </thead>

                <tbody className='table-group-divider'>
                    {organizers.map(function(organizer) {
                        return (
                            <tr key={organizer.id} className='align-middle'>
                                <td>{organizer.name}</td>

                                <td className='text-body-secondary'>
                                    {organizer.description || '—'}
                                </td>

                                <td className='text-end text-nowrap'>
                                    <EditButton organizerId={organizer.id} />
                                    <DeleteButton organizer={organizer} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    function DeleteConfirmationModal() {
        if (!organizerToDelete) {
            return null;
        }

        var buttonText = null;
        if (deleting) {
            buttonText = phrases.get('components.pages.OrganizersListPage.delete.popup.processing');
        } else {
            buttonText = phrases.get('components.pages.OrganizersListPage.delete.popup.confirm');
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteCancel}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {phrases.get('components.pages.OrganizersListPage.delete.popup.title')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        {phrases.get('components.pages.OrganizersListPage.delete.popup.question')}{' '}
                        <strong>{organizerToDelete.name}</strong>?
                    </p>

                    {deleteError && (
                        <div className='alert alert-danger mb-0'>{deleteError}</div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteCancel}
                        disabled={deleting}>
                        {phrases.get('components.pages.OrganizersListPage.delete.popup.cancel')}
                    </Button>

                    <Button
                        variant='danger'
                        onClick={handleDelete}
                        disabled={deleting}>
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function DeleteBlockedModal() {
        if (!organizerDeleteBlocked) {
            return null;
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteBlockedClose}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {phrases.get('components.pages.OrganizersListPage.delete.blocked.title')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className='mb-0'>
                        {phrases.get('components.pages.OrganizersListPage.delete.blocked.subtitle.1')}{' '}
                        <strong>{organizerDeleteBlocked.name}</strong>{' '}
                        {phrases.get('components.pages.OrganizersListPage.delete.blocked.subtitle.2')}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteBlockedClose}>
                        {phrases.get('components.pages.OrganizersListPage.delete.blocked.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    var table = null;
    if (organizers && organizers.length > 0) {
        table = <OrganizersTable />;
    }

    return (
        <>
            <Header />

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {loading ? (
                            <Loader />
                        ) : organizers.length === 0 ? (
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


export default OrganizersListPage;