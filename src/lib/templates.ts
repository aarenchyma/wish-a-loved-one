const TEMPLATE_IDS = [
  'template_01',
  'template_02',
  'template_03',
  'template_04',
  'template_05',
  'template_06',
] as const;

export type TemplateId = typeof TEMPLATE_IDS[number];

export function pickRandomTemplate(): TemplateId {
  const index = Math.floor(Math.random() * TEMPLATE_IDS.length);
  return TEMPLATE_IDS[index];
}