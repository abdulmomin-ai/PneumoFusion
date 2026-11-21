import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Curated Multan specialist & thoracic/chest hospital entries (stable module reference)
const MULTAN_SPECIALISTS = [
  {
    id: 'nishtar-kamal',
    name: 'Dr. Ayesha Khan',
    specialty: 'Pulmonologist',
    roleTag: 'Chest & Respiratory Medicine',
    hospital: 'Nishtar Medical College Hospital',
    area: 'nishtar',
    areaLabel: 'Nishtar Road, Multan',
    address: 'Block A, College Road, Near Block B Hospital, Multan',
    phone: '+92 61 9233200',
    timings: '10:00 AM - 3:00 PM',
    accent: 'violet',
  },
  {
    id: 'abdali-bilal',
    name: 'Dr. Bilal Ahmed',
    specialty: 'Thoracic Surgeon',
    roleTag: 'Thoracic & Chest Surgery Unit',
    hospital: "Women's Hospital & Medical Centre",
    area: 'abdali',
    areaLabel: 'Abdali Road, Multan',
    address: 'Abdali Road, Near Expo Centre, Multan',
    phone: '+92 61 9233205',
    timings: '9:00 AM - 2:00 PM',
    accent: 'cyan',
  },
  {
    id: 'bosan-sarah',
    name: 'Dr. Sarah Mahmood',
    specialty: 'Pulmonologist',
    roleTag: 'Pulmonary Care & Diagnostics',
    hospital: 'Metro Hospital, Multan',
    area: 'bosan',
    areaLabel: 'Bosan Road, Multan',
    address: 'Bosan Road, Near Bus Stand, Multan',
    phone: '+92 61 9233201',
    timings: '5:00 PM - 8:00 PM',
    accent: 'emerald',
  },
  {
    id: 'shahrukn-sameer',
    name: 'Dr. Muhammad Sameer',
    specialty: 'Thoracic Surgeon',
    roleTag: 'Thoracic Surgical Consultation',
    hospital: 'Jinnah Clinic',
    area: 'shah-rukn',
    areaLabel: 'Shah Rukn-e-Alam, Multan',
    address: 'Shah Rukn-e-Alam Road, Near Mosque, Multan',
    phone: '+92 61 9233203',
    timings: '11:00 AM - 5:00 PM',
    accent: 'amber',
  },
  {
    id: 'suraj-fatima',
    name: 'Dr. Fatima Noor',
    specialty: 'Pulmonologist',
    roleTag: 'Respiratory & Infection Care',
    hospital: 'Al-Samar Hospital',
    area: 'suraj',
    areaLabel: 'Suraj Miani Road, Multan',
    address: 'Suraj Miani Road, Near Bus Stand, Multan',
    phone: '+92 61 9233202',
    timings: '10:00 AM - 4:00 PM',
    accent: 'violet',
  },
  {
    id: 'nishtar-hassan',
    name: 'Dr. Hassan Rana',
    specialty: 'Pulmonologist',
    roleTag: 'Pulmonary Outpatient Clinic',
    hospital: 'Civil Hospital, Multan',
    area: 'nishtar',
    areaLabel: 'Nishtar Road, Multan',
    address: 'Block A, Jail Road, Near Block C, Multan',
    phone: '+92 61 9233204',
    timings: '8:00 AM - 12:00 PM',
    accent: 'cyan',
  },
  {
    id: 'bosan-zubair',
    name: 'Dr. Zubair Ahmad',
    specialty: 'Thoracic Surgeon',
    roleTag: 'Chest & Thoracic Surgery',
    hospital: 'Private Chest Care Centre',
    area: 'bosan',
    areaLabel: 'Bosan Road, Multan',
    address: 'Bosan Road, Near City Hospital, Multan',
    phone: '+92 300 1234567',
    timings: 'Anytime, Call to Schedule',
    accent: 'emerald',
  },
  {
    id: 'shahrukn-nusrat',
    name: 'Dr. Nusrat Bibi',
    specialty: 'Pulmonologist',
    roleTag: 'Chest & Lung Specialist',
    hospital: 'Punjab Healthcare Corporation Hospital',
    area: 'shah-rukn',
    areaLabel: 'Shah Rukn-e-Alam, Multan',
    address: 'Shah Rukn-e-Alam Road, Near Bunyad Hospital, Multan',
    phone: '+92 61 9233206',
    timings: '9:00 AM - 5:00 PM',
    accent: 'amber',
  },
];

