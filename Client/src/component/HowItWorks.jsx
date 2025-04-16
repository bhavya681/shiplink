import React, { useEffect, useRef } from 'react';
import { Package, Truck, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Step = ({ number, title, description, icon, position, delay }) => {
  return (
    <div 
      className={cn(
        "flex items-start gap-6 opacity-0",
        position === 'left' ? "animate-slide-right" : "animate-slide-left",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        "flex items-center gap-4",
        position === 'right' && "order-last"
      )}>
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {number}
          </div>
        </div>
      </div>
      <div className={cn(
        "flex-1",
        position === 'right' && "text-right"
      )}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('[class*="animate-slide-"]');
            elements.forEach(el => {
              el.classList.add('opacity-100');
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section id="how-it-works" className="py-20 bg-gray-100/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-medium">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How ShipLink Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes it easy to connect users with local shippers for efficient delivery.
          </p>
        </div>
        
        <div ref={containerRef} className="max-w-4xl mx-auto space-y-16">
          <Step 
            number={1}
            title="List Your Item"
            description="Describe your package with details like size, weight, pickup and delivery locations."
            icon={<Package className="text-blue-600" size={24} />}
            position="left"
            delay={100}
          />
          
          <Step 
            number={2}
            title="Receive Bids"
            description="Local shippers in your area will review your listing and send competitive quotes."
            icon={<CreditCard className="text-blue-600" size={24} />}
            position="right"
            delay={300}
          />
          
          <Step 
            number={3}
            title="Choose a Shipper"
            description="Compare rates, reviews, and estimated delivery times to select the best shipper."
            icon={<CheckCircle2 className="text-blue-600" size={24} />}
            position="left"
            delay={500}
          />
          
          <Step 
            number={4}
            title="Track Your Delivery"
            description="Monitor your package's journey in real-time until it reaches its destination."
            icon={<Truck className="text-blue-600" size={24} />}
            position="right"
            delay={700}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;