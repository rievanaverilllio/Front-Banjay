import React, { useEffect, useRef, useState } from 'react';
import './dashboard.css';
import 'leaflet/dist/leaflet.css';
import BanjayMap from './BanjayMap';
import MapFilters from './MapFilters';
import ReactModal from 'react-modal'; // pastikan sudah install react-modal


const Dashboard = () => {
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [markerLatLng, setMarkerLatLng] = useState(null);
  const [markerZoom, setMarkerZoom] = useState(5.2);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const [wilayah, setWilayah] = useState({
    provinsi: null,
    kota: null,
    kecamatan: null,
  });
  const [riskSummary, setRiskSummary] = useState({
    label: 'Low',
    score: '',
    recommendation: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [parsedReport, setParsedReport] = useState(null);
  const [finalReport, setFinalReport] = useState(''); // untuk modal
  const [chatbotFollowup, setChatbotFollowup] = useState(''); // Tambahkan state untuk respons analisis lengkap

  const handleChatSubmit = async () => {
    setIsLoading(true);

    // Ambil nama & kode dari state wilayah
    const provinceLabel = wilayah.provinsi?.name || '';
    const provinceCode = wilayah.provinsi?.id || '';
    const cityLabel = wilayah.kota?.name || '';
    const cityCode = wilayah.kota?.id || '';
    const districtLabel = wilayah.kecamatan?.name || '';
    const districtCode = wilayah.kecamatan?.id || '';

    const lat = markerLatLng ? markerLatLng[0] : '';
    const lon = markerLatLng ? markerLatLng[1] : '';

    // Format kalimat: kirim nama dan kode kota, serta nama dan kode kecamatan
    const payload = `provinsi: ${provinceLabel}, (${provinceCode}), kota: ${cityLabel} (${cityCode}), kecamatan: ${districtLabel} (${districtCode}), dengan koordinat ${lat} LS, dan ${lon} BT, pesan: ${chatInput}`;

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

      // Tampilkan cloud_coverage_summary & satellite_analysis di chatbot-followup
      let followup = '';
      if (data.hasil) {
        if (data.hasil.cloud_coverage_summary) {
          followup += `<div style="font-weight:bold;color:#008ACF;margin-bottom:6px;">Ringkasan Tutupan Awan:</div>
            <img src="https://inderaja.bmkg.go.id/IMAGE/HCAI/CLC/HCAI_CLC_Indonesia.png" alt="Citra Satelit BMKG" style="width:100%;max-width:500px;display:block;margin:10px 0 16px 0;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.07);" />
            <div>${data.hasil.cloud_coverage_summary}</div>`;
        }
        if (data.hasil.satellite_analysis) {
          // Format markdown sederhana ke HTML
          let analysis = data.hasil.satellite_analysis
            .replace(/^### (.+)$/m, '<div style="font-weight:bold;font-size:1.1em;margin-bottom:8px;">$1</div>')
            .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
            .replace(/\n\s*-\s/g, '<li>')
            .replace(/\n\d+\.\s/g, '<br><b>')
            .replace(/\n/g, '<br/>');
          // List bullet
          analysis = analysis.replace(/<li>(.+?)(?=<li>|<br>|$)/g, '<ul><li>$1</li></ul>');
          followup += `<div>${analysis}</div>`;
        }
      }
      setChatbotFollowup(followup);

      // --- PARSING FINAL REPORT ---
      if (data.hasil && data.hasil.final_report) {
        const report = data.hasil.final_report;
        setFinalReport(report); // simpan untuk modal
        // Ambil Kesimpulan Risiko
        const riskMatch = report.match(/\*\*1\. Kesimpulan Risiko:\*\* ([^\n]+)/);
        const scoreMatch = report.match(/\*\*2\. Skor Risiko:\*\* ([^\n]+)/);
        const rekomMatch = report.match(/\*\*6\. Rekomendasi Akhir:\*\*([\s\S]*)/);

        setRiskSummary({
          label: riskMatch ? riskMatch[1].trim() : 'Low',
          score: scoreMatch ? scoreMatch[1].trim() : '',
          recommendation: rekomMatch ? rekomMatch[1].trim() : '',
        });
      }
    } catch (err) {
      setChatResponse('Gagal mengirim ke server.');
    }

    setIsLoading(false);
  };

  function parseFinalReport(report) {
    if (!report) return null;
    // Parsing dengan regex
    const riskMatch = report.match(/\*\*1\. Kesimpulan Risiko:\*\* ([^\n]+)\n\n\*\*2\. Skor Risiko:\*\* ([^\n]+)/);
    const faktorPeningkat = report.match(/\*\*3\. Faktor Peningkat Risiko:\*\*([\s\S]*?)\n\n\*\*4\./);
    const faktorPereda = report.match(/\*\*4\. Faktor Pereda Risiko:\*\*([\s\S]*?)\n\n\*\*5\./);
    const analisisSintesis = report.match(/\*\*5\. Analisis Sintesis \(Interaksi Cuaca dan Lahan\):\*\*([\s\S]*?)\n\n\*\*6\./);
    const rekomAkhir = report.match(/\*\*6\. Rekomendasi Akhir:\*\*([\s\S]*)/);

    // Helper untuk list
    const toList = (txt) =>
      txt
        ? txt
            .split('\n')
            .map((s) => s.replace(/^\s*-\s*/, '').trim())
            .filter(Boolean)
        : [];

    return {
      "1. Kesimpulan Risiko": {
        "Tingkat Risiko": riskMatch ? riskMatch[1].trim() : '',
        "Skor Risiko": riskMatch ? riskMatch[2].trim() : '',
      },
      "2. Faktor Peningkat Risiko": faktorPeningkat ? toList(faktorPeningkat[1]) : [],
      "3. Faktor Pereda Risiko": faktorPereda ? toList(faktorPereda[1]) : [],
      "4. Analisis Sintesis (Interaksi Cuaca dan Lahan)": analisisSintesis ? analisisSintesis[1].trim() : '',
      "5. Rekomendasi Akhir": rekomAkhir ? rekomAkhir[1].trim() : '',
    };
  }

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
              onWilayahChange={setWilayah} // Tambahkan ini
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
            <button onClick={handleChatSubmit} disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </button>
            <div style={{ marginTop: 8, color: '#008ACF' }}></div>
          </div>
          <div className="dashboard-card">
            <h2 className="dashboard-risk-title">Banjay Risk Assessment</h2>
            <div className={`dashboard-badge dashboard-badge-${riskSummary.label.toLowerCase()}`}>
              <span className="dashboard-badge-icon">&#128712;</span>
              <span className="dashboard-badge-label">{riskSummary.label}</span>
            </div>
            {riskSummary.score && (
              <div style={{ fontWeight: 600, margin: '8px 0', color: '#008ACF' }}>
                Skor Risiko: {riskSummary.score}
              </div>
            )}
            <div className="dashboard-section">
              <div className="dashboard-section-title dashboard-section-info">
                <span className="dashboard-section-icon">&#8505;</span>
                Analysis Summary
              </div>
              <div className="dashboard-section-content">
                {riskSummary.recommendation
                  ? riskSummary.recommendation
                  : 'Belum ada rekomendasi. Submit data untuk analisis.'}
              </div>
              {/* Button Selengkapnya */}
              {finalReport && (
                <button
                  style={{
                    marginTop: 12,
                    background: '#008ACF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 18px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowModal(true)}
                >
                  Selengkapnya
                </button>
              )}
            </div>
          </div>

          {/* Modal untuk Final Report */}
          <ReactModal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            contentLabel="Final Report"
            style={{
              overlay: { background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
              content: {
                position: 'static',
                maxWidth: 650,
                minWidth: 320,
                margin: 'auto',
                borderRadius: 16,
                padding: '32px 28px 24px 28px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                border: 'none',
                background: '#f8fafc',
                fontFamily: 'inherit',
                inset: 'unset',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontWeight: 700, color: '#008ACF', fontSize: 22 }}>Final Report Analisis</h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#008ACF',
                  cursor: 'pointer',
                  marginLeft: 12,
                  lineHeight: 1
                }}
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
                title="Tutup"
              >
                &times;
              </button>
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                margin: '18px 0',
                fontSize: 16,
                color: '#222',
                lineHeight: 1.6,
                maxHeight: 400,
                overflowY: 'auto',
                background: '#fff',
                borderRadius: 8,
                padding: '18px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              dangerouslySetInnerHTML={{
                __html: finalReport
                  .replace(/###\s*Executive Summary/g, '<b style="font-size:18px;">Executive Summary</b>')
                  .replace(/\*\*(\d+\..+?)\*\*/g, '<b>$1</b>')
                  .replace(/\n/g, '<br/>')
              }}
            />
            <button
              style={{
                background: '#008ACF',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 28px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 16,
                margin: '0 auto',
                display: 'block',
                marginTop: 18
              }}
              onClick={() => setShowModal(false)}
            >
              Tutup
            </button>
          </ReactModal>
          <div className="dashboard-card">
            <h3>Respons Lengkap Chatbot</h3>
            <div className="dashboard-chatbot-response">
            </div>
            <div
              id="chatbot-followup"
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                background: '#f8fafc',
                borderRadius: 8,
                padding: '14px 12px',
                minHeight: 180,
                maxHeight: 320, // tambahkan batas tinggi
                fontSize: 15,
                color: '#222',
                marginBottom: 12,
                border: '1px solid #e0e7ef',
                overflowY: 'auto' // aktifkan scroll jika konten melebihi maxHeight
              }}
              dangerouslySetInnerHTML={{ __html: chatbotFollowup }}
            />
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
