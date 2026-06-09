{/* Contact Form */}
<form
  onSubmit={(e) => e.preventDefault()}
  className="space-y-4"
>
  <div>
    <label htmlFor="name" className="mb-2 block text-green-400">
      $ enter_name
    </label>
    <input
      id="name"
      name="name"
      type="text"
      placeholder="John Doe"
      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500"
    />
  </div>

  <div>
    <label htmlFor="email" className="mb-2 block text-green-400">
      $ enter_email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      placeholder="john@example.com"
      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500"
    />
  </div>

  <div>
    <label htmlFor="message" className="mb-2 block text-green-400">
      $ enter_message
    </label>
    <textarea
      id="message"
      name="message"
      rows={5}
      placeholder="Write your message here..."
      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500"
    />
  </div>

  <button
    type="submit"
    className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-500/10 px-5 py-3 text-green-400 transition hover:bg-green-500/20"
  >
    <Send size={16} />
    <span>$ execute send-message</span>
  </button>

  <div className="pt-3 text-green-400">
    <span className="animate-pulse">█</span>
  </div>
</form>