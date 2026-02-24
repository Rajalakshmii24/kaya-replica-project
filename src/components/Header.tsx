import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import KayaLogo from "./KayaLogo";
import { X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Properties",
    to: "/properties",
    children: [
      { label: "All Properties", to: "/properties" },
      { label: "Off Plan", to: "/offplan" },
      { label: "Secondary Market", to: "/secondary" },
    ],
  },
  { label: "Services", to: "/services" },
  { label: "Current Market", to: "/current-market" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const headerBg = !isHome || scrolled ? "bg-kaya-olive" : "bg-transparent";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-300 ${headerBg}`}>
        <Link to="/" className="flex items-center gap-3">
          <KayaLogo className="w-10 h-10 text-primary-foreground" />
          <span className="text-primary-foreground font-raleway font-light tracking-[0.4em] text-lg">
            KAYA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                    className="flex items-center gap-1 text-primary-foreground font-raleway font-light tracking-[0.15em] text-xs uppercase hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen === item.label && (
                    <div className="absolute top-full left-0 mt-2 bg-kaya-olive min-w-[200px] py-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          onClick={() => setDropdownOpen(null)}
                          className="block px-5 py-2.5 text-primary-foreground font-raleway font-light text-xs tracking-[0.1em] uppercase hover:bg-primary-foreground/10 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.to}
                  className="text-primary-foreground font-raleway font-light tracking-[0.15em] text-xs uppercase hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link to="/contact" className="kaya-btn-outline">
            Schedule Visit
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden flex items-center gap-3 text-primary-foreground font-raleway font-light tracking-[0.3em] text-sm uppercase"
        >
          Menu
          <span className="flex flex-col gap-1.5">
            <span className="block w-6 h-[1px] bg-primary-foreground" />
            <span className="block w-6 h-[1px] bg-primary-foreground" />
          </span>
        </button>
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
          <nav className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                      className="flex items-center gap-2 text-primary-foreground font-raleway font-light tracking-[0.3em] text-xl uppercase hover:opacity-70 transition-opacity"
                    >
                      {item.label}
                      <ChevronDown size={18} className={`transition-transform ${mobileDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileDropdown === item.label && (
                      <div className="flex flex-col items-center gap-3 mt-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.to}
                            onClick={() => { setMenuOpen(false); setMobileDropdown(null); }}
                            className="text-primary-foreground/80 font-raleway font-light tracking-[0.2em] text-base uppercase hover:opacity-70 transition-opacity"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-primary-foreground font-raleway font-light tracking-[0.3em] text-xl uppercase hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="kaya-btn-outline mt-4"
            >
              Schedule Visit
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
