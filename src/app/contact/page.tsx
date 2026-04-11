'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    try {
      await api.post('/contact', { name, email, phone: phone || undefined, message });
      setStatus('ok');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: unknown) {
      setStatus('err');
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong. Please try again or email us directly.';
      setErrMsg(msg);
    }
  };

  return (
    <main className="w-full bg-background-light min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16 md:py-24">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary mb-3 font-medium">संपर्क • Contact</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-background-dark mb-4">Contact Us</h1>
        <p className="font-body text-sm text-gray-600 mb-10 leading-relaxed">
          Questions about an order, a product, or shipping? Send a message below — it goes straight to our team. You can
          also email{' '}
          <a href="mailto:culturehatti@gmail.com" className="text-primary font-semibold hover:underline">
            culturehatti@gmail.com
          </a>
          .
        </p>

        {status === 'ok' && (
          <div className="mb-8 p-4 border border-primary/40 bg-primary/10 font-body text-sm text-background-dark">
            Thank you. We have received your message and will get back to you soon.
          </div>
        )}
        {status === 'err' && errMsg && (
          <div className="mb-8 p-4 border border-red-300 bg-red-50 font-body text-sm text-red-900">{errMsg}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-6 font-body">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">
              Name
            </label>
            <input
              id="contact-name"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-background-dark/20 px-4 py-3 text-sm focus:ring-0 focus:border-primary transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-background-dark/20 px-4 py-3 text-sm focus:ring-0 focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">
              Phone <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-background-dark/20 px-4 py-3 text-sm focus:ring-0 focus:border-primary transition-colors"
              placeholder="10-digit mobile"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              minLength={10}
              maxLength={8000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-background-dark/20 px-4 py-3 text-sm focus:ring-0 focus:border-primary transition-colors resize-y"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-background-dark font-semibold uppercase tracking-[0.2em] text-sm hover:bg-accent transition-colors disabled:opacity-60 luxury-shadow"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>

        <p className="mt-12 font-body text-sm text-gray-500">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
