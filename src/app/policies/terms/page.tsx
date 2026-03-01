export default function TermsAndConditionsPage() {
  return (
    <div className="w-full bg-background-light min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="border-3 border-black bg-white p-8 md:p-12 brutalist-shadow">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-6">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
            Last Updated: March 1, 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Cultural Hatti website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">2. Use of Website</h2>
              <p className="mb-4">You agree to use our website only for lawful purposes and in a way that does not infringe upon the rights of others. You must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Engage in any activity that disrupts or interferes with our services</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">3. Product Information</h2>
              <p>
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">4. Pricing and Payment</h2>
              <p className="mb-4">
                All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We accept payment through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credit/Debit Cards</li>
                <li>Net Banking</li>
                <li>UPI</li>
                <li>Digital Wallets</li>
              </ul>
              <p className="mt-4">
                Payment must be received in full before order processing. We reserve the right to refuse or cancel any order for any reason, including pricing errors or suspected fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">5. Order Processing</h2>
              <p>
                Once your order is placed and payment is confirmed, you will receive an order confirmation email. Order processing typically takes 1-2 business days. We will notify you when your order has been shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">6. Shipping Policy</h2>
              <p>
                We offer free shipping across India. Orders are typically delivered within 7 working days from the date of shipment. Delivery times may vary based on location and other factors beyond our control. For detailed information, please refer to our <a href="/policies/shipping" className="text-primary underline font-bold">Shipping Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">7. Returns and Refunds</h2>
              <p>
                We accept returns within 15 days of delivery for eligible products. Refunds will be processed within 15 working days to the original payment source. For complete details, please review our <a href="/policies/returns" className="text-primary underline font-bold">Return & Refund Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">8. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of Cultural Hatti and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">9. User Accounts</h2>
              <p>
                When you create an account, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Cultural Hatti shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our website or services. Our total liability shall not exceed the amount paid by you for the product or service in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Cultural Hatti, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">12. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">14. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at:
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
