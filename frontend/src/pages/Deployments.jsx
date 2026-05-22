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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deployments</h1>

      <div className="space-y-4">
        {deployments.map((deployment, index) => (
          <div
            key={index}
            className="border rounded-xl p-4"
          >
            <h2 className="text-lg font-semibold">
              {deployment.name}
            </h2>

            <p className="text-sm">
              Status: {deployment.status}
            </p>

            <a
              href={deployment.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              {deployment.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}