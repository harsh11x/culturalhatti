export default function ReturnsPolicyPage() {
  return (
    <div className="w-full bg-background-light min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="border-3 border-black bg-white p-8 md:p-12 brutalist-shadow">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-6">
            Return & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
            Last Updated: March 1, 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">1. Return Window</h2>
              <div className="bg-primary/10 border-2 border-primary p-6 mb-4">
                <p className="font-bold text-lg mb-2">Return Period</p>
                <p className="text-2xl font-black">15 Days</p>
                <p className="text-sm mt-2">From the date of delivery</p>
              </div>
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return eligible items within 15 days of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">2. Eligibility for Returns</h2>
              <p className="mb-4">To be eligible for a return, items must meet the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Item must be unused, unworn, and in the same condition as received</li>
                <li>Item must be in its original packaging with all tags attached</li>
                <li>Item must not be altered, damaged, or soiled</li>
                <li>Return must be initiated within 15 days of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">3. Non-Returnable Items</h2>
              <p className="mb-4">The following items cannot be returned or exchanged:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Customized or personalized products</li>
                <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                <li>Intimate apparel and innerwear for hygiene reasons</li>
                <li>Products with broken seals or tampered packaging</li>
                <li>Gift cards and vouchers</li>
                <li>Items damaged due to misuse or negligence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">4. How to Initiate a Return</h2>
              <p className="mb-4">To return an item, please follow these steps:</p>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-bold mb-2">Step 1: Contact Us</p>
                  <p>Email us at returns@culturalhatti.com or call our customer support with your order number and reason for return.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-bold mb-2">Step 2: Return Authorization</p>
                  <p>Our team will review your request and provide you with a Return Authorization Number (RAN) and return instructions.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-bold mb-2">Step 3: Pack the Item</p>
                  <p>Securely pack the item in its original packaging with all tags and accessories. Include the RAN in the package.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-bold mb-2">Step 4: Ship the Return</p>
                  <p>We will arrange for pickup or provide you with a return shipping label. Keep the tracking information for your records.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">5. Return Shipping</h2>
              <p className="mb-4">
                <strong>Free Return Pickup:</strong> We offer free return pickup for most locations across India. Our courier partner will collect the package from your address at no additional cost.
              </p>
              <p>
                For areas where pickup is not available, you may need to ship the item back to us. In such cases, we will provide you with the return address and may reimburse standard shipping costs upon receipt of the returned item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">6. Refund Processing</h2>
              <div className="bg-primary/10 border-2 border-primary p-6 mb-4">
                <p className="font-bold text-lg mb-2">Refund Timeline</p>
                <p className="text-2xl font-black">15 Working Days</p>
                <p className="text-sm mt-2">From the date we receive your returned item</p>
              </div>
              <p className="mb-4">Once we receive and inspect your returned item:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will send you an email confirmation acknowledging receipt of the return</li>
                <li>If the return is approved, your refund will be processed within 15 working days</li>
                <li>The refund will be credited to your original payment method</li>
                <li>Depending on your bank or payment provider, it may take an additional 5-7 business days for the refund to reflect in your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">7. Refund Method</h2>
              <p className="mb-4">
                Refunds will be processed to the <strong>original payment source</strong> used for the purchase:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Credit/Debit Card:</strong> Refunded to the same card</li>
                <li><strong>Net Banking:</strong> Refunded to the same bank account</li>
                <li><strong>UPI:</strong> Refunded to the linked account</li>
                <li><strong>Digital Wallet:</strong> Refunded to the same wallet</li>
              </ul>
              <p className="mt-4">
                We do not offer cash refunds or refunds to a different payment method than the one used for the original purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">8. Exchanges</h2>
              <p>
                If you would like to exchange an item for a different size, color, or product, please initiate a return for the original item and place a new order for the desired item. This ensures faster processing and availability of your preferred choice.
              </p>
              <p className="mt-4">
                Alternatively, you can contact our customer support team, and we will assist you with the exchange process if the desired item is in stock.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">9. Damaged or Defective Items</h2>
              <p className="mb-4">
                If you receive a damaged or defective item:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact us within 48 hours of delivery</li>
                <li>Provide photos of the damaged/defective item and packaging</li>
                <li>We will arrange for immediate pickup and provide a replacement or full refund</li>
                <li>No return shipping charges will apply for damaged or defective items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">10. Wrong Item Received</h2>
              <p>
                If you receive an incorrect item, please contact us immediately. We will arrange for pickup of the wrong item and ship the correct item to you at no additional cost. If the correct item is not available, we will process a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">11. Partial Refunds</h2>
              <p className="mb-4">
                In certain situations, only partial refunds may be granted:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items with obvious signs of use or wear</li>
                <li>Items returned without original packaging or tags</li>
                <li>Items damaged due to customer negligence</li>
                <li>Items returned after 15 days of delivery (at our discretion)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">12. Cancellations</h2>
              <p className="mb-4">
                <strong>Before Shipment:</strong> You can cancel your order before it is shipped by contacting our customer support. A full refund will be processed within 5-7 business days.
              </p>
              <p>
                <strong>After Shipment:</strong> Once the order is shipped, you cannot cancel it. However, you can refuse delivery or initiate a return once you receive the item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">13. Contact Us</h2>
              <p>
                For any questions or concerns regarding returns and refunds, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 border-2 border-black">
                <p className="font-bold">Cultural Hatti Returns Department</p>
                <p>Email: customercare@culturalhatti.com</p>
                <p>Hours: Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
