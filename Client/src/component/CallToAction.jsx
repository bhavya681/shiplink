// import React from 'react';
// import { ArrowRight, Package, TruckIcon } from 'lucide-react';

// const CallToAction = () => {
//   return (
//     <section className="py-20 relative overflow-hidden">
//       {/* Background Decoration */}
//       <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent -z-10"></div>
//       <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full -z-10 transform translate-x-1/2"></div>
      
//       <div className="container mx-auto px-4 md:px-6">
//         <div className="text-center mb-16">
//           <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
//             Join ShipLink Today
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Shipping Experience?</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Join thousands of users and shippers on ShipLink and revolutionize your local shipping experience.
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//           <div className="glass-panel rounded-2xl p-8 hover-scale">
//             <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
//               <Package className="text-primary" size={24} />
//             </div>
//             <h3 className="text-2xl font-semibold mb-4">I Need to Ship Items</h3>
//             <p className="text-muted-foreground mb-6">
//               List your items, receive competitive bids from local shippers, and get your packages delivered quickly and reliably.
//             </p>
//             <a 
//               href="/signup?type=user" 
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-300 w-full"
//             >
//               Sign Up as a User
//               <ArrowRight size={16} />
//             </a>
//           </div>
          
//           <div className="glass-panel rounded-2xl p-8 hover-scale">
//             <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
//               <TruckIcon className="text-primary" size={24} />
//             </div>
//             <h3 className="text-2xl font-semibold mb-4">I Want to Be a Shipper</h3>
//             <p className="text-muted-foreground mb-6">
//               Join our network of trusted shippers, bid on local delivery jobs, and grow your shipping business with ShipLink.
//             </p>
//             <a 
//               href="/signup?type=shipper" 
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-300 w-full"
//             >
//               Sign Up as a Shipper
//               <ArrowRight size={16} />
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CallToAction;

import React from 'react';
import { ArrowRight, Package, TruckIcon } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden ">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-transparent -z-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 rounded-l-full -z-10 transform translate-x-1/2"></div>

      <div className="container mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
            Join ShiftShip Today
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Shipping Experience?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of users and shippers on ShiftShip and revolutionize your local shipping experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* User Card */}
          <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 hover:scale-105 transition-transform duration-300 border border-blue-200">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <Package className="text-blue-600" size={28} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">I Need to Ship Items</h3>
            <p className="text-gray-600 mb-6">
              List your items, receive competitive bids from local shippers, and get your packages delivered quickly and reliably.
            </p>
            <a
              href="/signup?type=user"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full shadow-md"
            >
              Sign Up as a User
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Shipper Card */}
          <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 hover:scale-105 transition-transform duration-300 border border-blue-200">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <TruckIcon className="text-blue-600" size={28} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">I Want to Be a Shipper</h3>
            <p className="text-gray-600 mb-6">
              Join our network of trusted shippers, bid on local delivery jobs, and grow your shipping business with ShiftShip.
            </p>
            <a
              href="/signup?type=shipper"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full shadow-md"
            >
              Sign Up as a Shipper
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
