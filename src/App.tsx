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

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="space-y-6">
          {cities.map((city, index) => (
            <div
              key={city}
              className="relative overflow-hidden group"
              style={{
                backgroundColor: index % 2 === 0 ? COLORS.dark : COLORS.black,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: COLORS.red }}
              />
              <h2
                className="py-8 px-6 text-6xl tracking-widest font-bold relative z-10"
                style={{
                  color: COLORS.white,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
              >
                {city}
              </h2>
              <div
                className="absolute top-1/2 -right-4 w-16 h-16 -translate-y-1/2"
                style={{ backgroundColor: COLORS.coral }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
