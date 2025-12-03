import { GeoCondition } from '../../types'; // Attention au chemin

export const GeoEngine = {
  getConditions: (tournament: string): GeoCondition => {
    const base = {
        altitude: 0,
        humidity: 50,
        windSpeed: 5,
        courtSpeedIndex: 50,
        ballType: 'Standard',
        isIndoor: false,
        weather: "Ensoleillé (Simulé)" // ✅ AJOUT MANQUANT
    };

    if (tournament.includes('Bogota')) {
        return { ...base, altitude: 2600, weather: "Nuageux", courtSpeedIndex: 80 };
    }
    
    return base;
  }
};
