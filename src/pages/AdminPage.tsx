
import React, { useState } from 'react';
import { MOCK_ADMIN_STATS } from '../constants';
import { Target, TrendingUp, Users, Database, Settings, Save, RefreshCw, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';

// Mock ROI History
const roiData = [
  { day: 'Lundi', roi: 5 },
  { day: 'Mardi', roi: 8 },
  { day: 'Mercredi', roi: -2 },
  { day: 'Jeudi', roi: 12 },
  { day: 'Vendredi', roi: 15 },
  { day: 'Samedi', roi: 10 },
  { day: 'Dimanche', roi: 18 },
];

export const AdminPage: React.FC = () => {
  const { aiWeights, updateWeights, saveConfig, retrainAI, systemLogs } = useConfig();
  const { state } = useBankroll();
  const [trainingStatus, setTrainingStatus] = useState<{msg: string, type: 'idle'|'loading'|'success'}>({ msg: '', type: 'idle'});

  const handleSliderChange = (key: keyof typeof aiWeights, val: string) => {
    updateWeights({
      ...aiWeights,
      [key]: parseFloat(val) / 100
    });
  };

  const handleRetrain = () => {
    setTrainingStatus({ msg: 'Analyse de l\'historique en cours...', type: 'loading' });
    
    setTimeout(() => {
        const res = retrainAI(state.history);
        if (res.success) {
            setTrainingStatus({ msg: `🔥 Retraining terminé ! Gain précision: +${res.improvement}%`, type: 'success' });
        } else {
            setTrainingStatus({ msg: `⚠️ ${res.msg}`, type: 'idle' });
        }
    }, 1500); // Fake delay for UX
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <h2 className="text-3xl font-bold">Dashboard Admin</h2>
         <div className="flex gap-4">
             <button 
                onClick={handleRetrain}
                disabled={trainingStatus.type === 'loading'}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
             >
                <RefreshCw size={18} className={trainingStatus.type === 'loading' ? 'animate-spin' : ''} /> 
                {trainingStatus.type === 'loading' ? 'Training...' : 'Retrain IA'}
             </button>
             <button 
                onClick={saveConfig}
                className="bg-neon hover:bg-neonHover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-neon/20"
             >
                <Save size={18} /> Sauvegarder Config
             </button>
         </div>
      </div>

      {/* Retrain Feedback Banner */}
      {trainingStatus.msg && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${trainingStatus.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surfaceHighlight border-neutral-700 text-gray-300'}`}>
              {trainingStatus.type === 'success' ? <CheckCircle /> : <Database />}
              <span className="font-bold">{trainingStatus.msg}</span>
          </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Target} 
          label="Précision IA" 
          value={`${MOCK_ADMIN_STATS.aiAccuracy}%`} 
          sub="+1.2% cette semaine" 
          color="text-neon" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="ROI Global" 
          value={`${MOCK_ADMIN_STATS.globalROI}%`} 
          sub="Excellent" 
          color="text-green-500" 
        />
        <StatCard 
          icon={Database} 
          label="Prédictions" 
          value={MOCK_ADMIN_STATS.totalPredictions.toString()} 
          sub="Total à vie" 
          color="text-blue-500" 
        />
        <StatCard 
          icon={Users} 
          label="Utilisateurs Actifs" 
          value={MOCK_ADMIN_STATS.activeUsers.toString()} 
          sub="En direct" 
          color="text-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
           <h3 className="font-bold text-lg mb-6">Performance ROI (7 jours)</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={roiData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="day" stroke="#666" fontSize={12} />
                 <YAxis stroke="#666" fontSize={12} />
                 <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                 <Line type="monotone" dataKey="roi" stroke="#FF7A00" strokeWidth={3} dot={{fill: '#FF7A00'}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Settings Area */}
        <div className="bg-surface border border-neutral-800 rounded-xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <Settings className="text-gray-400" />
             <h3 className="font-bold text-lg">Poids Modèle IA</h3>
           </div>
           
           <div className="space-y-6">
             <Slider 
                label="Importance Surface" 
                value={Math.round(aiWeights.surfaceWeight * 100)} 
                onChange={(e) => handleSliderChange('surfaceWeight', e.target.value)}
             />
             <Slider 
                label="Forme Récente" 
                value={Math.round(aiWeights.formWeight * 100)} 
                onChange={(e) => handleSliderChange('formWeight', e.target.value)}
             />
             <Slider 
                label="Historique H2H" 
                value={Math.round(aiWeights.h2hWeight * 100)} 
                onChange={(e) => handleSliderChange('h2hWeight', e.target.value)}
             />
             <Slider 
                label="Facteur Fatigue" 
                value={Math.round(aiWeights.fatigueFactor * 100)} 
                onChange={(e) => handleSliderChange('fatigueFactor', e.target.value)}
             />
             <Slider 
                label="Facteur Mental" 
                value={Math.round(aiWeights.mentalWeight * 100)} 
                onChange={(e) => handleSliderChange('mentalWeight', e.target.value)}
             />
             <Slider 
                label="Variance / Chaos" 
                value={Math.round(aiWeights.variance * 100)} 
                onChange={(e) => handleSliderChange('variance', e.target.value)}
             />
           </div>
           
           <div className="mt-8 text-xs text-gray-500 text-center">
             Modifiez les curseurs ou utilisez le bouton "Retrain IA" pour l'auto-apprentissage.
           </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="font-bold">Journaux Système</h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 text-gray-200 sticky top-0 bg-surface">
                <tr>
                <th className="p-4">Horodatage</th>
                <th className="p-4">Action</th>
                <th className="p-4">Détails</th>
                </tr>
            </thead>
            <tbody>
                {systemLogs.map(log => (
                <tr key={log.id} className="border-t border-neutral-800 hover:bg-white/5">
                    <td className="p-4 font-mono text-xs">{log.timestamp}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${log.action === 'MODEL_TRAIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-neonDim text-neon'}`}>{log.action}</span></td>
                    <td className="p-4">{log.details}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: any, label: string, value: string, sub: string, color: string }> = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-surface border border-neutral-800 rounded-xl p-6 flex items-start justify-between hover:border-neon/30 transition-colors">
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-white">{value}</h4>
      <p className={`text-xs mt-2 ${color}`}>{sub}</p>
    </div>
    <div className={`p-3 rounded-lg bg-black/40 ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);

const Slider: React.FC<{ label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
  <div>
    <div className="flex justify-between text-xs mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-neon">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={onChange}
      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon"
    />
  </div>
);
