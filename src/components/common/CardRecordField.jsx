import { Col } from 'react-bootstrap';


function CardRecordField({ label, value, hightlight = false }) {

    function ValueCol() {
        var col = <Col xs={8} className='small'>{value}</Col>;
        if (hightlight) {
            col = <Col xs={8} className='small fw-bold'>{value}</Col>;
        }

        return col;
    }

    return (
        <div className='d-flex px-3 py-2 border-top'>
            <Col xs={4} className='text-body-secondary small'>{label}</Col>
            <ValueCol />
        </div>
    );
}


export default CardRecordField;
