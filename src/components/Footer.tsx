import { Link } from "react-router-dom";
import KayaLogo from "./KayaLogo";
import { Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Properties", to: "/properties" },
  { label: "Off Plan", to: "/offplan" },
  { label: "Services", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  { label: "Facebook", url: "https://www.facebook.com/kayarealestate.ae" },
  { label: "Instagram", url: "https://www.instagram.com/kayarealestate/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/kaya-real-estate/" },
  { label: "YouTube", url: "https://www.youtube.com/@kayarealestate" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-kaya-olive text-primary-foreground">
      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo & About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <KayaLogo className="w-10 h-10 text-primary-foreground" />
              <span className="font-raleway font-light tracking-[0.4em] text-lg">KAYA</span>
            </Link>
            <p className="font-raleway font-light text-sm leading-relaxed opacity-80">
              Kaya Real Estate is a trusted real estate brokerage firm based in Dubai, UAE.
              We specialize in luxury residential and commercial properties across the emirate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-raleway font-medium tracking-[0.2em] text-sm uppercase mb-6">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-raleway font-light text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-raleway font-medium tracking-[0.2em] text-sm uppercase mb-6">
              Contact Us
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="opacity-80 mt-0.5 shrink-0" />
                <p className="font-raleway font-light text-sm opacity-80 leading-relaxed">
                  Office 1404, Aspect Tower,<br />
                  Business Bay, Dubai, UAE
                </p>
              </div>
              <a href="tel:+97142SEQ1234" className="flex items-center gap-3 font-raleway font-light text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={16} className="shrink-0" />
                +971 4 252 7575
              </a>
              <a href="mailto:info@kayarealestate.ae" className="flex items-center gap-3 font-raleway font-light text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Mail size={16} className="shrink-0" />
                info@kayarealestate.ae
              </a>
            </div>
          </div>

          {/* Map + Social */}
          <div>
            <h3 className="font-raleway font-medium tracking-[0.2em] text-sm uppercase mb-6">
              Find Us
            </h3>
            <div className="w-full h-40 mb-6 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.168!2d55.2644!3d25.1865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzExLjQiTiA1NcKwMTUnNTEuOCJF!5e0!3m2!1sen!2sae!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kaya Real Estate Office Location"
              />
            </div>
            <div className="flex gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway font-light text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wider"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-raleway font-light text-xs opacity-60">
            © {new Date().getFullYear()} Kaya Real Estate. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="font-raleway font-light text-xs opacity-60 hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link to="/contact" className="font-raleway font-light text-xs opacity-60 hover:opacity-100 transition-opacity">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
