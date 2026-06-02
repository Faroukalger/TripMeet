const GOOGLE_API_KEY = 'AIzaSyAd4e-rY0y6F02X9LByRCQnz37V5vwvA08';

export const searchNearbyHotels = async (latitude, longitude, radius = 1000) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=lodging&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        stars: place.rating ? Math.round(place.rating) : 3,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photo: place.photos?.[0]?.photo_reference || null,
        rating: place.rating || 0,
        solos: Math.floor(Math.random() * 8) + 1,
        realDist: 0,
      }));
    }
    return [];
  } catch(e) {
    console.log('Erreur Google Places:', e);
    return [];
  }
};

export const getHotelPhoto = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

export const searchHotelByName = async (name) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(name + ' hotel')}&type=lodging&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        stars: place.rating ? Math.round(place.rating) : 3,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photo: place.photos?.[0]?.photo_reference || null,
        rating: place.rating || 0,
      }));
    }
    return [];
  } catch(e) {
    console.log('Erreur recherche hôtel:', e);
    return [];
  }
};
