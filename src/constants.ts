export const MOCK_ADMIN_STATS = {
  users: 124,
  ticketsSent: 392,
  yield: 14.5,
};

export const MOCK_LOGS = [
  { date: "2025-11-22", event: "Connexion admin" },
  { date: "2025-11-21", event: "Mise à jour configuration Telegram" },
  { date: "2025-11-20", event: "Ajout matchs mock" },
];

export const MOCK_MATCHES = [
  {
    id: "1",
    player1: { name: "A. Rublev", rank: 5 },
    player2: { name: "F. Auger-Aliassime", rank: 12 },
    status: "TODAY",
    odds: { p1: 1.65, p2: 2.30 },
  },
  {
    id: "2",
    player1: { name: "N. Osaka", rank: 17 },
    player2: { name: "E. Rybakina", rank: 4 },
    status: "TODAY",
    odds: { p1: 1.70, p2: 2.10 },
  },
];
