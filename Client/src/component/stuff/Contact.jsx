import React from 'react';
import "./stuff.css";

const Contact = () => {
  return (
    <section className="contact">
      <h1>Contact Us</h1>
      <form className="contact-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea placeholder="Write your message"></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default Contact;
