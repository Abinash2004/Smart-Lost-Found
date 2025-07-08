import { Link } from 'react-router-dom';
import { FaShieldAlt, FaDatabase, FaCookieBite, FaUserShield, FaEnvelope } from 'react-icons/fa';

const sections = [{
  icon: <FaDatabase className="w-5 h-5 text-neutral-400" />,
  title: "1. Information We Collect",
  items: [
    "Name, email address, phone number, and user-submitted item descriptions.",
    "Data is collected only for identification and communication purposes.",
    "Location data may be collected when submitting found items to assist in recovery."
  ]
}, {
  icon: <FaShieldAlt className="w-5 h-5 text-neutral-400" />,
  title: "2. How We Use Your Data",
  items: [
    "To verify ownership or found item claims.",
    "To send email notifications related to your account or claims.",
    "To improve our services and user experience."
  ]
}, {
  icon: <FaUserShield className="w-5 h-5 text-neutral-400" />,
  title: "3. Data Protection",
  content: "Your information is stored securely using industry-standard encryption and never shared with third parties except as required by law or with your explicit consent."
}, {
  icon: <FaCookieBite className="w-5 h-5 text-neutral-400" />,
  title: "4. Cookies & Analytics",
  items: [
    "We use essential cookies for site functionality.",
    "Analytics cookies help us understand how users interact with our platform.",
    "No sensitive personal data is stored in cookies.",
    "You can manage cookie preferences in your browser settings."
  ]
}, {
  icon: <FaEnvelope className="w-5 h-5 text-neutral-400" />,
  title: "5. Your Rights",
  content: "You have the right to access, correct, or delete your personal data at any time. For any privacy-related inquiries, please contact our Data Protection Officer at the email below."
}];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-700">
          <div className="bg-neutral-900 px-6 py-5 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-neutral-700"><FaShieldAlt className="w-6 h-6 text-neutral-200" /></div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-100">Privacy Policy</h1>
                <p className="text-neutral-400 mt-1">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-neutral-300 mb-8 leading-relaxed">
              At Smart Lost & Found, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="space-y-10">
              {sections.map(({ icon, title, items, content }, i) => (
                <section key={i} className="group">
                  <div className="flex items-start space-x-4">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200 mt-1">{icon}</span>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-neutral-100 mb-3">{title}</h2>
                      {items ? (
                        <ul className="space-y-2 text-neutral-300">
                          {items.map((item, i) => (
                            <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-500">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-neutral-300 leading-relaxed">{content}</p>}
                    </div>
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-700">
              <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                <p className="text-center text-neutral-300">
                  If you have any questions about our privacy practices, please contact us at{' '}
                  <a href="mailto:abinashparida2021@gmail.com" className="font-medium text-neutral-100 hover:text-white hover:underline">
                    abinashparida2021@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900 px-6 py-4 border-t border-neutral-700 text-center">
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:underline transition-colors duration-200">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
