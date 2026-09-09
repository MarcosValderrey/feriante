import { useEffect } from 'react';
import { useState } from 'react';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import PageHeader from '../common/PageHeader.jsx';
import { getSummary } from '../../services/insights.js';
import Formats from '../../utils/Formats.jsx';
import phrases from '../../utils/Phrases.jsx';


function SummaryPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(function() {
        loadSummary();
    }, []);

    async function loadSummary() {
        try {
            const result = await getSummary();
            setSummary(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const header = <PageHeader
        icon='bar-chart-line'
        title={phrases.get('components.pages.SummaryPage.title')}
        subtitle={phrases.get('components.pages.SummaryPage.subtitle')} />;

    const loader = <div className='text-center py-5'>
        <Spinner animation='border' variant='primary' />
    </div>;

    if (loading) {
        return (
            <>
                {header}
                {loader}
            </>
        );
    }

    if (!summary) {
        return (
            <>
                {header}
                <EmptySummary />
            </>
        );
    }

    return (
        <>
            {header}

            <Container fluid>
                <HeadlineStats summary={summary} />
                <Records summary={summary} />
                <ProductSummary summary={summary} />
                <OrganizerSummary summary={summary} />
                <WorkdaySummary summary={summary} />
            </Container>
        </>
    );
}


function HeadlineStats({ summary }) {
    return (
        <Row className='g-3 mb-4'>
            <StatCard
                icon='box-seam'
                value={summary.totalQuantity}
                label={phrases.get('components.pages.SummaryPage.headlines.totalQuantity')}
            />

            <StatCard
                icon='cash-coin'
                value={Formats.asMoney(summary.totalRevenue)}
                label={phrases.get('components.pages.SummaryPage.headlines.totalRevenue')}
            />

            <StatCard
                icon='box-seam'
                value={summary.totalProducts}
                label={phrases.get('components.pages.SummaryPage.headlines.totalProducts')}
            />

            <StatCard
                icon='calendar-event'
                value={summary.totalWorkdays}
                label={phrases.get('components.pages.SummaryPage.headlines.totalWorkdays')}
            />

            <StatCard
                icon='shop'
                value={summary.totalOrganizers}
                label={phrases.get('components.pages.SummaryPage.headlines.totalOrganizers')}
            />

            <StatCard
                icon='box-seam'
                value={summary.totalSales}
                label={phrases.get('components.pages.SummaryPage.headlines.totalSales')}
            />

            <StatCard
                icon='cash'
                value={Formats.asPercentage(summary.cashSalesPercentage)}
                label={phrases.get('components.pages.SummaryPage.headlines.cashSalesPercentage')}
            />

            <StatCard
                icon='phone'
                value={Formats.asPercentage(summary.walletSalesPercentage)}
                label={phrases.get('components.pages.SummaryPage.headlines.walletSalesPercentage')}
            />
        </Row>
    );
}


function StatCard({ icon, value, label }) {
    return (
        <Col xs={12} sm={6} lg={3}>
            <Card className='border-0 h-100'>
                <Card.Body className='text-center'>
                    <i className={`bi bi-${icon} fs-2 text-primary`}></i>
                    <div className='display-6 fw-semibold mt-2 text-nowrap'>{value}</div>
                    <div className='text-body-secondary text-nowrap'>{label}</div>
                </Card.Body>
            </Card>
        </Col>
    );
}


function Records({ summary }) {
    return (
        <section className='mb-4'>
            <h2 className='h5 mb-3'>Récords</h2>

            <Row className='g-3'>
                <RecordCard
                    icon='box-seam'
                    label={phrases.get('components.pages.SummaryPage.records.biggestSaleByQuantity')}
                    value={
                        summary.biggestSale
                            ? `${asQuantity(summary.biggestSale.quantity)}`
                            : '—'
                    }
                    description={
                        summary.biggestSale
                            ? `${summary.biggestSale.productName}`
                            : phrases.get('components.pages.SummaryPage.unavailable')
                    }
                />

                <RecordCard
                    icon='cash-coin'
                    label={phrases.get('components.pages.SummaryPage.records.biggestSaleByRevenue')}
                    value={
                        summary.biggestRevenueSale
                            ? Formats.asMoney(summary.biggestRevenueSale.totalPrice)
                            : '—'
                    }
                    description={
                        summary.biggestRevenueSale
                            ? `${summary.biggestRevenueSale.productName} · ${asQuantity(summary.biggestRevenueSale.quantity)}`
                            : phrases.get('components.pages.SummaryPage.unavailable')
                    }
                />

                <RecordCard
                    icon='calendar-event'
                    label={phrases.get('components.pages.SummaryPage.records.mostQuantityByWorkday')}
                    value={
                        summary.workdaysByQuantity.length
                            ? `${asQuantity(summary.workdaysByQuantity[0].quantity)}`
                            : '—'
                    }
                    description={
                        summary.workdaysByQuantity.length
                            ? Formats.asWorkday(summary.workdaysByQuantity[0])
                            : phrases.get('components.pages.SummaryPage.unavailable')
                    }
                />

                <RecordCard
                    icon='graph-up-arrow'
                    label={phrases.get('components.pages.SummaryPage.records.mostRevenueByWorkday')}
                    value={
                        summary.workdaysByRevenue.length
                            ? Formats.asMoney(summary.workdaysByRevenue[0].revenue)
                            : '—'
                    }
                    description={
                        summary.workdaysByRevenue.length
                            ? Formats.asWorkday(summary.workdaysByRevenue[0])
                            : phrases.get('components.pages.SummaryPage.unavailable')
                    }
                />

                <RecordCard
                    icon='calendar-event'
                    label={phrases.get('components.pages.SummaryPage.records.oldestWorkday.title')}
                    value={
                        summary.oldestWorkday?.date
                            ? Formats.asDate(summary.oldestWorkday?.date)
                            : '—'
                    }
                    description={phrases.get('components.pages.SummaryPage.records.oldestWorkday.subtitle')}
                />

                <RecordCard
                    icon='calendar-event'
                    label={phrases.get('components.pages.SummaryPage.records.newestWorkday.title')}
                    value={
                        summary.newestWorkday?.date
                            ? Formats.asDate(summary.newestWorkday?.date)
                            : '—'
                    }
                    description={phrases.get('components.pages.SummaryPage.records.newestWorkday.subtitle')}
                />
            </Row>
        </section>
    );
}


function RecordCard({ icon, label, value, description }) {
    return (
        <Col xs={12} md={6} xl={3}>
            <Card className='border-0'>
                <Card.Body className='d-flex align-items-center'>
                    <div className='me-3'>
                        <i className={`bi bi-${icon} fs-3 text-primary me-3`}></i>
                    </div>

                    <div className='flex-grow-1'>
                        <div className='small text-body-secondary'>{label}</div>
                        <div className='fs-5 fw-semibold'>{value}</div>
                        <div className='small text-body-secondary text-muted mt-1'>{description}</div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}


function ProductSummary({ summary }) {
    return (
        <section className='mb-4'>
            <h2 className='h5 mb-3'>{phrases.get('components.pages.SummaryPage.products.title')}</h2>

            <Row className='g-3'>
                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.products.byQuantity')}
                    icon='box-seam'
                    items={summary.productsByQuantity.slice(0, 10)}
                    valueKey='quantity'
                    formatValue={asQuantity}
                />

                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.products.byRevenue')}
                    icon='cash-coin'
                    items={summary.productsByRevenue.slice(0, 10)}
                    valueKey='revenue'
                    formatValue={Formats.asMoney}
                />
            </Row>
        </section>
    );
}


function OrganizerSummary({ summary }) {
    return (
        <section className='mb-4'>
            <h2 className='h5 mb-3'>{phrases.get('components.pages.SummaryPage.organizers.title')}</h2>

            <Row className='g-3'>
                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.organizers.byQuantity')}
                    icon='box-seam'
                    items={summary.organizersByQuantity.slice(0, 10)}
                    valueKey='quantity'
                    formatValue={asQuantity}
                />

                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.organizers.byRevenue')}
                    icon='cash-coin'
                    items={summary.organizersByRevenue.slice(0, 10)}
                    valueKey='revenue'
                    formatValue={Formats.asMoney}
                />
            </Row>
        </section>
    );
}


function WorkdaySummary({ summary }) {
    return (
        <section className='mb-4'>
            <h2 className='h5 mb-3'>{phrases.get('components.pages.SummaryPage.workdays.title')}</h2>

            <Row className='g-3'>
                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.workdays.byQuantity')}
                    icon='box-seam'
                    items={summary.workdaysByQuantity.slice(0, 10)}
                    valueKey='quantity'
                    formatValue={asQuantity}
                    formatItem={Formats.asWorkday}
                />

                <RankingCard
                    title={phrases.get('components.pages.SummaryPage.workdays.byRevenue')}
                    icon='cash-coin'
                    items={summary.workdaysByRevenue.slice(0, 10)}
                    valueKey='revenue'
                    formatValue={Formats.asMoney}
                    formatItem={Formats.asWorkday}
                />
            </Row>
        </section>
    );
}


function RankingCard({
    title,
    icon,
    items,
    valueKey,
    formatValue,
    formatItem
}) {
    return (
        <Col xs={12} lg={6}>
            <Card className='shadow-sm h-100'>
                <Card.Header>
                    <i className={`bi bi-${icon} me-2 text-primary`}></i>
                    <span>{title}</span>
                </Card.Header>

                <Card.Body className='p-0'>
                    {items.length === 0 ? (
                        <div className='text-center text-body-secondary py-4'>
                            {phrases.get('components.pages.SummaryPage.unavailable')}
                        </div>
                    ) : (
                        <Table responsive hover size='sm' className='mb-0 small'>
                            <tbody className='table-group-divider'>
                                {items.map(function(item, index) {
                                    return (
                                        <tr key={index + 1}>
                                            <td className='col-1 text-center text-primary'>
                                                {getRankIcon(index) && (
                                                    <i className={`bi ${getRankIcon(index)}`}></i>
                                                )}
                                            </td>
                                            <td>
                                                {formatItem
                                                    ? formatItem(item)
                                                    : item.productName
                                                        ?? item.organizerName}
                                            </td>
                                            <td className='text-end fw-semibold'>{formatValue(item[valueKey])}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
}


function EmptySummary() {
    return (
        <Container fluid>
            <div className='text-center text-body-secondary py-5'>
                <i className='bi bi-bar-chart-line fs-1 d-block mb-3'></i>
                <span>{phrases.get('components.pages.SummaryPage.empty')}</span>
            </div>
        </Container>
    );
}


function getRankIcon(index) {
    if (index === 0) {
        return 'bi-trophy-fill text-warning';
    }

    if (index === 1) {
        return 'bi-award-fill';
    }

    if (index === 2) {
        return 'bi-award';
    }

    return null;
}


/**
 * Format a number by adding the "units" text at the end.
 * 
 * @param {*} value 
 * @returns 
 */
function asQuantity(value) {
    const quantity = phrases.get('components.pages.SummaryPage.quantity');

    return `${value} ${quantity}`;
};


export default SummaryPage;