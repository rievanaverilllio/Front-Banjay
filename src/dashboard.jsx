import React, { useEffect } from 'react';
import './dashboard.css';

// If you want to use Google Fonts, import in index.html or via CSS
// import 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';

const Dashboard = () => {
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
            legend: {
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
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
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    // Google Charts loader
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    script.onload = () => {
      if (window.google) {
        window.google.charts.load('current', {
          packages: ['geochart'],
          mapsApiKey: ''
        });
        window.google.charts.setOnLoadCallback(drawRegionsMap);
      }
    };
    document.body.appendChild(script);
    // Chart.js loader
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartScript.async = true;
    chartScript.onload = () => {};
    document.body.appendChild(chartScript);
    // Redraw on resize
    window.addEventListener('resize', drawRegionsMap);
    function drawRegionsMap() {
      if (!window.google || !window.google.visualization) return;
      var data = window.google.visualization.arrayToDataTable([
        ['Province Code', 'Province Name', 'Jumlah'],
        ['ID-AC', 'Aceh', 120],
        ['ID-BA', 'Bali', 85],
        ['ID-BB', 'Bangka Belitung', 65],
        ['ID-BT', 'Banten', 45],
        ['ID-BE', 'Bengkulu', 95],
        ['ID-YO', 'DI Yogyakarta', 210],
        ['ID-JK', 'DKI Jakarta', 700],
        ['ID-GO', 'Gorontalo', 75],
        ['ID-JA', 'Jambi', 110],
        ['ID-JB', 'Jawa Barat', 320],
        ['ID-JT', 'Jawa Tengah', 280],
        ['ID-JI', 'Jawa Timur', 380],
        ['ID-KB', 'Kalimantan Barat', 70],
        ['ID-KS', 'Kalimantan Selatan', 60],
        ['ID-KT', 'Kalimantan Tengah', 55],
        ['ID-KI', 'Kalimantan Timur', 50],
        ['ID-KU', 'Kalimantan Utara', 40],
        ['ID-KR', 'Kepulauan Riau', 35],
        ['ID-LA', 'Lampung', 30],
        ['ID-MA', 'Maluku', 25],
        ['ID-MU', 'Maluku Utara', 20],
        ['ID-NB', 'Nusa Tenggara Barat', 90],
        ['ID-NT', 'Nusa Tenggara Timur', 80],
        ['ID-PA', 'Papua', 15],
        ['ID-PB', 'Papua Barat', 12],
        ['ID-RI', 'Riau', 130],
        ['ID-SR', 'Sulawesi Barat', 40],
        ['ID-SN', 'Sulawesi Selatan', 95],
        ['ID-ST', 'Sulawesi Tengah', 65],
        ['ID-SG', 'Sulawesi Tenggara', 55],
        ['ID-SA', 'Sulawesi Utara', 45],
        ['ID-SB', 'Sumatera Barat', 180],
        ['ID-SS', 'Sumatera Selatan', 150],
        ['ID-SU', 'Sumatera Utara', 200],
      ]);

      var options = {
        region: 'ID',
        displayMode: 'regions',
        resolution: 'provinces',
        colorAxis: { colors: ['#e0ffd9', '#008000'] },
        backgroundColor: '#81d4fa',
        datalessRegionColor: 'white',
        defaultColor: '#bad5b5',
        tooltip: {
          trigger: 'focus',
          showTitle: true,
          textStyle: { fontSize: 14 }
        },
        width: '100%',
        height: 400,
        keepAspectRatio: true
      };

      // Format kolom tooltip seperti di HTML
      var formatter = new window.google.visualization.PatternFormat('{1}: {2}');
      formatter.format(data, [0, 1, 2], 0);

      var view = new window.google.visualization.DataView(data);
      view.setColumns([0, 2, {
        type: 'string',
        role: 'tooltip',
        calc: function (dt, row) {
          return dt.getValue(row, 1) + ': ' + dt.getValue(row, 2);
        }
      }]);

      var chart = new window.google.visualization.GeoChart(document.getElementById('regions_div'));
      chart.draw(view, options);
    }
    // Cleanup
    return () => {
      window.removeEventListener('resize', drawRegionsMap);
    };
  }, []);

  return (
    <>
      <div className="dashboard-root">
        <header className="dashboard-header">
          <h1
            className="dashboard-title"
          >
          </h1>
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
            <div id="regions_div" style={{ width: '100%', height: 400, borderRadius: '0.75rem', overflow: 'hidden', background: '#e0f7fa' }}></div>
            <div id="province-info" className="dashboard-province-info"></div>
          </div>
          <div className="dashboard-card">
            <h3>Chatbot untuk Menganalisis</h3>
            <label htmlFor="chatbot-input">Ketik pertanyaan atau data yang ingin dianalisis:</label>
            <textarea id="chatbot-input" rows={5} placeholder="Tulis pertanyaan atau data di sini..."></textarea>
            <h3>Upload Gambar Satelit BMKG</h3>
            <div style={{ margin: '0.5rem 0', fontSize: '0.98rem' }}>
              Silakan kunjungi <a href="https://www.bmkg.go.id/cuaca/satelit/himawari-cloud-type" target="_blank" rel="noopener noreferrer">https://www.bmkg.go.id/cuaca/satelit/himawari-cloud-type</a> lalu upload gambarnya.
            </div>
            <input id="chatbot-image" type="file" accept="image/*" />
            <button>Kirim</button>
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
              Respons lengkap dari chatbot akan muncul di sini.
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
