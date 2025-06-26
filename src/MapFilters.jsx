import React, { useEffect, useState } from 'react';

const MapFilters = ({
  provinsi,
  setProvinsi,
  kota,
  setKota,
  kecamatan,
  setKecamatan,
  setMarkerLatLng,
  setMarkerZoom
}) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Load JSON data
  useEffect(() => {
    fetch('/provinces.json')
      .then(res => res.json())
      .then(setProvinces);
    fetch('/regencies.json')
      .then(res => res.json())
      .then(setRegencies);
    fetch('/districts.json')
      .then(res => res.json())
      .then(setDistricts);
  }, []);

  // Get options
  const provinceOptions = provinces;
  const selectedProvince = provinces.find(p => p.id === provinsi);
  const cityOptions = regencies.filter(r => r.province_id === provinsi);
  const selectedCity = regencies.find(c => c.id === kota);
  const districtOptions = districts.filter(d => d.regency_id === kota);

  // Handle marker update
  useEffect(() => {
    if (kecamatan) {
      const d = districts.find(d => d.id === kecamatan);
      if (d && d.latitude && d.longitude) {
        setMarkerLatLng([d.latitude, d.longitude]);
        setMarkerZoom(13);
        return;
      }
    }
    if (selectedCity) {
      if (selectedCity.latitude && selectedCity.longitude) {
        setMarkerLatLng([selectedCity.latitude, selectedCity.longitude]);
        setMarkerZoom(11);
        return;
      }
    }
    if (selectedProvince) {
      if (selectedProvince.latitude && selectedProvince.longitude) {
        setMarkerLatLng([selectedProvince.latitude, selectedProvince.longitude]);
        setMarkerZoom(7);
        return;
      }
    }
    setMarkerLatLng(null);
    setMarkerZoom(5.2);
  }, [provinsi, kota, kecamatan, provinces, regencies, districts, selectedProvince, selectedCity, setMarkerLatLng, setMarkerZoom]);

  return (
    <div className="dashboard-map-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <select
        id="dropdown-provinsi"
        style={{ flex: 1 }}
        value={provinsi}
        onChange={e => {
          setProvinsi(e.target.value);
          setKota('');
          setKecamatan('');
        }}
      >
        <option value="">Pilih Provinsi</option>
        {provinceOptions.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        id="dropdown-kota"
        style={{ flex: 1 }}
        value={kota}
        onChange={e => {
          setKota(e.target.value);
          setKecamatan('');
        }}
        disabled={!provinsi}
      >
        <option value="">Pilih Kota/Kabupaten</option>
        {cityOptions.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        id="dropdown-kecamatan"
        style={{ flex: 1 }}
        value={kecamatan}
        onChange={e => setKecamatan(e.target.value)}
        disabled={!kota}
      >
        <option value="">Pilih Kecamatan</option>
        {districtOptions.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  );
};

export default MapFilters;