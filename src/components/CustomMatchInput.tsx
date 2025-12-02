import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const CustomMatchInput: React.FC = () => {
  const { addCustomMatch } = useData();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    if (p1 && p2) {
        addCustomMatch(p1, p2);
        setP1('');
        setP2('');
        setIsOpen(false);
    }
  };

  if (!isOpen) {
      return (
          <button onClick={() => setIsOpen(true)} className="w-full py-3 border-2 border-dashed border-neutral-800 text-gray-500 rounded-xl hover:border-neon hover:text-neon transition-all flex items-center justify-center gap-2">
              <PlusCircle size={20} /> Ajouter un match manuellement
          </button>
      );
  }

  return (
    <div className="bg-surface border border-neon/30 p-4 rounded-xl animate-fade-in mb-4">
        <h3 className="text-white font-bold mb-3 text-sm">Sélectionner de nouveaux joueurs</h3>
        <div className="flex flex-col gap-3">
            <input 
                type="text" 
                placeholder="Joueur 1 (ex: Nadal)" 
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="bg-black/40 border border-neutral-700 rounded p-2 text-white text-sm focus:border-neon outline-none"
            />
            <div className="text-center text-xs text-gray-500 font-bold">CONTRE</div>
            <input 
                type="text" 
                placeholder="Joueur 2 (ex: Federer)" 
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                className="bg-black/40 border border-neutral-700 rounded p-2 text-white text-sm focus:border-neon outline-none"
            />
            <div className="flex gap-2 mt-2">
                <button onClick={() => setIsOpen(false)} className="flex-1 py-2 bg-neutral-800 text-gray-400 rounded text-xs font-bold">Annuler</button>
                <button onClick={handleAdd} className="flex-1 py-2 bg-neon text-black rounded text-xs font-bold hover:bg-neonHover">AJOUTER & ANALYSER</button>
            </div>
        </div>
    </div>
  );
};
