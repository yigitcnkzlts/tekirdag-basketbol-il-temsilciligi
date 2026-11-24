import { matches as legacyMatches, results as legacyResults } from "./data";
import { referees } from "./public-data";

export type SeasonId = `${number}-${number}`;
export type AssignmentRole = "Başhakem" | "Yardımcı Hakem" | "Üçüncü Saha Hakemi" | "Masa Hakemi";
export type AssignmentStatus = "Aktif" | "Değiştirildi" | "İptal Edildi";

export interface Season { id: SeasonId; label: string; startYear: number; endYear: number; active: boolean; archived: boolean }
export interface RefereeAssignment { id: string; matchId: number; refereeId: number; role: AssignmentRole; status: AssignmentStatus; classificationSnapshot: string }
export interface HistoricalMatch {
  id: number; seasonId: SeasonId; iso: string; league: string; category: string; home: string; away: string;
  venue: string; district: string; status: "Planlandı" | "Tamamlandı" | "Ertelendi" | "İptal Edildi";
  homeScore?: number; awayScore?: number; deletedAt?: string | null;
}

export const CURRENT_SEASON: SeasonId = "2026-2027";

export function createSeasonRange(fromStartYear = 2022, throughStartYear = 2027, activeSeason: SeasonId = CURRENT_SEASON): Season[] {
  return Array.from({ length: throughStartYear - fromStartYear + 1 }, (_, index) => {
    const startYear = throughStartYear - index;
    const id = `${startYear}-${startYear + 1}` as SeasonId;
    return { id, label: `${startYear}–${startYear + 1}`, startYear, endYear: startYear + 1, active: id === activeSeason, archived: id < activeSeason };
  });
}

export const historicalMatches: HistoricalMatch[] = [
  ...legacyResults.map((result, index) => ({ id: result.id, seasonId: CURRENT_SEASON, iso: `2026-11-${23-index}T14:00:00+03:00`, league: `Tekirdağ ${result.category} Ligi`, category: result.category, home: result.home, away: result.away, venue: index === 0 ? "İsmet İnönü Spor Salonu" : index === 1 ? "Atatürk Spor Salonu" : "100. Yıl Spor Salonu", district: index === 0 ? "Süleymanpaşa" : index === 1 ? "Çerkezköy" : "Çorlu", status: "Tamamlandı" as const, homeScore: result.homeScore, awayScore: result.awayScore, deletedAt: null })),
  ...legacyMatches.map(match => ({ id: match.id, seasonId: CURRENT_SEASON, iso: match.iso, league: match.league, category: match.category, home: match.home, away: match.away, venue: match.venue, district: match.district, status: match.status === "İptal Edildi" ? "İptal Edildi" as const : match.status === "Ertelendi" ? "Ertelendi" as const : "Planlandı" as const, deletedAt: null })),
];

const refereeId = (name: string) => referees.find(item => item.name === name.toLocaleUpperCase("tr-TR"))?.id;
const assignment = (matchId: number, name: string, role: AssignmentRole, status: AssignmentStatus = "Aktif"): RefereeAssignment | null => {
  const id = refereeId(name); return id ? { id: `a-${matchId}-${id}-${role}`, matchId, refereeId: id, role, status, classificationSnapshot: "İl Hakemi" } : null;
};

export const refereeAssignments: RefereeAssignment[] = [
  assignment(1, "Yiğit Can Kızıltaş", "Başhakem"), assignment(2, "Vesim Elagöz", "Başhakem"),
  assignment(3, "Engin Karabıyık", "Başhakem"), assignment(3, "Şaban Akgün", "Yardımcı Hakem"),
  assignment(4, "Metin Aka", "Başhakem"), assignment(101, "Yiğit Can Kızıltaş", "Başhakem"),
  assignment(101, "Vesim Elagöz", "Yardımcı Hakem"), assignment(102, "Şaban Akgün", "Başhakem"),
  assignment(102, "Engin Karabıyık", "Yardımcı Hakem"), assignment(103, "Metin Aka", "Başhakem"),
  assignment(103, "Yiğit Can Kızıltaş", "Yardımcı Hakem"),
].filter((item): item is RefereeAssignment => item !== null);

export interface PublicRepository {
  getSeasons(activeSeason?: SeasonId): Season[];
  getMatches(seasonId?: SeasonId | "all"): HistoricalMatch[];
  getAssignments(): RefereeAssignment[];
}

export const demoPublicRepository: PublicRepository = {
  getSeasons: activeSeason => createSeasonRange(2022, Math.max(2027, Number((activeSeason ?? CURRENT_SEASON).split("-")[0])), activeSeason),
  getMatches: seasonId => historicalMatches.filter(match => !match.deletedAt && (!seasonId || seasonId === "all" || match.seasonId === seasonId)),
  getAssignments: () => refereeAssignments.filter(item => item.status === "Aktif"),
};
