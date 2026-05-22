import React, { useEffect, useState } from 'react'
import RestaurantCard from '../components/RestaurantCard'
import api from '../lib/api'
import { Sparkles, Filter, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'

const CUISINE_OPTIONS = ['South Indian', 'Continental', 'Seafood', 'Vegan', 'North Indian', 'Breakfast'];
const DIETARY_OPTIONS = [
  { id: 'any', label: 'Any' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'non-veg', label: 'Non-Veg' }
];

export default function Recommendations() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalized, setPersonalized] = useState(false);
  const [preferredCuisines, setPreferredCuisines] = useState([]);
  const [dietary, setDietary] = useState('any');
  const [maxDelivery, setMaxDelivery] = useState(45);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isGuest = localStorage.getItem('userType') === 'guest' || !user;

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const prefs = { preferredCuisines, dietary, maxDeliveryMinutes: maxDelivery };
      const params = isGuest ? { preferences: JSON.stringify(prefs) } : {};
      const { data } = await api.get('/restaurants/recommendations', { params });
      setRestaurants(data.restaurants || []);
      setPersonalized(data.personalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      let cuisines = [];
      let diet = 'any';
      let delivery = 45;
      if (user?.preferences) {
        cuisines = user.preferences.preferredCuisines || [];
        diet = user.preferences.dietary || 'any';
        delivery = user.preferences.maxDeliveryMinutes || 45;
        setPreferredCuisines(cuisines);
        setDietary(diet);
        setMaxDelivery(delivery);
      }
      setLoading(true);
      try {
        const prefs = { preferredCuisines: cuisines, dietary: diet, maxDeliveryMinutes: delivery };
        const params = isGuest ? { preferences: JSON.stringify(prefs) } : {};
        const { data } = await api.get('/restaurants/recommendations', { params });
        setRestaurants(data.restaurants || []);
        setPersonalized(data.personalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCuisine = (c) => {
    setPreferredCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const saveAndRefresh = async () => {
    if (!isGuest) {
      try {
        await api.put('/restaurants/preferences', {
          preferredCuisines,
          dietary,
          maxDeliveryMinutes: maxDelivery
        });
        const updated = { ...user, preferences: { preferredCuisines, dietary, maxDeliveryMinutes: maxDelivery } };
        localStorage.setItem('user', JSON.stringify(updated));
      } catch (err) {
        console.error('Save preferences failed', err);
      }
    }
    fetchRecommendations();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              {personalized ? 'Personalized for you' : 'Popular near you'}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold">Order from top hotels</h1>
          <p className="mt-2 text-lg opacity-90 max-w-xl">
            Zomato & Swiggy style picks — restaurants ranked by your taste, diet, and delivery time.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-green-600" />
            <h2 className="font-bold text-gray-800">Your food preferences</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {CUISINE_OPTIONS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  preferredCuisines.includes(c)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {DIETARY_OPTIONS.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDietary(d.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  dietary === d.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <label className="text-sm text-gray-600 block mb-2">
            Max delivery: {maxDelivery} min
          </label>
          <input
            type="range"
            min={15}
            max={60}
            value={maxDelivery}
            onChange={(e) => setMaxDelivery(Number(e.target.value))}
            className="w-full max-w-md mb-4 accent-green-600"
          />
          <Button onClick={saveAndRefresh} className="bg-green-600 hover:bg-green-700 rounded-xl">
            Apply & refresh picks
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, i) => (
              <RestaurantCard key={r._id} restaurant={r} rank={i + 1} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
