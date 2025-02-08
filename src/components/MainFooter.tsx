import { COLORS } from "../constants/colors";

export function MainFooter() {
  return (
    <div
      className="flex items-center px-8 overflow-hidden"
      style={{ backgroundColor: COLORS.coral }}
    >
      <span
        className="text-6xl font-bold tracking-widest"
        style={{ color: COLORS.beige }}
      >
        hey
      </span>
    </div>
  );
}
