"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      text: "Jl. H. R. Rasuna Said No.22 Kav. C",
      href: "https://maps.app.goo.gl/coBF8c5YUBHY6RJw9",
      label: "Visit us",
    },
    {
      icon: Phone,
      text: "0857-1726-9057",
      href: "tel:085717269057",
      label: "Call us",
    },
    {
      icon: Mail,
      text: "info@freelinkd.com",
      href: "mailto:info.freelinkd@gmail.com",
      label: "Email us",
    },
    {
      icon: Globe,
      text: "www.freelinkd.com",
      href: "https://www.freelinkd.com",
      label: "Website",
    },
  ];

  return (
    <section id="contact" className="py-12 md:py-20 bg-(--background)">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-(--primary)/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-(--secondary)/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 md:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Ready to start your project? We&#39;d love to hear from you. Send us
            a message and we&#39;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 items-stretch">
          {/* Map Container */}
          <motion.div
            className="w-full h-64 lg:h-auto min-h-75 lg:min-h-87.5 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3254202957505!2d106.83053821081567!3d-6.22074956090159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f6ddce3efd%3A0xea6830e6c82c7a18!2sPlaza%20Festival!5e0!3m2!1sen!2sid!4v1766498937676!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

          {/* Contact Info Card */}
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col justify-center h-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
              Contact Information
            </h3>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={
                    item.icon === Globe || item.icon === MapPin
                      ? "_blank"
                      : undefined
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className="shrink-0 w-10 h-10 bg-(--primary) rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium mb-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 translate-y-0 md:-translate-y-1 md:group-hover:translate-y-0 transform">
                      {item.label}
                    </span>
                    <span className="text-gray-800 font-semibold text-base group-hover:text-(--primary) transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
