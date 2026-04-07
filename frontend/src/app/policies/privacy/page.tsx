export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-background-light min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="border-3 border-black bg-white p-8 md:p-12 brutalist-shadow">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
            Last Updated: March 1, 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">1. Information We Collect</h2>
              <p className="mb-4">
                At Cultural Hatti, we collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account or make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer service team</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="mt-4">
                This information may include your name, email address, phone number, shipping address, billing address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, shipping companies, and other service providers who assist us in operating our business</li>
                <li><strong>Legal Compliance:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">7. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 border-2 border-black">
                <p className="font-bold">Cultural Hatti</p>
                <p>Email: customercare@culturalhatti.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
