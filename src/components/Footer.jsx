import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <p>
            Discover amazing travel experiences with our curated packages and
            exclusive offers.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li>
              <Link to="/destinations" className="hover:text-blue-300">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-blue-300">
                Special Deals
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-300">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p className="mb-2">
            Subscribe for the latest travel updates and exclusive offers.
          </p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full p-2 rounded text-gray-800"
          />
          <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
