import React, { useEffect, useRef } from "react";
import {
  MapPin,
  Clock,
  Shield,
  Zap,
  Truck,
  UserCheck,
  BadgeCheck,
  Wallet,
} from "lucide-react";

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div
      className="relative bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-6 opacity-0 scale-90 transition-all duration-500 ease-out"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center shadow-md mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2 leading-relaxed">{description}</p>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".scale-90");
            elements.forEach((el) => {
              el.classList.remove("scale-90", "opacity-0");
              el.classList.add("scale-100", "opacity-100");
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

  const features = [
    {
      icon: <MapPin size={26} />,
      title: "Local Shipping",
      description:
        "Connect with shippers in your area for faster and more cost-effective delivery.",
    },
    {
      icon: <Clock size={26} />,
      title: "Real-Time Tracking",
      description:
        "Monitor your package's journey from pickup to delivery with live updates.",
    },
    {
      icon: <Shield size={26} />,
      title: "Secure Payments",
      description:
        "Our secure payment system protects both users and shippers throughout the process.",
    },
    {
      icon: <Zap size={26} />,
      title: "Instant Bidding",
      description:
        "Receive competitive bids from local shippers within minutes of listing your item.",
    },
    {
      icon: <Truck size={26} />,
      title: "Flexible Delivery",
      description:
        "Choose from various delivery options based on your timeframe and budget.",
    },
    {
      icon: <UserCheck size={26} />,
      title: "Verified Shippers",
      description:
        "All shippers on our platform are thoroughly vetted for reliability and professionalism.",
    },
    {
      icon: <BadgeCheck size={26} />,
      title: "Quality Assurance",
      description:
        "Our rating system ensures you receive high-quality service every time.",
    },
    {
      icon: <Wallet size={26} />,
      title: "Transparent Pricing",
      description:
        "No hidden fees. See exactly what you'll pay before confirming a shipper.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <span className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium tracking-wide">
            🚀 Why Choose Us?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Shipping Made Easy
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a seamless and efficient way to connect with trusted
            shippers. Experience fast, secure, and flexible delivery solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
