import data from '../../../../data/dummy_data.json';
export default function Experience() {
  return (
    <section className="p-10">

      <h2 className="text-3xl font-bold mb-6">Experience</h2>

      <div className="space-y-6">

        {data.experience.map((exp, index) => (
          <div key={index} className="border-l-2 border-gray-700 pl-4">

            <h3 className="font-bold">{exp.role}</h3>
            <p className="text-gray-400">{exp.company}</p>
            <p className="text-sm text-gray-500">{exp.period}</p>
            <p className="mt-2 text-sm">{exp.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}