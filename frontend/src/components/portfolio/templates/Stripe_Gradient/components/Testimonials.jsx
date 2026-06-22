import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-16">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <p className="text-slate-300">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 mt-6">
                <img
                  src={testimonial.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />

                <div>
                  <h4>{testimonial.name}</h4>
                  <p className="text-sm text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}