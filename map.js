let map, markers = [], placesService, infoWindow;

function initMap(){
  const defaultCenter = { lat: 35.4676, lng: -97.5164 }; // OKC
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCenter, zoom: 4, mapTypeControl: true,
  });
  infoWindow = new google.maps.InfoWindow();
  placesService = new google.maps.places.PlacesService(map);

  // Try user geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(loc); map.setZoom(12);
      },
      () => {},
      { timeout: 5000 }
    );
  }

  document.getElementById('search-btn').addEventListener('click', runSearch);
  document.getElementById('search-input').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ e.preventDefault(); runSearch(); }
  });
}

function runSearch(){
  const q = document.getElementById('search-input').value.trim() || 'top restaurants near me';
  const request = { query: q };
  placesService.textSearch(request, (results, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;
    render(results.slice(0,5));
  });
}

function render(list){
  clearMarkers();
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  list.forEach((place, idx) => {
    const marker = new google.maps.Marker({
      map, position: place.geometry.location, label: String(idx+1)
    });
    markers.push(marker);
    marker.addListener('click', ()=> openInfo(place, marker));

    const card = document.createElement('article');
    card.className = 'card-item';
    card.tabIndex = 0;
    card.innerHTML = `<h3>${idx+1}. ${place.name}</h3>
      <p>${place.formatted_address || ''}</p>
      <p>${place.types?.slice(0,2).join(', ') || ''} ${place.rating ? ' • ⭐ ' + place.rating : ''}</p>
      <button class="btn" type="button">Focus</button>`;
    card.querySelector('button').addEventListener('click', () => {
      map.panTo(place.geometry.location); map.setZoom(15);
      openInfo(place, marker);
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        map.panTo(place.geometry.location); map.setZoom(15);
        openInfo(place, marker);
      }
    });
    cards.appendChild(card);
  });
}

function openInfo(place, marker){
  infoWindow.setContent(`<strong>${place.name}</strong><br>${place.formatted_address || ''}`);
  infoWindow.open({ map, anchor: marker });
}

function clearMarkers(){
  markers.forEach(m => m.setMap(null));
  markers = [];
}

window.initMap = initMap;
