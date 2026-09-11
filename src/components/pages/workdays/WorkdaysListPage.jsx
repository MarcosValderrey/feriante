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
import { deleteWorkday, getWorkdays } from '../../../services/workdays';
import { getSalesByWorkdayId } from '../../../services/sales';
import { getOrganizerById } from '../../../services/organizers';
import Formats from '../../../utils/Formats';
import phrases from '../../../utils/Phrases';


function WorkdaysListPage() {
    const navigate = useNavigate();

    const [workdays, setWorkdays] = useState([]);
    const [organizers, setOrganizers] = useState({});
    const [loading, setLoading] = useState(true);

    const [workdayToDelete, setWorkdayToDelete] = useState(null);
    const [workdayDeleteBlocked, setWorkdayDeleteBlocked] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function loadWorkdays() {
        setLoading(true);

        getWorkdays()
            .then(async function(result) {
                setWorkdays(result);

                const organizerIds = [
                    ...new Set(
                        result.map(function(workday) {
                            return workday.organizerId;
                        })
                    )
                ];

                const organizerResults = await Promise.all(
                    organizerIds.map(function(organizerId) {
                        return getOrganizerById(organizerId);
                    })
                );

                const organizerMap = {};

                organizerResults.forEach(function(organizer) {
                    if (organizer) {
                        organizerMap[organizer.id] = organizer;
                    }
                });

                setOrganizers(organizerMap);
            })
            .catch(function(error) {
                console.error('Failed to load workdays:', error);
            })
            .finally(function() {
                setLoading(false);
            });
    }

    useEffect(function() {
        loadWorkdays();
    }, []);

    function handleDeleteRequest(workday) {
        setWorkdayDeleteBlocked(null);
        setWorkdayToDelete(workday);
    }

    function handleDeleteCancel() {
        if (deleting) {
            return;
        }

        setWorkdayToDelete(null);
    }

    function handleDeleteBlockedClose() {
        setWorkdayDeleteBlocked(null);
    }

    async function handleDeleteConfirm() {
        setDeleting(true);

        try {
            const sales = await getSalesByWorkdayId(workdayToDelete.id);

            if (sales.length > 0) {
                setWorkdayToDelete(null);
                setWorkdayDeleteBlocked(workdayToDelete);
                return;
            }

            await deleteWorkday(workdayToDelete.id);

            setWorkdayToDelete(null);
            loadWorkdays();
        } catch (error) {
            console.error('Failed to delete workday:', error);
        } finally {
            setDeleting(false);
        }
    }

    function AddButton() {
        return (
            <Button
                variant='primary'
                onClick={function() {
                    navigate(phrases.get('App.paths.workdays.new'));
                }}>
                <i className='bi bi-plus-lg me-1'></i>
                <span>{phrases.get('components.pages.WorkdaysListPage.new')}</span>
            </Button>
        );
    }

    function ViewButton({ workdayId }) {
        return (
            <Button
                variant='outline-primary'
                size='sm'
                className='me-1'
                title={phrases.get('components.pages.WorkdaysListPage.view.tooltip')}
                onClick={function() {
                    navigate(`${phrases.get('App.paths.workdays.list')}/${workdayId}`);
                }}>

                <i className='bi bi-eye'></i>
            </Button>
        );
    }

    function EditButton({ workdayId }) {
        return (
            <Button
                variant='outline-secondary'
                size='sm'
                className='me-1'
                title={phrases.get('components.pages.WorkdaysListPage.edit.tooltip')}
                onClick={function() {
                    navigate(
                        `${phrases.get('App.paths.workdays.edit')}${workdayId}${phrases.get('App.paths.edit')}`
                    );
                }}>
                <i className='bi bi-pencil'></i>
            </Button>
        );
    }

    function DeleteButton({ workday }) {
        return (
            <Button
                variant='outline-danger'
                size='sm'
                title={phrases.get('components.pages.WorkdaysListPage.delete.tooltip')}
                onClick={function() {
                    handleDeleteRequest(workday);
                }}>
                <i className='bi bi-trash'></i>
            </Button>
        );
    }

    function Header() {
        return (
            <PageHeader
                icon='calendar-event'
                title={phrases.get('components.pages.WorkdaysListPage.title')}
                subtitle={phrases.get('components.pages.WorkdaysListPage.subtitle')}
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
                <i className='bi bi-calendar-event fs-1 d-block mb-3'></i>
                <span>
                    {phrases.get('components.pages.WorkdaysListPage.empty')}
                </span>
            </div>
        );
    }

    function WorkdaysTable() {
        return (
            <Table responsive hover size='sm' className='mb-4 small'>
                <thead>
                    <tr>
                        <th scope='col' className='col-2'>
                            {phrases.get(
                                'components.pages.WorkdaysListPage.table.date'
                            )}
                        </th>

                        <th scope='col' className='col-3'>
                            {phrases.get(
                                'components.pages.WorkdaysListPage.table.organizer'
                            )}
                        </th>

                        <th scope='col' className='col-5'>
                            {phrases.get(
                                'components.pages.WorkdaysListPage.table.description'
                            )}
                        </th>

                        <th scope='col' className='col-2 text-end'>
                            {phrases.get(
                                'components.pages.WorkdaysListPage.table.actions'
                            )}
                        </th>
                    </tr>
                </thead>

                <tbody className='table-group-divider'>
                    {workdays.map(function(workday) {
                        const organizer = organizers[workday.organizerId];

                        return (
                            <tr key={workday.id} className='align-middle'>
                                <td>{Formats.asDate(workday.date)}</td>

                                <td>{organizer ? organizer.name : '—'}</td>

                                <td className='text-body-secondary'>{workday.description || '—'}</td>

                                <td className='text-end text-nowrap'>
                                    <ViewButton workdayId={workday.id} />
                                    <EditButton workdayId={workday.id} />
                                    <DeleteButton workday={workday} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    function DeleteConfirmationModal() {
        if (!workdayToDelete) {
            return null;
        }

        var buttonText = null;

        if (deleting) {
            buttonText = phrases.get(
                'components.pages.WorkdaysListPage.delete.popup.processing'
            );
        } else {
            buttonText = phrases.get(
                'components.pages.WorkdaysListPage.delete.popup.confirm'
            );
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteCancel}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {phrases.get(
                            'components.pages.WorkdaysListPage.delete.popup.title'
                        )}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        {phrases.get(
                            'components.pages.WorkdaysListPage.delete.popup.question'
                        )}{' '}
                        <strong>{Formats.asDate(workdayToDelete.date)}</strong>
                        ?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteCancel}
                        disabled={deleting}>
                        {phrases.get('components.pages.WorkdaysListPage.delete.popup.cancel')}
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
        if (!workdayDeleteBlocked) {
            return null;
        }

        return (
            <Modal
                show={true}
                onHide={handleDeleteBlockedClose}
                centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {phrases.get(
                            'components.pages.WorkdaysListPage.delete.blocked.title'
                        )}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className='mb-0'>
                        {phrases.get(
                            'components.pages.WorkdaysListPage.delete.blocked.subtitle.1'
                        )}{' '}
                        <strong>{Formats.asDate(workdayDeleteBlocked.date)}</strong>{' '}
                        {phrases.get('components.pages.WorkdaysListPage.delete.blocked.subtitle.2')}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleDeleteBlockedClose}>
                        {phrases.get('components.pages.WorkdaysListPage.delete.blocked.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    var table = null;

    if (workdays && workdays.length > 0) {
        table = <WorkdaysTable />;
    }

    return (
        <>
            <Header />

            <Container fluid>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {loading ? (
                            <Loader />
                        ) : workdays.length === 0 ? (
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


export default WorkdaysListPage;