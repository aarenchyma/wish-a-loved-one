import type { ComponentType } from 'react';
import ValentineTemplate from './Template01';
import BirthdayTemplate from './Template02';
import AnniversaryTemplate from './Template03';
import GraduationTemplate from './Template04';
import WeddingTemplate from './Template05';
import NewYearTemplate from './Template06';
import { ComingSoonTemplate } from './ComingSoonTemplate';

export interface TemplateProps {
  senderName: string;
  recipientName: string;
  message: string;
  mediaUrl?: string;
}

const registry: Record<string, ComponentType<TemplateProps>> = {
  valentine: ValentineTemplate,
  birthday: BirthdayTemplate,
  anniversary: AnniversaryTemplate,
  graduation: GraduationTemplate,
  wedding: WeddingTemplate,
  newyear: NewYearTemplate,
};

export function getTemplateComponent(templateId: string | null): ComponentType<TemplateProps> {
  if (templateId && registry[templateId]) {
    return registry[templateId];
  }
  return ComingSoonTemplate;
}

export function isTemplateAvailable(templateId: string): boolean {
  return templateId in registry;
}

export const AVAILABLE_TEMPLATE_IDS = Object.keys(registry);