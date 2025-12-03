import { GodModeReportV2 } from '../../types';
import { GodEngine } from './GodEngine'; // On réutilise la logique de base

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<GodModeReportV2> => {
    // On délègue au GodEngine qui est maintenant le maître
    return GodEngine.generateReportV2(p1, p2, tournament);
  }
};
