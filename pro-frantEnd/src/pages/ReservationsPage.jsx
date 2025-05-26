import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchReservations } from "../services/api";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusMapping = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approuvée", color: "bg-green-100 text-green-800" },
  rejected: { label: "Refusée", color: "bg-red-100 text-red-800" }
};

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadReservations = async () => {
      try {
        const data = await fetchReservations();
        setReservations(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les réservations",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, [user, navigate, toast]);

  // Regrouper les réservations par salle
  const reservationsByRoom = reservations.reduce((acc, reservation) => {
    const { roomId, roomName } = reservation;
    if (!acc[roomId]) {
      acc[roomId] = {
        roomName,
        reservations: []
      };
    }
    acc[roomId].reservations.push(reservation);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Réservations</h1>
        {user && !isAdmin() && (
          <Button asChild>
            <a href="/mes-reservations">Mes réservations</a>
          </Button>
        )}
        {user && isAdmin() && (
          <Button asChild>
            <a href="/admin">Administration</a>
          </Button>
        )}
      </div>

      {Object.keys(reservationsByRoom).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            Aucune réservation disponible.
          </p>
          <Button asChild className="mt-4">
            <a href="/rooms">Voir les salles</a>
          </Button>
        </div>
      ) : (
        Object.values(reservationsByRoom).map(({ roomName, reservations }, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">{roomName}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Horaires</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.userName}</TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
                    <TableCell className="max-w-xs truncate">{reservation.purpose}</TableCell>
                    <TableCell>
                      <Badge className={statusMapping[reservation.status].color}>
                        {statusMapping[reservation.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )}
    </div>
  );
};

export default ReservationsPage;