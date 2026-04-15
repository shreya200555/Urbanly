export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-16 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-2xl font-semibold text-white">
          Urbanly
        </div>
        <p className="text-gray-400 text-sm">
          2025 Urbanly. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
