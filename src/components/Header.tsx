import { useState } from "react";
import { Link } from "react-router-dom";
import KayaLogo from "./KayaLogo";
import { X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-3">
          <KayaLogo className="w-10 h-10 text-primary-foreground" />
          <span className="text-primary-foreground font-raleway font-light tracking-[0.4em] text-lg">
            KAYA
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="kaya-btn-outline hidden md:inline-flex"
          >
            Schedule Visit
          </a>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-3 text-primary-foreground font-raleway font-light tracking-[0.3em] text-sm uppercase"
          >
            Menu
            <span className="flex flex-col gap-1.5">
              <span className="block w-6 h-[1px] bg-primary-foreground" />
              <span className="block w-6 h-[1px] bg-primary-foreground" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-kaya-olive flex flex-col items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-primary-foreground"
          >
            <X size={28} />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {["Home", "Projects", "Gallery", "Packages", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-primary-foreground font-raleway font-light tracking-[0.3em] text-2xl uppercase hover:opacity-70 transition-opacity"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
