import React from 'react';
import { 
  Sun, Moon, ShieldCheck, 
  Droplets, Sparkles, ArrowLeft,
  Calendar, Zap, ShoppingBag
} from 'lucide-react';

export default function RoutinePage({ result, onBack, onNavigate }: { result: any, onBack: () => void, onNavigate: (p: string) => void }) {
  const defaultRoutine = {
    morning: [
      { step: "Cleanser", desc: "Wash your face with a gentle cleanser to remove overnight oils.", icon: Droplets },
      { step: "Moisturizer", desc: "Apply a light moisturizer to hydrate and protect the skin barrier.", icon: ShieldCheck },
      { step: "Sunscreen", desc: "Essential protection against UV rays. Use SPF 30 or higher.", icon: Sun }
    ],
    night: [
      { step: "Face wash", desc: "Remove dirt, pollution, and makeup from the day.", icon: Droplets },
      { step: "Treatment cream", desc: "Apply targeted treatment for your specific skin condition.", icon: Sparkles },
      { step: "Hydrating gel", desc: "Lock in moisture while you sleep for skin repair.", icon: Moon }
    ]
  };

  const routine = result?.result?.recommended_routine || result?.routine || defaultRoutine;

  return (
    <div className="routine-container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '48px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px' }}>
              Daily <span className="text-gradient">Rituals</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-gray)', fontWeight: '500' }}>
              Your personalized AI-guided skincare regimen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
        {/* Morning Routine */}
        <div>
          <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '32px', border: '1px solid rgba(251,191,36,0.3)', background: 'linear-gradient(180deg, rgba(254,243,199,0.5) 0%, #FFFFFF 100%)' }}>
            <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(251,191,36,0.12)', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>
               <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Sun size={24} />
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F' }}>A.M. Protocol</h3>
            </div>
            
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {(routine.morning || defaultRoutine.morning).map((item: any, i: number) => {
                  const stepName = typeof item === 'string' ? item : item.step;
                  const stepDesc = typeof item === 'string' ? "" : item.desc;
                  return (
                    <div 
                      key={i} 
                      style={{ 
                        padding: '20px 24px', 
                        borderRadius: '20px', 
                        background: '#FFFFFF', 
                        border: '1px solid rgba(30,58,95,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 2px 10px rgba(30,58,95,0.06)'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900' }}>
                         {i+1}
                      </div>
                      <div style={{ flex: 1 }}>
                         <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: '#1E3A5F' }}>
                            {stepName}
                         </h4>
                         <p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.5' }}>{stepDesc}</p>
                      </div>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>

        {/* Night Routine */}
        <div>
          <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '32px', border: '1px solid rgba(99,102,241,0.3)', background: 'linear-gradient(180deg, rgba(224,231,255,0.5) 0%, #FFFFFF 100%)' }}>
            <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
               <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <Moon size={24} />
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F' }}>P.M. Protocol</h3>
            </div>

            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {(routine.night || defaultRoutine.night).map((item: any, i: number) => {
                  const stepName = typeof item === 'string' ? item : item.step;
                  const stepDesc = typeof item === 'string' ? "" : item.desc;
                  return (
                    <div 
                      key={i} 
                      style={{ 
                        padding: '20px 24px', 
                        borderRadius: '20px', 
                        background: '#FFFFFF', 
                        border: '1px solid rgba(30,58,95,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 2px 10px rgba(30,58,95,0.06)'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900' }}>
                         {i+1}
                      </div>
                      <div style={{ flex: 1 }}>
                         <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: '#1E3A5F' }}>
                            {stepName}
                         </h4>
                         <p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.5' }}>{stepDesc}</p>
                      </div>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
