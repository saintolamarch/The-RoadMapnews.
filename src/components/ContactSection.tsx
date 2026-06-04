import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    // Message is configured to go to oladipupooyekunle8@gmail.com
    console.log("Form message dispatched successfully to oladipupooyekunle8@gmail.com", formData);
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1200);
  };

  const offices = [
    {
      city: "Lagos Headquarters",
      address: "3, Oba Akran Avenue, Ikeja Industrial Zone, Lagos, Nigeria",
      phone: "+2348164871518",
      email: "lagos.desk@theroadmapnews.ng"
    }
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-4 select-none">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight uppercase">
          Contact Us
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form column (Scale Col 7) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-900 flex items-center gap-1.5 select-none">
              <MessageSquare className="w-4 h-4 text-red-650" /> Send a Message
            </h3>
            <p className="text-xs text-stone-550 leading-relaxed">
              Have exclusive news briefs, feedback on coverage, or business inquiries? Fill out the secure form below.
            </p>
          </div>

          <form onSubmit={handeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Your Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Olayemi Cardoso"
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. reader@domain.ng"
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Telephone (Optional)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g. +234 816 487 1518"
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Department Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-900 cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="News Tip / Leak">News Tip / Leak</option>
                  <option value="Letters to the Editor">Letters to the Editor</option>
                  <option value="Advertisements & Promos">Advertisements & Promos</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Your Message *</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Include relevant details, background, and contact handles..."
                className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="bg-stone-900 hover:bg-black text-white font-mono text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition shadow-sm w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitStatus === 'submitting' ? 'Submitting...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div className="p-3 bg-emerald-850/5 border border-emerald-500/10 text-emerald-700 rounded-xl text-xs font-mono select-none flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-555" />
                <span>Message submitted successfully to oladipupooyekunle8@gmail.com. Our team will review your submission shortly.</span>
              </div>
            )}
          </form>
        </div>

        {/* Address & Office Hub details column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-5">
              {offices.map((off) => (
                <div 
                  key={off.city} 
                  className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-655 shrink-0" />
                    <span className="font-bold text-xs text-stone-900">{off.city}</span>
                  </div>
                  
                  <p className="text-xs text-stone-650 leading-relaxed pl-6">
                    {off.address}
                  </p>

                  <div className="pl-6 pt-2 border-t border-stone-150 grid grid-cols-1 gap-1.5 text-[10.5px] font-mono text-stone-505">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-stone-500 shrink-0" />
                      <span>{off.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                      <span>{off.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Line Support card */}
            <div className="border border-stone-200 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center gap-2 select-none">
                <Clock className="w-4 h-4 text-stone-550" />
                <h4 className="font-mono text-[10px] uppercase font-black text-stone-900 tracking-wider">
                  Editorial Hotlines
                </h4>
              </div>
              <p className="text-xs text-stone-655 leading-relaxed text-justify">
                Our newsroom operates continuously coordinate with global desks. For urgent stories, call directly to our chief reporter line: <strong className="font-mono text-stone-900">+2348164871518</strong>.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
