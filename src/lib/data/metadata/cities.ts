interface CityVisitDates {
  season: string;
  year: string;
  dates: string[];
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
      dates: ["DEC 25-30", "JAN 26-28"],
    },
  },
  paris: {
    name: "paris",
    displayName: "PARIS",
    visitDates: {
      season: "SPRING",
      year: "MMXXIV",
      dates: ["MAR 15-22", "APR 03-10"],
    },
  },
 
};

export const formatVisitDates = (city: string): string => {
  const metadata = citiesMetadata[city.toLowerCase()];
  if (!metadata) return "VISIT DATES TO BE ANNOUNCED";

  const { season, year, dates } = metadata.visitDates;
  return `${season} • ${year}  ·  ${dates.join("  ·  ")}`;
};
