import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Welcome to Smart Lost & Found!</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">1. User Responsibility</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>You are responsible for the accuracy of any item you post.</li>
                <li>Misuse of the claim process may lead to account suspension.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Posting Guidelines</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Only legitimate found items should be posted.</li>
                <li>Offensive, misleading, or fraudulent content is prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Claim Verification</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>The platform does not guarantee the approval of any claim.</li>
                <li>All approvals are handled manually by the item poster.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Liability</h2>
              <p className="text-gray-600">
                Smart Lost & Found is not liable for any loss, damage, or incorrect item recovery due to misinformation provided by users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Modifications</h2>
              <p className="text-gray-600">
                We reserve the right to update these terms at any time.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              By continuing to use the platform, you acknowledge and accept these terms.
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

export default TermsPage;
