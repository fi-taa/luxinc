const base = "https://placehold.co";

function img(width: number, height: number, label: string) {
  return `${base}/${width}x${height}/0a0a0a/1a1a1a/png?text=${encodeURIComponent(label)}`;
}

export const placeholderImages = {
  hero: img(1920, 1080, "Hero"),
  lodge: img(640, 900, "Lodge"),
  kenya: img(400, 500, "Kenya"),
  rwanda: img(400, 500, "Rwanda"),
  global: img(400, 500, "Global"),
  cruise: img(400, 520, "Ocean"),
  desert: img(400, 520, "Desert"),
  skyline: img(400, 520, "City"),
  architect1: img(360, 480, "Architect"),
  architect2: img(360, 480, "Architect"),
  architect3: img(360, 480, "Architect"),
  journal1: img(120, 120, "Journal"),
  journal2: img(120, 120, "Journal"),
  journal3: img(120, 120, "Journal"),
  caseStudy: img(720, 540, "Case Study"),
  team1: img(360, 440, "Team"),
  team2: img(360, 440, "Team"),
  team3: img(360, 440, "Team"),
  london: img(640, 400, "London"),
  dubai: img(640, 400, "Dubai"),
} as const;
