interface MonthYear {
  month: string;
  year: string;
}

interface CityVisitDates {
  season: string;
  year: string;
  visits: MonthYear[];
}

interface CityMetadata {
  name: string;
  displayName: string;
  visitDates: CityVisitDates;
}

export const citiesMetadata: Record<string, CityMetadata> = {
  barcelona: {
    name: "barcelona",
    displayName: "BARCELONA",
    visitDates: {
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
    visitDates: {
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
    visitDates: {
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
    visitDates: {
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
    visitDates: {
      season: "WINTER",
      year: "MMXXV",
      visits: [
        { month: "JAN", year: "MMXXV" }
      ],
    },
  },
 
};

export const formatVisitDates = (city: string): string => {
  const metadata = citiesMetadata[city.toLowerCase()];
  if (!metadata) return "VISIT DATES TO BE ANNOUNCED";

  const { season, visits } = metadata.visitDates;
  return `${season}  ·  ${visits.map(v => `${v.month} ${v.year}`).join("  ·  ")}`;
};
