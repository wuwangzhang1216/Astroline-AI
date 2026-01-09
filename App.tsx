import React, { useState, useEffect, useRef } from 'react';
import { 
  Header, PrimaryButton, SelectionCard, Title, Subtitle, 
  OptionGrid, Input, Icons, PageContainer, ContentArea, ActionArea 
} from './components/UIComponents';
import { 
  AppStep, Gender, RelationshipStatus, Goal, 
  UserData, PalmistryResult, AstrologyResult 
} from './types';
import { analyzePalmImage, generateAstrologyChart } from './services/geminiService';

// --- Sub-Components ---

const ProcessingUI = ({ title, subtitle, tasks }: { title: string, subtitle?: string, tasks?: string[] }) => {
  const [currentTask, setCurrentTask] = useState(0);

  useEffect(() => {
    if (!tasks) return;
    const interval = setInterval(() => {
      setCurrentTask(prev => (prev + 1) % tasks.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <PageContainer>
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center animate-fade-in relative">
            <div className="relative w-64 h-64 mb-10">
                  <div className="absolute inset-0 bg-teal-500/5 blur-[60px] rounded-full animate-pulse-slow"></div>
                  
                  {/* Tech Rings */}
                  <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 rounded-full border border-teal-400/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-12 rounded-full border border-indigo-400/20 animate-[spin_6s_linear_infinite]"></div>
                  
                  {/* Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-24 rounded-full bg-[#050B14] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(20,184,166,0.15)] border border-teal-500/30 backdrop-blur-md">
                        <span className="text-3xl animate-pulse">✨</span>
                     </div>
                  </div>

                  {/* Orbits */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_10px_white] animate-[spin_3s_linear_infinite] origin-[0_128px]"></div>
            </div>
            
            <h2 className="text-2xl serif text-white mb-3 tracking-wide">{title}</h2>
            <p className="text-gray-400 text-sm max-w-[280px] mx-auto leading-relaxed font-light">{subtitle}</p>
            
            {tasks && (
              <div className="mt-8 h-6 flex flex-col items-center justify-center">
                <p className="text-teal-400 font-mono text-[10px] uppercase tracking-[0.2em] animate-slide-up key={currentTask}">
                  {tasks[currentTask]}
                </p>
              </div>
            )}
        </div>
    </PageContainer>
  );
};

interface ProcessingStepProps {
  title: string;
  subtitle?: string;
  tasks?: string[];
  minDuration?: number; 
  processPromise?: Promise<any>; 
  onComplete: (result?: any) => void;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ 
  title, subtitle, tasks, minDuration = 4000, processPromise, onComplete 
}) => {
  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    const runProcess = async () => {
      try {
        let result = null;
        if (processPromise) {
          result = await processPromise;
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          if (isMounted) onComplete(result);
        }, remaining);
      } catch (e) {
        console.error(e);
        setTimeout(() => {
          if (isMounted) onComplete(null);
        }, minDuration);
      }
    };

    runProcess();
    return () => { isMounted = false; };
  }, []);

  return <ProcessingUI title={title} subtitle={subtitle} tasks={tasks} />;
};

interface PalmUploadStepProps {
  onImageSelected: (base64: string) => void;
}

