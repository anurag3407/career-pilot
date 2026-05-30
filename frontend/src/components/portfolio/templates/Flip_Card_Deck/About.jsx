import data from '../../../../data/dummy_data.json';
export default function About() {
  return (
    <section className="p-10">

      <h2 className="text-3xl font-bold mb-4">About Me</h2>

      <p className="text-gray-300 leading-7">
        {data.personal.bio}
      </p>

      <div className="mt-6">
        <img
          src={data.personal.avatar}
          alt={`Avatar of ${data.personal.name}`}
          className="w-32 h-32 rounded-full"
        />
      </div>

    </section>
  );
}