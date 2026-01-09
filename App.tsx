import React, { useState, useEffect, useRef } from 'react';
import { 
  Header, PrimaryButton, SelectionCard, Title, Subtitle, 
  OptionGrid, Input, Icons 
} from './components/UIComponents';
import { 
  AppStep, Gender, RelationshipStatus, Goal, 
  UserData, PalmistryResult, AstrologyResult 
} from './types';
import { analyzePalmImage, generateAstrologyChart } from './services/geminiService';

// --- Sub-Components (Extracted to fix Hook Rules) ---

const ProcessingUI = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
      <div className="relative w-64 h-64 mb-8">
            {/* Rotating Chart Graphic */}
            <div className="absolute inset-0 rounded-full border border-teal-800 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-teal-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Placeholder Horoscope Wheel */}
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-teal-200" />
                    <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.5" className="text-teal-200" />
                    <circle cx="50" cy="50" r="20" fill="#162B36" />
              </svg>
            </div>
            {/* Connection lines overlay */}
            <svg className="absolute inset-0 w-full h-full animate-pulse">
                <line x1="20" y1="30" x2="80" y2="70" stroke="#4FD1C5" strokeWidth="1" opacity="0.5" />
                <line x1="80" y1="30" x2="20" y2="70" stroke="#4FD1C5" strokeWidth="1" opacity="0.5" />
                <circle cx="20" cy="30" r="2" fill="#4FD1C5" />
                <circle cx="80" cy="70" r="2" fill="#4FD1C5" />
            </svg>
      </div>
      
      <h2 className="text-2xl serif text-teal-100 mb-4">{title}</h2>
      {subtitle && (
          <div className="bg-[#fefce8] text-gray-900 p-4 rounded-xl relative max-w-xs shadow-lg animate-fade-in-up">
              <p className="font-medium text-sm">{subtitle}</p>
              {/* Chat bubble tail */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fefce8] rotate-45"></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-teal-800 border-2 border-[#fefce8] overflow-hidden">
                      <img src="https://picsum.photos/50/50" alt="Bot" />
                    </div>
              </div>
          </div>
      )}
  </div>
);

interface ProcessingStepProps {
  title: string;
  subtitle?: string;
  duration?: number;
  onNext: () => void;
  onMount?: () => void;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ title, subtitle, duration = 3000, onNext, onMount }) => {
  useEffect(() => {
    if (onMount) onMount();
    const timer = setTimeout(onNext, duration);
    return () => clearTimeout(timer);
  }, []);

  return <ProcessingUI title={title} subtitle={subtitle} />;
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
      <div className="flex flex-col items-center justify-center h-full p-6">
          <Title>Upload your palm</Title>
          <div 
              className="w-full h-64 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center bg-[#162B36] cursor-pointer hover:border-teal-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
          >
              <Icons.Female /> 
              <span className="mt-4 text-gray-400">Tap to select image</span>
          </div>
          <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
          />
          <div className="mt-8 w-full">
              <PrimaryButton onClick={() => fileInputRef.current?.click()}>Select Photo</PrimaryButton>
          </div>
      </div>
  );
};

interface PalmAnalysisStepProps {
  palmImage: string | null;
  onComplete: (result: PalmistryResult) => void;
}

