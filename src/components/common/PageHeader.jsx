import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function PageHeader({ title, subtitle, icon, action = null }) {
    return (
        <Container fluid className='py-4'>
            <Row className='align-items-center'>
                <Col md={6} className='text-md-start'>
                    <div className='d-flex justify-content-center justify-content-md-start align-items-center'>
                        <i className={`bi bi-${icon} fs-1 text-primary me-3`}></i>

                        <div>
                            <h1 className='h3 mb-1'>{title}</h1>
                            <div className='text-body-secondary'>{subtitle}</div>
                        </div>
                    </div>
                </Col>

                <Col md={6} className='text-center text-md-end mt-3 mt-md-0'>
                    {action}
                </Col>
            </Row>
        </Container>
    );
}


export default PageHeader;