import React from 'react';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import phrases from '../../utils/Phrases';
import JumboLink from '../common/JumboLink';
import Title from '../common/Title';


function HomePage() {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Title
                        title={phrases.get('components.pages.HomePage.title')}
                        subtitle={phrases.get('components.pages.HomePage.subtitle')}>
                    </Title>
                </Col>
            </Row>

            <Row className='g-3 justify-content-center'>
                <Col xs={12} sm={6} lg={4}>
                    <JumboLink
                        href={phrases.get('App.paths.products')}
                        icon='box-seam'
                        title={phrases.get('components.pages.HomePage.links.products.title')}
                        description={phrases.get('components.pages.HomePage.links.products.description')}
                    />
                </Col>

                <Col xs={12} sm={6} lg={4}>
                    <JumboLink
                        href={phrases.get('App.paths.sales')}
                        icon='cart-plus'
                        title={phrases.get('components.pages.HomePage.links.sales.title')}
                        description={phrases.get('components.pages.HomePage.links.sales.description')}
                    />
                </Col>

                <Col xs={12} sm={6} lg={4}>
                    <JumboLink
                        href={phrases.get('App.paths.summary')}
                        icon='bar-chart-line'
                        title={phrases.get('components.pages.HomePage.links.summary.title')}
                        description={phrases.get('components.pages.HomePage.links.summary.description')}
                    />
                </Col>

                <Col xs={12} sm={6} lg={4}>
                    <JumboLink
                        href={phrases.get('App.paths.development')}
                        icon='code-slash'
                        title={phrases.get('components.pages.HomePage.links.development.title')}
                        description={phrases.get('components.pages.HomePage.links.development.description')}
                    />
                </Col>
            </Row>
                    
        </Container>
    );
}


export default HomePage;