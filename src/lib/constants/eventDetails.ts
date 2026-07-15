export interface EventDetailsConfig {
  graduate: {
    fullName: string;
    firstName: string;
    degree: string;
    major: string;
    university: string;
    classYear: number;
    photoUrl: string;
    bioMessage: string;
  };
  event: {
    date: string; // ISO string or human readable
    time: string;
    venueName: string;
    venueAddress: string;
    dressCode: string;
    rsvpDeadline: string;
  };
  copy: {
    heroHeadline: string;
    heroSubheadline: string;
    invitationMessage: string;
  };
}

export const EVENT_DETAILS: EventDetailsConfig = {
  graduate: {
    fullName: "Gary Smith",
    firstName: "Gary",
    degree: "Bachelor of Science",
    major: "Computer Science",
    university: "State University",
    classYear: 2026,
    photoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    bioMessage: "Thank you to all my family and friends for your unwavering support over the past four years!",
  },
  event: {
    date: "2026-08-15",
    time: "4:00 PM – 8:00 PM",
    venueName: "Grand Horizon Garden",
    venueAddress: "123 University Avenue, Suite 400, Cityville, ST 12345",
    dressCode: "Smart Casual / Semi-Formal",
    rsvpDeadline: "2026-08-01",
  },
  copy: {
    heroHeadline: "Gary is Graduating!",
    heroSubheadline: "Join us in celebrating the Class of 2026",
    invitationMessage: "You are warmly invited to join Gary and family for an evening of celebration, dinner, and memories as we commemorate the completion of his degree.",
  },
};
