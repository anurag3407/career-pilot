import data from '../../../../data/dummy_data.json';
export default function Skills() {
  return (
    <section className="p-10">

      <h2 className="text-3xl font-bold mb-6">Skills</h2>

      <div className="flex flex-wrap gap-3">
        {data.skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-800 rounded-full text-sm"
          >
            {skill.name} - {skill.level}
          </span>
        ))}
      </div>

    </section>
  );
}