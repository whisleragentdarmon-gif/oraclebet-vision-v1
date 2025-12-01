import { GeoCondition } from '../types';

export const GeoEngine = {
  getConditions: (tournament: string): GeoCondition => {
    // Base de données simulée des tournois
    if (tournament.includes('Bogota') || tournament.includes('Gstaad')) {
      return { altitude: 2600, humidity: 40, windSpeed: 10, courtSpeedIndex: 85, ballType: 'Pressureless', isIndoor: false }; // Altitude = Balle rapide
    }
    if (tournament.includes('Miami')) {
      return { altitude: 0, humidity: 85, windSpeed: 25, courtSpeedIndex: 45, ballType: 'Penn Marathon', isIndoor: false }; // Humide = Balle lourde
    }
    // Défaut
    return { altitude: 0, humidity: 50, windSpeed: 5, courtSpeedIndex: 50, ballType: 'Standard', isIndoor: false };
  }
};
