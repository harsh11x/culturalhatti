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
        'Something went wrong. Try again or email culturehatti@gmail.com';
      setErrMsg(msg);
    }
  };

  return (
    <main className="flex-grow w-full bg-background-light min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-4">Contact Us</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-8">
          Message us below or email{' '}
          <a href="mailto:culturehatti@gmail.com" className="text-primary hover:underline">
            culturehatti@gmail.com
          </a>
        </p>

        {status === 'ok' && (
          <div className="mb-6 p-4 border-3 border-black bg-primary/20 font-bold text-sm">Thank you — we will reply soon.</div>
        )}
        {status === 'err' && errMsg && (
          <div className="mb-6 p-4 border-3 border-black bg-red-100 text-sm">{errMsg}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2">Name</label>
            <input
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-black px-4 py-3 font-bold focus:ring-0 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-black px-4 py-3 font-bold focus:ring-0 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2">Phone (optional)</label>
            <input
              type="tel"
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border-2 border-black px-4 py-3 font-bold focus:ring-0 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2">Message</label>
            <textarea
              required
              minLength={10}
              maxLength={8000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border-2 border-black px-4 py-3 font-bold focus:ring-0 focus:border-primary resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-black text-background-light px-8 py-4 font-black uppercase tracking-widest border-3 border-black hover:bg-primary hover:text-black transition-colors disabled:opacity-50 brutalist-shadow"
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>

        <Link href="/" className="inline-block mt-10 text-sm font-black uppercase tracking-widest border-b-2 border-black hover:text-primary">
          ← Home
        </Link>
      </div>
    </main>
  );
}
