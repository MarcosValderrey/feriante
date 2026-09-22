import { Carousel } from 'react-bootstrap';


function ImageCarousel({ publicImagesUrls }) {
    if (publicImagesUrls.length === 0) {
        return null;
    }

    return (
        <Carousel className='feriante-carousel' interval={5000}>
            {publicImagesUrls.map((url, index) => (
                <Carousel.Item key={url}>
                    <img src={url} alt={url} className='d-block w-100 discovery-card-image' />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}


export {
    ImageCarousel
};