import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Offer = ({ imageSrc, altText, title }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
    <Link
      to={`/offer/${title}`}
      className="block relative overflow-hidden rounded-lg shadow-lg"
    >
      <img src={imageSrc} alt={altText} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h3 className="text-white text-lg sm:text-xl font-bold">{title}</h3>
      </div>
    </Link>
  </motion.div>
);

export default Offer;