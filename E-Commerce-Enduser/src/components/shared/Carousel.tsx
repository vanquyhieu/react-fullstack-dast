import Carousel from 'react-bootstrap/Carousel';
import { Category } from '../../types/category.type';

function DarkVariantExample({categories} :{categories: Category[]}) {
  return (
    <Carousel data-bs-theme="dark" className='flex-box'>
        {categories.map(category => (
          <Carousel.Item key={category._id}>
            <img
              className="d-block w-100"
              src={category.images[0].url}
              alt={category.name}
            />
            <Carousel.Caption>
              <h3>{category.name}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default DarkVariantExample;