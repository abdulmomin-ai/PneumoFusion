import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

export default function FullReport({ user, onLogout, dark, setDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, preview } = location.state || {};

  // Agar direct navbar se aaye bina result data ke, to guide karo pehle scan analyze karne ke liye
  if (!result) {
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
  const confidence = Math.round(result.confidence);
  const normalProb = result.normal_prob ?? (100 - confidence);
  const pneumoniaProb = result.pneumonia_prob ?? confidence;
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
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
          <div className={`glass-card ${isPneumonia ? 'tint-pink' : 'tint-teal'} rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
            <div className="relative z-[2]">
              <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Screening Prediction</p>
              <p className={`text-3xl md:text-4xl font-extrabold ${isPneumonia ? 'text-coral-dark' : 'text-emerald-600'} ${isPneumonia ? 'print-status-badge print-status-pneumonia' : 'print-status-badge print-status-normal'}`}>
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
                <img src={preview} alt="Original X-ray" className="relative z-[2] w-full rounded-2xl object-cover max-h-[320px]" />
              ) : (
                <div className="relative z-[2] text-xs text-muted py-12 text-center">No image preview available</div>
              )}
            </div>

            {/* Probability breakdown */}
            <div className="glass-card tint-teal rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="relative z-[2] font-display font-bold text-sm text-ink dark:text-white mb-4">
                  Probability Breakdown & Metrics
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

          {/* 4. Care & Curation: Tailored guidance for PNEUMONIA or NORMAL */}
          <div className="glass-card tint-purple rounded-3xl p-6 mb-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-2">
              Clinical Care & Curation Guidance ({isPneumonia ? 'Pneumonia Screening Protocol' : 'Normal Screening Protocol'})
            </h3>
            <div className="relative z-[2] text-sm text-muted font-medium leading-relaxed space-y-2">
              {isPneumonia ? (
                <>
                  <p>• <strong className="text-ink dark:text-white">Medical Consultation:</strong> Schedule an immediate follow-up with your primary physician or a pulmonologist for physical auscultation and diagnostic confirmation.</p>
                  <p>• <strong className="text-ink dark:text-white">Prescribed Regimen:</strong> Take all prescribed antibiotics or medications exactly as directed by your healthcare provider. Do not discontinue early.</p>
                  <p>• <strong className="text-ink dark:text-white">Vitals Monitoring:</strong> Regularly check your temperature and blood oxygen saturation via pulse oximetry.</p>
                </>
              ) : (
                <>
                  <p>• <strong className="text-ink dark:text-white">Maintenance:</strong> Your chest X-ray screening shows no prominent signs of pneumonia opacity. Continue maintaining good respiratory hygiene.</p>
                  <p>• <strong className="text-ink dark:text-white">Preventive Care:</strong> Stay up to date on annual vaccinations (influenza, pneumococcal) and avoid exposure to indoor smoke or pollutants.</p>
                  <p>• <strong className="text-ink dark:text-white">Symptom Watch:</strong> If new respiratory symptoms develop (persistent cough, fever, shortness of breath), repeat screening promptly.</p>
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
                <p className="text-muted leading-relaxed">Lie down or sit comfortably. Place one hand on your chest and the other on your belly. Breathe in slowly through your nose so your belly rises, then exhale gently through pursed lips.</p>
              </div>
              <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-ink dark:text-white mb-1">2. Pursed-Lip Breathing</p>
                <p className="text-muted leading-relaxed">Inhale slowly through your nose for 2 seconds with your mouth closed. Purse your lips as if blowing out a candle and exhale slowly and steadily for 4 seconds.</p>
              </div>
              <div className="bg-black/[0.03] dark:bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-ink dark:text-white mb-1">3. Deep Lung Expansion</p>
                <p className="text-muted leading-relaxed">Take a deep breath in, hold it for 3 to 5 seconds to allow full alveolar recruitment, and then slowly release. Repeat 5-10 times per session to improve vital capacity.</p>
              </div>
            </div>
          </div>

          {/* 6. Pulmonary Recovery Diet & Hydration: Fluids, anti-inflammatory foods, lean protein, and irritants to avoid */}
          <div className="glass-card tint-neutral rounded-3xl p-6 mb-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-3">
              Pulmonary Recovery Diet & Hydration
            </h3>
            <div className="relative z-[2] grid md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-ink dark:text-white">Hydration & Nutrients</p>
                <p className="text-muted leading-relaxed">• <strong className="text-ink dark:text-white">Hydration:</strong> Drink 8–10 glasses of water or warm herbal teas daily to thin mucus and clear airways.</p>
                <p className="text-muted leading-relaxed">• <strong className="text-ink dark:text-white">Anti-Inflammatory Foods:</strong> Consume berries, leafy greens, turmeric, ginger, and garlic to support immune response.</p>
                <p className="text-muted leading-relaxed">• <strong className="text-ink dark:text-white">Lean Proteins:</strong> Include fish, poultry, eggs, and legumes to aid tissue repair and muscle strength.</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-ink dark:text-white">Irritants to Avoid</p>
                <p className="text-muted leading-relaxed">• <strong className="text-ink dark:text-white">Tobacco & Vaping:</strong> Completely avoid cigarette smoke, e-cigarettes, and secondhand smoke which inflame lung tissue.</p>
                <p className="text-muted leading-relaxed">• <strong className="text-ink dark:text-white">Environmental Pollutants:</strong> Limit exposure to chemical fumes, heavy dust, and harsh cleaning aerosols.</p>
                <p><strong className="text-ink dark:text-white">• Excess Dairy & Sugar:</strong> Moderating processed sugars and heavy dairy can help prevent excess mucus production.</p>
              </div>
            </div>
          </div>

          {/* 7. Medical Disclaimer: AI screening/educational tool only; consult doctor/pulmonologist; urgent care warning */}
          <div className="glass-card tint-pink rounded-3xl p-6">
            <h3 className="relative z-[2] font-display font-bold text-ink dark:text-white mb-2">
              Important Medical Disclaimer & Urgent Care Warning
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