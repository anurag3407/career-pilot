export default function Deployments() {
  const deployments = [
    {
      name: "Portfolio v1",
      status: "Live",
      url: "https://portfolio-demo.vercel.app",
    },
    {
      name: "Personal Portfolio",
      status: "Building",
      url: "https://personal-portfolio.vercel.app",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Deployments
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {deployments.map((deployment, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:scale-[1.02] hover:border-blue-500/40 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold break-words">
                  {deployment.name}
                </h2>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${
                    deployment.status === "Live"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {deployment.status}
                </span>
              </div>

              <a
                href={deployment.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm sm:text-base text-blue-400 hover:text-blue-300 underline break-all"
              >
                {deployment.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}