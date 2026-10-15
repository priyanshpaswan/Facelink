import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { ReportSubmission } from '../../types/index.ts';
import { ShieldAlert, X, Check } from 'lucide-react';

interface ReportModalProps {
  targetUserId: string;
  targetUsername: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetUserId,
  targetUsername,
  onClose,
}) => {
  const { submitReport } = useApp();
  const [category, setCategory] = useState<ReportSubmission['category']>('incorrect_match');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories: Array<{ id: ReportSubmission['category']; label: string; desc: string }> = [
    {
      id: 'incorrect_match',
      label: 'Incorrect Face Match',
      desc: 'The face scan incorrectly matched this person instead of someone else.',
    },
    {
      id: 'harassment',
      label: 'Harassment or Misuse',
      desc: 'Inappropriate profile info, offensive content, or predatory behavior.',
    },
    {
      id: 'unauthorized_photo',
      label: 'Unauthorized Photo / Impersonation',
      desc: 'This profile is using someone else’s photo or identity.',
    },
    {
      id: 'stalking_suspicion',
      label: 'Stalking or Unwanted Tracking',
      desc: 'Repeated unauthorized searches or violation of physical safety boundaries.',
    },
    {
      id: 'other',
      label: 'Other Concern',
      desc: 'Any other safety or consent violation.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(targetUserId, targetUsername, category, description);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
          aria-label="Close Report Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-[240px] mx-auto">
              Our safety and consent team will review this incident within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Report Profile</h3>
                <p className="text-xs text-slate-400">Reporting @{targetUsername}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Select Reason
              </label>
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    category === cat.id
                      ? 'bg-violet-950/40 border-violet-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportCategory"
                    value={cat.id}
                    checked={category === cat.id}
                    onChange={() => setCategory(cat.id)}
                    className="mt-0.5 text-violet-600 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-semibold leading-none">{cat.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Where did you meet, or what specific issue occurred?"
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
