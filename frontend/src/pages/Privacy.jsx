import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Your privacy matters to us at Smart Lost & Found.</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Name, email address, phone number, and user-submitted item descriptions.</li>
                <li>Data is collected only for identification and communication purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">2. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>To verify ownership or found item claims.</li>
                <li>To send email notifications related to your account or claims.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Data Protection</h2>
              <p className="text-gray-600">
                Your information is stored securely and never shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Cookies & Analytics</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>We may use cookies to improve your browsing experience.</li>
                <li>No sensitive personal data is stored in cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Your Rights</h2>
              <p className="text-gray-600">
                You may request your data to be updated or removed at any time by contacting our support.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              If you have any questions about our policies, please reach out via email at{' '}
              <a 
                href="mailto:abinashparida2021@gmail.com" 
                className="text-blue-600 hover:underline"
              >
                abinashparida2021@gmail.com
              </a>.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
