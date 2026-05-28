import data from '../../../../data/dummy_data.json';
export default function Testimonials() {
  return (
    <section className="p-10">

      <h2 className="text-3xl font-bold mb-6">Testimonials</h2>

      <div className="grid md:grid-cols-2 gap-6">

        {data.testimonials.map((t, index) => (
          <div key={index} className="bg-gray-900 p-4 rounded-lg">

            <p className="italic">"{t.text}"</p>

            <div className="mt-4 font-bold">
              {t.name}
            </div>

            <p className="text-sm text-gray-400">
              {t.role}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}