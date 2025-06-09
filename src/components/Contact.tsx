import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }

    // Reset status after 3 seconds
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'omry@visigence.com',
      href: 'mailto:omry@visigence.com'
    }
  ];

  return (
    <section id="contact" className="py-24 lg:py-40 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-orbitron font-black text-gradient mb-8 leading-tight tracking-tighter">
            LET'S CONNECT
          </h2>
          <p className="text-xl text-slate-300 max-w-text-content mx-auto leading-relaxed tracking-wide">
            Ready to transform your digital vision into reality? 
            Let's discuss your next groundbreaking project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h3 className="text-2xl font-orbitron font-bold text-white mb-8 tracking-tight">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <label htmlFor="name" className="block text-slate-300 font-medium mb-3 tracking-wide">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 glass-strong rounded-lg border border-white/10 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 bg-transparent text-white placeholder-slate-400 transition-all duration-300 tracking-wide"
                  placeholder="Your Name"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <label htmlFor="email" className="block text-slate-300 font-medium mb-3 tracking-wide">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 glass-strong rounded-lg border border-white/10 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 bg-transparent text-white placeholder-slate-400 transition-all duration-300 tracking-wide"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Subject */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <label htmlFor="subject" className="block text-slate-300 font-medium mb-3 tracking-wide">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 glass-strong rounded-lg border border-white/10 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 bg-transparent text-white placeholder-slate-400 transition-all duration-300 tracking-wide"
                  placeholder="Project Discussion"
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <label htmlFor="message" className="block text-slate-300 font-medium mb-3 tracking-wide">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 glass-strong rounded-lg border border-white/10 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 bg-transparent text-white placeholder-slate-400 transition-all duration-300 resize-none tracking-wide leading-relaxed"
                  placeholder="Tell me about your project vision..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-4 glass-strong px-10 py-5 rounded-lg neon-glow-accent hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white font-medium tracking-wide">Sending...</span>
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium tracking-wide">Message Sent!</span>
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium tracking-wide">Failed to Send</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-accent-400" />
                      <span className="text-white font-medium tracking-wide">Send Message</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h3 className="text-2xl font-orbitron font-bold text-white mb-8 tracking-tight">
              Get in Touch
            </h3>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group w-full max-w-md"
              >
                <a
                  href={contactInfo[0].href}
                  className="flex items-center justify-center space-x-6 glass-strong p-10 rounded-xl neon-glow-accent hover:neon-glow transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <Mail className="w-8 h-8 text-accent-400 group-hover:text-primary-400 transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-white font-orbitron font-bold text-lg group-hover:text-gradient transition-all duration-300 mb-2 tracking-tight">
                      {contactInfo[0].title}
                    </h4>
                    <p className="text-slate-300 group-hover:text-white transition-colors duration-300 text-lg tracking-wide">
                      {contactInfo[0].value}
                    </p>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;