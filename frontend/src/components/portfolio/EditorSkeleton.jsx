const EditorSkeleton = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-background animate-pulse">
      
      <div className="h-14 w-full bg-muted rounded-md mb-4 px-4" />

      <div className="flex flex-1 gap-4 px-4 pb-4">
        
       
        <div className="w-1/3 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-muted rounded-md" />
          ))}
        </div>

      
        <div className="w-2/3 bg-muted rounded-md" />

      </div>
    </div>
  );
};

export default EditorSkeleton;
