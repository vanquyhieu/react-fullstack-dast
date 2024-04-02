import classNames from 'classnames';
import omit from 'lodash/omit';
import { useForm } from 'react-hook-form';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { path } from '../../constants';
import { useSchemaValidate } from '../../hooks';
import { QueryConfig } from '../../pages/HomePage';
import { Category } from '../../types/category.type';
import RatingStars from './RatingStars';
import DynamicSlides from '../../components/shared/DynamicSlider';
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

interface Props {
  queryConfig: QueryConfig;
  categoriesAsider: Category[];
}

interface FormState {
  price_min: string;
  price_max: string;
}

const AsideFilter = ({ categoriesAsider, queryConfig }: Props) => {
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(categoriesAsider.slice(0, 12));
  const [active, setActive] = useState(false);

  const navigate = useNavigate();
  const { category: categoryId } = queryConfig;
  console.log('categoryAsider', categoriesAsider);

  const schema = useSchemaValidate('priceMinMax');

  const { handleSubmit, control, reset } = useForm<FormState>({
    defaultValues: {
      price_min: '',
      price_max: '',
    },
    // resolver: yupResolver(schema),
  });

  const handleFilterByPrice = (payload: FormState) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: payload.price_max,
        price_min: payload.price_min,
      }).toString(),
    });
  };

  const handleRemoveAll = () => {
    reset();
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString(),
    });
  };

  if (categoriesAsider.length < 12) {
    setActive(true);
  } 
  return (
    <div className="py-3 flex-col">
      <Link to={path.home} className="flex items-center font-semibold text-gray-400">
        <svg viewBox="0 0 12 10" className="mr-3 h-4 w-3 fill-current">
          <g fillRule="evenodd" stroke="none" strokeWidth={1}>
            <g transform="translate(-373 -208)">
              <g transform="translate(155 191)">
                <g transform="translate(218 17)">
                  <path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Danh mục
      </Link>
      <div className="my-4 h-[1px] bg-gray-300" />
      <br></br>
      <button
        className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
        onClick={() => {
          // Update the displayed categories to include the next 2 categories
          setDisplayedCategories(() => [...categoriesAsider.slice(0,12)]);
        }}      
      >
        <BsChevronLeft />
      </button>
      <ul className="flex">
        {displayedCategories.map((category) => (
          <li className="flex flex-wrap justify-between items-center text-center hover:text-gray-500 border hover:border-slate-500 w-28 h-32  " key={category._id}>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: category._id,
                }).toString(),
              }}
              className={classNames('relative px-2', {
                'font-semibold text-primary': categoryId === category._id,
              })}
            >
              <div>
                <img src={`${category.images[0].url}`}></img>
              </div>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
        onClick={() => {
          if (active){
            // Update the displayed categories to include the next 2 categories
            setDisplayedCategories(() => [...categoriesAsider.slice(12, categoriesAsider.length)]);
          }
        }}      
      >
        <BsChevronRight />
      </button>
      <div className="my-4 h-[1px] bg-gray-300" />
    </div>
  );
};

export default AsideFilter;
