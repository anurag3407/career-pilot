import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Utensils } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '2',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Reservation requested:', formData);
    alert('Thank you! Your reservation request has been received.');
  };

  return (
    <section className="bg-[#1a1a1a] text-stone-300 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Utensils className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Reserve Your Table</h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            Experience culinary excellence. Book your table now or get in touch for special events and private dining.
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Information */}
          <div className="space-y-10 flex flex-col justify-center">
            <div className="bg-[#242424] p-8 rounded-2xl shadow-xl border border-stone-800">
              <h3 className="text-2xl font-serif text-white mb-8 border-b border-stone-700 pb-4">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="bg-stone-800/50 p-3 rounded-full mr-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Our Location</h4>
                    <p className="text-stone-400">123 Culinary Boulevard<br />Gourmet District, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-stone-800/50 p-3 rounded-full mr-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-stone-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-stone-800/50 p-3 rounded-full mr-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-stone-400">reservations@culinaryrestaurant.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-stone-800/50 p-3 rounded-full mr-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Opening Hours</h4>
                    <p className="text-stone-400">Mon-Thu: 5:00 PM - 10:00 PM<br />Fri-Sun: 4:00 PM - 11:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-[#242424] p-8 rounded-2xl shadow-xl border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
            
            <h3 className="text-2xl font-serif text-white mb-8">Book a Table</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    placeholder="(555) 000-0000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-stone-400 mb-2">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-stone-400 mb-2">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                    <option value="9+">9+ People</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-400 mb-2">Special Requests (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                  placeholder="Dietary requirements, special occasions..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#1a1a1a] font-bold py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>Confirm Reservation</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
