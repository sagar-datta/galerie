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
  newYork: {
    name: "new-york",
    displayName: "NEW YORK",
    visitDates: {
      season: "AUTUMN",
      year: "MMXXIII",
      dates: ["OCT 12-20", "NOV 05-15"],
    },
  },
  london: {
    name: "london",
    displayName: "LONDON",
    visitDates: {
      season: "SUMMER",
      year: "MMXXIV",
      dates: ["JUN 28-JUL 05", "AUG 18-25"],
    },
  },
  chicago: {
    name: "chicago",
    displayName: "CHICAGO",
    visitDates: {
      season: "SPRING",
      year: "MMXXIV",
      dates: ["APR 15-22"],
    },
  },
  miami: {
    name: "miami",
    displayName: "MIAMI",
    visitDates: {
      season: "WINTER",
      year: "MMXXIII",
      dates: ["DEC 18-28"],
    },
  },
  shanghai: {
    name: "shanghai",
    displayName: "SHANGHAI",
    visitDates: {
      season: "AUTUMN",
      year: "MMXXIV",
      dates: ["SEP 10-20", "OCT 15-25"],
    },
  },
  berlin: {
    name: "berlin",
    displayName: "BERLIN",
    visitDates: {
      season: "SUMMER",
      year: "MMXXIV",
      dates: ["JUL 08-15", "AUG 01-10"],
    },
  },
  vienna: {
    name: "vienna",
    displayName: "VIENNA",
    visitDates: {
      season: "SPRING",
      year: "MMXXIV",
      dates: ["MAY 01-08"],
    },
  },
  melbourne: {
    name: "melbourne",
    displayName: "MELBOURNE",
    visitDates: {
      season: "SUMMER",
      year: "MMXXIV",
      dates: ["JAN 05-15", "FEB 01-10"],
    },
  },
  tokyo: {
    name: "tokyo",
    displayName: "TOKYO",
    visitDates: {
      season: "SPRING",
      year: "MMXXIV",
      dates: ["MAR 25-APR 05"],
    },
  },
};

export const formatVisitDates = (city: string): string => {
  const metadata = citiesMetadata[city.toLowerCase()];
  if (!metadata) return "VISIT DATES TO BE ANNOUNCED";

  const { season, year, dates } = metadata.visitDates;
  return `${season} • ${year}  ·  ${dates.join("  ·  ")}`;
};
