import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal — replaces window.confirm() throughout the app.
 * Usage:
 *   <ConfirmModal
 *     isOpen={confirmOpen}
 *     title="Delete Product?"
 *     message="This cannot be undone."
 *     confirmLabel="Delete"
 *     confirmClassName="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
 *     onConfirm={() => { doAction(); setConfirmOpen(false); }}
 *     onCancel={() => setConfirmOpen(false)}
 *   />
 */
const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmClassName = 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
  onConfirm,
  onCancel,
  icon: Icon = AlertTriangle,
  iconClassName = 'text-red-500',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-jade-dark/60 backdrop-blur-sm">
      <div className="bg-white border border-jade/5 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${iconClassName}`} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-black text-jade-dark mb-1">{title}</h3>
            {message && <p className="text-pebble text-sm leading-relaxed font-bold opacity-70">{message}</p>}
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-pebble hover:text-jade-dark rounded-xl hover:bg-morning transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-bold text-pebble hover:bg-morning transition text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
