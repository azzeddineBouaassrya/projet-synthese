export const rooms = [
  {
    id: 1,
    name: "Salle A",
    capacity: 10,
    location: "Étage 1",
    description: "Petite salle de conférence équipée d'un projecteur et d'un tableau blanc",
    facilities: ["Projecteur", "Tableau blanc", "WiFi", "Climatisation"],
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Salle B",
    capacity: 20,
    location: "Étage 2",
    description: "Salle de réunion de taille moyenne avec équipement audio/vidéo",
    facilities: ["Projecteur", "Système audio", "WiFi", "Climatisation", "Téléconférence"],
    imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Grande salle C",
    capacity: 50,
    location: "Étage 1",
    description: "Grande salle pour les présentations et les événements d'entreprise",
    facilities: ["Projecteur HD", "Système audio", "WiFi", "Climatisation", "Téléconférence", "Estrade"],
    imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1025&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Salle de créativité",
    capacity: 15,
    location: "Étage 3",
    description: "Espace de brainstorming avec mobilier flexible et murs inscriptibles",
    facilities: ["Tableaux muraux", "Mobilier modulable", "WiFi", "Climatisation"],
    imageUrl: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=1089&auto=format&fit=crop"
  }
];

export const reservations = [
  {
    id: 1,
    roomId: 1,
    roomName: "Salle A",
    userId: 1,
    userName: "Jean Dupont",
    date: "2025-05-25",
    startTime: "09:00",
    endTime: "10:30",
    purpose: "Réunion d'équipe",
    status: "approved",
    createdAt: "2025-05-20T10:30:00Z"
  },
  {
    id: 2,
    roomId: 2,
    roomName: "Salle B",
    userId: 1,
    userName: "Jean Dupont",
    date: "2025-05-26",
    startTime: "14:00",
    endTime: "16:00",
    purpose: "Présentation client",
    status: "pending",
    createdAt: "2025-05-20T11:45:00Z"
  },
  {
    id: 3,
    roomId: 3,
    roomName: "Grande salle C",
    userId: 2,
    userName: "Marie Martin",
    date: "2025-05-27",
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Formation",
    status: "approved",
    createdAt: "2025-05-19T09:15:00Z"
  },
  {
    id: 4,
    roomId: 1,
    roomName: "Salle A",
    userId: 3,
    userName: "Pierre Dubois",
    date: "2025-05-25",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Entretien",
    status: "rejected",
    createdAt: "2025-05-18T16:20:00Z"
  }
];