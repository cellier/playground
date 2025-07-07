import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-10 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-4">Contact</h2>
      <p className="text-gray-600 mb-6">Have a project in mind? Let's work together.</p>
      <a href="mailto:hi@example.com" className="inline-block px-6 py-3 bg-black text-white rounded-md">Say Hello</a>
    </section>
  );
}