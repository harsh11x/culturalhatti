export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-background-light min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="border-3 border-black bg-white p-8 md:p-12 brutalist-shadow">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-6">
            Shipping Policy
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
            Last Updated: March 1, 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">1. Shipping Coverage</h2>
              <p>
                Cultural Hatti offers <strong>FREE SHIPPING</strong> across all of India. We currently ship to all serviceable pin codes within India. International shipping is not available at this time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">2. Processing Time</h2>
              <p>
                Orders are processed within 1-2 business days (excluding weekends and public holidays) after payment confirmation. You will receive an order confirmation email once your order has been placed, and a shipping confirmation email with tracking information once your order has been dispatched.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">3. Delivery Time</h2>
              <div className="bg-primary/10 border-2 border-primary p-6 mb-4">
                <p className="font-bold text-lg mb-2">Standard Delivery Timeline</p>
                <p className="text-2xl font-black">7 Working Days</p>
                <p className="text-sm mt-2">From the date of shipment</p>
              </div>
              <p className="mb-4">
                Please note that delivery times may vary depending on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your location and pin code serviceability</li>
                <li>Weather conditions and natural calamities</li>
                <li>Political disruptions or strikes</li>
                <li>Peak season volumes (festivals, sales events)</li>
                <li>Courier partner delays beyond our control</li>
              </ul>
              <p className="mt-4">
                We strive to deliver your order within the estimated timeframe, but these are approximate delivery times and not guaranteed delivery dates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">4. Order Tracking</h2>
              <p>
                Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Logging into your Cultural Hatti account and viewing your order history</li>
                <li>Using the tracking link provided in the shipping confirmation email</li>
                <li>Contacting our customer support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">5. Shipping Partners</h2>
              <p>
                We partner with reliable courier services to ensure safe and timely delivery of your orders. Our shipping partners include reputed national and regional courier companies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">6. Delivery Address</h2>
              <p className="mb-4">
                Please ensure that you provide a complete and accurate shipping address with the following details:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name of the recipient</li>
                <li>Complete street address with house/flat number</li>
                <li>Landmark (if applicable)</li>
                <li>City, State, and Pin Code</li>
                <li>Contact phone number</li>
              </ul>
              <p className="mt-4">
                Cultural Hatti is not responsible for delays or non-delivery due to incorrect or incomplete address information provided by the customer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">7. Failed Delivery Attempts</h2>
              <p>
                Our courier partners will make up to 3 delivery attempts. If delivery fails after all attempts due to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Recipient not available</li>
                <li>Incorrect address</li>
                <li>Refusal to accept delivery</li>
                <li>Premises locked</li>
              </ul>
              <p className="mt-4">
                The order will be returned to us. In such cases, the customer may be charged for return shipping costs if they wish to have the order reshipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">8. Damaged or Lost Shipments</h2>
              <p className="mb-4">
                We take great care in packaging your orders. However, if you receive a damaged package or if your order is lost in transit:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For damaged packages: Do not accept the delivery and inform our customer support immediately</li>
                <li>If you've already accepted: Take photos of the damaged package and product, and contact us within 24 hours</li>
                <li>For lost shipments: Contact us if your order hasn't arrived within 10 working days of shipment</li>
              </ul>
              <p className="mt-4">
                We will investigate the issue with our shipping partner and provide a replacement or full refund as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">9. Order Modifications</h2>
              <p>
                Once an order is placed, you have a limited window to modify or cancel it. Please contact our customer support immediately if you need to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Change the delivery address</li>
                <li>Cancel the order</li>
                <li>Modify order items</li>
              </ul>
              <p className="mt-4">
                Once the order has been dispatched, address changes may not be possible. In such cases, you may need to refuse delivery and place a new order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">10. Customs and Duties</h2>
              <p>
                As we currently ship only within India, there are no customs duties or international taxes applicable to your orders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase mb-4 text-primary">11. Contact Us</h2>
              <p>
                For any shipping-related queries or concerns, please contact our customer support team:
              </p>
              <div className="mt-4 p-4 bg-gray-50 border-2 border-black">
                <p className="font-bold">Cultural Hatti Customer Support</p>
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