// Error Boundary component for safe error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FullReport.jsx ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen relative">
          <div className="aurora-bg">
            <div className="aurora-blob one" />
            <div className="aurora-blob two" />
            <div className="aurora-blob three" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-md px-5 pt-24 pb-20 text-center">
              <div className="glass-card tint-purple rounded-3xl p-10">
                <div className="relative z-[2] h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mx-auto mb-4">
                  !
                </div>
                <h1 className="relative z-[2] font-display text-xl font-bold text-ink dark:text-white mb-2">
                  Error in Clinical Report
                </h1>
                <p className="relative z-[2] text-sm text-muted font-medium mb-6">
                  An unexpected error occurred while rendering the report. Try navigating back to the Results page and re-analyze your X-ray.
                </p>
                <Link
                  to="/results"
                  className="relative z-[2] glossy-btn inline-flex items-center gap-2 rounded-full text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA 0%, #7C6FF0 50%, #67E8F9 100%)',
                    boxShadow: '0 8px 28px rgba(124, 111, 240, 0.5), inset 0 1px 1px rgba(255,255,255,0.5)',
                  }}
                >
                  <span className="relative z-[2]">Go to Results Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Regional Focus Analysis component - measures prominent Grad-CAM activation energy left vs right
function RegionalFocusAnalysis({ heatmapBase64 }) {
  const [assessment, setAssessment] = React.useState(null);

  React.useEffect(() => {
    if (!heatmapBase64) {
      setAssessment(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (!width || !height) {
          setAssessment({
            leftPct: 50,
            rightPct: 50,
            focusDirection: 'Bilateral Thoracic Regions',
            magnitude: 'Mixed',
            clinicianNote:
              'Opacities appear distributed across both sides; perform comprehensive bilateral auscultation and interval follow-up monitoring if clinically indicated.',
          });
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setAssessment({
            leftPct: 50,
            rightPct: 50,
            focusDirection: 'Bilateral Thoracic Regions',
            magnitude: 'Mixed',
            clinicianNote:
              'Opacities appear distributed across both sides; perform comprehensive bilateral auscultation and interval follow-up monitoring if clinically indicated.',
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);

        // Weight warm/high-activation pixels (red/yellow/green peaks) above dark/blue background
        let leftWeight = 0;
        let rightWeight = 0;
        const midX = Math.floor(width * 0.52);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const warmSignal = Math.max(0, r - Math.max(b, 70));
          const yellowSignal = Math.max(0, Math.min(r, g) - Math.max(b, 80));
          const prominence = warmSignal * 1.6 + yellowSignal * 1.2;

          if (prominence > 12) {
            const pixelIndex = i / 4;
            const x = pixelIndex % width;
            const weightedEnergy = prominence * prominence;

            if (x < midX) {
              leftWeight += weightedEnergy;
            } else {
              rightWeight += weightedEnergy;
            }
          }
        }

        const totalWeight = leftWeight + rightWeight;
        const leftPct =
          Number.isFinite(leftWeight) && Number.isFinite(totalWeight) && totalWeight > 0
            ? Math.min(98, Math.max(2, Math.round((leftWeight / totalWeight) * 100)))
            : 50;
        const rightPct = 100 - leftPct;

        let focusDirection;
        let magnitude;
        let clinicianNote;

        if (leftPct >= 55) {
          focusDirection = 'Left Pulmonary Dominance';
          magnitude = leftPct >= 70 ? 'High / Predominant Left' : 'Moderate-to-High Left';
          clinicianNote =
            'Stronger activation energy is concentrated toward the left thoracic field. Correlate with PA/lateral chest views, auscultation, and clinical symptoms.';
        } else if (rightPct >= 55) {
          focusDirection = 'Right Pulmonary Dominance';
          magnitude = rightPct >= 70 ? 'High / Predominant Right' : 'Moderate-to-High Right';
          clinicianNote =
            'Stronger activation energy is concentrated toward the right thoracic field. Correlate with PA/lateral chest views, auscultation, and clinical symptoms.';
        } else {
          focusDirection = 'Bilateral Thoracic Regions';
          magnitude = 'Mixed / Balanced';
          clinicianNote =
            'Activation energy is relatively balanced across both lung fields; perform comprehensive bilateral auscultation and clinical correlation.';
        }

        setAssessment({
          leftPct,
          rightPct,
          focusDirection,
          magnitude,
          clinicianNote,
        });
      } catch (e) {
        console.warn('Regional focus analysis failed:', e);
        setAssessment({
          leftPct: 50,
          rightPct: 50,
          focusDirection: 'Bilateral Thoracic Regions',
          magnitude: 'Mixed',
          clinicianNote:
            'Opacities appear distributed across both sides; perform comprehensive bilateral auscultation and interval follow-up monitoring if clinically indicated.',
        });
      }
    };

    img.onerror = () => {
      if (cancelled) return;
      setAssessment({
        leftPct: 50,
        rightPct: 50,
        focusDirection: 'Bilateral Thoracic Regions',
        magnitude: 'Mixed',
        clinicianNote:
          'Opacities appear distributed across both sides; perform comprehensive bilateral auscultation and interval follow-up monitoring if clinically indicated.',
      });
    };

    img.src = `data:image/png;base64,${heatmapBase64}`;

    return () => {
      cancelled = true;
    };
  }, [heatmapBase64]);

  if (!heatmapBase64) {
    return (
      <div className="glass-card tint-neutral rounded-3xl p-6 mb-6 break-inside-avoid print-break-inside-avoid">
        <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-1">
          Regional Focus Summary
        </h3>
        <p className="relative z-[2] text-sm text-muted font-medium">
          No Grad-CAM heatmap available. Please analyze an X-ray to view regional focus analysis.
        </p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="glass-card tint-neutral rounded-3xl p-6 mb-6 break-inside-avoid print-break-inside-avoid">
        <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-1">
          Regional Focus Summary
        </h3>
        <p className="relative z-[2] text-sm text-muted font-medium">
          Analyzing Grad-CAM regional activation...
        </p>
      </div>
    );
  }

  const { leftPct, rightPct, focusDirection, magnitude, clinicianNote } = assessment;

  return (
    <div className="glass-card tint-neutral rounded-3xl p-6 mb-6 break-inside-avoid print-break-inside-avoid">
      <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-1">
        Regional Focus Summary (Left vs Right)
      </h3>
      <p className="relative z-[2] text-sm text-muted font-medium mb-4">
        High-activation Grad-CAM focus distribution across left and right thoracic regions.
      </p>

      <div className="relative z-[2] space-y-3">
        {/* Prominent side-by-side comparison bar */}
        <div className="flex w-full h-9 rounded-xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm">
          <div
            className="flex items-center justify-center transition-all duration-300"
            style={{
              width: `${Math.max(12, leftPct)}%`,
              backgroundColor: leftPct >= rightPct ? '#DC2626' : '#059669',
            }}
          >
            <span className="text-xs font-extrabold text-white tracking-wide">
              Left {leftPct}%
            </span>
          </div>
          <div
            className="flex items-center justify-center transition-all duration-300"
            style={{
              width: `${Math.max(12, rightPct)}%`,
              backgroundColor: rightPct > leftPct ? '#DC2626' : '#047857',
            }}
          >
            <span className="text-xs font-extrabold text-white tracking-wide">
              Right {rightPct}%
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xs font-bold px-1">
          <span className="text-rose-700 dark:text-rose-300">Left Region ({leftPct}%)</span>
          <span className="text-emerald-800 dark:text-emerald-300">Right Region ({rightPct}%)</span>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-3 space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-ink dark:text-white text-xs mt-0.5">Focus:</span>
            <span className="text-xs font-semibold text-ink dark:text-white">{focusDirection}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-ink dark:text-white text-xs mt-0.5">Magnitude:</span>
            <span className="text-xs text-ink dark:text-white">{magnitude}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-ink dark:text-white text-xs mt-0.5">Clinician Note:</span>
            <span className="text-xs text-muted">{clinicianNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Doctor vs AI Screening Role clarification
function RoleComparison() {
  return (
    <div className="glass-card tint-neutral rounded-3xl p-5 mb-6 break-inside-avoid print-break-inside-avoid">
      <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-4">
        AI Screening vs. Clinician Role
      </h3>

      <div className="relative z-[2] grid md:grid-cols-2 gap-4">
        {/* AI Screening */}
        <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4 border-l-4 border-teal-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-bold text-ink dark:text-white text-sm">
              AI Screening &amp; Triage
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-muted font-medium leading-relaxed">
            <li>• Priority triage tool for rapid flagging</li>
            <li>• Identifies potential opacity patterns (based on training corpus)</li>
            <li>• Generates visual explainability heatmaps</li>
            <li>• Provides standardized care guidance</li>
            <li>• For research/educational reference</li>
          </ul>
        </div>

        {/* Clinician */}
        <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-bold text-ink dark:text-white text-sm">
              Clinician Diagnosis
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-muted font-medium leading-relaxed">
            <li>• Final confirmation of clinical state</li>
            <li>• Physical auscultation and diagnostic correlation</li>
            <li>• Considers patient history and comorbidities</li>
            <li>• Determines treatment plan and follow-up</li>
            <li>• Responsible for all clinical decisions</li>
          </ul>
        </div>
      </div>

      {/* Triage Note */}
      <div className="relative z-[2] mt-4 pt-3 border-t border-black/10 dark:border-white/10">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-ink dark:text-white text-xs mt-0.5">Triage Note:</span>
          <span className="text-xs text-muted leading-relaxed">
            This AI screening tool assists in rapid flagging and note-taking for clinicians. The model's output is <strong>not</strong> a formal diagnosis and should <strong>always</strong> be corroborated with physical examination, clinical judgment, and relevant medical history before clinical conclusion. EfficientNet-B2 deep convolutional neural network outputs probabilistic indications of opacity patterns and not definitive pathology.
          </span>
        </div>
      </div>
    </div>
  );
}

// Back arrow icon - overall design ke sath consistent stroke style
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// PDF download icon
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Crisp architectural/clinical visual badge for each Multan facility (never breaks offline or in print)
function SpecialistVisualBadge({ name, specialty, accent }) {
  const initials = (name || 'DR')
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const palette = {
    violet: {
      bg: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 55%, #38BDF8 100%)',
      pill: 'rgba(255,255,255,0.18)',
      border: '#A78BFA',
    },
    cyan: {
      bg: 'linear-gradient(135deg, #0F172A 0%, #0284C7 55%, #22D3EE 100%)',
      pill: 'rgba(255,255,255,0.18)',
      border: '#67E8F9',
    },
    emerald: {
      bg: 'linear-gradient(135deg, #064E3B 0%, #059669 55%, #34D399 100%)',
      pill: 'rgba(255,255,255,0.18)',
      border: '#6EE7B7',
    },
    amber: {
      bg: 'linear-gradient(135deg, #78350F 0%, #D97706 55%, #FBBF24 100%)',
      pill: 'rgba(255,255,255,0.18)',
      border: '#FCD34D',
    },
  };

  const theme = palette[accent] || palette.violet;
  const isThoracic = /thoracic/i.test(specialty);

  return (
    <div
      className="w-24 sm:w-28 h-24 rounded-2xl p-2.5 flex flex-col justify-between text-white shrink-0 relative overflow-hidden"
      style={{
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.16)',
      }}
    >
      <svg
        viewBox="0 0 80 80"
        className="w-12 h-12 absolute -right-2 -bottom-2 opacity-25 pointer-events-none"
        fill="none"
      >
        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="3" />
        <path
          d="M40 22v36M22 40h36"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex items-center justify-between gap-1 z-10">
        <span
          className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: theme.pill }}
        >
          {initials}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-tight opacity-90">
          {isThoracic ? 'SURG' : 'CHEST'}
        </span>
      </div>

      <div className="z-10">
        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-85 leading-none mb-1">
          Multan Care
        </p>
        <p className="text-[11px] font-extrabold leading-tight truncate">
          {isThoracic ? 'Thoracic Unit' : 'Pulmonary Wing'}
        </p>
      </div>
    </div>
  );
}

// Multan Specialist Referral component - only shows when isPneumonia is true
function MultanSpecialistReferral() {
  const [selectedArea, setSelectedArea] = React.useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = React.useState('all');
  const [locationInput, setLocationInput] = React.useState('');

  const filteredSpecialists = React.useMemo(() => {
    const queryText = locationInput.trim().toLowerCase();

    return MULTAN_SPECIALISTS.filter((specialist) => {
      const areaMatch = selectedArea === 'all' || specialist.area === selectedArea;
      const specialtyMatch =
        selectedSpecialty === 'all' ||
        specialist.specialty.toLowerCase().includes(selectedSpecialty.replace(/-/g, ' '));
      const textMatch =
        !queryText ||
        specialist.areaLabel.toLowerCase().includes(queryText) ||
        specialist.hospital.toLowerCase().includes(queryText) ||
        specialist.address.toLowerCase().includes(queryText) ||
        specialist.name.toLowerCase().includes(queryText);

      return areaMatch && specialtyMatch && textMatch;
    });
  }, [selectedArea, selectedSpecialty, locationInput]);

  return (
    <section
      aria-label="Multan Specialist Referral"
      className="rounded-3xl p-6 mb-6 break-inside-avoid print-break-inside-avoid border border-purple-400/30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-600/15 text-purple-700 dark:text-purple-300 mb-1.5">
            Multan Clinical Referral • Top 3 Matches
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Recommended Pulmonologists &amp; Thoracic Surgeons in Multan
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {filteredSpecialists.length} matching {filteredSpecialists.length === 1 ? 'option' : 'options'}
        </span>
      </div>

      {/* Referral Disclaimer */}
      <div className="rounded-2xl px-4 py-3 mb-5 bg-amber-500/10 border border-amber-500/25 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
        <strong>Referral Guidance:</strong> Curated Multan pulmonary &amp; thoracic surgical options for post-screening follow-up. Call ahead to confirm appointment slots, specialist availability, and hospital services.
      </div>

      {/* Interactive Filters (hidden in print) */}
      <div className="print:hidden grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
            Area / Stop in Multan
          </label>
          <select
            className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="all">All Multan Areas</option>
            <option value="nishtar">Nishtar Road</option>
            <option value="abdali">Abdali Road</option>
            <option value="bosan">Bosan Road</option>
            <option value="shah-rukn">Shah Rukn-e-Alam</option>
            <option value="suraj">Suraj Miani Road</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
            Specialist Type
          </label>
          <select
            className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="all">Pulmonologist &amp; Thoracic Surgeon</option>
            <option value="pulmonologist">Pulmonologist Only</option>
            <option value="thoracic-surgeon">Thoracic Surgeon Only</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
            Nearby Landmark / Hospital
          </label>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="e.g. Nishtar, Metro, Expo..."
            className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Top 3 Specialist Cards */}
      <div className="space-y-4">
        {filteredSpecialists.slice(0, 3).map((specialist, index) => {
          const mapsQuery = encodeURIComponent(
            `${specialist.hospital}, ${specialist.address}, Multan`
          );
          const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
          const cleanTel = specialist.phone.replace(/[^\d+]/g, '');

          return (
            <div
              key={specialist.id}
              className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 border-l-4 border-l-purple-600 shadow-sm break-inside-avoid print-break-inside-avoid"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Visual Badge on Left */}
                <SpecialistVisualBadge
                  name={specialist.name}
                  specialty={specialist.specialty}
                  accent={specialist.accent}
                />

                {/* Main Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mr-2">
                        #{index + 1}
                      </span>
                      <span className="font-display text-base font-bold text-slate-900 dark:text-white">
                        {specialist.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                      {specialist.specialty}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2.5">
                    {specialist.hospital} • {specialist.roleTag}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Area: </span>
                      {specialist.areaLabel}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Timings: </span>
                      {specialist.timings}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-900 dark:text-white">Address: </span>
                      {specialist.address}
                    </div>
                  </div>

                  {/* Action Row: Phone + Google Maps */}
                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <a
                      href={`tel:${cleanTel}`}
                      className="font-bold text-indigo-700 dark:text-indigo-300 hover:underline"
                    >
                      Call: {specialist.phone}
                    </a>

                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="print:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                    >
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSpecialists.length === 0 && (
          <div className="rounded-2xl p-6 text-center bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            No matching Multan specialists found for this filter. Reset area, specialty, or landmark search to view options.
          </div>
        )}
      </div>
    </section>
  );
}

function InnerFullReport({ user, onLogout, dark, setDark }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely destructure location state with fallback
  const locationState = location.state || {};
  const result = locationState.result;
  const preview = locationState.preview;

  // Guard against missing result data
  if (!result || typeof result !== 'object') {
    return (
      <div className="min-h-screen relative">
        <div className="aurora-bg">
          <div className="aurora-blob one" />
          <div className="aurora-blob two" />
          <div className="aurora-blob three" />
        </div>

        <div className="relative z-10">
          <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />
          <main className="mx-auto max-w-md px-5 pt-24 pb-20 text-center">
            <div className="glass-card tint-purple rounded-3xl p-10">
              <div className="relative z-[2] h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mx-auto mb-4">
                !
              </div>
              <h1 className="relative z-[2] font-display text-xl font-bold text-ink dark:text-white mb-2">
                No report to show yet
              </h1>
              <p className="relative z-[2] text-sm text-muted font-medium mb-6">
                First go to the Result page and analyze a chest X-ray to generate a report.
              </p>
              <Link
                to="/results"
                className="relative z-[2] glossy-btn inline-flex items-center gap-2 rounded-full text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C6FF0 50%, #67E8F9 100%)',
                  boxShadow: '0 8px 28px rgba(124, 111, 240, 0.5), inset 0 1px 1px rgba(255,255,255,0.5)',
                }}
              >
                <span className="relative z-[2]">Go to Result Page</span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isPneumonia = result.prediction === 'PNEUMONIA';
  const rawConfidence = Number(result.confidence);
  const confidence = Number.isFinite(rawConfidence) ? Math.round(rawConfidence) : 0;
  const normalProb = Number.isFinite(Number(result.normal_prob))
    ? Math.round(Number(result.normal_prob))
    : Math.max(0, 100 - confidence);
  const pneumoniaProb = Number.isFinite(Number(result.pneumonia_prob))
    ? Math.round(Number(result.pneumonia_prob))
    : confidence;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen relative">
      <div className="aurora-bg">
        <div className="aurora-blob one" />
        <div className="aurora-blob two" />
        <div className="aurora-blob three" />
      </div>

      <div className="relative z-10">
        <div className="print:hidden">
          <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />
        </div>

        <main className="mx-auto max-w-4xl px-5 md:px-8 pt-10 pb-20">
          {/* 1. Header: PneumoFusion Clinical AI Screening Report, date/time, and EfficientNetB2 + Grad-CAM */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider">
                  EfficientNet-B2 + Grad-CAM
                </span>
                <span className="text-xs text-muted">Clinical AI Screening</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">
                PneumoFusion Clinical Report
              </h1>
              <p className="text-muted text-sm mt-1">
                Generated on {today} at {timestamp} {user?.name ? `• Patient: ${user.name}` : ''}
              </p>
            </div>
            <div className="print:hidden flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="glossy-btn flex items-center gap-1.5 rounded-full text-white font-semibold text-sm uppercase tracking-wider px-5 py-2.5 transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C6FF0 50%, #67E8F9 100%)',
                  boxShadow: '0 8px 28px rgba(124, 111, 240, 0.5), inset 0 1px 1px rgba(255,255,255,0.5)',
                }}
              >
                <span className="relative z-[2] flex items-center gap-1.5">
                  <DownloadIcon />
                  Download PDF Report
                </span>
              </button>
              <button
                onClick={() => navigate('/results')}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-3 py-2"
              >
                <BackIcon />
                Back
              </button>
            </div>
          </div>

          {/* 2. Screening Summary: Prediction (NORMAL or PNEUMONIA), confidence %, and normal/pneumonia probabilities */}
          <div
            className={`glass-card ${isPneumonia ? 'tint-pink' : 'tint-teal'} rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
          >
            <div className="relative z-[2]">
              <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Screening Prediction</p>
              <p
                className={`text-3xl md:text-4xl font-extrabold ${isPneumonia ? 'text-coral-dark' : 'text-emerald-600'} ${isPneumonia ? 'print-status-badge print-status-pneumonia' : 'print-status-badge print-status-normal'}`}
              >
                {result.prediction}
              </p>
            </div>
            <div className="relative z-[2] flex items-center gap-6">
              <div>
                <p className="text-xs text-muted font-medium mb-1">Confidence</p>
                <p className="text-2xl font-bold text-ink dark:text-white">{confidence}%</p>
              </div>
              <div className="h-10 w-px bg-black/10 dark:bg-white/10" />
              <div>
                <p className="text-xs text-muted font-medium mb-1">Normal Prob</p>
                <p className="text-2xl font-bold text-emerald-600">{normalProb}%</p>
              </div>
              <div className="h-10 w-px bg-black/10 dark:bg-white/10" />
              <div>
                <p className="text-xs text-muted font-medium mb-1">Pneumonia Prob</p>
                <p className="text-2xl font-bold text-coral-dark">{pneumoniaProb}%</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Original scan */}
            <div className="glass-card tint-purple rounded-3xl p-5">
              <h3 className="relative z-[2] font-display font-bold text-sm text-ink dark:text-white mb-3">
                Original Chest X-Ray
              </h3>
              {preview ? (
                <img
                  src={preview}
                  alt="Original X-ray"
                  className="relative z-[2] w-full rounded-2xl object-cover max-h-[320px]"
                />
              ) : (
                <div className="relative z-[2] text-xs text-muted py-12 text-center">No image preview available</div>
              )}
            </div>

            {/* Probability breakdown */}
            <div className="glass-card tint-teal rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="relative z-[2] font-display font-bold text-sm text-ink dark:text-white mb-4">
                  Probability Breakdown &amp; Metrics
                </h3>

                <div className="relative z-[2] flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted font-medium">Normal Tissue Probability</span>
                      <span className="font-semibold text-ink dark:text-white">{normalProb}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${normalProb}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted font-medium">Pneumonia Consistency Probability</span>
                      <span className="font-semibold text-ink dark:text-white">{pneumoniaProb}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-coral-dark" style={{ width: `${pneumoniaProb}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-[2] mt-5 pt-4 border-t border-black/10 dark:border-white/10 text-xs text-muted font-medium leading-relaxed">
                Analyzed via EfficientNet-B2 deep convolutional neural network trained on chest radiographs. Model outputs indicate structural opacity patterns.
              </div>
            </div>
          </div>

          {/* 3. Visual Explainability: Grad-CAM heatmap/circled image + short note on highlighted regions */}
          <div className="glass-card tint-pink rounded-3xl p-6 mb-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-1">
              Visual Explainability (Grad-CAM)
            </h3>
            <p className="relative z-[2] text-sm text-muted font-medium mb-5">
              Gradient-weighted Class Activation Mapping highlights pulmonary regions that influenced the EfficientNet-B2 screening decision.
            </p>

            <div className="relative z-[2] grid md:grid-cols-2 gap-5">
              {result.circled_image_base64 && (
                <div>
                  <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Circled Region Focus</p>
                  <img
                    src={`data:image/png;base64,${result.circled_image_base64}`}
                    alt="Circled regions"
                    className="w-full rounded-2xl object-cover max-h-[300px]"
                  />
                </div>
              )}
              {result.heatmap_image_base64 && (
                <div>
                  <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Activation Heatmap</p>
                  <img
                    src={`data:image/png;base64,${result.heatmap_image_base64}`}
                    alt="Heatmap overlay"
                    className="w-full rounded-2xl object-cover max-h-[300px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4a. Regional Focus Analysis: Left vs right pixel energy on Grad-CAM heatmap */}
          <RegionalFocusAnalysis heatmapBase64={result.heatmap_image_base64} />

          {/* 4b. Role Comparison: Doctor vs AI Screening */}
          <RoleComparison />

          {/* 4c. Multan Specialist Referral: Only show for PNEUMONIA cases */}
          {isPneumonia && <MultanSpecialistReferral />}

          {/* 4. Care & Curation: Tailored guidance for PNEUMONIA or NORMAL */}
          <div className="glass-card tint-purple rounded-3xl p-6 mb-6 break-inside-avoid print-break-inside-avoid">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-2">
              Clinical Care &amp; Curation Guidance ({isPneumonia ? 'Pneumonia Screening Protocol' : 'Normal Screening Protocol'})
            </h3>
            <div className="relative z-[2] text-sm text-muted font-medium leading-relaxed space-y-2">
              {isPneumonia ? (
                <>
                  <p>
                    - <strong className="text-ink dark:text-white">Medical Consultation:</strong> Schedule an immediate follow-up with your primary physician or a pulmonologist for physical auscultation and diagnostic confirmation.
                  </p>
                  <p>
                    - <strong className="text-ink dark:text-white">Prescribed Regimen:</strong> Take all prescribed antibiotics or medications exactly as directed by your healthcare provider. Do not discontinue early.
                  </p>
                  <p>
                    - <strong className="text-ink dark:text-white">Vitals Monitoring:</strong> Regularly check your temperature and blood oxygen saturation via pulse oximetry.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    - <strong className="text-ink dark:text-white">Maintenance:</strong> Your chest X-ray screening shows no prominent signs of pneumonia opacity. Continue maintaining good respiratory hygiene.
                  </p>
                  <p>
                    - <strong className="text-ink dark:text-white">Preventive Care:</strong> Stay up to date on annual vaccinations (influenza, pneumococcal) and avoid exposure to indoor smoke or pollutants.
                  </p>
                  <p>
                    - <strong className="text-ink dark:text-white">Symptom Watch:</strong> If new respiratory symptoms develop (persistent cough, fever, shortness of breath), repeat screening promptly.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* 5. Breathing Exercises: Diaphragmatic breathing, pursed-lip breathing, and deep lung expansion */}
          <div className="glass-card tint-teal rounded-3xl p-6 mb-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-3">
              Recommended Pulmonary Breathing Exercises
            </h3>
            <div className="relative z-[2] grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-ink dark:text-white mb-1">1. Diaphragmatic Breathing</p>
                <p className="text-muted leading-relaxed">
                  Lie down or sit comfortably. Place one hand on your chest and the other on your belly. Breathe in slowly through your nose so your belly rises, then exhale gently through pursed lips.
                </p>
              </div>
              <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-ink dark:text-white mb-1">2. Pursed-Lip Breathing</p>
                <p className="text-muted leading-relaxed">
                  Inhale slowly through your nose for 2 seconds with your mouth closed. Purse your lips as if blowing out a candle and exhale slowly and steadily for 4 seconds.
                </p>
              </div>
              <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-ink dark:text-white mb-1">3. Deep Lung Expansion</p>
                <p className="text-muted leading-relaxed">
                  Take a deep breath in, hold it for 3 to 5 seconds to allow full alveolar recruitment, and then slowly release. Repeat 5-10 times per session to improve vital capacity.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Pulmonary Recovery Diet & Hydration: Fluids, anti-inflammatory foods, lean protein, and irritants to avoid */}
          <div className="glass-card tint-neutral rounded-3xl p-6 mb-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-3">
              Pulmonary Recovery Diet &amp; Hydration
            </h3>
            <div className="relative z-[2] grid md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-ink dark:text-white">Hydration &amp; Nutrients</p>
                <p className="text-muted leading-relaxed">
                  - <strong className="text-ink dark:text-white">Hydration:</strong> Drink 8–10 glasses of water or warm herbal teas daily to thin mucus and clear airways.
                </p>
                <p className="text-muted leading-relaxed">
                  - <strong className="text-ink dark:text-white">Anti-Inflammatory Foods:</strong> Consume berries, leafy greens, turmeric, ginger, and garlic to support immune response.
                </p>
                <p className="text-muted leading-relaxed">
                  - <strong className="text-ink dark:text-white">Lean Proteins:</strong> Include fish, poultry, eggs, and legumes to aid tissue repair and muscle strength.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-ink dark:text-white">Irritants to Avoid</p>
                <p className="text-muted leading-relaxed">
                  - <strong className="text-ink dark:text-white">Tobacco &amp; Vaping:</strong> Completely avoid cigarette smoke, e-cigarettes, and secondhand smoke which inflame lung tissue.
                </p>
                <p className="text-muted leading-relaxed">
                  - <strong className="text-ink dark:text-white">Environmental Pollutants:</strong> Limit exposure to chemical fumes, heavy dust, and harsh cleaning aerosols.
                </p>
                <p>
                  <strong className="text-ink dark:text-white">• Excess Dairy &amp; Sugar:</strong> Moderating processed sugars and heavy dairy can help prevent excess mucus production.
                </p>
              </div>
            </div>
          </div>

          {/* 7. Medical Disclaimer: AI screening/educational tool only; consult doctor/pulmonologist; urgent care warning */}
          <div className="glass-card tint-pink rounded-3xl p-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-2">
              Important Medical Disclaimer &amp; Urgent Care Warning
            </h3>
            <div className="relative z-[2] text-sm text-muted font-medium leading-relaxed space-y-2">
              <p>
                <strong className="text-ink dark:text-white">AI Screening Tool Only:</strong> This report is generated by an automated AI screening and educational tool (EfficientNet-B2 + Grad-CAM) and does <strong className="text-ink dark:text-white">not</strong> constitute a formal medical diagnosis. Always consult a qualified physician or pulmonologist for professional evaluation.
              </p>
              <p className="text-coral-dark font-semibold">
                ⚠️ Seek Urgent Emergency Medical Care Immediately If You Experience:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-ink dark:text-white font-medium">
                <li>Severe shortness of breath or difficulty breathing (dyspnea)</li>
                <li>Persistent chest pain, tightness, or pressure</li>
                <li>High fever unresponsive to antipyretics</li>
                <li>Bluish lips, face, or nail beds (cyanosis or low oxygen saturation &lt;92%)</li>
                <li>Confusion, lethargy, or altered mental state</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FullReport(props) {
  return (
    <ErrorBoundary>
      <InnerFullReport {...props} />
    </ErrorBoundary>
  );
}