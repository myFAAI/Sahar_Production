import React from 'react';

export function Slides({ material }) {
  if (!material || material.type !== 'slides') {
    return <div className="text-gray-500">No slides available</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{material.title}</h2>

      {material.fileUrl && (
        <iframe
          src={material.fileUrl}
          className="w-full h-96 border border-gray-300 rounded-lg mb-4"
          allowFullScreen
          title={material.title}
        />
      )}

      {material.content && (
        <div className="prose max-w-none">
          {material.content}
        </div>
      )}
    </div>
  );
}
