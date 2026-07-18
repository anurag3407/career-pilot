import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const PreviewFrame = ({ url, title = "Portfolio Preview" }) => {
  const [device, setDevice] = useState('desktop');

  const getFrameWidth = () => {
    switch (device) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Device Toggles */}
      <div className="flex items-center space-x-2 bg-secondary p-1 rounded-lg">
        <button
          onClick={() => setDevice('desktop')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            device === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'
          }`}
          title="Desktop view"
        >
          <Monitor className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            device === 'tablet' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'
          }`}
          title="Tablet view"
        >
          <Tablet className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Tablet</span>
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            device === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'
          }`}
          title="Mobile view"
        >
          <Smartphone className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Preview Container */}
      <div
        className="relative bg-background border rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out"
        style={{ width: getFrameWidth(), height: '800px', maxWidth: '100%' }}
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-muted flex items-center px-4 border-b">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="mx-auto text-xs text-muted-foreground flex items-center absolute left-1/2 -translate-x-1/2">
            {title}
          </div>
        </div>
        <iframe
          src={url}
          className="w-full h-full pt-8 border-none bg-background transition-all duration-500"
          title="Portfolio Preview"
        />
      </div>
    </div>
  );
};

export default PreviewFrame;
