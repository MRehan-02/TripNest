if (typeof mapToken !== 'undefined' && mapToken) {
  mapboxgl.accessToken = mapToken;

  const defaultCoordinates = [74.2433, 16.7050]; // Kolhapur fallback
  const coordinates = (typeof listing !== 'undefined' && listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) 
    ? listing.geometry.coordinates 
    : defaultCoordinates;

  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 9
  });

  const marker = new mapboxgl.Marker({ color: '#f43f5e', rotation: 0 })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h4 style="font-weight:700; margin-bottom:4px;">${listing.title || 'TripNest Stay'}</h4><p style="font-size:12px; color:#6b7280;">Exact location provided after booking</p>`))
      .addTo(map);
}

