import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onDemoClick: () => void;
}

export function Navbar({ onDemoClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-16 pt-6">
      <div className="liquid-glass rounded-xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-3xl font-bold tracking-wide text-white"
          style={{ fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Urbanly
        </div>

        {/* Center Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm text-white hover:text-gray-300 transition-colors duration-200"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm text-white hover:text-gray-300 transition-colors duration-200"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm text-white hover:text-gray-300 transition-colors duration-200"
          >
            Contact Us
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={onDemoClick}
          className="hidden md:block bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Try Live Demo
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-1"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden liquid-glass rounded-xl mt-2 p-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-white hover:text-gray-300 transition-colors duration-200 text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-white hover:text-gray-300 transition-colors duration-200 text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm text-white hover:text-gray-300 transition-colors duration-200 text-left"
            >
              Contact Us
            </button>
            <button
              onClick={onDemoClick}
              className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 w-full"
            >
              Try Live Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
