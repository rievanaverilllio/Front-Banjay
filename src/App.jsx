// src/App.js

// Mengimpor React untuk membangun komponen UI
import React, { useEffect, useRef } from 'react';
// Mengimpor motion dan useInView dari framer-motion untuk animasi yang dipicu oleh visibilitas
import { motion, useInView } from 'framer-motion';
// Mengimpor komponen dari react-router-dom
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './app.css';
// Mengimpor komponen Dashboard
import Dashboard from './dashboard'; // Pastikan path ini benar
// Tambahkan import gambar di bagian atas file
import mistralLogo from './assets/mistral-ai-logo.png';
import claudeLogo from './assets/claude-ai-logo.png';
import openaiLogo from './assets/open-ai-logo.png';
// Import gambar arsitektur
import appArchitecture from './assets/banjay-arsitektur.png'; // Pastikan path dan nama file benar


// Komponen yang berisi konten utama halaman beranda (sebelumnya adalah isi dari App)
const HomeContent = () => {
  // Referensi untuk setiap bagian untuk memantau visibilitas di viewport
  const heroRef = useRef(null);
  const insightsRef = useRef(null);
  const marketingRef = useRef(null);
  const teamRef = useRef(null);
  const testimonialsRef = useRef(null);
  // Tambah ref untuk bagian arsitektur
  const architectureRef = useRef(null);


  // Menggunakan useInView untuk mendeteksi apakah bagian sudah terlihat (hanya sekali)
  const heroInView = useInView(heroRef, { once: true });
  const insightsInView = useInView(insightsRef, { once: true });
  const marketingInView = useInView(marketingRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
  // Tambah useInView untuk arsitektur
  const architectureInView = useInView(architectureRef, { once: true });


  // Varian animasi untuk kemunculan setiap bagian
  const sectionRevealVariants = {
    hidden: { opacity: 0, y: 150 }, // Mulai dari posisi lebih jauh di bawah
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }, // Durasi lebih lama
  };

  // Varian animasi untuk judul Hero Section
  const heroTitleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut", delay: 0.3 } },
  };

  // Varian animasi untuk teks Hero Section
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut", delay: 0.5 } },
  };

  // Varian animasi untuk tombol (efek hover dan tap)
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Varian animasi umum untuk semua kartu (efek 3D pada hover)
  const card3DVariants = {
    initial: { opacity: 0, y: 30, scale: 0.97 }, // Sedikit lebih kecil dan di bawah saat awal
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Menambahkan bayangan default
      transition: { duration: 0.7, ease: "easeOut" }
    },
    whileHover: {
      scale: 1.02, // Sedikit membesar
      rotateX: 2, // Rotasi ringan pada sumbu X
      rotateY: 2, // Rotasi ringan pada sumbu Y
      z: 30, // Mengangkat elemen dari bidang (membutuhkan perspective pada parent)
      boxShadow: "0 8px 15px rgba(0,0,0,0.2)", // Membuat bayangan lebih menonjol saat hover
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  // Varian animasi untuk item bergerak horizontal (marquee style ke kiri)
  const marqueeLeftVariants = {
    animate: {
      x: ['0%', '-100%'], // Bergerak ke kiri sebesar 100% dari lebarnya sendiri
      transition: {
        x: {
          repeat: Infinity, // Ulangi terus-menerus
          ease: "linear", // Gerakan linear
          duration: 100, // Durasi animasi (sesuaikan untuk kecepatan)
        },
      },
    },
  };

  // Varian animasi untuk item bergerak horizontal (marquee style ke kanan)
  const marqueeRightVariants = {
    animate: {
      x: ['-100%', '0%'], // Bergerak ke kanan dari -100% ke 0% dari lebarnya sendiri
      transition: {
        x: {
          repeat: Infinity, // Ulangi terus-menerus
          ease: "linear", // Gerakan linear
          duration: 100, // Durasi animasi (sesuaikan untuk kecepatan)
        },
      },
    },
  };

  // Gaya untuk item tag yang bergerak
  const tagItemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.9rem 1.8rem',
    margin: '1.3rem',
    backgroundImage: 'linear-gradient(to right,rgb(255, 255, 255),rgb(198, 235, 255))', // GRADASI biru muda ke biru langit
    borderRadius: '1rem',
    boxShadow: '0 0.1rem 0.2rem rgba(0,0,0,.05)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#263238',
  };


  // Data untuk baris item yang bergerak di bagian Comprehensive Insights
  const insightsRow1 = [
    { text: "Curah Hujan Real-time", icon: "bi-cloud-rain-fill" },
    { text: "Analisis Citra Satelit", icon: "bi-satellite-fill" },
    { text: "Kondisi Tanah", icon: "bi-layers-fill" },
    { text: "Model Hidrologi", icon: "bi-graph-up-arrow" },
    { text: "Peringatan Dini", icon: "bi-bell-fill" },
    { text: "Manajemen Risiko", icon: "bi-shield-fill-check" },
    { text: "Pemantauan Sungai", icon: "bi-droplet-fill" },
    { text: "Kondisi Vegetasi", icon: "bi-tree-fill" },
    { text: "Aksesibilitas Wilayah", icon: "bi-signpost-fill" },
    { text: "Analisis Tren Musiman", icon: "bi-calendar2-week-fill" }
  ];

  const insightsRow2 = [
    { text: "Data Geospasial", icon: "bi-globe" },
    { text: "Prediksi Akurat", icon: "bi-bar-chart-fill" },
    { text: "Visualisasi Peta", icon: "bi-map-fill" },
    { text: "Integrasi AI", icon: "bi-cpu-fill" },
    { text: "Respons Cepat", icon: "bi-lightning-fill" },
    { text: "Evaluasi Historis", icon: "bi-clock-history" },
    { text: "Akurasi Tinggi", icon: "bi-patch-check-fill" },
    { text: "Notifikasi Otomatis", icon: "bi-broadcast" },
    { text: "Dashboard Interaktif", icon: "bi-speedometer" },
    { text: "Pemodelan Berbasis Lokasi", icon: "bi-geo-alt-fill" }
  ];


  // Tambahkan varian animasi untuk card testimoni
  const testimonialCardVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: i * 0.25, ease: 'easeOut' }
    })
  };

  // Varian animasi untuk card insight kiri dan kanan
  const insightCardLeftVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } }
  };
  const insightCardRightVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut', delay: 0.2 } }
  };

  return (
    <>
      {/* Elemen untuk latar belakang gradasi yang buram (live wallpaper) */}
      <div className="gradient-blurred-background"></div>

      {/* Wrapper untuk semua konten aplikasi agar tetap di atas latar belakang buram */}
      <div className="app-content-wrapper container-fluid p-0">
        {/* Navbar Section */}
        <nav className="navbar navbar-expand-lg navbar-light py-3 fixed-top d-flex justify-content-center" style={{ zIndex: 1050 }}>
          <div className="container navbar-custom px-4">
            {/* Merek atau logo aplikasi (Banjay) */}
            <Link className="navbar-brand navbar-brand-custom fw-bold d-flex align-items-center" to="/">
              <img
                src="src/assets/logo remove bg.png"
                alt="Location Icon"
                className="me-1"
                style={{ width: '50px', height: '50px' }}
              />
              Banjay
            </Link>
            {/* Tombol toggler untuk navigasi responsif pada perangkat kecil */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* Item-item navigasi */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                {/* MODIFIKASI: Tambahkan link Beranda ke header, dengan href ke Hero Section */}
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#hero-section">Beranda</a>
                </li>
                {/* Link navigasi ke section lainnya */}
                <li className="nav-item"><a className="nav-link" href="#wawasan-section">Wawasan</a></li>
                <li className="nav-item"><a className="nav-link" href="#inovasi-section">Inovasi</a></li>
                <li className="nav-item"><a className="nav-link" href="#arsitektur-section">Arsitektur</a></li>
                <li className="nav-item"><a className="nav-link" href="#tim-section">Tim</a></li>
                <li className="nav-item"><a className="nav-link" href="#dampak-section">Dampak</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        {/* MODIFIKASI: Tambahkan id untuk href navbar */}
        <header
          ref={heroRef}
          id="hero-section" // ID ditambahkan di sini
          className="hero-section d-flex align-items-center justify-content-center bg-transparent"
          style={{ minHeight: '100vh' }} // Menggunakan 100vh agar section hero selalu menempati seluruh viewport
        >
          <div className="container text-center">
            <motion.div
              className="d-inline-flex align-items-center justify-content-center rounded-pill"
              style={{
                marginTop: 0,
                marginBottom: 0,
                textAlign: 'center',
              }}
              variants={heroTitleVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
            </motion.div>

            <motion.h1
              className="display-3 fw-bolder mb-2 section-title-theme"
              variants={heroTitleVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              style={{ fontSize: '3.1rem', lineHeight: '1.3' }}
            >
              Banjir Mungkin Nge-prank<br />Tapi Banjay Gak Pernah Salah
            </motion.h1>
            <motion.p
              className="lead mb-5 text-muted"
              variants={heroTextVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              style={{ fontSize: '1.2rem' }}
            >
              Sistem analisis risiko banjir berbasis AI yang mengintegrasikan data real-time untuk keputusan yang cepat dan tepat.
            </motion.p>
            <div className="d-flex justify-content-center gap-3">
              <Link
                to="/dashboard"
                className="btn btn-primary-theme rounded-pill px-4 shadow-sm"
              >
                Mulai Demo Banjay AI <i className="bi bi-arrow-right-short ms-2"></i>
              </Link>
            </div>
            <p className="mt-1 pt-4 text-muted mx-auto" style={{ maxWidth: '450px' }}>
              Dipercaya oleh instansi:.
            </p>
            <div className="d-flex justify-content-center align-items-center flex-wrap mt-4 gap-4">
              <img src={mistralLogo} alt="Mistral Logo" style={{ maxHeight: '40px', marginRight: '1rem' }} />
              <img src={claudeLogo} alt="Claude Logo" style={{ maxHeight: '40px', marginRight: '1rem' }} />
              <img src={openaiLogo} alt="OpenAI Logo" style={{ maxHeight: '40px' }} />
            </div>
          </div>
        </header>

        {/* --- */}
        {/* Comprehensive Insights Section */}
        <section ref={insightsRef} id="wawasan-section" className="py-5 bg-light-theme text-center">
          <div className="container">
            <motion.div variants={sectionRevealVariants} initial="hidden" animate={insightsInView ? "visible" : "hidden"}>
              <p className="text-primary-theme text-uppercase fw-bold mb-1">Wawasan Banjir</p>
              <h2 className="mb-4 section-title-theme">Analisis Risiko Banjir Komprehensif</h2>
              <p className="lead mb-5 text-muted" style={{ fontSize: '1.1rem' }}>
                Deteksi potensi banjir dengan mengintegrasikan data spasial, citra satelit, kondisi tanah, dan cuaca.
              </p>
              <div className="row g-4">
                <div className="col-md-6">
                  <motion.div
                    className="card shadow-sm rounded-3 p-4 text-start h-100"
                    variants={insightCardLeftVariants}
                    initial="hidden"
                    animate={insightsInView ? "visible" : "hidden"}
                  >
                    <h5 className="card-title fw-bold text-info">Pemantauan Cuaca & Iklim</h5>
                    <p className="text-muted">Lacak perubahan curah hujan dan tren iklim untuk identifikasi risiko banjir.</p>
                    <div className="bg-white p-3 rounded-3 border d-flex justify-content-center align-items-center" style={{ height: '180px', overflow: 'hidden' }}>
                      <img src="src/assets/Satelit.png" alt="Grafik Cuaca" className="img-fluid" style={{ opacity: 0.8 }} />
                    </div>
                    <p className="mt-3 text-muted" style={{ fontSize: '0.95rem' }}>
                      Data Himawari-9 dan jurnal cuaca terintegrasi untuk prediksi yang akurat.
                    </p>
                  </motion.div>
                </div>
                <div className="col-md-6">
                  <motion.div
                    className="card shadow-sm rounded-3 p-4 text-start h-100"
                    variants={insightCardRightVariants}
                    initial="hidden"
                    animate={insightsInView ? "visible" : "hidden"}
                  >
                    <h5 className="card-title fw-bold text-info">Pemetaan Risiko Berbasis AI</h5>
                    <p className="text-muted">
                      <i className="bi bi-geo-alt-fill text-primary-theme me-2"></i> Identifikasi area rentan banjir dengan pemetaan dinamis.
                    </p>
                    <div className="bg-white p-3 rounded-3 border d-flex justify-content-center align-items-center" style={{ height: '180px', overflow: 'hidden' }}>
                      <img src="src/assets/map.png" alt="Peta Risiko" className="img-fluid" style={{ opacity: 0.8 }} />
                    </div>
                    <p className="mt-3 text-muted" style={{ fontSize: '0.95rem' }}>
                      Visualisasi intuitif membantu perencanaan mitigasi yang efektif.
                    </p>
                  </motion.div>
                </div>
              </div>
              <div className="mt-5 pt-3">
                <div className="scrolling-wrapper">
                  <motion.div
                    className="d-inline-flex"
                    variants={marqueeRightVariants}
                    animate="animate"
                  >
                    {insightsRow1.map((item, index) => (
                      <div key={item.text + index} style={tagItemStyle}>
                        <i className={`bi ${item.icon} me-2 text-primary-theme`}></i> {item.text}
                      </div>
                    ))}
                    {insightsRow1.map((item, index) => (
                      <div key={item.text + '_dup_' + index} style={tagItemStyle}>
                        <i className={`bi ${item.icon} me-2 text-primary-theme`}></i> {item.text}
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className="scrolling-wrapper">
                  <motion.div
                    className="d-inline-flex"
                    variants={marqueeLeftVariants}
                    animate="animate"
                  >
                    {insightsRow2.map((item, index) => (
                      <div key={item.text + index} style={tagItemStyle}>
                        <i className={`bi ${item.icon} me-2 text-primary-theme`}></i> {item.text}
                      </div>
                    ))}
                    {insightsRow2.map((item, index) => (
                      <div key={item.text + '_dup_' + index} style={tagItemStyle}>
                        <i className={`bi ${item.icon} me-2 text-primary-theme`}></i> {item.text}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- */}
        {/* AI-Powered Marketing Section */}
        <section ref={marketingRef} id="inovasi-section" className="py-5 bg-white-theme text-center">
          <div className="container">
            <motion.div variants={sectionRevealVariants} initial="hidden" animate={marketingInView ? "visible" : "hidden"}>
              <p className="text-primary-theme text-uppercase fw-bold mb-1">Inovasi Teknologi</p>
              <h2 className="mb-4 section-title-theme">Kecerdasan Buatan untuk Ketahanan Bencana</h2>
              <p className="lead mb-5 text-muted" style={{ fontSize: '1.1rem' }}>
                Memanfaatkan AI dan data citra satelit untuk memberikan wawasan prediktif yang belum pernah ada sebelumnya.
              </p>
              <div className="row g-4 justify-content-center">
                <div className="col-12 col-lg-7">
                  <motion.div
                    className="card shadow-sm rounded-3 p-4 text-start h-100 ai-marketing-card"
                    variants={card3DVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="whileHover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img
                        src="src/assets/visual-capt.png"
                        alt="Visual Captioning"
                        style={{ width: '35%', borderRadius: '12px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h5 className="card-title fw-bold text-info">Visual Captioning & RAG</h5>
                        <p className="text-muted" style={{ textAlign: 'justify' }}>
                          Transformasi citra satelit dan dokumen ilmiah menjadi narasi yang relevan dalam konteks mitigasi banjir.
                          Melalui integrasi teknologi visual captioning dan Retrieval-Augmented Generation (RAG), sistem Banjay secara otomatis memahami isi dari citra satelit (seperti Himawari-9 Cloud Type) dan mengaitkannya dengan informasi dari jurnal cuaca dan data historis banjir.
                          Model menghasilkan deskripsi cuaca yang mendalam, mengidentifikasi jenis awan, intensitas hujan, dan potensi risiko banjir di wilayah Indonesia berdasarkan koordinat geografis.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="row g-4">
                    <div className="col-12">
                      <motion.div
                        className="card shadow-sm rounded-3 p-4 text-start h-100 ai-marketing-card"
                        variants={card3DVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                      >
                        <h5 className="card-title fw-bold text-info">Model LLM Terintegrasi</h5>
                        <p className="text-muted" style={{ textAlign: 'justify' }}>Banjay memanfaatkan Large Language Model (LLM) untuk memahami keterkaitan antara data cuaca, tanah, dan histori banjir. Model ini memberikan analisis prediktif yang akurat dan kontekstual, membantu identifikasi risiko banjir secara ilmiah dan berbasis data.</p>
                      </motion.div>
                    </div>
                    <div className="col-12">
                      <motion.div
                        className="card shadow-sm rounded-3 p-4 text-start h-100 ai-marketing-card"
                        variants={card3DVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                      >
                        <h5 className="card-title fw-bold text-info">Antarmuka Responsif</h5>
                        <p className="text-muted" style={{ textAlign: 'justify' }}>Peta interaktif menampilkan warna dinamis sesuai tingkat risiko banjir, mempermudah identifikasi wilayah rawan secara visual.</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- */}
        {/* Arsitektur Aplikasi Section */}
        <section ref={architectureRef} id="arsitektur-section" className="py-5 bg-light-theme text-center">
          <div className="container">
            <motion.div variants={sectionRevealVariants} initial="hidden" animate={architectureInView ? "visible" : "hidden"}>
              <p className="text-primary-theme text-uppercase fw-bold mb-1">Struktur Sistem</p>
              <h2 className="mb-4 section-title-theme">Arsitektur Aplikasi Banjay</h2>
              <p className="lead mb-5 text-muted" style={{ fontSize: '1.1rem' }}>
                Lihat bagaimana sistem Banjay dirancang untuk memberikan analisis risiko banjir yang akurat dan efisien.
              </p>
              <div className="d-flex justify-content-center">
                <img
                  src={appArchitecture}
                  alt="Application Architecture"
                  className="img-fluid rounded shadow-lg"
                  style={{ maxWidth: '90%', height: 'auto', border: '1px solid #ddd' }}
                />
              </div>
              <p className="mt-5 text-muted">
                Diagram ini menjelaskan komponen-komponen utama dan alur data dalam sistem kami.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- */}
        {/* Our Team Section */}
        <section ref={teamRef} id="tim-section" className="py-5 bg-white-theme text-center">
          <div className="container">
            <motion.div variants={sectionRevealVariants} initial="hidden" animate={teamInView ? "visible" : "hidden"}>
              <p className="text-primary-theme text-uppercase fw-bold mb-1">Tim Kami</p>
              <h2 className="mb-4 section-title-theme">Pakar AI & Website di Balik Banjay</h2>
              <div className="row justify-content-center g-4">
                <div className="col-md-6 col-lg-4">
                  <motion.div
                    className="card shadow-sm rounded-3 p-4 h-100 team-member-card"
                    variants={card3DVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="whileHover"
                  >
                    <img src="src/assets/rievan1.png" className="rounded-circle mx-auto mb-4 team-member-image" alt="AI Expert" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                    <h5 className="card-title fw-bold mb-1 text-info">Rievan Averillio, S.T., M.T.
                    </h5>
                    <p className="card-text text-muted">Ahli Kecerdasan Buatan</p>
                    <p className="card-text" style={{ fontSize: '0.95rem' }}>"Mendedikasikan diri untuk mengembangkan solusi AI yang adaptif untuk bencana alam."</p>
                    <div className="d-flex justify-content-center mt-3">
                      <a href="#" className="text-info mx-2"><i className="bi bi-linkedin" style={{ fontSize: '2rem' }}></i></a>
                      <a href="#" className="text-info mx-2"><i className="bi bi-twitter" style={{ fontSize: '2rem' }}></i></a>
                    </div>
                  </motion.div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <motion.div
                    className="card shadow-sm rounded-3 p-4 h-100 team-member-card"
                    variants={card3DVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="whileHover"
                  >
                    <img src="src/assets/afin.jpg" className="rounded-circle mx-auto mb-4 team-member-image" alt="Hydrologist" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                    <h5 className="card-title fw-bold mb-1 text-info">Prof. Afin Maulana, S.T., M.Sc.
                    </h5>
                    <p className="card-text text-muted">Pakar Hidrologi & Geospasial</p>
                    <p className="card-text" style={{ fontSize: '0.95rem' }}>"Menggabungkan data spasial dengan model hidrologi untuk pemahaman banjir yang mendalam."</p>
                    <div className="d-flex justify-content-center mt-3">
                      <a href="#" className="text-info mx-2"><i className="bi bi-github" style={{ fontSize: '2rem' }}></i></a>
                      <a href="#" className="text-info mx-2"><i className="bi bi-envelope-fill" style={{ fontSize: '2rem' }}></i></a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- */}
        {/* What Our Users Say Section */}
        <section ref={testimonialsRef} id="dampak-section" className="py-5 bg-light-theme text-center">
          <div className="container">
            <motion.div variants={sectionRevealVariants} initial="hidden" animate={testimonialsInView ? "visible" : "hidden"}>
              <p className="text-primary-theme text-uppercase fw-bold mb-1">Dampak Nyata</p>
              <h2 className="mb-4 section-title-theme">Kisah Sukses dari Mitra Kami</h2>
              <div className="row g-4">
                {[
                  {
                    text: '"Banjay telah merevolusi cara kami memprediksi dan merespons potensi banjir. Peringatan dini menjadi jauh lebih akurat!"',
                    name: 'Kepala BPBD Kab. Bandung',
                    role: 'Instansi Pemerintah Daerah',
                    img: "src/assets/client.png"
                  },
                  {
                    text: '"Integrasi data satelit Himawari-9 sangat membantu penelitian kami dalam memahami dinamika aliran air dan risiko banjir."',
                    name: 'Peneliti Hidrologi Institut Teknologi Nasional',
                    role: 'Pusat Studi Bencana',
                    img: "src/assets/client.png"
                  },
                  {
                    text: '"Dashboard Banjay informatif, mudah digunakan, dan dirancang untuk memantau banjir secara real-time dengan antarmuka yang ramah pengguna."',
                    name: 'Operator Pusdalops',
                    role: 'BPBD Kota Surabaya',
                    img: "src/assets/client.png"
                  },
                  {
                    text: '"Prediksi AI Banjay membantu kami mengambil keputusan cepat saat terdapat tanda cuaca extream secara tepat."',
                    name: 'Tim Tanggap Darurat',
                    role: 'Relawan Bencana',
                    img: "src/assets/client.png"
                  },
                ].map((item, i) => (
                  <motion.div
                    className="col-md-6 col-lg-3"
                    key={item.name}
                    custom={i}
                    initial="hidden"
                    animate={testimonialsInView ? "visible" : "hidden"}
                    variants={testimonialCardVariants}
                  >
                    <div className="card shadow-sm rounded-3 p-4 text-start h-100">
                      <p className="text-muted" style={{ fontStyle: 'italic' }}>{item.text}</p>
                      <div className="d-flex align-items-center mt-3">
                        <img src={item.img} alt="Klien Avatar" className="rounded-circle me-3" style={{ opacity: 0.8, width: '50px', height: '50px' }} />
                        <div>
                          <h6 className="mb-0 text-info">{item.name}</h6>
                          <small className="text-muted">{item.role}</small>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-muted">
                <i className="bi bi-check-circle-fill me-2 text-primary-theme" style={{ fontSize: '1rem' }}></i> Bergabunglah dengan kami untuk masa depan yang lebih aman.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="py-5 footer-theme text-white">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4">
                <h5 className="fw-bold">Banjay</h5>
                <p>© 2024 Banjay Analytics</p>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-6 col-md-3 mb-3">
                    <ul className="list-unstyled">
                      <li><a href="#">Beranda</a></li>
                      <li><a href="#">Fitur</a></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <ul className="list-unstyled">
                      <li><a href="#">Solusi</a></li>
                      <li><a href="#">Kontak</a></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <ul className="list-unstyled">
                      <li><a href="#">Privasi</a></li>
                      <li><a href="#">Syarat & Ketentuan</a></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <ul className="list-unstyled">
                      <li><a href="#">Dibuat oleh Google</a></li>
                      <li><a href="#">info@banjay.com</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <a href="#" className="text-white mx-2"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white mx-2"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white mx-2"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const App = () => {
  return (
    <div className="banjay-app">
      <Router>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;