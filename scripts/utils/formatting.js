/**
 * Format city names into various formats needed by the application
 * @param {string[]} folders - Array of folder names from Cloudinary
 * @returns {Array<{
 *   display: string,
 *   file: string,
 *   variable: string,
 *   constant: string,
 *   key: string,
 *   original: string
 * }>} Formatted city names in different formats
 */
export function formatCityNames(folders) {
  return folders.map((folder) => {
    // Convert to title case format for display
    const titleCase = folder
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return {
      display: titleCase,         // For display (e.g., "New York")
      file: titleCase
        .toLowerCase()
        .replace(/\s+/g, "-"),   // For filenames (e.g., "new-york")
      variable: titleCase
        .toLowerCase()
        .replace(/\s+/g, ""),    // For variable names (e.g., "newyork")
      constant: folder
        .toUpperCase()
        .replace(/\s+/g, "_"),   // For cities ticker constant (e.g., "NEW_YORK")
      key: folder
        .toUpperCase()
        .replace(/\s+/g, "_"),   // For object keys (e.g., "NEW_YORK")
      original: folder,          // Keep original folder name for Cloudinary queries
    };
  });
}