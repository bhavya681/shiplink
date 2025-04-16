import React, { useCallback, useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    role: "Small Business Owner",
    content:
      "ShiftShip has transformed how I deliver products to my local customers. Reliable and efficient!",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Professional Shipper",
    content:
      "ShiftShip helped me grow my business by connecting me with more clients in my area.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Thompson",
    role: "Regular User",
    content:
      "I shipped a fragile item with care. Definitely my go-to for local deliveries!",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    rating: 4,
  },
  {
    id: 4,
    name: "David Chen",
    role: "E-commerce Entrepreneur",
    content:
      "ShiftShip reduced our delivery issues by 75%. Customers are happier than ever!",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="relative bg-white rounded-2xl shadow-lg p-8 m-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group isolate">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />
    <Quote className="absolute -top-6 -right-6 w-32 h-32 text-blue-50/50 transition-opacity duration-300 group-hover:text-blue-100/30" />
    <div className="flex items-center gap-5 mb-6">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-sm"
      />
      <div>
        <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
          className={`${
            i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
          } mr-1 transition-transform duration-200 hover:scale-125`}
          fill={i < testimonial.rating ? "currentColor" : "none"}
        />
      ))}
    </div>
    <p className="text-gray-600 leading-relaxed mb-6">{testimonial.content}</p>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const totalSlides = testimonials.length;
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/30 to-white/50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community about their transformative experiences with
            ShiftShip
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-8"
            style={{
              transform: `translateX(-${
                (currentIndex % totalSlides) * (100 / slidesPerView)
              }%)`,
              width: `${(totalSlides / slidesPerView) * 100}%`,
            }}
            ref={sliderRef}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="min-w-full sm:min-w-[50%] md:min-w-[33.33%]"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
          >
            <ChevronLeft size={24} className="text-blue-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex % totalSlides === idx
                    ? "bg-blue-600 w-8"
                    : "bg-blue-200 w-4"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
          >
            <ChevronRight size={24} className="text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
