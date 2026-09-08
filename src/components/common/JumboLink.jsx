import { Card } from 'react-bootstrap';


function JumboLink({ href, icon, title, description }) {
    return (
        <a href={href} className='text-decoration-none text-body'>
            <Card className='h-100 shadow-sm'>
                <Card.Body className='text-center py-4'>
                    <i className={`bi bi-${icon} fs-1 text-primary`}></i>
                    <h2 className='h5 mt-3 mb-1'>{title}</h2>
                    <div className='small text-body-secondary'>{description}</div>
                </Card.Body>
            </Card>
        </a>
    );
}


export default JumboLink;