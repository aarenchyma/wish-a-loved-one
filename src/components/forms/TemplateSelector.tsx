'use client';

import { getTemplateComponent, AVAILABLE_TEMPLATE_IDS } from '@/components/templates';

const TEMPLATE_NAMES: Record<string, string> = {
  template_01: 'Sunset',
  template_02: 'Ocean',
  template_03: 'Meadow',
  template_04: 'Lavender',
  template_05: 'Midnight',
  template_06: 'Peach',
};

interface TemplateSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-900">Choose a design</p>
      <div className="grid grid-cols-3 gap-3">
        {AVAILABLE_TEMPLATE_IDS.map((id) => {
          const Template = getTemplateComponent(id);
          const selected = value === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`rounded-xl overflow-hidden border-2 transition text-left ${
                selected ? 'border-gray-900 scale-105' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="h-24 w-full overflow-hidden relative bg-white pointer-events-none">
                <div
                  className="absolute top-0 left-0 origin-top-left"
                  style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}
                >
                  <Template senderName="Alex" recipientName="Joshua" message="Wishing you the best day ever!" />
                </div>
              </div>
              <p className="text-xs text-center py-1.5 text-gray-600 border-t">
                {TEMPLATE_NAMES[id] ?? id}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getRandomTemplateId(): string {
  return AVAILABLE_TEMPLATE_IDS[Math.floor(Math.random() * AVAILABLE_TEMPLATE_IDS.length)];
}