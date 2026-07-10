import { Mail, MapPin, Clock, Send } from "lucide-react";

export default function Contact({ data }) {
  const { personal, socials } = data;

  const contactItems = [
    { icon: Mail, label: "Email", value: socials?.email, href: `mailto:${socials?.email}` },
    { icon: MapPin, label: "Location", value: personal?.location },
    { icon: Clock, label: "Hours", value: personal?.hours ?? "Mon–Fri, 9am–6pm" },
  ].filter((c) => c.value);

  const socialsArray = socials 
    ? Object.entries(socials).map(([platform, url]) => ({ platform, url }))
    : [];

  return (
    <>
      <section id="contact" className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase block mb-3">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Book a Consultation</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Contact Information</h3>
              <div className="space-y-5 mb-10">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-medium mb-0.5">{label}</p>
                      {href ? <a href={href} className="text-slate-200 font-medium text-sm hover:text-blue-400 transition-colors">{value}</a> : <p className="text-slate-200 font-medium text-sm">{value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none" />
                <button type="button" className="w-full bg-blue-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex justify-between items-center text-slate-400 text-sm">
          <span>{personal?.name ?? "Dr. Jane Doe"}</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}