export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              At Ogaal ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Somaliland Water Intelligence Platform.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By using our platform, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-medium text-slate-900 mb-3">Personal Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may collect personally identifiable information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Name and contact information</li>
              <li>Location data for water source reporting</li>
              <li>Communication preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium text-slate-900 mb-3">Usage Data</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>IP address and location information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Device information</li>
              <li>Referral sources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small data files stored on your device.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform to improve services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              You can control cookies through your browser settings. However, disabling certain cookies may affect platform functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>To provide and maintain our water monitoring services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information for improving our platform</li>
              <li>To monitor the usage of our platform</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To provide you with news and general information about water resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>With service providers who assist us in operating our platform</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights or property</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our platform may contain links to third-party websites or services that are not owned or controlled by us. This Privacy Policy does not apply to these third-party services.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We strongly advise you to review the privacy policies of any third-party services you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p className="text-slate-700 leading-relaxed">
              When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate information</li>
              <li>The right to erase your personal information</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <p className="text-slate-700">Email: privacy@ogaal.org</p>
              <p className="text-slate-700">Address: Somaliland Water Intelligence Platform</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}