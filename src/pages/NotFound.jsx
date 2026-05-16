import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-morning text-jade-dark flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-jade/5 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-jade/5 shadow-xl">
          <Search className="w-12 h-12 text-jade" />
        </div>

        <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-jade bg-jade/5 border border-jade/10 px-4 py-1.5 rounded-full mb-6 italic">
          404 · Signal Lost
        </span>

        <h1 className="text-6xl md:text-8xl font-black text-jade-dark tracking-tighter mb-4 italic">
          404
        </h1>
        <h2 className="text-2xl font-black text-pebble mb-4 tracking-tight uppercase">
          Gear Missing
        </h2>
        <p className="text-pebble font-bold opacity-60 leading-relaxed mb-10 text-sm">
          The page you're looking for couldn't be found. It may have been relocated, decommissioned,
          or the transmission was interrupted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-jade hover:bg-jade-dark text-white font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 shadow-lg shadow-jade/20"
          >
            <Home className="w-5 h-5" />
            Back to Store
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-morning text-pebble font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition border border-jade/5 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
