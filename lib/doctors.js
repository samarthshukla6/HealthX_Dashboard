export const SPECIALTIES = [
  { id: "cardiology", label: "Heart / Cardiology" },
  { id: "ent", label: "ENT" },
  { id: "neurology", label: "Neurology" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "general", label: "General Practice" },
];

export const DOCTORS = [
  {
    id: 1,
    name: "Dr. Evelyn Reed",
    specialtyId: "cardiology",
    speciality: "Cardiology",
    avatarUrl: "/doctor1.jpeg",
    email: "work.sanskarjain@gmail.com",
  },
  {
    id: 2,
    name: "Dr. Marcus Chen",
    specialtyId: "neurology",
    speciality: "Neurology",
    avatarUrl: "/doctor2.jpeg",
    email: "samarthshukla150604@gmail.com",
  },
  {
    id: 3,
    name: "Dr. Anya Sharma",
    specialtyId: "pediatrics",
    speciality: "Pediatrics",
    avatarUrl: "/doctor3.jpeg",
    email: "anya.sharma@example.com",
  },
  {
    id: 4,
    name: "Dr. James Ortiz",
    specialtyId: "ent",
    speciality: "ENT",
    avatarUrl: "/doctor1.jpeg",
    email: "james.ortiz@example.com",
  },
  {
    id: 5,
    name: "Dr. Sarah Kim",
    specialtyId: "orthopedics",
    speciality: "Orthopedics",
    avatarUrl: "/doctor2.jpeg",
    email: "sarah.kim@example.com",
  },
  {
    id: 6,
    name: "Dr. Robert Hayes",
    specialtyId: "general",
    speciality: "General Practice",
    avatarUrl: "/doctor3.jpeg",
    email: "robert.hayes@example.com",
  },
];

export const TIME_SLOTS = (() => {
  const slots = [];
  let hour = 11;
  let minute = 0;
  while (hour < 19 || (hour === 19 && minute === 0)) {
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
})();
