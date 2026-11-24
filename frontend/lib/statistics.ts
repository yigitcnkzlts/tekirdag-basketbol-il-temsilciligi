import type { AssignmentRole, HistoricalMatch, RefereeAssignment, SeasonId } from "./domain";
import { referees } from "./public-data";

export interface RefereeStatistic { refereeId:number; name:string; classification:string; weekly:number; monthly:number; season:number; career:number; primary:number; assistant:number; third:number; table:number; upcoming:number; lastDate:string|null }

const countable = (match: HistoricalMatch) => match.status !== "İptal Edildi" && match.status !== "Ertelendi" && !match.deletedAt;
export function calculateRefereeStatistics(matches: HistoricalMatch[], assignments: RefereeAssignment[], seasonId: SeasonId | "all" = "all", now = new Date("2026-11-24T12:00:00+03:00")): RefereeStatistic[] {
  const monday = new Date(now); const day = (monday.getDay() + 6) % 7; monday.setDate(monday.getDate() - day); monday.setHours(0,0,0,0);
  const weekEnd = new Date(monday); weekEnd.setDate(weekEnd.getDate()+7);
  const byId = new Map(matches.map(match => [match.id, match]));
  return referees.map(referee => {
    const careerValid = assignments.filter(a => a.refereeId === referee.id && a.status === "Aktif").filter(a => { const m=byId.get(a.matchId); return Boolean(m && countable(m)); });
    const valid = careerValid.filter(a => { const m=byId.get(a.matchId)!; return seasonId === "all" || m.seasonId === seasonId; });
    const unique = [...new Map(valid.map(a => [a.matchId,a])).values()];
    const played = unique.filter(a => byId.get(a.matchId)?.status === "Tamamlandı");
    const upcoming = unique.filter(a => byId.get(a.matchId)?.status === "Planlandı");
    const roleCount = (role:AssignmentRole) => valid.filter(a => a.role === role).length;
    const dates = played.map(a => byId.get(a.matchId)!.iso).sort();
    return { refereeId:referee.id,name:referee.name,classification:referee.classification,weekly:unique.filter(a=>{const d=new Date(byId.get(a.matchId)!.iso);return d>=monday&&d<weekEnd}).length,monthly:unique.filter(a=>{const d=new Date(byId.get(a.matchId)!.iso);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()}).length,season:unique.length,career:new Set(careerValid.map(a=>a.matchId)).size,primary:roleCount("Başhakem"),assistant:roleCount("Yardımcı Hakem"),third:roleCount("Üçüncü Saha Hakemi"),table:roleCount("Masa Hakemi"),upcoming:upcoming.length,lastDate:dates.at(-1)??null };
  });
}

export function slugifyReferee(name:string){return name.toLocaleLowerCase("tr-TR").replaceAll("ı","i").replaceAll("ü","u").replaceAll("ö","o").replaceAll("ş","s").replaceAll("ğ","g").replaceAll("ç","c").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
