import { COLORS } from "./constants/colors";

function App() {
  const cities = [
    "NEW YORK",
    "PARIS",
    "LONDON",
    "CHICAGO",
    "MIAMI",
    "SHANGHAI",
    "BERLIN",
    "VIENNA",
    "MELBOURNE",
    "TOKYO",
  ];

  // Split cities into two groups
  const midPoint = Math.ceil(cities.length / 2);
  const topCities = cities.slice(0, midPoint);
  const bottomCities = cities.slice(midPoint);

  // Create duplicated arrays for smooth infinite scroll
  const createDuplicates = (arr: string[]) => [...arr, ...arr, ...arr, ...arr];
  const topDuplicates = createDuplicates(topCities);
  const bottomDuplicates = createDuplicates(bottomCities);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      <div className="max-w-full mx-auto py-20">
        <div className="ticker-row mb-8 scroll-left">
          <div className="ticker-content">
            {topDuplicates.map((city, index) => (
              <span
                key={`${city}-${index}`}
                className="ticker-item text-6xl tracking-widest font-bold"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
        <div className="ticker-row scroll-right">
          <div className="ticker-content">
            {bottomDuplicates.map((city, index) => (
              <span
                key={`${city}-${index}`}
                className="ticker-item text-6xl tracking-widest font-bold"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
