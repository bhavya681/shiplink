import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t-blue-500 shadow-2xl shadow-blue-400 bg-gradient-to-b from-white to-white text-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <span className="font-bold text-white text-xl">S</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  ShipLink
                </span>
              </a>
            </div>
            <p className="text-gray-900 mb-6 leading-relaxed">
              Revolutionizing local logistics through seamless connections and smart solutions.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-blue-300 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {['Company', 'Support'].map((title, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
              <ul className="space-y-3">
                {Array(5).fill().map((_, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="flex items-center text-gray-700 hover:text-blue-700 transition-colors group"
                    >
                      <span className="w-2 h-2 bg-blue-700 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {title} Link {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-400" size={16} />
                </div>
                <p className="text-gray-800 leading-relaxed">
                  123 Logistics Parkway<br />
                  Suite 450<br />
                  Delivery City, SC 12345
                </p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-blue-400" size={16} />
                </div>
                <a href="tel:1234567890" className="text-gray-800 hover:text-blue-800 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-400" size={16} />
                </div>
                <a href="mailto:hello@shiplink.com" className="text-gray-800 hover:text-blue-400 transition-colors">
                  hello@shiplink.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-400 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-700 text-sm">
            &copy; {new Date().getFullYear()} ShipLink. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="#" className="text-gray-800 hover:text-blue-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-800 hover:text-blue-800 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-800 hover:text-blue-800 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;