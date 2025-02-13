export interface CitiesTickerProps {
  onCityClick: (city: string, rect: DOMRect) => void;
  isPaused: boolean;
}
