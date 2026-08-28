import type { ComponentType } from 'react';
import Template01 from './Template01';
import Template02 from './Template02';
import Template03 from './Template03';
import Template04 from './Template04';
import Template05 from './Template05';
import Template06 from './Template06';
import { ComingSoonTemplate } from './ComingSoonTemplate';

export interface TemplateProps {
  senderName: string;
  recipientName: string;
  message: string;
  mediaUrl?: string;
}

const registry: Record<string, ComponentType<TemplateProps>> = {
  template_01: Template01,
  // template_02: Template02,
  // template_03: Template03,
  // template_04: Template04,
  // template_05: Template05,
  // template_06: Template06,
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