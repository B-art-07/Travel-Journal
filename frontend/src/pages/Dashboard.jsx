import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const renderAudioPlayer = (url) => {
  if (!url) return null;
  
  if (url.includes('spotify.com')) {
    const embedUrl = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    return <iframe src={embedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="rounded-xl mt-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></iframe>;
  }
  
  if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
     const videoId = url.includes('youtu.be/') ? url.split('youtu.be/')[1].split('?')[0] : url.split('v=')[1].split('&')[0];
     return <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-xl mt-4 border border-slate-700 shadow-[0_0_15px_rgba(217,70,239,0.2)]"></iframe>;
  }
  
  return <a href={url} target="_blank" rel="noreferrer" className="text-cyan-400 underline mt-4 block text-sm tracking-widest uppercase hover:text-fuchsia-400">Launch External Audio Playlist 🎵</a>;
};

function Dashboard() {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(''); 
  const [trips, setTrips] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); 
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [existingCoverImage, setExistingCoverImage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [companions, setCompanions] = useState('');

  // ✅ Created a master variable for your API to keep the code perfectly clean!
  const API_BASE_URL = 'https://travel-journal-1-e9fi.onrender.com';

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setTrips(data);
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openEditModal = (trip, e) => {
    e.stopPropagation(); 
    setTitle(trip.title);
    setLocation(trip.destination);
    setDate(trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '');
    setDescription(trip.description);
    setExistingCoverImage(trip.coverImage || ''); 
    setMusicUrl(trip.musicPlaylistUrl || '');
    setCompanions(trip.companions ? trip.companions.join(', ') : '');
    setImageFile(null); 
    setEditingId(trip._id);
    setIsModalOpen(true);
  };

  const openNewTripModal = () => {
    setTitle('');
    setLocation('');
    setDate('');
    setDescription('');
    setExistingCoverImage('');
    setMusicUrl('');
    setCompanions('');
    setImageFile(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmitTrip = async (e) => {
    e.preventDefault();
    setError(''); 
    const token = localStorage.getItem('token');
    let finalImageUrl = existingCoverImage; 

    if (imageFile) {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) finalImageUrl = uploadData.imageUrl;
        else throw new Error('Failed to upload visual data.');
      } catch (err) {
        setError('Connection lost during visual upload.');
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    // ✅ Removed the hidden localhost link!
    const url = editingId ? `${API_BASE_URL}/api/trips/${editingId}` : `${API_BASE_URL}/api/trips`;
    const method = editingId ? 'PUT' : 'POST';
    const companionsArray = companions ? companions.split(',').map(c => c.trim()) : [];

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title, 
          destination: location, 
          startDate: date, 
          description,
          coverImage: finalImageUrl,
          musicPlaylistUrl: musicUrl, 
          companions: companionsArray 
        }),
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchTrips();
      } else {
        const data = await response.json();
        setError(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      setError('Connection to mainframe lost.');
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation(); 
    const isConfirmed = window.confirm("WARNING: Are you sure you want to permanently purge this memory fragment?");
    if (!isConfirmed) return;
    try {
      const token = localStorage.getItem('token');
      // ✅ Removed the final hidden localhost link!
      const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) setTrips(trips.filter(trip => trip._id !== id));
    } catch (err) {
      alert('Connection to mainframe lost.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-hidden text-slate-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 fixed pointer-events-none animate-grid-scan"></div>
      <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)] pointer-events-none fixed"></div>

      <nav className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse"></div>
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-widest uppercase">Neon<span className="text-slate-100">Journeys</span></h1>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 border border-fuchsia-500/30 px-4 py-2 rounded bg-fuchsia-500/10 transition-all duration-300">Disconnect</button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto p-6 mt-8 animate-entrance">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2 uppercase tracking-wide">Command Center</h2>
            <p className="text-cyan-400/70 text-sm tracking-widest">ACTIVE MEMORY DATABANKS</p>
          </div>
          <button onClick={openNewTripModal} className="group relative px-6 py-3 font-bold text-slate-950 uppercase tracking-widest overflow-hidden rounded bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
            <span className="relative z-10">+ Initialize New Protocol</span>
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
          </button>
        </div>

        {isLoading ? (
          <div className="text-cyan-400 text-center py-20 animate-pulse tracking-widest text-xl font-bold">ACCESSING DATABANKS...</div>
        ) : trips.length === 0 ? (
          <div className="w-full border-2 border-dashed border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-sm">
            <span className="text-slate-600 text-2xl mb-4">?</span>
            <h3 className="text-lg font-bold text-slate-400 mb-2 tracking-wider">NO DATA FRAGMENTS FOUND</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div 
                key={trip._id} 
                onClick={() => setSelectedTrip(trip)} 
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/80 p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 group flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                <div>
                  {trip.coverImage && (
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-lg border border-slate-700/50 relative">
                      <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                      <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 uppercase tracking-wide">{trip.title}</h3>
                    {trip.startDate && <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">{new Date(trip.startDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-fuchsia-400/80 uppercase tracking-wider font-bold">
                    <span className="text-lg">📍</span> {trip.destination}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-3 mb-6 line-clamp-3">{trip.description}</p>
                  
                  {trip.musicPlaylistUrl && <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase mb-4 animate-pulse">🎵 Audio Log Attached</div>}
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 tracking-widest uppercase">Click to Expand</span>
                  <div className="flex gap-2">
                    <button onClick={(e) => openEditModal(trip, e)} className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 hover:text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded bg-cyan-950/20 transition-all duration-300">Edit</button>
                    <button onClick={(e) => handleDeleteTrip(trip._id, e)} className="text-xs font-bold uppercase tracking-widest text-red-500/70 hover:text-red-400 border border-red-500/20 px-3 py-1.5 rounded bg-red-950/20 transition-all duration-300">Purge</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-entrance">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-[0_0_50px_-10px_rgba(34,211,238,0.4)] w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-5 text-slate-500 hover:text-fuchsia-400 text-xl transition-all">✕</button>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider uppercase mb-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {editingId ? "Update Memory Data" : "Upload Memory Data"}
            </h2>
            
            {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-400 text-sm font-bold text-center tracking-wider">{error}</div>}

            <form onSubmit={handleSubmitTrip} className="space-y-5">
              <div className="p-4 border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-lg text-center hover:border-cyan-400/50 transition-all">
                <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider cursor-pointer">
                  {existingCoverImage ? "Replace Visual Data (Optional)" : "Attach Visual Data (Optional)"}
                </label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer" />
                {imageFile && <p className="text-xs text-fuchsia-400 mt-2">Ready: {imageFile.name}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Memory Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Location Grid *</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Timestamp *</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all [color-scheme:dark]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Companions</label>
                  <input type="text" placeholder="John, Sarah..." value={companions} onChange={(e) => setCompanions(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600 text-sm" />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Audio Source (URL)</label>
                  <input type="url" placeholder="Spotify / YouTube Link" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Data Log *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest" disabled={isUploadingImage}>Abort</button>
                <button type="submit" disabled={isUploadingImage} className="px-5 py-2.5 border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400 hover:text-slate-950 transition-all text-sm uppercase tracking-widest disabled:opacity-50">
                  {isUploadingImage ? "TRANSMITTING..." : (editingId ? "Update Data" : "Transmit Data")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-entrance" onClick={() => setSelectedTrip(null)}>
          <div 
            className="bg-slate-950 border border-cyan-500/30 p-1 md:p-2 rounded-2xl shadow-[0_0_60px_-10px_rgba(34,211,238,0.3)] w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} 
          >
            <button onClick={() => setSelectedTrip(null)} className="absolute top-4 right-6 text-white hover:text-fuchsia-400 text-2xl z-20 drop-shadow-[0_0_5px_rgba(0,0,0,1)] transition-all">✕</button>
            
            <div className="bg-slate-900 rounded-xl overflow-hidden relative">
              {selectedTrip.coverImage ? (
                <div className="w-full h-64 md:h-80 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  <img src={selectedTrip.coverImage} alt={selectedTrip.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-32 bg-slate-800 border-b border-slate-700"></div>
              )}

              <div className="p-8 relative z-20 -mt-16">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] uppercase tracking-tight">{selectedTrip.title}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                    📍 {selectedTrip.destination}
                  </span>
                  {selectedTrip.startDate && (
                    <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                      {new Date(selectedTrip.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {selectedTrip.companions && selectedTrip.companions.length > 0 && (
                    <span className="bg-slate-800 text-slate-300 border border-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      👥 {selectedTrip.companions.join(', ')}
                    </span>
                  )}
                </div>

                <div className="prose prose-invert prose-cyan max-w-none mb-8">
                  <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-light border-l-4 border-cyan-500 pl-4">{selectedTrip.description}</p>
                </div>

                {selectedTrip.musicPlaylistUrl && (
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <h4 className="text-xs text-fuchsia-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span> Audio Log
                    </h4>
                    {renderAudioPlayer(selectedTrip.musicPlaylistUrl)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;