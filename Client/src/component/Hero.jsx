import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedShip from './AnimatedShip';

const Hero = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-medium reveal-on-scroll">
              Local Shipping Made Easy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight reveal-on-scroll">
              Connect with <span className="text-blue-600">Local Shippers</span> for Your Delivery Needs
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl reveal-on-scroll">
              ShipLink connects you with trusted local shippers in your area. List your items and get competitive bids for fast, reliable shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal-on-scroll">
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Get Started
                <ArrowRight size={16} />
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                How It Works
              </a>
            </div>
            
            <div className="mt-10 flex items-center gap-4 reveal-on-scroll">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                    <span className="text-xs font-medium">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Trusted by</span> thousands of users and shippers
              </div>
            </div>
          </div>
          
          <div className="lg:pl-10 reveal-on-scroll">
            <AnimatedShip />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;