import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Shield, Wrench, Zap, Award, ChevronRight } from 'lucide-react';
import Header from '../components/shared/Header';

const Business = () => {
  const services = [
    { icon: Wrench, title: 'Spare Parts Supply', desc: 'Genuine and aftermarket parts for all major motorbike brands. Fast sourcing on request.' },
    { icon: Zap, title: 'Performance Upgrades', desc: 'Exhaust systems, carburetors, sprockets and performance components for serious riders.' },
    { icon: Shield, title: 'Quality Guarantee', desc: 'All products are quality-checked before sale. We stand behind every part we sell.' },
    { icon: Award, title: 'Expert Advice', desc: 'Our team knows bikes. Get free technical advice on fitment, compatibility and maintenance.' },
  ];

  return (
    <div className="min-h-screen bg-morning text-jade-dark font-poppins">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-jade/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-jade/5 rounded-full blur-[100px]" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-jade bg-jade/10 border border-jade/20 px-6 py-2 rounded-full mb-8">
            Business & Wholesale
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
            Trade &<br />
            <span className="text-jade">Partnerships</span>
          </h1>
          <p className="text-pebble-dark text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Riders Gear Nairobi supplies premium motorcycle gear and accessories to retailers,
            workshops, and professional riders across East Africa. Partner with us for quality and reliability.
          </p>
          <a
            href="https://wa.me/254700000000?text=Hi%20Riders%20Gear%2C%20I%20have%20a%20business%20enquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-jade hover:bg-jade-dark text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-jade/20 transition transform hover:-translate-y-1 text-lg"
          >
            <Phone className="w-5 h-5" />
            Connect via WhatsApp
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-black tracking-tight text-center mb-4">Our Commitment</h2>
          <p className="text-pebble text-center mb-14 text-sm font-medium">Powering your business with the best in riding gear.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-jade/5 hover:border-jade/20 p-8 rounded-3xl transition group shadow-sm hover:shadow-xl hover:shadow-jade/5">
                <div className="w-14 h-14 bg-jade/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jade/10 transition">
                  <Icon className="w-7 h-7 text-jade" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-pebble-dark leading-relaxed text-sm font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-center mb-14">Our Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: MapPin, label: 'Headquarters', value: 'Nairobi, Kenya' },
              { icon: Phone, label: 'WhatsApp', value: '+254 700 000 000' },
              { icon: Clock, label: 'Service Hours', value: 'Mon–Sat · 8am – 6pm' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-jade/5 p-8 rounded-3xl shadow-sm">
                <div className="w-12 h-12 bg-jade/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-jade" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-pebble mb-1">{label}</p>
                <p className="font-bold text-jade-dark">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-jade">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black mb-4 tracking-tight text-white">Scale Your Inventory</h2>
          <p className="text-morning/80 mb-10 font-medium">We offer exclusive wholesale rates for bulk orders and business accounts.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl border border-white/20 transition"
            >
              Browse Products
            </Link>
            <a
              href="https://wa.me/254700000000?text=Hi%20Riders%20Gear%2C%20I%20would%20like%20to%20place%20a%20bulk%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-jade font-bold px-10 py-5 rounded-2xl shadow-xl transition hover:bg-morning"
            >
              Request Wholesale Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Business;
