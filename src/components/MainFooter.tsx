import { COLORS } from "../constants/colors";

export function MainFooter() {
  return (
    <div className="w-full h-full grid grid-rows-4 overflow-hidden">
      <div
        className="overflow-hidden flex items-end justify-end px-8 pb-4 row-span-3"
        style={{ backgroundColor: COLORS.beige }}
      >
        <span className="text-7xl font-bold" style={{ color: COLORS.red }}>
          Sagar's Photo Gallery
        </span>
      </div>
      <div
        className="overflow-hidden flex items-center px-8"
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
