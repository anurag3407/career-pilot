import data from '../../../../data/dummy_data.json';
import { Github, Linkedin, Mail } from "lucide-react";
export default function Contact() {
  return (
    <section className="p-10 text-center">

      <h2 className="text-3xl font-bold mb-6">Contact</h2>

      <p className="mb-4">{data.personal.email}</p>

      <div className="flex justify-center gap-6">

        <a
          href={data.socials.github}
          aria-label={`GitHub profile of ${data.personal.name}`}
        >
          <Github />
        </a>

        <a href={data.socials.linkedin}>
          <Linkedin />
        </a>

        <a href={`mailto:${data.personal.email}`}>
          <Mail />
        </a>

      </div>

    </section>
  );
}