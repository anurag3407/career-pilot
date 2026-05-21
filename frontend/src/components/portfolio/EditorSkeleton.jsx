const EditorSkeleton = () => {
  return (
    <div className="flex flex-col h-screen w-full animate-pulse" style={{backgroundColor: '#0f172a'}}>
      
      {/* Top header bar */}
      <div className="h-14 w-full rounded-md mb-4 px-4" style={{backgroundColor: '#1e293b'}} />

      {/* Main content */}
      <div className="flex flex-1 gap-4 px-4 pb-4">
        
        {/* Left panel - section cards */}
        <div className="w-1/3 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full rounded-md" style={{backgroundColor: '#1e293b'}} />
          ))}
        </div>

        {/* Right panel - preview area */}
        <div className="w-2/3 rounded-md" style={{backgroundColor: '#1e293b'}} />

      </div>
    </div>
  );
};

export default EditorSkeleton;
