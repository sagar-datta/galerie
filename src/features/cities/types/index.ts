// Selected City Types
export interface SelectedCityProps {
  city: string;
  position: { top: number; left: number };
  onReturn: () => void;
  isReturning: boolean;
  isDirectAccess?: boolean;
}

// Ticker Types
export interface CitiesTickerProps {
  onCityClick: (city: string, rect: DOMRect) => void;
  isPaused: boolean;
}
