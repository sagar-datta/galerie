export const formatCityUrl = (city: string) =>
  city.toLowerCase().replace(/_+/g, "-");

export const normalizeCityName = (cityUrl: string) =>
  cityUrl.replace(/-/g, "_");

export const formatCityDisplay = (city: string) => city.replace(/_+/g, " ");
