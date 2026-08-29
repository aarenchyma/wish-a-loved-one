'use client';

import { useEffect, useState, useRef } from 'react';
import { matchOccasion } from '@/lib/occasionMatch';
import { getTemplateComponent, AVAILABLE_TEMPLATE_IDS } from '@/components/templates';

interface OccasionInputProps {
  templateId: string;
  onTemplateChange: (id: string) => void;
}

export function OccasionInput({ templateId, onTemplateChange }: OccasionInputProps) {
  const [text, setText] = useState('');
  const [matched, setMatched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const match = matchOccasion(text);
      if (match) {
        onTemplateChange(match);
        setMatched(true);
      } else {
        setMatched(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [text]);

  const Template = getTemplateComponent(templateId);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
          What's the occasion?
        </label>
        <input
          id="occasion"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. birthday, heartfelt message, our anniversary…"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        {text.trim() && (
          <p className="text-xs mt-1.5 text-gray-500">
            {matched ? 'Design matched ✓ — you can keep typing to refine it' : "We'll use a general design until this matches something specific"}
          </p>
        )}
      </div>

      {/* live preview, scaled down, same real component that renders on the paid page */}
      <div className="rounded-xl overflow-hidden border border-gray-200 h-40 relative bg-white pointer-events-none">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: '250%', height: '250%', transform: 'scale(0.4)' }}
        >
          <Template senderName="Alex" recipientName="Sam" message="Wishing you the best day ever!" />
        </div>
      </div>
    </div>
  );
}