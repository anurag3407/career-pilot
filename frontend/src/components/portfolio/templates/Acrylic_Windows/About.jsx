export default function About({ data, isMaximized }) {
  const { personal, stats } = data;

  const statItems = [
    { label: 'Years Exp.', value: stats?.yearsExperience },
    { label: 'Projects', value: stats?.projectsCompleted },
    { label: 'Clients', value: stats?.happyClients },
  ];

  return (
    <div className="py-4">
      <div className={`grid md:grid-cols-2 ${isMaximized ? 'gap-16 items-center' : 'gap-10 items-center'}`}>
        <div className="flex flex-col items-center gap-6">
          <img
            src={personal?.avatar}
            alt={personal?.name || 'Profile'}
            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/160'; }}
            className={`rounded-2xl object-cover ring-2 ring-[#0078D4]/40 ${isMaximized ? 'w-48 h-48' : 'w-36 h-36 md:w-40 md:h-40'}`}
          />
          <div className="grid grid-cols-3 gap-3 w-full">
            {statItems.map(s => (
              <div
                key={s.label}
                className={`backdrop-blur-sm bg-white/[0.06] border border-white/15 rounded-xl text-center ${isMaximized ? 'p-6' : 'p-3'}`}
              >
                <div className={`font-bold text-[#0078D4] ${isMaximized ? 'text-4xl' : 'text-2xl'}`}>
                  {s.value}+
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* min-w-0 needed or flex child overflows grid */}
        <div className="flex flex-col gap-4 min-w-0">
          <h2 className={`font-bold text-white ${isMaximized ? 'text-4xl' : 'text-2xl md:text-3xl'}`}>
            About <span className="text-[#0078D4]">Me</span>
          </h2>
          <p className={`text-white/70 leading-relaxed break-words ${isMaximized ? 'text-lg' : 'text-sm md:text-base'}`}>
            {personal?.bio}
          </p>
          {personal?.location && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="text-[#0078D4]">📍</span>
              {personal.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
