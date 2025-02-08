import { COLORS } from "../constants/colors";

export function MainFooter() {
  return (
    <div className="w-full flex flex-col overflow-hidden">
      <div
        className="overflow-hidden flex items-end justify-end px-8 pb-4"
        style={{ backgroundColor: COLORS.beige }}
      >
        <span className="text-7xl font-bold" style={{ color: COLORS.red }}>
          Galerie de Sagar
        </span>
      </div>
      <div
        className="h-24 overflow-hidden flex items-center px-8"
        style={{ backgroundColor: COLORS.coral }}
      >
        <span
          className="text-4xl font-bold tracking-widest truncate"
          style={{ color: COLORS.white }}
        >
          select place above to view images.
        </span>
      </div>
    </div>
  );
}
