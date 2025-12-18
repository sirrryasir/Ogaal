import Footer from "../../components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="py-12 px-4 flex-1">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing and using the Somaliland Water Intelligence Platform ("the Platform") provided by Ogaal ("we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-slate-700 leading-relaxed">
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Use License</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials (information or software) on the Platform for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Accounts</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <p className="text-slate-700 leading-relaxed">
              You agree not to disclose your password to any third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Content</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our Platform may allow you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content").
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              You are responsible for Content that you post to the Platform, including its legality, reliability, and appropriateness.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By posting Content to the Platform, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Prohibited Uses</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You may not use our Platform:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Water Source Reporting</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Users may report conditions of water sources through the Platform. All reports must be accurate and made in good faith.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to verify reported information and may remove or modify reports that appear inaccurate or violate these terms.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Users should not rely solely on Platform data for critical decisions regarding water safety or availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The information on this Platform is provided on an 'as is' basis. To the fullest extent permitted by law, we:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Exclude all representations and warranties relating to this website and its contents</li>
              <li>Exclude all liability for damages arising out of or in connection with your use of this website</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              The Platform provides water intelligence data for informational purposes only and should not be considered professional advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitations</h2>
            <p className="text-slate-700 leading-relaxed">
              In no event shall Ogaal or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Platform, even if Ogaal or our authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Accuracy of Materials</h2>
            <p className="text-slate-700 leading-relaxed">
              The materials appearing on the Platform could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its Platform are accurate, complete, or current. We may make changes to the materials contained on its Platform at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Modifications</h2>
            <p className="text-slate-700 leading-relaxed">
              We may revise these terms of service for the Platform at any time without notice. By using this Platform, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Somaliland, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <p className="text-slate-700">Email: legal@ogaal.org</p>
              <p className="text-slate-700">Address: Somaliland Water Intelligence Platform</p>
            </div>
          </section>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}