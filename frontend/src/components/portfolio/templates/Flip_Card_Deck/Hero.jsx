import data from '../../../../data/dummy_data.json';
export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center">

      <h1 className="text-6xl font-bold">
        {data.personal.name}
      </h1>

      <p className="text-xl text-gray-400 mt-2">
        {data.personal.title}
      </p>

      <p className="max-w-xl mt-6">
        {data.personal.bio}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        📍 {data.personal.location}
      </p>

    </section>
  );
}