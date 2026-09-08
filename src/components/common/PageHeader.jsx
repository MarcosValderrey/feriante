import { Container } from 'react-bootstrap';


function PageHeader({ title, subtitle, icon }) {
    return (
        <Container fluid className='py-4'>
            <div className="d-flex align-items-center">
                <i className={`bi bi-${icon} fs-1 text-primary me-3`}></i>

                <div>
                    <h1 className='h3 mb-1'>{title}</h1>
                    <div className='text-body-secondary'>{subtitle}</div>
                </div>
            </div>
        </Container>
    );
}


export default PageHeader;