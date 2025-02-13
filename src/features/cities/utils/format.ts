export const formatCityUrl = (city: string) =>
  city.toLowerCase().replace(/\s+/g, "-");

export const normalizeCityName = (cityUrl: string) =>
  cityUrl.replace(/-/g, " ");
