import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { NavLink } from 'react-router-dom';

import phrases from '../../utils/Phrases';


function Header() {
    return (
        <Navbar bg='body' expand='lg' className='mb-2 shadow-sm' sticky='top'>
            <Container fluid>
                <Navbar.Brand href='/' className='d-flex align-items-center gap-2'>
                    <img src='images/icons/shop-32x32.png' alt='Feriante Logo' width={32} height={32} className='d-inline-block' />
                    <span className='align-middle fw-bold text-secondary'>Feriante</span>
                    <span className='badge rounded-pill text-bg-primary'>{__APP_VERSION__}</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls='feriante-navbar-nav'></Navbar.Toggle>
                <Navbar.Collapse id='feriante-navbar-nav'>
                    <Nav className='ms-auto'>
                        <Nav.Link as={NavLink} to={phrases.get('App.paths.products.list')}>{phrases.get('components.common.Header.products')}</Nav.Link>
                        <Nav.Link as={NavLink} to={phrases.get('App.paths.organizers.list')}>{phrases.get('components.common.Header.organizers')}</Nav.Link>
                        <Nav.Link as={NavLink} to={phrases.get('App.paths.sales')}>{phrases.get('components.common.Header.sales')}</Nav.Link>
                        <Nav.Link as={NavLink} to={phrases.get('App.paths.summary')}>{phrases.get('components.common.Header.summary')}</Nav.Link>
                        <Nav.Link as={NavLink} to={phrases.get('App.paths.development')}>{phrases.get('components.common.Header.development')}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default Header;