const PalmAnalysisStep: React.FC<PalmAnalysisStepProps> = ({ palmImage, onComplete }) => {
  useEffect(() => {
      const processPalm = async () => {
          if (palmImage) {
              const result = await analyzePalmImage(palmImage);
              onComplete(result);
          } else {
             // Should not happen if flow is correct, but safe fallback
             onComplete({
               loveScore: 50, healthScore: 50, wisdomScore: 50, careerScore: 50,
               loveText: "N/A", healthText: "N/A", wisdomText: "N/A", careerText: "N/A", summary: "Analysis failed."
             });
          }
      };
      processPalm();
  }, []); // Run once on mount

  return <ProcessingUI title="Analyzing Lines..." subtitle="Deciphering the unique paths of your destiny..." />;
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
    // Logic for next step depending on current step
    switch (step) {
      case AppStep.LANDING: setStep(AppStep.BIRTH_DATE); break;
      case AppStep.BIRTH_DATE: 
        if(userData.birthDate) setStep(AppStep.BIRTH_TIME); 
        break;
      case AppStep.BIRTH_TIME: setStep(AppStep.BIRTH_PLACE); break;
      case AppStep.BIRTH_PLACE: 
        if(userData.birthPlace) setStep(AppStep.PROCESSING_CHART); 
        break;
      case AppStep.PROCESSING_CHART: setStep(AppStep.RELATIONSHIP); break;
      case AppStep.RELATIONSHIP: setStep(AppStep.GOALS); break;
      case AppStep.GOALS: setStep(AppStep.COLOR); break;
      case AppStep.COLOR: setStep(AppStep.ELEMENT); break;
      case AppStep.ELEMENT: setStep(AppStep.PROCESSING_ACCURACY); break;
      case AppStep.PROCESSING_ACCURACY: setStep(AppStep.PALM_INTRO); break;
      case AppStep.PALM_INTRO: setStep(AppStep.PALM_UPLOAD); break;
      case AppStep.PALM_UPLOAD: 
        if(userData.palmImage) setStep(AppStep.PROCESSING_PALM);
        break;
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

  // --- Render Functions (Pure UI) ---

  const renderLanding = () => (
    <div className="flex flex-col h-full items-center justify-between py-10 px-6 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop')] bg-cover bg-center relative">
       <div className="absolute inset-0 bg-[#0d1f2d]/80 z-0"></div>
       <div className="z-10 w-full flex flex-col items-center">
         <div className="w-16 h-16 border-2 border-teal-500 rounded-full flex items-center justify-center mb-6">
            <Icons.Star />
         </div>
         <h1 className="text-4xl serif text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white font-bold mb-4 drop-shadow-md">
           Unlock destiny with planets and palm reading
         </h1>
         <p className="text-gray-300 text-center text-sm mb-12 max-w-xs">
           Complete a 1-minute quiz to get a personalized prediction.
         </p>
         
         <div className="grid grid-cols-3 gap-4 w-full">
           {[
             { l: 'Female', v: Gender.Female, i: <Icons.Female /> },
             { l: 'Male', v: Gender.Male, i: <Icons.Male /> },
             { l: 'Non-binary', v: Gender.NonBinary, i: <Icons.Genderless /> }
           ].map((opt) => (
             <button
                key={opt.l}
                onClick={() => { updateData('gender', opt.v); handleNext(); }}
                className="flex flex-col items-center justify-center bg-[#162B36]/90 p-4 rounded-2xl h-32 border border-transparent hover:border-teal-500 transition-all backdrop-blur-sm"
             >
                <div className="text-teal-400 mb-2">{opt.i}</div>
                <span className="text-sm font-medium">{opt.l}</span>
             </button>
           ))}
         </div>
       </div>
    </div>
  );

  const renderBirthDate = () => (
    <div className="p-6">
      <Title>When’s your birthday?</Title>
      <Subtitle>It’s also important to know your date of birth for making complete and accurate predictions.</Subtitle>
      <div className="my-8">
        <Input 
          type="date" 
          value={userData.birthDate} 
          onChange={(e) => updateData('birthDate', e.target.value)} 
          className="text-white"
        />
      </div>
      <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-6">
        <PrimaryButton onClick={handleNext} disabled={!userData.birthDate}>Continue</PrimaryButton>
      </div>
    </div>
  );

  const renderBirthTime = () => (
    <div className="p-6">
      <Title>Do you know your birth time?</Title>
      <Subtitle>This helps us find out where planets were placed in the sky at the moment of your birth.</Subtitle>
      <div className="my-8">
        <Input 
          type="time" 
          value={userData.birthTime || ''} 
          onChange={(e) => updateData('birthTime', e.target.value)} 
        />
      </div>
      <div className="text-center mt-4">
        <button onClick={handleNext} className="text-teal-500 text-sm underline">I don't remember</button>
      </div>
      <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-6">
        <PrimaryButton onClick={handleNext}>Continue</PrimaryButton>
      </div>
    </div>
  );

  const renderBirthPlace = () => (
    <div className="p-6">
      <Title>Where were you born?</Title>
      <Subtitle>The place is important to explore your core personality traits, needs, and desires.</Subtitle>
      <div className="my-8">
        <Input 
          type="text" 
          placeholder="Toronto, Ontario, Canada"
          value={userData.birthPlace} 
          onChange={(e) => updateData('birthPlace', e.target.value)} 
        />
      </div>
      <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-6">
        <PrimaryButton onClick={handleNext} disabled={!userData.birthPlace}>Continue</PrimaryButton>
      </div>
    </div>
  );

  const renderRelationship = () => (
    <div className="p-6">
      <Title>Relationship Status</Title>
      <Subtitle>To get started, tell us about your current relationship status.</Subtitle>
      <OptionGrid>
        {[
          { l: RelationshipStatus.Relationship, i: <Icons.Heart /> },
          { l: RelationshipStatus.BrokeUp, i: <Icons.BrokenHeart /> },
          { l: RelationshipStatus.Engaged, i: <Icons.Smile /> },
          { l: RelationshipStatus.Married, i: <Icons.Ring /> },
          { l: RelationshipStatus.Looking, i: <Icons.Star /> },
          { l: RelationshipStatus.Single, i: <Icons.Smile /> },
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
    </div>
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
        <div className="p-6 pb-24">
        <Title>What are your goals?</Title>
        <Subtitle>Select up to 3</Subtitle>
        <div className="text-center mb-4 text-teal-400 font-bold">{userData.goals.length}/3</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: Goal.Family, i: <Icons.Heart /> },
            { l: Goal.Career, i: <Icons.Briefcase /> },
            { l: Goal.Health, i: <Icons.Smile /> },
            { l: Goal.Marriage, i: <Icons.Ring /> },
            { l: Goal.Travel, i: <Icons.Plane /> },
            { l: Goal.Education, i: <Icons.Book /> },
            { l: Goal.Friends, i: <Icons.Users /> },
            { l: Goal.Children, i: <Icons.Baby /> },
          ].map(opt => (
            <button
                key={opt.l}
                onClick={() => toggleGoal(opt.l)}
                className={`flex items-center p-3 rounded-xl border text-left transition-all ${
                    userData.goals.includes(opt.l)
                    ? 'bg-teal-900/50 border-teal-500 text-teal-100' 
                    : 'bg-[#162B36] border-transparent text-gray-300'
                }`}
            >
                <span className="mr-2">{opt.i}</span>
                <span className="text-sm font-medium">{opt.l}</span>
            </button>
          ))}
        </div>
        <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-6">
            <PrimaryButton onClick={handleNext} disabled={userData.goals.length === 0}>Continue</PrimaryButton>
        </div>
      </div>
    );
  };

  const renderColor = () => (
    <div className="p-6">
        <Title>Preferred Color?</Title>
        <Subtitle>Important for better personalization.</Subtitle>
        <OptionGrid>
            {['Red', 'Yellow', 'Blue', 'Orange', 'Green'].map(c => (
                 <div 
                 key={c}
                 onClick={() => { updateData('favoriteColor', c); handleNext(); }}
                 className="flex items-center p-4 rounded-xl bg-[#162B36] cursor-pointer hover:bg-[#1e3a4a] transition-colors"
               >
                 <div className="w-8 h-8 rounded-full mr-4 border border-white/10" style={{ backgroundColor: c.toLowerCase() }}></div>
                 <span className="text-lg text-white">{c}</span>
               </div>
            ))}
        </OptionGrid>
    </div>
  );

  const renderElement = () => (
    <div className="p-6">
        <Title>Which element of nature do you like best?</Title>
        <OptionGrid>
            {[
                {l: 'Earth', i: <Icons.Leaf />}, 
                {l: 'Water', i: <Icons.Water />}, 
                {l: 'Fire', i: <Icons.Fire />}, 
                {l: 'Air', i: <Icons.Wind />}
            ].map(e => (
                <SelectionCard 
                    key={e.l} 
                    selected={userData.element === e.l}
                    onClick={() => { updateData('element', e.l); handleNext(); }}
                    icon={e.i}
                >
                    {e.l}
                </SelectionCard>
            ))}
        </OptionGrid>
    </div>
  );

  const renderPalmIntro = () => (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Title>Take a photo of your left palm</Title>
          <div className="relative my-8">
              {/* Palm Scan Graphic */}
              <div className="w-64 h-80 border-2 border-dashed border-teal-500/50 rounded-3xl flex items-center justify-center bg-[#162B36]/30">
                  <svg className="w-48 h-48 text-teal-800 opacity-50" viewBox="0 0 100 100" fill="currentColor">
                     <path d="M50 95 C 40 90, 30 80, 30 60 L 25 35 A 3 3 0 0 1 31 35 L 35 55 L 38 30 A 3 3 0 0 1 44 30 L 45 50 L 50 20 A 3 3 0 0 1 56 20 L 55 50 L 62 25 A 3 3 0 0 1 68 25 L 65 55 L 75 40 A 3 3 0 0 1 80 45 L 70 70 C 65 85, 60 90, 50 95" />
                  </svg>
                  {/* Overlay Tags */}
                  <div className="absolute top-10 right-0 bg-[#0f172a] text-xs px-2 py-1 rounded-full border border-teal-500 text-teal-400 flex items-center gap-1"><Icons.Heart/> Marriage</div>
                  <div className="absolute bottom-20 left-0 bg-[#0f172a] text-xs px-2 py-1 rounded-full border border-teal-500 text-teal-400 flex items-center gap-1"><Icons.Briefcase/> Career</div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-teal-400 shadow-[0_0_15px_#4FD1C5] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">Privacy is a priority. We only process non-identifiable data to ensure anonymity.</p>
          <div className="w-full">
            <PrimaryButton onClick={handleNext}>Take a photo</PrimaryButton>
          </div>
      </div>
  );

  const renderResultsPreview = () => {
      if (!palmResult) return null;

      const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 w-24">
                  <div className={`w-2 h-2 rounded-full ${color}`}></div>
                  <span className="text-sm font-medium text-gray-200">{label}</span>
              </div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full mx-3 overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
              </div>
              <span className="text-xs font-mono text-gray-400">{value}%</span>
          </div>
      );

      return (
          <div className="relative min-h-screen bg-[#0d1f2d]">
              {/* Background Image Effect */}
              <div className="absolute inset-0 z-0 opacity-20">
                 {userData.palmImage && <img src={userData.palmImage} className="w-full h-full object-cover blur-sm" alt="Palm" />}
              </div>
              <div className="relative z-10 flex flex-col h-full p-6 bg-gradient-to-b from-[#0d1f2d]/80 via-[#0d1f2d] to-[#0d1f2d]">
                  <h1 className="text-3xl serif text-center text-[#eef2f6] mt-8 mb-2">Your palm reading</h1>
                  <p className="text-center text-teal-400 text-sm mb-10 font-medium tracking-wide">IS READY!</p>

                  <div className="bg-[#162B36]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl mb-8">
                      <StatBar label="Love" value={palmResult.loveScore} color="bg-rose-500" />
                      <StatBar label="Health" value={palmResult.healthScore} color="bg-teal-400" />
                      <StatBar label="Wisdom" value={palmResult.wisdomScore} color="bg-yellow-400" />
                      <StatBar label="Career" value={palmResult.careerScore} color="bg-violet-500" />
                      
                      <hr className="border-white/10 my-6"/>

                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          <strong className="text-rose-400">Heart Line:</strong> {palmResult.loveText}
                      </p>
                       <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          <strong className="text-teal-400">Life Line:</strong> {palmResult.healthText}
                      </p>
                      
                      <div className="mt-4 text-center">
                          <button className="text-teal-400 text-xs font-bold uppercase tracking-widest hover:text-teal-300">More data in full report</button>
                      </div>
                  </div>

                  <div className="mt-auto">
                      <PrimaryButton onClick={handleNext}>Get Full Report</PrimaryButton>
                  </div>
              </div>
          </div>
      )
  };

  const renderFullReport = () => (
    <div className="p-6 h-screen overflow-y-auto bg-[#0d1f2d]">
       <div className="flex items-center justify-between mb-8">
            <button onClick={() => setStep(AppStep.LANDING)} className="text-gray-400"><Icons.Back/></button>
            <span className="text-teal-500 font-serif font-bold">PREMIUM REPORT</span>
            <div className="w-6"></div>
       </div>

       <div className="text-center mb-8">
           <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 p-1 mb-4">
               <div className="w-full h-full rounded-full bg-[#0d1f2d] flex items-center justify-center flex-col">
                   <span className="text-2xl font-serif text-white">{astroResult?.sunSign || 'Sun'}</span>
                   <span className="text-xs text-gray-400">Sun Sign</span>
               </div>
           </div>
           <h2 className="text-2xl font-serif text-white mb-2">Hello, {userData.gender === Gender.Female ? 'Goddess' : 'Traveler'}</h2>
           <p className="text-gray-400 text-sm">Born in {userData.birthPlace}</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-[#162B36] p-4 rounded-xl text-center">
               <span className="block text-gray-400 text-xs uppercase mb-1">Moon Sign</span>
               <span className="text-lg text-teal-200 serif">{astroResult?.moonSign || 'Calculating...'}</span>
           </div>
           <div className="bg-[#162B36] p-4 rounded-xl text-center">
               <span className="block text-gray-400 text-xs uppercase mb-1">Ascendant</span>
               <span className="text-lg text-teal-200 serif">{astroResult?.ascendant || 'Calculating...'}</span>
           </div>
       </div>

       <div className="bg-gradient-to-r from-teal-900/40 to-indigo-900/40 border border-teal-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl"></div>
           <h3 className="text-xl serif text-white mb-3 relative z-10">Cosmic Prediction</h3>
           <p className="text-gray-300 leading-relaxed text-sm relative z-10">
               {astroResult?.prediction || "The stars are currently aligning to generate your unique path..."}
           </p>
       </div>

        <div className="bg-[#162B36] p-6 rounded-2xl mb-8">
           <h3 className="text-xl serif text-white mb-4">Palm Summary</h3>
           <p className="text-gray-300 leading-relaxed text-sm italic">
               "{palmResult?.summary || "Analyzing palm lines..."}"
           </p>
        </div>

       <div className="text-center pb-8">
           <p className="text-xs text-gray-500">Power Word</p>
           <p className="text-3xl serif text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 font-bold uppercase tracking-widest">
               {astroResult?.powerWord || "DESTINY"}
           </p>
       </div>
    </div>
  );

  // --- Main Switch ---

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#0d1f2d] shadow-2xl overflow-hidden relative font-sans text-gray-100">
      {step !== AppStep.LANDING && step !== AppStep.RESULTS_PREVIEW && step !== AppStep.FULL_REPORT && (
        <Header step={step} totalSteps={14} onBack={handleBack} />
      )}
      
      <div className="h-full">
        {step === AppStep.LANDING && renderLanding()}
        {step === AppStep.BIRTH_DATE && renderBirthDate()}
        {step === AppStep.BIRTH_TIME && renderBirthTime()}
        {step === AppStep.BIRTH_PLACE && renderBirthPlace()}
        
        {step === AppStep.PROCESSING_CHART && (
          <ProcessingStep 
            title="Mapping your birth chart..." 
            subtitle="Your chart shows a rare spark — let's discover your best match"
            onNext={handleNext}
            onMount={() => {
              if (!astroResult) {
                generateAstrologyChart(userData).then(setAstroResult);
              }
            }}
          />
        )}
        
        {step === AppStep.RELATIONSHIP && renderRelationship()}
        {step === AppStep.GOALS && renderGoals()}
        {step === AppStep.COLOR && renderColor()}
        {step === AppStep.ELEMENT && renderElement()}
        
        {step === AppStep.PROCESSING_ACCURACY && (
          <ProcessingStep 
            title="Forecast accuracy" 
            subtitle="You're close to a big reveal! Confirm one last thing..." 
            duration={3000}
            onNext={handleNext}
          />
        )}
        
        {step === AppStep.PALM_INTRO && renderPalmIntro()}
        
        {step === AppStep.PALM_UPLOAD && (
          <PalmUploadStep 
            onImageSelected={(img) => {
              updateData('palmImage', img);
              handleNext();
            }}
          />
        )}
        
        {step === AppStep.PROCESSING_PALM && (
          <PalmAnalysisStep 
            palmImage={userData.palmImage}
            onComplete={(result) => {
              setPalmResult(result);
              handleNext();
            }}
          />
        )}
        
        {step === AppStep.RESULTS_PREVIEW && renderResultsPreview()}
        {step === AppStep.FULL_REPORT && renderFullReport()}
      </div>
    </div>
  );
}