import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { Business } from './types';
import { X, Save, Building2, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('biz_analyst_businesses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'chat'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('biz_analyst_businesses', JSON.stringify(businesses));
  }, [businesses]);

  const handleAddBusiness = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newBusiness: Business = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      niche: formData.get('niche') as string,
      website: formData.get('website') as string,
      description: formData.get('description') as string,
      createdAt: Date.now()
    };

    setBusinesses(prev => [...prev, newBusiness]);
    setSelectedBusinessId(newBusiness.id);
    setShowAddModal(false);
  };

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  return (
    <div className="flex h-screen bg-app-bg text-app-text font-sans overflow-hidden">
      <Sidebar 
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onSelectBusiness={(id) => {
          setSelectedBusinessId(id);
          setView('dashboard');
        }}
        onAddBusiness={() => setShowAddModal(true)}
        onLogout={() => {
           if(confirm("Logout will clear the current business view.")) {
             setSelectedBusinessId(null);
           }
        }}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-app-bg rounded-tl-3xl shadow-[-10px_-10px_30px_rgba(0,0,0,0.5)] border-l border-white/5 my-2 mr-2">
        {selectedBusiness ? (
          view === 'dashboard' ? (
            <Dashboard 
              business={selectedBusiness} 
              onStartChat={() => setView('chat')} 
            />
          ) : (
            <ChatInterface 
              business={selectedBusiness} 
              onBack={() => setView('dashboard')}
            />
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-app-muted">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-app-accent blur-3xl opacity-20 rounded-full"></div>
               <div className="w-32 h-32 bg-app-card rounded-3xl flex items-center justify-center relative border border-white/10 shadow-2xl">
                  <Building2 className="w-12 h-12 text-app-accent" />
               </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to BIZ AI</h2>
            <p className="max-w-md text-lg opacity-70">Select a business from the sidebar or add a new one to start your expert analysis session.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-8 px-8 py-3 bg-app-accent text-black rounded-xl hover:bg-[#bef264] transition-all font-bold shadow-[0_0_20px_rgba(217,249,157,0.3)]"
            >
              Add Your First Business
            </button>
          </div>
        )}
      </div>

      {/* Add Business Modal - Dark Theme */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-app-card rounded-3xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-app-accent" />
                Add New Business
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-app-muted hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddBusiness} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Business Name</label>
                <input required name="name" type="text" className="w-full bg-app-bg text-white rounded-xl border-white/10 border px-4 py-3 focus:ring-2 focus:ring-app-accent focus:border-transparent outline-none transition-all placeholder-white/20" placeholder="e.g. Acme Corp" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Niche</label>
                  <input required name="niche" type="text" className="w-full bg-app-bg text-white rounded-xl border-white/10 border px-4 py-3 focus:ring-2 focus:ring-app-accent focus:border-transparent outline-none transition-all placeholder-white/20" placeholder="e.g. Retail" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Website</label>
                  <input name="website" type="url" className="w-full bg-app-bg text-white rounded-xl border-white/10 border px-4 py-3 focus:ring-2 focus:ring-app-accent focus:border-transparent outline-none transition-all placeholder-white/20" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Description</label>
                <textarea required name="description" rows={4} className="w-full bg-app-bg text-white rounded-xl border-white/10 border px-4 py-3 focus:ring-2 focus:ring-app-accent focus:border-transparent outline-none transition-all resize-none placeholder-white/20" placeholder="Describe your business model..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-app-accent text-black font-bold py-4 rounded-xl hover:bg-[#bef264] transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Save className="w-5 h-5" />
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;