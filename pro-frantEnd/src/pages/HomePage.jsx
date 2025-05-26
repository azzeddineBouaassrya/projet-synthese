import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Système de Gestion des Réservations de Salles
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Planifiez et gérez efficacement vos réservations de salles de conférence
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {user ? (
            <>
              <Button asChild size="lg" className="px-8">
                <Link to="/rooms">Voir les salles disponibles</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link to="/mes-reservations">Mes réservations</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="px-8">
              <Link to="/login">Commencer</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-primary text-2xl mb-4">🔍</div>
          <h3 className="font-semibold text-lg mb-2">Recherche simple</h3>
          <p className="text-gray-600">
            Trouvez rapidement une salle disponible pour la date et l'heure souhaitées.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-primary text-2xl mb-4">📅</div>
          <h3 className="font-semibold text-lg mb-2">Réservation facile</h3>
          <p className="text-gray-600">
            Réservez une salle en quelques clics pour vos réunions et événements.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-primary text-2xl mb-4">⚙️</div>
          <h3 className="font-semibold text-lg mb-2">Gestion efficace</h3>
          <p className="text-gray-600">
            Gérez vos réservations et voyez l'historique de vos réservations passées et à venir.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
