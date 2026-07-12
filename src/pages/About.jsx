import { useEffect, useState } from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import CartDrawer from '../components/shared/CartDrawer';
import { subscribeSettings } from '../firebase/products';
import { Shield, Target, Users, Zap } from 'lucide-react';

const About = () => {
  const [settings, setSettings] = useState({ shopName: '', whatsappNumber: '' });

  useEffect(() => {
    const unsubSettings = subscribeSettings((data) => {
      setSettings(data);
    });
    return () => unsubSettings();
  }, []);

  return (
    <div className="min-h-screen bg-morning text-jade-dark flex flex-col font-poppins selection:bg-jade/20">
      <Header shopName={settings?.shopName} />
      <CartDrawer whatsappNumber={settings?.whatsappNumber} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 border-b border-jade/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jade/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pebble/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#2D5A54 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-jade bg-jade/10 border border-jade/20 px-6 py-2 rounded-full mb-8">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
            Driven by <br />
            <span className="text-jade">Passion for the Ride</span>
          </h1>
          <p className="text-pebble-dark text-lg md:text-xl font-medium mx-auto leading-relaxed max-w-2xl">
            At {settings?.shopName || 'Riders Gear Nairobi'}, we believe that every journey deserves the best equipment. We curate the highest quality parts and accessories to keep you safe and your bike performing at its peak.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-jade-dark tracking-tight mb-4">Our Core Values</h2>
            <p className="text-pebble font-medium max-w-2xl mx-auto">
              Everything we do is built on a foundation of quality, trust, and a deep understanding of what riders need on the road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Safety First', desc: 'We never compromise on safety. Every product we sell is tested and verified for quality.' },
              { icon: Target, title: 'Precision', desc: 'From exact fitments to accurate advice, we ensure you get exactly what your bike needs.' },
              { icon: Users, title: 'Community', desc: 'We are riders serving riders. Our advice comes from real experience on the road and track.' },
              { icon: Zap, title: 'Performance', desc: 'Unlock your bike\'s true potential with our curated selection of performance parts.' }
            ].map((value, index) => (
              <div key={index} className="bg-morning border border-jade/5 p-8 rounded-3xl group hover:border-jade/20 hover:shadow-xl hover:shadow-jade/5 transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-jade" />
                </div>
                <h3 className="text-xl font-bold text-jade-dark mb-3">{value.title}</h3>
                <p className="text-pebble text-sm leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer shopName={settings?.shopName} />
    </div>
  );
};

export default About;
