import { COLORS } from "../constants/colors";

export function MainFooter() {
  return (
    <div className="w-full h-full grid grid-rows-4 overflow-hidden">
      <div
        className="overflow-hidden flex items-center px-8"
        style={{ backgroundColor: COLORS.beige }}
      >
        <span
          className="text-6xl font-bold tracking-widest truncate"
          style={{ color: COLORS.red }}
        >
          hey
        </span>
      </div>
      <div
        className="overflow-hidden flex items-center px-8 row-span-3"
        style={{ backgroundColor: COLORS.coral }}
      >
        <span
          className="text-6xl font-bold tracking-widest truncate"
          style={{ color: COLORS.beige }}
        >
          hey
        </span>
      </div>
    </div>
  );
}
