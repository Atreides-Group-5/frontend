import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';

const DestinationCard = ({
  _id,
  name,
  destination_to,
  rating,
  price,
  images,
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    <Link to={`/package/${_id}`} className="block h-full">
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          <img
            className="w-full h-full object-cover"
            src={images[0] || '/destination/default.jpg'}
            alt={name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-2 left-2 text-white font-light text-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
            {destination_to}
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-medium text-lg mb-2 text-gray-800 line-clamp-2">
            {name}
          </h3>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
            <div className="text-blue-600 font-semibold">
              ${price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default DestinationCard;
