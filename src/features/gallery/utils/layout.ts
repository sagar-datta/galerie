import { GalleryImage } from "../types/gallery.types";
import { CURSOR_STYLE_CONFIG } from "../constants";
import { formatCityDisplay } from "../../../features/cities/utils/format";

/**
 * Creates an array of image rows for the gallery layout
 * @param images Array of gallery images to organize
 * @param numRows Number of rows to distribute images across
 * @returns Array of arrays, where each inner array represents a row of images
 */
export function createImageRows(images: GalleryImage[], numRows: number = 2) {
  const rows: GalleryImage[][] = Array.from({ length: numRows }, () => []);
  images.forEach((image, index) => {
    rows[index % numRows].push(image);
  });
  return rows;
}

/**
 * Calculates cursor style for the modal
 * @param city City name to display in cursor
 * @returns CSS cursor style object
 */
export function calculateCursorStyle(city: string) {
  const {
    MIN_WIDTH,
    MAX_WIDTH,
    ARROW_SPACE,
    LARGE_FONT_SIZE,
    SMALL_FONT_SIZE,
    LARGE_CHAR_WIDTH,
    SMALL_CHAR_WIDTH,
  } = CURSOR_STYLE_CONFIG;

  const formattedCity = formatCityDisplay(city);

  // Calculate font size based on text length
  const fontSize = formattedCity.length > 8 ? SMALL_FONT_SIZE : LARGE_FONT_SIZE;

  // Calculate dimensions with dynamic text fitting
  const charWidth = fontSize === LARGE_FONT_SIZE ? LARGE_CHAR_WIDTH : SMALL_CHAR_WIDTH;
  const textWidth = formattedCity.length * charWidth;
  const padding = Math.max(16, Math.min(24, textWidth * 0.15));
  const calculatedWidth = Math.min(
    Math.max(MIN_WIDTH, textWidth + ARROW_SPACE + padding),
    MAX_WIDTH
  );

  // Calculate text area width (leaving space for arrow)
  const textAreaWidth = calculatedWidth - ARROW_SPACE - padding;

  // Only add textLength for long city names
  const textLengthAttr = formattedCity.length > 8 
    ? `textLength='${textAreaWidth}' lengthAdjust='spacingAndGlyphs'` 
    : '';

  // Position text
  const textX = calculatedWidth / 2 + 16;
  const textY = fontSize === LARGE_FONT_SIZE ? 22 : 20;

  return {
    cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${calculatedWidth} 32' width='${calculatedWidth}' height='32'><rect x='6' y='6' width='${
      calculatedWidth - 8
    }' height='26' rx='1' fill='%23EBE9D1'/><rect x='3' y='3' width='${
      calculatedWidth - 8
    }' height='26' rx='1' fill='%23FF685B'/><g stroke='%23131313' stroke-linecap='square' stroke-width='3' fill='none'><path d='M20 16h18'></path><path d='m24 11l-6 5l6 5'></path></g><text x='${textX}' y='${textY}' fill='%23131313' text-anchor='middle' font-size='${fontSize}' font-family='Helvetica' font-weight='900' stroke='%23131313' stroke-width='0.5' ${textLengthAttr}>${formattedCity}</text></svg>") 16 16, auto`,
  };
}
