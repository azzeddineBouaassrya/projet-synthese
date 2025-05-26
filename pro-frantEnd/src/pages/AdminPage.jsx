import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  fetchRooms, 
  fetchReservations, 
  updateReservationStatus,
  deleteRoom,
  createRoom,
  updateRoom 
} from "../services/api";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const statusMapping = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approuvée", color: "bg-green-100 text-green-800" },
  rejected: { label: "Refusée", color: "bg-red-100 text-red-800" }
};

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState(null);
  const [editableRoom, setEditableRoom] = useState({});
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin()) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
      });
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const roomsData = await fetchRooms();
        setRooms(roomsData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les salles",
        });
      } finally {
        setIsLoadingRooms(false);
      }

      try {
        const reservationsData = await fetchReservations();
        setReservations(reservationsData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les réservations",
        });
      } finally {
        setIsLoadingReservations(false);
      }
    };

    loadData();
  }, [user, isAdmin, navigate, toast]);

  const handleUpdateReservationStatus = async (id, status) => {
    try {
      const updatedReservation = await updateReservationStatus(id, status);
      if (updatedReservation) {
        setReservations(reservations.map(res => 
          res.id === id ? updatedReservation : res
        ));
        
        toast({
          title: status === "approved" ? "Réservation approuvée" : "Réservation refusée",
          description: `La réservation a été ${status === "approved" ? "approuvée" : "refusée"} avec succès`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteRoom(roomToDelete);
      setRooms(rooms.filter(room => room.id !== roomToDelete));
      
      toast({
        title: "Salle supprimée",
        description: "La salle a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la salle",
      });
    } finally {
      setIsDeleting(false);
      setRoomToDelete(null);
    }
  };

  const handleAddRoom = async () => {
    if (!editableRoom.name || !editableRoom.capacity || !editableRoom.location || !editableRoom.description) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }
    
    try {
      const facilities = editableRoom.facilities || [];
      const imageUrl = editableRoom.imageUrl || "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1000&auto=format&fit=crop";
      
      const newRoom = await createRoom({
        name: editableRoom.name,
        capacity: Number(editableRoom.capacity),
        location: editableRoom.location,
        description: editableRoom.description,
        facilities: typeof facilities === 'string' ? facilities.split(',').map(f => f.trim()) : facilities,
        imageUrl
      });
      
      setRooms([...rooms, newRoom]);
      setEditableRoom({});
      setIsAddingRoom(false);
      
      toast({
        title: "Salle ajoutée",
        description: "La nouvelle salle a été ajoutée avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la salle",
      });
    }
  };

  const handleUpdateRoom = async () => {
    if (!isEditingRoom || !editableRoom.name || !editableRoom.capacity || !editableRoom.location || !editableRoom.description) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }
    
    try {
      const facilities = editableRoom.facilities || [];
      
      const updatedRoom = await updateRoom(isEditingRoom, {
        name: editableRoom.name,
        capacity: Number(editableRoom.capacity),
        location: editableRoom.location,
        description: editableRoom.description,
        facilities: typeof facilities === 'string' ? facilities.split(',').map(f => f.trim()) : facilities,
        imageUrl: editableRoom.imageUrl
      });
      
      if (updatedRoom) {
        setRooms(rooms.map(room => 
          room.id === isEditingRoom ? updatedRoom : room
        ));
        setEditableRoom({});
        setIsEditingRoom(null);
        
        toast({
          title: "Salle mise à jour",
          description: "La salle a été mise à jour avec succès",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la salle",
      });
    }
  };

  const startEditRoom = (room) => {
    setEditableRoom({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      description: room.description,
      facilities: room.facilities,
      imageUrl: room.imageUrl
    });
    setIsEditingRoom(room.id);
  };

  const pendingReservations = reservations.filter(res => res.status === "pending");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Administration</h1>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="reservations">
            Réservations
          </TabsTrigger>
          <TabsTrigger value="rooms">
            Salles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des réservations</CardTitle>
              <CardDescription>
                Validez ou refusez les demandes de réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReservations ? (
                <p className="text-center py-4">Chargement des réservations...</p>
              ) : (
                <>
                  {pendingReservations.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="font-semibold">Réservations en attente ({pendingReservations.length})</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Salle</TableHead>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Horaires</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingReservations.map(reservation => (
                            <TableRow key={reservation.id}>
                              <TableCell>{reservation.roomName}</TableCell>
                              <TableCell>{reservation.userName}</TableCell>
                              <TableCell>{reservation.date}</TableCell>
                              <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
                              <TableCell className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-green-100 text-green-800 hover:bg-green-200 border-0"
                                  onClick={() => handleUpdateReservationStatus(reservation.id, "approved")}
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-red-100 text-red-800 hover:bg-red-200 border-0"
                                  onClick={() => handleUpdateReservationStatus(reservation.id, "rejected")}
                                >
                                  Refuser
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-600">
                      Aucune réservation en attente
                    </p>
                  )}

                  <div className="mt-8 space-y-6">
                    <h3 className="font-semibold">Toutes les réservations ({reservations.length})</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salle</TableHead>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Horaires</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map(reservation => (
                          <TableRow key={reservation.id}>
                            <TableCell>{reservation.roomName}</TableCell>
                            <TableCell>{reservation.userName}</TableCell>
                            <TableCell>{reservation.date}</TableCell>
                            <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des salles</CardTitle>
                <CardDescription>
                  Ajoutez, modifiez et supprimez des salles
                </CardDescription>
              </div>
              <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
                <DialogTrigger asChild>
                  <Button>Ajouter une salle</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une salle</DialogTitle>
                    <DialogDescription>
                      Complétez les informations pour créer une nouvelle salle
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom *
                      </Label>
                      <Input
                        id="name"
                        value={editableRoom.name || ""}
                        onChange={(e) => setEditableRoom({...editableRoom, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Salle A"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">
                        Capacité *
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={editableRoom.capacity || ""}
                        onChange={(e) => setEditableRoom({...editableRoom, capacity: parseInt(e.target.value)})}
                        className="col-span-3"
                        placeholder="10"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Lieu *
                      </Label>
                      <Input
                        id="location"
                        value={editableRoom.location || ""}
                        onChange={(e) => setEditableRoom({...editableRoom, location: e.target.value})}
                        className="col-span-3"
                        placeholder="Étage 1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={editableRoom.description || ""}
                        onChange={(e) => setEditableRoom({...editableRoom, description: e.target.value})}
                        className="col-span-3"
                        placeholder="Petite salle de conférence..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="facilities" className="text-right">
                        Équipements
                      </Label>
                      <Input
                        id="facilities"
                        value={Array.isArray(editableRoom.facilities) ? editableRoom.facilities.join(", ") : (editableRoom.facilities || "")}
                        onChange={(e) => setEditableRoom({...editableRoom, facilities: e.target.value})}
                        className="col-span-3"
                        placeholder="Projecteur, WiFi, Tableau blanc"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imageUrl" className="text-right">
                        URL Image
                      </Label>
                      <Input
                        id="imageUrl"
                        value={editableRoom.imageUrl || ""}
                        onChange={(e) => setEditableRoom({...editableRoom, imageUrl: e.target.value})}
                        className="col-span-3"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingRoom(false)}>Annuler</Button>
                    <Button onClick={handleAddRoom}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingRooms ? (
                <p className="text-center py-4">Chargement des salles...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map(room => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.capacity} personnes</TableCell>
                        <TableCell>{room.location}</TableCell>
                        <TableCell className="flex space-x-2">
                          <Dialog open={isEditingRoom === room.id} onOpenChange={(open) => !open && setIsEditingRoom(null)}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => startEditRoom(room)}>
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Modifier la salle</DialogTitle>
                                <DialogDescription>
                                  Modifiez les informations de la salle
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    Nom *
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={editableRoom.name || ""}
                                    onChange={(e) => setEditableRoom({...editableRoom, name: e.target.value})}
                                    className="col-span-3"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-capacity" className="text-right">
                                    Capacité *
                                  </Label>
                                  <Input
                                    id="edit-capacity"
                                    type="number"
                                    value={editableRoom.capacity || ""}
                                    onChange={(e) => setEditableRoom({...editableRoom, capacity: parseInt(e.target.value)})}
                                    className="col-span-3"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-location" className="text-right">
                                    Lieu *
                                  </Label>
                                  <Input
                                    id="edit-location"
                                    value={editableRoom.location || ""}
                                    onChange={(e) => setEditableRoom({...editableRoom, location: e.target.value})}
                                    className="col-span-3"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-description" className="text-right">
                                    Description *
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editableRoom.description || ""}
                                    onChange={(e) => setEditableRoom({...editableRoom, description: e.target.value})}
                                    className="col-span-3"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-facilities" className="text-right">
                                    Équipements
                                  </Label>
                                  <Input
                                    id="edit-facilities"
                                    value={Array.isArray(editableRoom.facilities) ? editableRoom.facilities.join(", ") : (editableRoom.facilities || "")}
                                    onChange={(e) => setEditableRoom({...editableRoom, facilities: e.target.value})}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-imageUrl" className="text-right">
                                    URL Image
                                  </Label>
                                  <Input
                                    id="edit-imageUrl"
                                    value={editableRoom.imageUrl || ""}
                                    onChange={(e) => setEditableRoom({...editableRoom, imageUrl: e.target.value})}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditingRoom(null)}>Annuler</Button>
                                <Button onClick={handleUpdateRoom}>Enregistrer</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setRoomToDelete(room.id)}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={roomToDelete !== null}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la salle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette salle ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;