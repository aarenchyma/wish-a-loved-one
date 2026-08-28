import type { TemplateProps } from './index';

export function ComingSoonTemplate({ senderName, recipientName, message, mediaUrl }: TemplateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{recipientName}</h1>
        {mediaUrl && <video src={mediaUrl} controls playsInline className="w-full rounded-2xl shadow-lg" />}
        <p className="text-lg text-gray-700 whitespace-pre-wrap">{message}</p>
        <p className="text-sm text-gray-500 pt-4">— from {senderName}</p>
      </div>
    </div>
  );
}