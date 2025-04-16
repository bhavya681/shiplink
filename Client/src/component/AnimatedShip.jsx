import React from 'react';
import { Package, Truck } from 'lucide-react';

const AnimatedShip = () => {
  return (
    <div className="relative w-full h-80 md:h-96 bg-gradient-to-r from-sky-100/50 to-blue-100/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Package className="text-blue-600" size={40} />
        </div>
      </div>
      
      {/* Animated truck */}
      <div className="absolute bottom-8 animate-ship-truck">
        <div className="relative flex items-center">
          <div className="w-16 h-10 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">SHIP</span>
          </div>
          <div className="w-10 h-8 bg-white rounded-r-md border-2 border-blue-600 flex items-center justify-center">
            <Truck className="text-blue-600" size={16} />
          </div>
          <div className="absolute -bottom-4 left-2 w-4 h-4 bg-gray-700 rounded-full animate-spin" />
          <div className="absolute -bottom-4 right-2 w-4 h-4 bg-gray-700 rounded-full animate-spin" />
        </div>
      </div>
      
      {/* Dotted path */}
      <svg className="absolute bottom-10 left-0 w-full" height="4" viewBox="0 0 400 4">
        <line x1="0" y1="2" x2="400" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-blue-600/60" />
      </svg>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500/20 rounded-full animate-float" style={{animationDelay: '0s'}} />
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-indigo-500/40 rounded-full animate-float" style={{animationDelay: '0.5s'}} />
      <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-blue-600/10 rounded-full animate-float" style={{animationDelay: '1s'}} />
      
      {/* Location markers */}
      <div className="absolute top-6 left-10 flex flex-col items-center">
        <div className="w-3 h-3 bg-blue-600 rounded-full mb-1" />
        <div className="text-xs font-medium">Pickup</div>
      </div>
      <div className="absolute top-6 right-10 flex flex-col items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mb-1" />
        <div className="text-xs font-medium">Delivery</div>
      </div>
    </div>
  );
};

export default AnimatedShip;