const PalmUploadStep: React.FC<PalmUploadStepProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onImageSelected(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
      <PageContainer>
        <ContentArea className="flex flex-col items-center justify-center">
          <Title>Hand Analysis</Title>
          <Subtitle>Upload a clear photo of your palm.</Subtitle>
          
          <div 
              className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0E1621] shadow-2xl flex flex-col items-center justify-center cursor-pointer group hover:border-teal-500/50 transition-all duration-500 mb-4"
              onClick={() => fileInputRef.current?.click()}
          >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-[#050B14] to-[#050B14]"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-teal-500/50"></div>
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-teal-500/50"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-teal-500/50"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-teal-500/50"></div>
              
              <div className="transition-transform duration-500 group-hover:scale-110 text-teal-500/80 mb-4 relative z-10">
                 <Icons.Camera />
              </div>
              <span className="text-gray-500 text-xs font-medium z-10 tracking-widest uppercase">Tap to Scan</span>
              
              {/* Scan Effect */}
              <div className="absolute left-0 right-0 h-[1px] bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-[scan_3s_ease-in-out_infinite] opacity-30"></div>
          </div>

          <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
          />
        </ContentArea>
        <ActionArea>
             <PrimaryButton onClick={() => fileInputRef.current?.click()}>Launch Scanner</PrimaryButton>
        </ActionArea>
      </PageContainer>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [userData, setUserData] = useState<UserData>({
    gender: null,
    birthDate: '',
    birthTime: null,
    birthPlace: '',
    relationshipStatus: null,
    goals: [],
    favoriteColor: null,
    element: null,
    palmImage: null
  });

  const [astroResult, setAstroResult] = useState<AstrologyResult | null>(null);
  const [palmResult, setPalmResult] = useState<PalmistryResult | null>(null);

  // --- Handlers ---

  const handleNext = () => {
    switch (step) {
      case AppStep.LANDING: setStep(AppStep.BIRTH_DATE); break;
      case AppStep.BIRTH_DATE: if(userData.birthDate) setStep(AppStep.BIRTH_TIME); break;
      case AppStep.BIRTH_TIME: setStep(AppStep.BIRTH_PLACE); break;
      case AppStep.BIRTH_PLACE: if(userData.birthPlace) setStep(AppStep.PROCESSING_CHART); break;
      case AppStep.PROCESSING_CHART: setStep(AppStep.RELATIONSHIP); break;
      case AppStep.RELATIONSHIP: setStep(AppStep.GOALS); break;
      case AppStep.GOALS: setStep(AppStep.COLOR); break;
      case AppStep.COLOR: setStep(AppStep.ELEMENT); break;
      case AppStep.ELEMENT: setStep(AppStep.PROCESSING_ACCURACY); break;
      case AppStep.PROCESSING_ACCURACY: setStep(AppStep.PALM_INTRO); break;
      case AppStep.PALM_INTRO: setStep(AppStep.PALM_UPLOAD); break;
      case AppStep.PALM_UPLOAD: if(userData.palmImage) setStep(AppStep.PROCESSING_PALM); break;
      case AppStep.PROCESSING_PALM: setStep(AppStep.RESULTS_PREVIEW); break;
      case AppStep.RESULTS_PREVIEW: setStep(AppStep.FULL_REPORT); break;
      default: break;
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateData = (field: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // --- Render Functions ---

  const renderLanding = () => (
    <PageContainer>
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[100%] bg-[radial-gradient(circle_at_center,#0f2238_0%,transparent_60%)] opacity-60"></div>
      </div>
      
      <ContentArea className="flex flex-col items-center justify-center relative z-10">
         <div className="w-20 h-20 border border-teal-500/20 rounded-full flex items-center justify-center mb-8 bg-[#0E1621] shadow-[0_0_40px_rgba(20,184,166,0.1)] relative">
            <div className="absolute inset-0 rounded-full border-t border-teal-500/40 animate-spin opacity-50"></div>
            <Icons.Star />
         </div>
         <h1 className="text-5xl serif text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-100 via-white to-teal-100 font-bold mb-4 drop-shadow-xl tracking-tighter">
           ASTROLINE
         </h1>
         <p className="text-teal-400/60 font-mono text-[9px] uppercase tracking-[0.4em] mb-12 border-b border-teal-500/10 pb-4">
           AI Destiny Analysis
         </p>
         
         <div className="flex gap-3 w-full max-w-sm animate-slide-up">
           {[
             { l: 'Female', v: Gender.Female, i: <Icons.Female /> },
             { l: 'Male', v: Gender.Male, i: <Icons.Male /> },
           ].map((opt) => (
             <button
                key={opt.l}
                onClick={() => { updateData('gender', opt.v); handleNext(); }}
                className="flex-1 glass-panel flex flex-col items-center justify-center py-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-teal-500/30 active:scale-95"
             >
                <div className="text-gray-500 group-hover:text-teal-400 transition-colors mb-2">{opt.i}</div>
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-white uppercase tracking-wider">{opt.l}</span>
             </button>
           ))}
         </div>
          <button
            onClick={() => { updateData('gender', Gender.NonBinary); handleNext(); }}
            className="mt-3 w-full max-w-sm glass-panel flex items-center justify-center py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-teal-500/30 active:scale-95"
            >
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="scale-75"><Icons.Genderless /></span> Other / Non-Binary
            </span>
        </button>
      </ContentArea>
       <div className="pb-safe p-4 text-center z-10">
         <p className="text-[9px] uppercase tracking-widest font-mono text-gray-600">Powered by Gemini 3</p>
       </div>
    </PageContainer>
  );

  const renderBirthDate = () => (
    <PageContainer>
        <ContentArea className="flex flex-col justify-center">
            <Title>First Breath</Title>
            <Subtitle>When did your journey begin?</Subtitle>
            <Input 
                type="date" 
                value={userData.birthDate} 
                onChange={(e) => updateData('birthDate', e.target.value)} 
                className="text-white appearance-none"
            />
        </ContentArea>
        <ActionArea>
            <PrimaryButton onClick={handleNext} disabled={!userData.birthDate}>Continue</PrimaryButton>
        </ActionArea>
    </PageContainer>
  );

  const renderBirthTime = () => (
    <PageContainer>
        <ContentArea className="flex flex-col justify-center">
            <Title>Precision Time</Title>
            <Subtitle>Needed for your Rising Sign.</Subtitle>
            <Input 
                type="time" 
                value={userData.birthTime || ''} 
                onChange={(e) => updateData('birthTime', e.target.value)} 
            />
            <button onClick={handleNext} className="mt-8 text-teal-500/70 text-xs hover:text-teal-400 transition-colors">Skip / I don't know</button>
        </ContentArea>
        <ActionArea>
             <PrimaryButton onClick={handleNext}>Confirm</PrimaryButton>
        </ActionArea>
    </PageContainer>
  );

  const renderBirthPlace = () => (
    <PageContainer>
        <ContentArea className="flex flex-col justify-center">
            <Title>Cosmic Origin</Title>
            <Subtitle>Where were you born?</Subtitle>
            <Input 
                type="text" 
                placeholder="City, Country"
                value={userData.birthPlace} 
                onChange={(e) => updateData('birthPlace', e.target.value)} 
                autoFocus
            />
        </ContentArea>
        <ActionArea>
            <PrimaryButton onClick={handleNext} disabled={!userData.birthPlace}>Align Stars</PrimaryButton>
        </ActionArea>
    </PageContainer>
  );

  const renderRelationship = () => (
    <PageContainer>
      <ContentArea>
          <Title>Status</Title>
          <Subtitle>Your heart's current position.</Subtitle>
          <OptionGrid>
            {[
              { l: RelationshipStatus.Single, i: <Icons.Smile /> },
              { l: RelationshipStatus.Looking, i: <Icons.Star /> },
              { l: RelationshipStatus.Relationship, i: <Icons.Heart /> },
              { l: RelationshipStatus.Married, i: <Icons.Ring /> },
              { l: RelationshipStatus.BrokeUp, i: <Icons.BrokenHeart /> },
            ].map(opt => (
              <SelectionCard 
                key={opt.l} 
                selected={userData.relationshipStatus === opt.l}
                onClick={() => { updateData('relationshipStatus', opt.l); handleNext(); }}
                icon={opt.i}
              >
                {opt.l}
              </SelectionCard>
            ))}
          </OptionGrid>
      </ContentArea>
    </PageContainer>
  );

  const renderGoals = () => {
    const toggleGoal = (g: Goal) => {
      const current = userData.goals;
      if (current.includes(g)) {
        updateData('goals', current.filter(x => x !== g));
      } else {
        if (current.length < 3) updateData('goals', [...current, g]);
      }
    };

    return (
      <PageContainer>
        <ContentArea>
            <Title>Focus Areas</Title>
            <Subtitle>Select up to 3 topics.</Subtitle>
            
            <div className="grid grid-cols-2 gap-3 pb-4">
            {[
                { l: Goal.Family, i: <Icons.Heart /> },
                { l: Goal.Career, i: <Icons.Briefcase /> },
                { l: Goal.Health, i: <Icons.Smile /> },
                { l: Goal.Marriage, i: <Icons.Ring /> },
                { l: Goal.Travel, i: <Icons.Plane /> },
                { l: Goal.Education, i: <Icons.Book /> },
                { l: Goal.Friends, i: <Icons.Users /> },
                { l: Goal.Children, i: <Icons.Baby /> },
            ].map(opt => {
                const isSelected = userData.goals.includes(opt.l);
                return (
                <button
                    key={opt.l}
                    onClick={() => toggleGoal(opt.l)}
                    className={`glass-panel flex flex-col items-center p-4 rounded-xl border transition-all duration-200 active:scale-95 ${
                        isSelected
                        ? 'bg-teal-900/30 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.1)]' 
                        : 'hover:bg-white/5 hover:border-white/20'
                    }`}
                >
                    <div className="text-xl mb-2 filter drop-shadow-md">{opt.i}</div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-teal-200' : 'text-gray-400'}`}>{opt.l}</span>
                </button>
            )})}
            </div>
        </ContentArea>
        <ActionArea>
            <PrimaryButton onClick={handleNext} disabled={userData.goals.length === 0}>
                Next ({userData.goals.length}/3)
            </PrimaryButton>
        </ActionArea>
      </PageContainer>
    );
  };

  const renderColor = () => (
    <PageContainer>
      <ContentArea>
        <Title>Aura</Title>
        <Subtitle>Select a resonance frequency.</Subtitle>
        <div className="space-y-3">
            {[
                { n: 'Red', c: 'from-red-600 to-orange-600' },
                { n: 'Gold', c: 'from-yellow-400 to-amber-600' },
                { n: 'Blue', c: 'from-blue-500 to-cyan-600' },
                { n: 'Purple', c: 'from-purple-600 to-indigo-600' },
                { n: 'Green', c: 'from-emerald-500 to-teal-600' }
            ].map(colorOpt => (
                 <button 
                   key={colorOpt.n}
                   onClick={() => { updateData('favoriteColor', colorOpt.n); handleNext(); }}
                   className="w-full relative overflow-hidden flex items-center p-4 rounded-xl bg-[#0E1621] hover:scale-[1.01] transition-all border border-white/5 active:scale-95"
                 >
                   <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colorOpt.c}`}></div>
                   <div className={`w-12 h-12 rounded-full mr-4 bg-gradient-to-br ${colorOpt.c} opacity-20 blur-lg absolute right-0`}></div>
                   <span className="text-lg text-white font-serif pl-4">{colorOpt.n}</span>
                 </button>
            ))}
        </div>
      </ContentArea>
    </PageContainer>
  );

  const renderElement = () => (
    <PageContainer>
        <ContentArea>
            <Title>Element</Title>
            <Subtitle>Your dominant nature.</Subtitle>
            <OptionGrid>
                {[
                    {l: 'Earth', i: <Icons.Leaf />, desc: 'Stable, Practical'}, 
                    {l: 'Water', i: <Icons.Water />, desc: 'Intuitive, Deep'}, 
                    {l: 'Fire', i: <Icons.Fire />, desc: 'Dynamic, Bold'}, 
                    {l: 'Air', i: <Icons.Wind />, desc: 'Intellectual, Free'}
                ].map(e => (
                    <button 
                        key={e.l} 
                        onClick={() => { updateData('element', e.l); handleNext(); }}
                        className={`
                          w-full glass-panel flex items-center p-4 mb-2 rounded-xl transition-all border text-left active:scale-95
                          ${userData.element === e.l 
                            ? 'bg-teal-900/30 border-teal-500/50' 
                            : 'hover:bg-white/5 hover:border-white/20'}
                        `}
                    >
                        <div className="p-2 bg-white/5 rounded-full mr-4 text-lg">{e.i}</div>
                        <div className="flex flex-col">
                            <span className="text-lg font-serif text-white">{e.l}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{e.desc}</span>
                        </div>
                    </button>
                ))}
            </OptionGrid>
        </ContentArea>
    </PageContainer>
  );

  const renderResultsPreview = () => {
      if (!palmResult) return null;

      const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
          <div className="mb-4 animate-slide-up">
              <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                  <span className="text-xs font-mono text-white">{value}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color} shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
              </div>
          </div>
      );

      return (
          <PageContainer>
              <div className="absolute inset-0 z-0">
                 {userData.palmImage && <img src={userData.palmImage} className="w-full h-full object-cover opacity-10 blur-xl scale-110" alt="Palm" />}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/95 to-[#050B14]/80"></div>
              </div>

              <ContentArea className="relative z-10 flex flex-col pt-8">
                  <div className="text-center mb-6">
                      <h1 className="text-3xl serif text-white mb-2">Analysis Complete</h1>
                      <div className="h-0.5 w-16 bg-teal-500 mx-auto rounded-full shadow-[0_0_10px_#2dd4bf]"></div>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 mb-6 border-t border-white/10 shadow-2xl">
                      <StatBar label="Emotion" value={palmResult.loveScore} color="bg-rose-500" />
                      <StatBar label="Vitality" value={palmResult.healthScore} color="bg-emerald-400" />
                      <StatBar label="Intellect" value={palmResult.wisdomScore} color="bg-blue-400" />
                      <StatBar label="Fate" value={palmResult.careerScore} color="bg-purple-500" />
                  </div>
                  
                  <div className="p-4 rounded-xl border-l-2 border-teal-500/50 bg-gradient-to-r from-teal-900/10 to-transparent">
                      <p className="text-gray-300 text-sm leading-6 font-light italic">
                          "{palmResult.summary}"
                      </p>
                  </div>
              </ContentArea>
              <ActionArea className="relative z-10">
                  <PrimaryButton onClick={handleNext}>View Full Report</PrimaryButton>
              </ActionArea>
          </PageContainer>
      )
  };

  const renderFullReport = () => (
    <PageContainer>
       {/* Sticky Header */}
       <div className="shrink-0 z-50 bg-[#050B14]/95 backdrop-blur-lg px-4 py-3 border-b border-white/5 flex items-center justify-between pt-safe">
            <button onClick={() => setStep(AppStep.LANDING)} className="text-gray-400 hover:text-white"><Icons.Back/></button>
            <span className="text-teal-400 font-serif tracking-[0.2em] text-[10px] font-bold uppercase">Cosmic Report</span>
            <div className="w-6"></div>
       </div>

       <ContentArea className="pb-10">
           {/* Hero Section */}
           <div className="text-center mb-8 relative mt-4">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-500/10 blur-[50px] rounded-full"></div>
               <div className="relative">
                   <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 p-[1px] mb-4 shadow-2xl">
                       <div className="w-full h-full rounded-full bg-[#050B14] flex items-center justify-center flex-col border-2 border-[#050B14]">
                           <span className="text-2xl font-serif text-white">{astroResult?.sunSign}</span>
                       </div>
                   </div>
                   <h2 className="text-2xl serif text-white">The {astroResult?.sunSign} Soul</h2>
               </div>
           </div>

           {/* Planetary Trinity - Compact Grid */}
           <div className="grid grid-cols-3 gap-2 mb-6">
               {[
                   { l: 'Sun', v: astroResult?.sunSign, c: 'text-amber-300' },
                   { l: 'Moon', v: astroResult?.moonSign, c: 'text-gray-300' },
                   { l: 'Rising', v: astroResult?.ascendant, c: 'text-teal-300' }
               ].map((item) => (
                   <div key={item.l} className="glass-panel p-2 rounded-xl text-center border-t border-white/5 relative overflow-hidden">
                       <span className="block text-gray-500 text-[8px] uppercase tracking-widest mb-1">{item.l}</span>
                       <span className={`text-xs font-serif ${item.c} block truncate font-medium`}>{item.v || 'N/A'}</span>
                   </div>
               ))}
           </div>

           {/* Core Prediction */}
           <div className="bg-[#0E1621] border border-teal-500/10 p-5 rounded-2xl mb-6 relative overflow-hidden shadow-lg">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
               <h3 className="text-sm serif text-white mb-3 flex items-center gap-2">
                   <span className="text-teal-400"><Icons.Sparkles /></span> Cosmic Forecast
               </h3>
               <p className="text-gray-300 leading-6 text-sm font-light font-mystic">
                   {astroResult?.prediction}
               </p>
           </div>
            
            {/* Palmistry Integration */}
            {palmResult && (
                <div className="glass-panel p-5 rounded-2xl mb-6 border border-white/5 relative">
                    <h3 className="text-sm serif text-white mb-4 flex items-center gap-2">
                        <span>✋</span> Palm Insight
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-rose-400/80 text-[10px] font-bold uppercase mb-1 tracking-wider">Heart & Emotion</h4>
                            <p className="text-gray-400 text-xs leading-5">{palmResult.loveText}</p>
                        </div>
                        <div>
                            <h4 className="text-purple-400/80 text-[10px] font-bold uppercase mb-1 tracking-wider">Fate & Career</h4>
                            <p className="text-gray-400 text-xs leading-5">{palmResult.careerText}</p>
                        </div>
                         <div className="bg-teal-900/10 p-3 rounded-lg mt-2 border border-teal-500/10">
                            <span className="text-teal-400 text-[9px] font-bold uppercase block mb-1 tracking-wider">Prediction</span>
                            <p className="text-teal-100/80 text-xs italic font-light">{palmResult.dominantHandPrediction}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Power Grid */}
           <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="glass-panel p-4 rounded-xl text-center flex flex-col items-center justify-center">
                   <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Power Word</span>
                   <span className="text-lg font-bold text-white uppercase tracking-widest">{astroResult?.powerWord}</span>
               </div>
               <div className="glass-panel p-4 rounded-xl text-center relative overflow-hidden flex flex-col items-center justify-center">
                   <div className="absolute inset-0 opacity-20 blur-xl" style={{backgroundColor: astroResult?.luckyColor?.toLowerCase().replace(' ', '')}}></div>
                   <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Lucky Color</span>
                   <span className="text-lg font-bold text-white relative z-10">{astroResult?.luckyColor}</span>
               </div>
           </div>
           
           <div className="text-center pb-8 opacity-40">
                <button onClick={() => setStep(AppStep.LANDING)} className="w-full py-3 border border-gray-800 rounded-xl text-gray-400 text-xs hover:text-white hover:border-white/20 transition-all">Start New Reading</button>
           </div>
       </ContentArea>
    </PageContainer>
  );

  return (
    <div className="h-full w-full max-w-md mx-auto bg-[#050B14] shadow-2xl relative font-sans text-gray-100 selection:bg-teal-500/30 overflow-hidden flex flex-col">
      {step !== AppStep.LANDING && step !== AppStep.RESULTS_PREVIEW && step !== AppStep.FULL_REPORT && (
        <Header step={step} totalSteps={14} onBack={handleBack} />
      )}
      
      {step === AppStep.LANDING && renderLanding()}
      {step === AppStep.BIRTH_DATE && renderBirthDate()}
      {step === AppStep.BIRTH_TIME && renderBirthTime()}
      {step === AppStep.BIRTH_PLACE && renderBirthPlace()}
      
      {step === AppStep.PROCESSING_CHART && (
        <ProcessingStep 
          title="Aligning Stars" 
          subtitle="Calculating planetary positions..."
          tasks={['Sun Position', 'Moon Phase', 'House Cusps', 'Aspects']}
          minDuration={3000}
          processPromise={generateAstrologyChart(userData)}
          onComplete={(result) => {
             if (result) setAstroResult(result);
             handleNext();
          }}
        />
      )}
      
      {step === AppStep.RELATIONSHIP && renderRelationship()}
      {step === AppStep.GOALS && renderGoals()}
      {step === AppStep.COLOR && renderColor()}
      {step === AppStep.ELEMENT && renderElement()}
      
      {step === AppStep.PROCESSING_ACCURACY && (
        <ProcessingStep 
          title="Deepening" 
          subtitle="Connecting personal data..." 
          tasks={['Elemental Resonance', 'Refining', 'Scanning Transits']}
          minDuration={2000}
          onComplete={handleNext}
        />
      )}
      
      {step === AppStep.PALM_INTRO && (
         <PageContainer>
            <ContentArea className="flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-teal-900/10 rounded-full flex items-center justify-center mb-6 border border-teal-500/20 relative">
                <div className="absolute inset-0 rounded-full border border-teal-500/10 animate-ping"></div>
                <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">✋</span>
             </div>
             <Title>The Final Layer</Title>
             <Subtitle>Your birth chart shows potential. Your palm shows reality.</Subtitle>
           </ContentArea>
           <ActionArea>
             <PrimaryButton onClick={handleNext}>Analyze Palm</PrimaryButton>
           </ActionArea>
         </PageContainer>
      )}
      
      {step === AppStep.PALM_UPLOAD && (
        <PalmUploadStep 
          onImageSelected={(img) => {
            updateData('palmImage', img);
            handleNext();
          }}
        />
      )}
      
      {step === AppStep.PROCESSING_PALM && (
        <ProcessingStep 
          title="Vision Analysis" 
          subtitle="Reading topographical lines..."
          tasks={['Heart Line Depth', 'Head Line Curve', 'Life Line Vitality', 'Fate Markers']}
          minDuration={5000}
          processPromise={analyzePalmImage(userData.palmImage!)}
          onComplete={(result) => {
            if (result) setPalmResult(result);
            handleNext();
          }}
        />
      )}
      
      {step === AppStep.RESULTS_PREVIEW && renderResultsPreview()}
      {step === AppStep.FULL_REPORT && renderFullReport()}
    </div>
  );
}