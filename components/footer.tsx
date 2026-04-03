"use client"

export function Footer() {
  return (
    <footer className="bg-[#2d3436] text-white">
      {/* Map Section */}
      <div className="w-full h-64 md:h-80 bg-muted relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.8028915947893!2d-99.1332049!3d19.3122945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0165f06f0001%3A0x7e5e8c3a5b7f5c8d!2sVilla%20Coapa%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1699999999999!5m2!1ses!2smx"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Paradisaea"
        />
      </div>

      {/* Bottom Bar */}
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
            {["Home", "Privacy Policy", "FAQ", "Contact Us"].map((link, index) => (
              <span key={link} className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {link}
                </a>
                {index < 3 && <span className="text-white/30">|</span>}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-white/50 text-xs">
              Copyright 2026 All Right Reserved
            </p>
            <p className="text-white/50 text-xs">
              Colibrí Visual
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
