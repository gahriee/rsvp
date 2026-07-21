export interface CollagePhoto {
  url: string;
  caption: string;
  rotation: string;
  tag: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface DressCodeSwatch {
  name: string;
  hex: string;
}

export interface DressCodeConfig {
  title: string;
  subtitle: string;
  description: string;
  swatches: DressCodeSwatch[];
}

export interface NavigationConfig {
  googleMapsUrl: string;
  appleMapsUrl: string;
  parkingNotes: string;
  mapCoordinates: {
    lat: number;
    lng: number;
  };
}

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
    date: string;
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
    scrapbookQuote?: string;
    footerNote?: string;
  };
  collagePhotos?: CollagePhoto[];
  timeline?: TimelineItem[];
  dressCodeDetails?: DressCodeConfig;
  navigation?: NavigationConfig;
}

export const EVENT_DETAILS: EventDetailsConfig = {
  graduate: {
    fullName: "Irish Balana",
    firstName: "Irish",
    degree: "Bachelor of Science",
    major: "Information Technology",
    university: "Our Lady of Fatima University",
    classYear: 2026,
    photoUrl: "/hero.JPG",
    bioMessage: "Thank you to all my family and friends for your unwavering love, warm wishes, and support over these amazing four years!",
  },
  event: {
    date: "2026-08-09",
    time: "6:00 PM – 8:00 PM",
    venueName: "Jollibee Marilaque near SM Cherry",
    venueAddress: "Jollibee Marilaque near SM Cherry Antipolo, Marcos Highway, Antipolo, Rizal, Philippines",
    dressCode: "Semi-Formal Elegance · Neutral & Pastel Tones",
    rsvpDeadline: "2026-08-01",
  },
  copy: {
    heroHeadline: "Irish is Graduating!",
    heroSubheadline: "Join us for a heartwarming celebration of love, laughter, and new beginnings",
    invitationMessage: "You are joyfully invited to join Irish and loved ones in a beautiful garden setting for an evening of celebration, delicious dining, and heartfelt memories as we toast to the Class of 2026!",
    scrapbookQuote: "Wherever you go, go with all your heart — capturing every sweet memory along the way.",
    footerNote: "Made with love to celebrate Irish's big day and the adventures ahead!",
  },
  collagePhotos: [
    {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      caption: "Senior Thesis & Capstone Completed!",
      rotation: "-rotate-3",
      tag: "Class of 2026",
    },
    {
      url: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=800",
      caption: "Spring Days & Cherry Blossoms on Campus",
      rotation: "rotate-2",
      tag: "Golden Hour",
    },
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
      caption: "Best Friends & Celebration Toast",
      rotation: "-rotate-2",
      tag: "Forever Friends",
    },
    {
      url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
      caption: "Late Night Library Study Sessions",
      rotation: "rotate-3",
      tag: "Hard Work Paid Off!",
    },
    {
      url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
      caption: "Here's to the Next Beautiful Chapter!",
      rotation: "-rotate-1",
      tag: "Future Bound",
    },
    {
      url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800",
      caption: "Laughter on the Quad",
      rotation: "rotate-1",
      tag: "Good Times",
    },
    {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      caption: "Cap Toss Practice",
      rotation: "-rotate-2",
      tag: "Milestone",
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      caption: "Toast to the Graduate",
      rotation: "rotate-3",
      tag: "Cheers",
    },
    {
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      caption: "Friends Family and Celebration",
      rotation: "-rotate-1",
      tag: "Community",
    },
    {
      url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800",
      caption: "Sunset Over the Library Tower",
      rotation: "rotate-2",
      tag: "Memories",
    },
    {
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
      caption: "Charity Walk & Student Council",
      rotation: "-rotate-3",
      tag: "Leadership",
    },
    {
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
      caption: "Unstoppable Squad",
      rotation: "rotate-1",
      tag: "Besties",
    },
    {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      caption: "Proud Smile on Graduation Eve",
      rotation: "-rotate-2",
      tag: "Irish 2026",
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      caption: "Looking Toward the Future",
      rotation: "rotate-2",
      tag: "Adventure",
    },
  ],
  dressCodeDetails: {
    title: "Dress Code",
    subtitle: "SEMI FORMAL - STRICTLY NEUTRAL & PASTEL TONES",
    description: "We would love for our guests to dress in warm neutral tones, earthy pastels, and elegant creams to complement our celebration aesthetic! Please avoid bright neon or overly saturated primary colors.",
    swatches: [
      { name: "Cream Ivory", hex: "#FAF8F5" },
      { name: "Off White Sand", hex: "#F3EFEA" },
      { name: "Champagne Beige", hex: "#E1D8CB" },
      { name: "Soft Taupe", hex: "#D1BFAD" },
      { name: "Warm Tan", hex: "#C4A484" },
      { name: "Blush Mocha", hex: "#B58A63" },
      { name: "Terracotta Brown", hex: "#9C6B4E" },
      { name: "Cocoa Espresso", hex: "#7A5239" },
      { name: "Deep Chocolate", hex: "#3D2314" },
      { name: "Golden Olive", hex: "#8F6840" },
      { name: "Soft Grey Stone", hex: "#D8D4D0" },
      { name: "Warm Charcoal", hex: "#6A5D57" },
    ],
  },
  navigation: {
    googleMapsUrl: "https://www.google.com/maps/place/Jollibee+Marilaque/@14.6247071,121.1320907,223m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3397b96f9415d22f:0xb17e83968c0b5620!2sJollibee+SM+Cherry+Antipolo!8m2!3d14.624897!4d121.1338348!16s%2Fg%2F11h3spw_p6!3m5!1s0x3397b90015d7e11d:0x5fbacbdc1c3fd310!8m2!3d14.6245766!4d121.1323038!16s%2Fg%2F11lv_vrx7c?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D",
    appleMapsUrl: "https://maps.apple.com/?q=Jollibee+Marilaque",
    parkingNotes: "Parking is available directly at the location. Look for Irish's graduation celebration welcome sign!",
    mapCoordinates: {
      lat: 14.6245766,
      lng: 121.1323038,
    },
  },
};
