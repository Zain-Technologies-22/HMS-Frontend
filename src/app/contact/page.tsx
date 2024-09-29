import React from 'react';
import '../globals.css';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <form className="mt-4">
        <label className="block mb-2">
          Name:
          <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" />
        </label>
        <label className="block mb-2">
          Email:
          <input type="email" className="w-full mt-1 p-2 border border-gray-300 rounded" />
        </label>
        <label className="block mb-2">
          Message:
          <textarea className="w-full mt-1 p-2 border border-gray-300 rounded" rows={4}></textarea>
        </label>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;

