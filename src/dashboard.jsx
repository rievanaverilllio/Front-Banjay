import React, { useEffect, useRef, useState } from 'react';
import './dashboard.css';
import 'leaflet/dist/leaflet.css';
import BanjayMap from './BanjayMap';
import MapFilters from './MapFilters';
import regencies from '../public/regencies.json';
import districts from '../public/districts.json';

const provinceOptions = [
  { value: 'Jawa Barat', label: 'Jawa Barat', cities: [
    { value: 'Bandung', label: 'Bandung', latlng: [-6.9147, 107.6098], districts: [
      { name: 'Cicendo', latlng: [-6.9005, 107.5895] },
      { name: 'Andir', latlng: [-6.9142, 107.5731] },
      { name: 'Coblong', latlng: [-6.8838, 107.6131] }
    ]}
  ]},
  { value: 'Jawa Tengah', label: 'Jawa Tengah', cities: [
    { value: 'Semarang', label: 'Semarang', latlng: [-6.9667, 110.4167], districts: [
      { name: 'Candisari', latlng: [-7.0015, 110.4302] },
      { name: 'Tembalang', latlng: [-7.0546, 110.4547] },
      { name: 'Banyumanik', latlng: [-7.0567, 110.4302] }
    ]}
  ]},
  { value: 'Jawa Timur', label: 'Jawa Timur', cities: [
    { value: 'Surabaya', label: 'Surabaya', latlng: [-7.2504, 112.7688], districts: [
      { name: 'Wonokromo', latlng: [-7.2956, 112.7342] },
      { name: 'Tegalsari', latlng: [-7.2677, 112.7361] },
      { name: 'Rungkut', latlng: [-7.3219, 112.7714] }
    ]}
  ]}
];

