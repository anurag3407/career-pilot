import data from "../../../../data/dummy_data.json";

export default function Footer() {
  return (
    <footer className="border-t border-[#f0f0f0] py-8 px-6 md:px-16 lg:px-24 bg-white/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-[#ccc] text-xs">
          © {new Date().getFullYear()} {data.personal?.name}. All rights reserved.
        </span>
        <div className="flex items-center gap-2 text-[#ddd] text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea4c89] animate-pulse" />
          Built with passion & coffee
        </div>
      </div>
    </footer>
  );
}