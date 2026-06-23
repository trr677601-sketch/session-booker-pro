export type Focus = "Strength" | "Conditioning" | "Mobility";
export type Location = "Studio" | "Outdoor";

export type ClassSlot = {
  id: string;
  time: string; // 24h "HH:MM"
  name: string;
  focus: Focus;
  location: Location;
  duration: number; // minutes
  spots: number; // 0 = full
  area?: string; // outdoor area
};

export type Day = {
  key: string;
  label: string;
  short: string;
  date: string;
  slots: ClassSlot[];
};

export const SCHEDULE: Day[] = [
  {
    key: "mon",
    label: "Monday",
    short: "Mon",
    date: "Week 1",
    slots: [
      { id: "mon-1", time: "06:30", name: "Sunrise Strength", focus: "Strength", location: "Outdoor", duration: 60, spots: 2, area: "Barceloneta" },
      { id: "mon-2", time: "08:00", name: "Foundations", focus: "Strength", location: "Studio", duration: 60, spots: 1 },
      { id: "mon-3", time: "12:30", name: "Midday Conditioning", focus: "Conditioning", location: "Studio", duration: 45, spots: 3 },
      { id: "mon-4", time: "17:30", name: "Heavy Pull", focus: "Strength", location: "Studio", duration: 60, spots: 0 },
      { id: "mon-5", time: "19:00", name: "Park Circuit", focus: "Conditioning", location: "Outdoor", duration: 45, spots: 2, area: "Ciutadella" },
      { id: "mon-6", time: "20:00", name: "Mobility Reset", focus: "Mobility", location: "Studio", duration: 45, spots: 4 },
    ],
  },
  {
    key: "tue",
    label: "Tuesday",
    short: "Tue",
    date: "Week 1",
    slots: [
      { id: "tue-1", time: "07:00", name: "Beach Sprints", focus: "Conditioning", location: "Outdoor", duration: 45, spots: 3, area: "Barceloneta" },
      { id: "tue-2", time: "08:30", name: "Press & Push", focus: "Strength", location: "Studio", duration: 60, spots: 1 },
      { id: "tue-3", time: "12:00", name: "Lunchbreak Lift", focus: "Strength", location: "Studio", duration: 45, spots: 2 },
      { id: "tue-4", time: "17:00", name: "Hinge & Carry", focus: "Strength", location: "Studio", duration: 60, spots: 0 },
      { id: "tue-5", time: "18:30", name: "Montjuïc Stairs", focus: "Conditioning", location: "Outdoor", duration: 60, spots: 4, area: "Montjuïc" },
      { id: "tue-6", time: "20:00", name: "Hip & Spine", focus: "Mobility", location: "Studio", duration: 45, spots: 3 },
    ],
  },
  {
    key: "wed",
    label: "Wednesday",
    short: "Wed",
    date: "Week 1",
    slots: [
      { id: "wed-1", time: "06:30", name: "Sunrise Strength", focus: "Strength", location: "Outdoor", duration: 60, spots: 2, area: "Barceloneta" },
      { id: "wed-2", time: "08:00", name: "Squat Focus", focus: "Strength", location: "Studio", duration: 60, spots: 1 },
      { id: "wed-3", time: "12:30", name: "Midday Conditioning", focus: "Conditioning", location: "Studio", duration: 45, spots: 2 },
      { id: "wed-4", time: "17:30", name: "Upper Body", focus: "Strength", location: "Studio", duration: 60, spots: 0 },
      { id: "wed-5", time: "19:00", name: "Poblenou Loop", focus: "Conditioning", location: "Outdoor", duration: 45, spots: 3, area: "Poblenou" },
      { id: "wed-6", time: "20:00", name: "Mobility Reset", focus: "Mobility", location: "Studio", duration: 45, spots: 4 },
    ],
  },
  {
    key: "thu",
    label: "Thursday",
    short: "Thu",
    date: "Week 1",
    slots: [
      { id: "thu-1", time: "07:00", name: "Beach Sprints", focus: "Conditioning", location: "Outdoor", duration: 45, spots: 1, area: "Barceloneta" },
      { id: "thu-2", time: "08:30", name: "Olympic Primer", focus: "Strength", location: "Studio", duration: 60, spots: 2 },
      { id: "thu-3", time: "12:00", name: "Lunchbreak Lift", focus: "Strength", location: "Studio", duration: 45, spots: 3 },
      { id: "thu-4", time: "17:00", name: "Posterior Chain", focus: "Strength", location: "Studio", duration: 60, spots: 1 },
      { id: "thu-5", time: "18:30", name: "Montjuïc Stairs", focus: "Conditioning", location: "Outdoor", duration: 60, spots: 0, area: "Montjuïc" },
      { id: "thu-6", time: "20:00", name: "Shoulder & T-Spine", focus: "Mobility", location: "Studio", duration: 45, spots: 4 },
    ],
  },
  {
    key: "fri",
    label: "Friday",
    short: "Fri",
    date: "Week 1",
    slots: [
      { id: "fri-1", time: "06:30", name: "Sunrise Strength", focus: "Strength", location: "Outdoor", duration: 60, spots: 3, area: "Barceloneta" },
      { id: "fri-2", time: "08:00", name: "Total Body", focus: "Strength", location: "Studio", duration: 60, spots: 1 },
      { id: "fri-3", time: "12:30", name: "Midday Conditioning", focus: "Conditioning", location: "Studio", duration: 45, spots: 2 },
      { id: "fri-4", time: "17:30", name: "Heavy Pull", focus: "Strength", location: "Studio", duration: 60, spots: 0 },
      { id: "fri-5", time: "19:00", name: "Park Circuit", focus: "Conditioning", location: "Outdoor", duration: 45, spots: 4, area: "Ciutadella" },
      { id: "fri-6", time: "20:00", name: "Mobility Reset", focus: "Mobility", location: "Studio", duration: 45, spots: 3 },
    ],
  },
  {
    key: "sat",
    label: "Saturday",
    short: "Sat",
    date: "Week 1",
    slots: [
      { id: "sat-1", time: "08:00", name: "Open Strength", focus: "Strength", location: "Studio", duration: 75, spots: 2 },
      { id: "sat-2", time: "09:30", name: "Beach Conditioning", focus: "Conditioning", location: "Outdoor", duration: 60, spots: 4, area: "Barceloneta" },
      { id: "sat-3", time: "11:00", name: "Skills & Carries", focus: "Strength", location: "Studio", duration: 60, spots: 3 },
      { id: "sat-4", time: "12:30", name: "Full Mobility", focus: "Mobility", location: "Studio", duration: 60, spots: 5 },
    ],
  },
];
