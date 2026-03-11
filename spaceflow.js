// DATA

const baseRooms = [

    { id: 1, name: 'Horizon Lounge', capacity: 50, basePrice: 299, location: 'Pięro 1', emoji: '🌅', rating: 4.8, reviews: 234, amenities: ['Wifi', 'Projektor', 'Kawa'] },

    { id: 2, name: 'Code Cave', capacity: 20, basePrice: 149, location: 'Pięro 2', emoji: '💻', rating: 4.9, reviews: 567, amenities: ['Wifi', 'Monitor', 'Pizza'] },

    { id: 3, name: 'Creative Hub', capacity: 30, basePrice: 199, location: 'Pięro 1', emoji: '🎨', rating: 4.7, reviews: 189, amenities: ['Wifi', 'Tablica', 'Snacki'] },

    { id: 4, name: 'Zen Garden', capacity: 15, basePrice: 99, location: 'Pięro 3', emoji: '🧘', rating: 5.0, reviews: 45, amenities: ['Wifi', 'Spokój', 'Herbata'] },

    { id: 5, name: 'Thunder Dome', capacity: 100, basePrice: 499, location: 'Pięro 2', emoji: '⚡', rating: 4.6, reviews: 892, amenities: ['Wifi', 'Audio', 'Catering'] },

    { id: 6, name: 'Starlight Studio', capacity: 25, basePrice: 179, location: 'Pięro 4', emoji: '✨', rating: 4.9, reviews: 421, amenities: ['Wifi', 'LED', 'Parking'] }

];



let favorites = [];



// INIT

document.getElementById('filterDate').valueAsDate = new Date();



// GENERATE ROOMS

function generateRooms() {

    const capacity = parseInt(document.getElementById('filterCapacity').value);

    return baseRooms.filter(r => r.capacity >= capacity).map(room => {

        const demandFactor = 0.8 + Math.sin(Date.now() / 10000) * 0.4;

        const capacityFactor = 1 - ((room.capacity - capacity) / room.capacity) * 0.3;

        const dynamicPrice = Math.round(room.basePrice * demandFactor * capacityFactor);

        const occupancy = Math.floor(Math.random() * 60) + 30;

        return { ...room, price: dynamicPrice, occupancy };

    });

}



// DEMAND INDICATOR

function getDemandIndicator(occupancy) {

    if (occupancy > 70) return { text: 'GORĄCO! 🔥', class: 'demand-hot' };

    if (occupancy > 40) return { text: 'Popularnie 📈', class: 'demand-warm' };

    return { text: 'Spokojnie 😎', class: 'demand-cool' };

}



// RENDER ROOMS

function renderRooms() {

    const rooms = generateRooms();

    const gridView = document.getElementById('gridView');

    const listView = document.getElementById('listView');



    gridView.innerHTML = rooms.map(room => {

        const demand = getDemandIndicator(room.occupancy);

        return `

            <div class="room-card" onclick="selectRoom(${room.id})">

                <span class="room-emoji">${room.emoji}</span>

                <div class="room-header">

                    <div class="room-title-section">

                        <h3>${room.name}</h3>

                        <div class="room-location">📍 ${room.location}</div>

                    </div>

                    <button class="btn-favorite ${favorites.includes(room.id) ? 'active' : ''}" onclick="toggleFavorite(event, ${room.id})">❤️</button>

                </div>

                <div class="demand-indicator ${demand.class}">${demand.text}</div>

                <div class="occupancy-bar"><div class="occupancy-fill" style="width: ${room.occupancy}%"></div></div>

                <div class="occupancy-text">${room.occupancy}% zajęte</div>

                <div class="amenities">${room.amenities.slice(0, 2).map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>

                <div class="room-footer">

                    <div>⭐ ${room.rating} (${room.reviews})</div>

                    <div>👥 ${room.capacity}</div>

                </div>

                <div class="room-price-section">

                    <div><div style="font-size: 12px; color: #a78bfa;">Cena/h</div><div class="price-amount">$${room.price}</div></div>

                    <button class="btn-book">Rezerwuj →</button>

                </div>

            </div>

        `;

    }).join('');



    listView.innerHTML = rooms.map(room => `

        <div class="room-list-item" onclick="selectRoom(${room.id})">

            <div class="room-list-content">

                <span class="room-list-emoji">${room.emoji}</span>

                <div class="room-list-info">

                    <h4>${room.name}</h4>

                    <p>${room.location} • ${room.capacity} osób • ⭐ ${room.rating}</p>

                </div>

            </div>

            <div class="room-list-right">

                <div class="room-list-price">$${room.price}</div>

                <button class="btn-book">Rezerwuj</button>

            </div>

        </div>

    `).join('');

}



// HEATMAP

function generateHeatmap() {

    const container = document.getElementById('heatmapGrid');

    const days = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];

    let html = days.map(d => `<div class="heatmap-day">${d}</div>`).join('');

    for (let i = 0; i < 28; i++) {

        const intensity = Math.random();

        const className = intensity > 0.7 ? 'heatmap-hot' : intensity > 0.4 ? 'heatmap-warm' : 'heatmap-cool';

        html += `<div class="heatmap-cell ${className}"></div>`;

    }

    container.innerHTML = html;

}



// CHANGE VIEW

document.getElementById('filterView').addEventListener('change', (e) => {

    const view = e.target.value;

    document.getElementById('gridView').classList.toggle('hidden', view !== 'grid');

    document.getElementById('listView').classList.toggle('hidden', view !== 'list');

    document.getElementById('mapView').classList.toggle('hidden', view !== 'map');

    if (view === 'map') generateHeatmap();

});



// CHANGE CAPACITY

document.getElementById('filterCapacity').addEventListener('change', renderRooms);



// CHAT

document.getElementById('chatBtn').addEventListener('click', () => {

    document.getElementById('chatBox').classList.toggle('hidden');

});



// SELECT ROOM

function selectRoom(roomId) {

    const room = baseRooms.find(r => r.id === roomId);

    document.getElementById('detailRoomName').textContent = room.name;

    document.getElementById('detailCapacity').textContent = room.capacity + ' osób';

    document.getElementById('detailLocation').textContent = room.location;

    document.getElementById('detailRating').textContent = `⭐ ${room.rating} (${room.reviews} ocen)`;

    document.getElementById('detailPrice').textContent = '$' + Math.round(room.basePrice * (0.8 + Math.sin(Date.now() / 10000) * 0.4));

    document.getElementById('roomDetails').classList.add('active');

}



// TOGGLE FAVORITE

function toggleFavorite(e, roomId) {

    e.stopPropagation();

    const btn = e.target.closest('.btn-favorite');

    if (favorites.includes(roomId)) {

        favorites = favorites.filter(id => id !== roomId);

        btn.classList.remove('active');

    } else {

        favorites.push(roomId);

        btn.classList.add('active');

    }

}



// INIT

renderRooms();

generateHeatmap();