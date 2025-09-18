import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const PetitionContext = createContext();

export function PetitionProvider({ children }) {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('http://localhost:5000/api/petitions');
      const data = await res.json();
      // Transform images and signatures
      data.forEach(p => {
        if (p.image) p.image = `data:image/jpeg;base64,${p.image}`;
        if (p.signaturesList && Array.isArray(p.signaturesList)) {
          p.signaturesList = p.signaturesList.map(sig => sig.signature ? `data:image/png;base64,${sig.signature}` : null);
        }
      });
      setPetitions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPetition = async (formData) => {
    try {
      const res = await apiFetch('http://localhost:5000/api/petitions', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchPetitions();
    } catch (err) {
      throw new Error('Failed to create petition: ' + err.message);
    }
  };

  const signPetition = async (petitionId, signatureData) => {
    try {
      const res = await apiFetch(`http://localhost:5000/api/petitions/${petitionId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureData }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      throw new Error('Failed to sign petition: ' + err.message);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  return (
    <PetitionContext.Provider value={{ petitions, loading, error, fetchPetitions, createPetition, signPetition }}>
      {children}
    </PetitionContext.Provider>
  );
}

export { PetitionContext }; // Explicitly export the context
export default PetitionProvider; // Default export for the provider