// component/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import "./Home.css";
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';

const Home = () => {
  return (<>
<Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CallToAction />
    </>
  );
};

export default Home;