const Dashboard = () => {
  const mapRef = useRef(null);
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [markerLatLng, setMarkerLatLng] = useState(null);
  const [markerZoom, setMarkerZoom] = useState(5.2);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');

  // Dapatkan opsi kota & kecamatan sesuai provinsi/kota
  const selectedProvince = provinceOptions.find(p => p.value === provinsi);
  const cityOptions = selectedProvince ? selectedProvince.cities : [];
  const selectedCity = cityOptions.find(c => c.value === kota);
  const districtOptions = selectedCity ? selectedCity.districts : [];

  // Dapatkan koordinat marker & zoom
  if (selectedProvince && !kota && !kecamatan) {
    setMarkerLatLng(selectedProvince.cities[0]?.latlng); // Titik kota pertama di provinsi
    setMarkerZoom(7);
  }
  if (selectedCity && !kecamatan) {
    setMarkerLatLng(selectedCity.latlng);
    setMarkerZoom(11);
  }
  if (selectedCity && kecamatan) {
    const selectedDistrict = selectedCity.districts.find(d => d.name === kecamatan);
    setMarkerLatLng(selectedDistrict ? selectedDistrict.latlng : selectedCity.latlng);
    setMarkerZoom(13);
  }

  const handleChatSubmit = async () => {
    setIsLoading(true);

    // Ambil nama kota dan kecamatan dari JSON
    let cityLabel = kota;
    const regencyObj = regencies.find(r => r.id === kota);
    if (regencyObj) cityLabel = regencyObj.name;

    let districtLabel = kecamatan;
    const districtObj = districts.find(d => d.id === kecamatan);
    if (districtObj) districtLabel = districtObj.name;

    // Ambil koordinat marker
    const lat = markerLatLng ? markerLatLng[0] : '';
    const lon = markerLatLng ? markerLatLng[1] : '';

    // Format kalimat: kirim nama dan kode kota, serta nama dan kode kecamatan
    const payload = `kota: ${cityLabel} (${kota}), kecamatan: ${districtLabel} (${kecamatan}), lat: ${lat}, lon: ${lon}, pesan: ${chatInput}`;

    try {
      const res = await fetch('http://localhost:5000/api/analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payload })
      });

      const data = await res.json();
      setChatResponse(
        JSON.stringify(data.hasil, null, 2) || 'Berhasil dikirim.'
      );
    } catch (err) {
      setChatResponse('Gagal mengirim ke server.');
    }

    setIsLoading(false);
  };


  useEffect(() => {
    // Chart.js Rainfall Chart
    if (window.Chart && document.getElementById('rainfallChart')) {
      const rainfallCtx = document.getElementById('rainfallChart').getContext('2d');
      new window.Chart(rainfallCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Rainfall (mm)',
              data: [186, 305, 237, 150, 200, 214],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Target (mm)',
              data: [160, 180, 190, 170, 190, 195],
              backgroundColor: '#10b981'
            }
          ]
        },
        options: {
          plugins: { legend: { position: 'top' } },
          responsive: true
        }
      });
    }
    // Chart.js Saturation Chart
    if (window.Chart && document.getElementById('saturationChart')) {
      const saturationCtx = document.getElementById('saturationChart').getContext('2d');
      new window.Chart(saturationCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Saturation Level',
              data: [30, 45, 55, 65, 70, 60, 50],
              borderColor: '#3b82f6',
              fill: false
            },
            {
              label: 'Critical Level',
              data: [60, 60, 60, 60, 60, 60, 60],
              borderColor: '#ef4444',
              borderDash: [4, 4],
              fill: false
            }
          ]
        },
        options: {
          plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 20,
              max: 80,
              ticks: {
                stepSize: 10,
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // LEAFLET MAP
    if (mapRef.current && !mapRef.current._leaflet_id) {
      const initialView = { center: [-2.5, 118], zoom: 5.2 };
      const map = L.map(mapRef.current).setView(initialView.center, initialView.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom Reset Button
      const resetControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function () {
          const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
          btn.innerHTML = '⟳';
          btn.title = 'Reset Map';
          btn.style.width = '34px';
          btn.style.height = '34px';
          btn.style.fontSize = '1.2rem';
          btn.style.cursor = 'pointer';
          btn.style.background = '#fff';
          btn.style.border = 'none';
          btn.style.outline = 'none';
          btn.onmousedown = btn.ondblclick = L.DomEvent.stopPropagation;
          btn.onclick = function () {
            map.setView(initialView.center, initialView.zoom);
          };
          return btn;
        }
      });
      map.addControl(new resetControl());
    }

    // Cleanup
    return () => {
      // Optional: destroy map if needed
    };
  }, []);

  return (
    <>
      <div className="dashboard-root">
        <header className="dashboard-header">
          <h1 className="dashboard-title"></h1>
        </header>
        <main className="dashboard-main">
          <div className="dashboard-card dashboard-full-width d-flex align-items-center">
            <a href="./">
              <img
                src="src/assets/logo remove bg.png"
                alt="Banjay Logo"
                style={{
                  width: '60px',
                  height: '60px',
                  marginRight: '20px',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </a>
            <div>
              <h2 className="mb-2">Banjay Dashboard</h2>
              <p className="mb-0">AI-powered Banjay risk assessment using satellite and soil data.</p>
            </div>
          </div>

          <div className="dashboard-card dashboard-full-width">
            <h3>Interactive Banjay Map</h3>
            <MapFilters
              provinsi={provinsi}
              setProvinsi={setProvinsi}
              kota={kota}
              setKota={setKota}
              kecamatan={kecamatan}
              setKecamatan={setKecamatan}
              setMarkerLatLng={setMarkerLatLng}
              setMarkerZoom={setMarkerZoom}
            />
            <BanjayMap
              markerLatLng={markerLatLng}
              zoom={markerZoom}
              provinsi={provinsi}
              kota={kota}
              onPickCoordinate={setMarkerLatLng}
            />
            {/* Tampilkan lat/lon di bawah peta */}
            <div style={{ marginTop: '0.5rem', fontSize: '1rem', textAlign: 'center', color: '#008ACF' }}>
              {markerLatLng
                ? `Latitude: ${markerLatLng[0]}, Longitude: ${markerLatLng[1]}`
                : 'Pilih lokasi untuk melihat koordinat'}
            </div>
          </div>
          <div className="dashboard-card">
            <h3>Chatbot untuk Menganalisis</h3>
            <label htmlFor="chatbot-input">Ketik pertanyaan atau data yang ingin dianalisis:</label>
            <textarea
              id="chatbot-input"
              rows={5}
              placeholder="Tulis pertanyaan atau data di sini..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <h3>Upload Gambar Satelit BMKG</h3>
            <div style={{ margin: '0.5rem 0', fontSize: '0.98rem' }}>
              Silakan kunjungi <a href="https://www.bmkg.go.id/cuaca/satelit/himawari-cloud-type" target="_blank" rel="noopener noreferrer">https://www.bmkg.go.id/cuaca/satelit/himawari-cloud-type</a> lalu upload gambarnya.
            </div>
            <input id="chatbot-image" type="file" accept="image/*" />
            <button onClick={handleChatSubmit} disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </button>
            <div style={{ marginTop: 8, color: '#008ACF' }}>{chatResponse}</div>
          </div>
          <div className="dashboard-card">
            <h2 className="dashboard-risk-title">Banjay Risk Assessment</h2>
            <div className="dashboard-badge dashboard-badge-low">
              <span className="dashboard-badge-icon">&#128712;</span>
              <span className="dashboard-badge-label">Low</span>
            </div>
            <p className="dashboard-note">Showing sample data. Submit your data for actual analysis.</p>
            <div className="dashboard-section">
              <div className="dashboard-section-title dashboard-section-info">
                <span className="dashboard-section-icon">&#8505;</span>
                Analysis Summary
              </div>
              <div className="dashboard-section-content">
                This is a placeholder summary. Based on the dummy data, the current Banjay risk is considered low. Rainfall has been minimal and soil saturation is well within safe limits. No immediate threats are detected for the selected location.
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <h3>Respons Lengkap Chatbot</h3>
            <div className="dashboard-chatbot-response">
              {chatResponse || 'Respons lengkap dari chatbot akan muncul di sini.'}
            </div>
            <textarea id="chatbot-followup" rows={10} placeholder="Respone Analisis lengkap..."></textarea>
          </div>
          <div className="dashboard-card">
            <h3>Histori Jumlah Banjir</h3>
            <p>Visualisasi tren jumlah kejadian banjir selama tahun 2010 hingga 2024.</p>
            <div className="dashboard-chart-container">
              <canvas id="saturationChart"></canvas>
            </div>
          </div>
        </main>
        <footer className="dashboard-footer">
          &copy; 2025 Banjay. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
