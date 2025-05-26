import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            RéservaSalle
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary">
              Accueil
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary">
              Salles
            </Link>
            
            {user ? (
              <>
                <Link to="/mes-reservations" className="text-gray-700 hover:text-primary">
                  Mes réservations
                </Link>
                
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary">
                    Administration
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-4">
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleLogout}>
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="default">
                <Link to="/login">Connexion</Link>
              </Button>
            )}
          </nav>
          
          {/* Menu mobile à implémenter si nécessaire */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;