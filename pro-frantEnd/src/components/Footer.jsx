import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; 2025 RéservaSalle. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="/rooms" className="text-sm text-gray-600 hover:text-primary">
              Salles
            </Link>
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary">
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
