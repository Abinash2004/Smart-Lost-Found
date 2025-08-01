import { Link } from 'react-router-dom';
import { FaGavel, FaEdit, FaCheckCircle, FaShieldAlt, FaSync } from 'react-icons/fa';

// Map of icon components
const iconComponents = {
  gavel: { component: FaGavel, className: 'w-5 h-5 text-neutral-400' },
  edit: { component: FaEdit, className: 'w-5 h-5 text-neutral-400' },
  checkCircle: { component: FaCheckCircle, className: 'w-5 h-5 text-neutral-400' },
  shield: { component: FaShieldAlt, className: 'w-5 h-5 text-neutral-400' },
  sync: { component: FaSync, className: 'w-5 h-5 text-neutral-400' },
};

const sections = [{
  icon: 'gavel',
  title: "1. User Responsibility",
  items: [
    "You are responsible for the accuracy of any item you post.",
    "Misuse of the claim process may lead to account suspension."
  ]
}, {
  icon: 'edit',
  title: "2. Posting Guidelines",
  items: [
    "Only legitimate found items should be posted.",
    "Offensive, misleading, or fraudulent content is prohibited."
  ]
}, {
  icon: 'checkCircle',
  title: "3. Claim Verification",
  items: [
    "The platform does not guarantee the approval of any claim.",
    "All approvals are handled manually by the item poster."
  ]
}, {
  icon: 'shield',
  title: "4. Liability",
  content: "Smart Lost & Found is not liable for any loss, damage, or incorrect item recovery due to misinformation provided by users."
}, {
  icon: 'sync',
  title: "5. Modifications",
  content: "We reserve the right to update these terms at any time."
}];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-700">
          <div className="bg-neutral-900 px-6 py-5 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-neutral-700"><FaGavel className="w-6 h-6 text-neutral-200" /></div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-100">Terms & Conditions</h1>
                <p className="text-neutral-400 mt-1">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-neutral-300 mb-8 leading-relaxed">Welcome to Smart Lost & Found! These terms and conditions outline the rules and regulations for using our platform.</p>
            <div className="space-y-10">
              {sections.map((section, index) => {
                const { component: Icon, className } = iconComponents[section.icon] || { component: FaGavel, className: 'w-5 h-5 text-neutral-400' };
                return (
                  <div key={index} className="mb-8 last:mb-0">
                    <div className="flex items-start mb-3">
                      <div className="flex-shrink-0 mr-3">
                        <Icon className={className} />
                      </div>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    </div>
                    {section.items ? (
                      <ul className="space-y-2 text-neutral-300">
                        {section.items.map((item, i) => (
                          <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-500">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-neutral-300 leading-relaxed">{section.content}</p>}
                  </div>
                );
              })}
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-700">
              <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                <p className="text-center text-neutral-300">
                  By continuing to use the platform, you acknowledge and accept these terms.
                  If you have any questions, please contact us at{' '}
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

export default TermsPage;
