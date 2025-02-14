interface MonthYear {
  month: string;
  year: string;
}

interface CityVisit {
  type: "city";
  season: string;
  year: string;
  visits: MonthYear[];
}

interface Collection {
  type: "collection";
  description: string;
}

type GalleryMetadata = {
  name: string;
  displayName: string;
  metadata: CityVisit | Collection;
}

export const citiesMetadata: Record<string, GalleryMetadata> = {
  barcelona: {
    name: "barcelona",
    displayName: "BARCELONA",
    metadata: {
      type: "city",
      season: "WINTER",
      year: "MMXXIV-V",
      visits: [
        {
          month: "DEC", year: "MMXXIV"
        },
        {
          month: "JAN", year: "MMXXV"
        }
      ],
    },
  },
  nullarbor: {
    name: "nullarbor",
    displayName: "NULLARBOR",
    metadata: {
      type: "city",
      season: "SUMMER",
      year: "MMXXIII",
      visits: [
        {
          month: "DEC", year: "MMXXIII"
        }
      ],
    },
  },
  vietnam: {
    name: "vietnam",
    displayName: "VIETNAM",
    metadata: {
      type: "city",
      season: "SUMMER",
      year: "MMXXIII",
      visits: [
        {
          month: "JUN", year: "MMXXIII"
        }
      ],
    },
  },
  andalusia: {
    name: "andalusia",
    displayName: "ANDALUSIA",
    metadata: {
      type: "city",
      season: "WINTER",
      year: "MMXXIV-V",
      visits: [
        { month: "DEC", year: "MMXXIV" },
        { month: "JAN", year: "MMXXV" }
      ],
    },
  },
  portugal: {
    name: "portugal",
    displayName: "PORTUGAL",
    metadata: {
      type: "city",
      season: "WINTER",
      year: "MMXXV",
      visits: [
        { month: "JAN", year: "MMXXV" }
      ],
    },
  },
  paintings: {
    name: "paintings",
    displayName: "PAINTINGS",
    metadata: {
      type: "collection",
      description: "Assortment of photographed paintings",
    },
  },
};

export const formatVisitDates = (city: string): string => {
  const metadata = citiesMetadata[city.toLowerCase()];
  if (!metadata) return "VISIT DATES TO BE ANNOUNCED";

  const data = metadata.metadata;
  switch (data.type) {
    case "city":
      return `${data.season}  ·  ${data.visits.map(v => `${v.month} ${v.year}`).join("  ·  ")}`;
    case "collection":
      return data.description;
  }
};
