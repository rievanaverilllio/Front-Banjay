import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const initialView = { center: [-2.5, 118], zoom: 5.2 };

const BanjayMap = ({ markerLatLng, zoom = 12, provinsi, kota, onPickCoordinate }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const provinceGeoJsonLayerRef = useRef(null);
  const regencyGeoJsonLayerRef = useRef(null);
  const pickModeRef = useRef(false);

  useEffect(() => {
    let map;
    if (mapRef.current && !mapRef.current._leaflet_id) {
      map = L.map(mapRef.current).setView(initialView.center, initialView.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom Reset Button
      const resetControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function () {
          const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
          btn.innerHTML = '<span>⟳</span>';
          btn.title = 'Reset Map';
          btn.style.width = '34px';
          btn.style.height = '34px';
          btn.style.fontSize = '1.2rem';
          btn.style.cursor = 'pointer';
          btn.style.background = '#f3f4f6';
          btn.style.border = '1px solid #111827';
          btn.style.outline = 'none';
          btn.onmousedown = btn.ondblclick = L.DomEvent.stopPropagation;
          btn.onclick = function () {
            map.setView(initialView.center, initialView.zoom, { animate: true, duration: 1.2 });
          };
          return btn;
        }
      });
      map.addControl(new resetControl());

      // Custom Pick Coordinate Switch Button
      const pickControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.background = '#e0e7ff';
          container.style.border = '1px solid #111827';
          container.style.borderRadius = '4px';
          container.style.padding = '0 8px';

          const label = L.DomUtil.create('label', '', container);
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          label.style.cursor = 'pointer';
          label.style.margin = '0';

          const input = L.DomUtil.create('input', '', label);
          input.type = 'checkbox';
          input.style.marginRight = '6px';
          input.checked = pickModeRef.current;

          const span = L.DomUtil.create('span', '', label);
          span.innerHTML = '📍';

          input.onchange = function () {
            pickModeRef.current = input.checked;
            container.style.background = pickModeRef.current ? '#c7d2fe' : '#e0e7ff';
            map.getContainer().style.cursor = pickModeRef.current ? 'crosshair' : '';
          };

          // Prevent map drag when interacting with switch
          container.onmousedown = container.ondblclick = L.DomEvent.stopPropagation;

          return container;
        }
      });
      map.addControl(new pickControl());

      // Handle map click for pick coordinate
      map.on('click', function (e) {
        if (pickModeRef.current && onPickCoordinate) {
          onPickCoordinate([e.latlng.lat, e.latlng.lng]);
          pickModeRef.current = false;
          map.getContainer().style.cursor = '';
          // Optionally, show marker at picked point
          if (markerRef.current) {
            markerRef.current.setLatLng([e.latlng.lat, e.latlng.lng]);
          } else {
            markerRef.current = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
          }
        }
      });

      mapRef.current._leaflet_map = map;
    } else if (mapRef.current && mapRef.current._leaflet_map) {
      map = mapRef.current._leaflet_map;
    }

    // Marker logic & smooth zoom
    if (map && markerLatLng) {
      if (markerRef.current) {
        markerRef.current.setLatLng(markerLatLng);
      } else {
        markerRef.current = L.marker(markerLatLng).addTo(map);
      }
      // Zoom dulu, baru render border
      map.flyTo(markerLatLng, zoom, { animate: true, duration: 1.2 });

      // Tunggu animasi selesai sebelum render border
      let onMoveEnd = () => {
        renderBorders();
        map.off('moveend', onMoveEnd);
      };
      map.off('moveend', onMoveEnd); // pastikan tidak double
      map.on('moveend', onMoveEnd);
    } else if (map && markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
      map.flyTo(initialView.center, initialView.zoom, { animate: true, duration: 1.2 });

      let onMoveEnd = () => {
        renderBorders();
        map.off('moveend', onMoveEnd);
      };
      map.off('moveend', onMoveEnd);
      map.on('moveend', onMoveEnd);
    } else {
      // Jika tidak ada marker, tetap render border
      renderBorders();
    }

    // Fungsi untuk render border setelah zoom selesai
    function renderBorders() {
      // Province border logic
      if (map) {
        if (provinceGeoJsonLayerRef.current) {
          map.removeLayer(provinceGeoJsonLayerRef.current);
          provinceGeoJsonLayerRef.current = null;
        }
        if (provinsi) {
          fetch(`/province/${provinsi}.geojson`)
            .then(res => res.json())
            .then(geojson => {
              if (provinceGeoJsonLayerRef.current) {
                map.removeLayer(provinceGeoJsonLayerRef.current);
              }
              provinceGeoJsonLayerRef.current = L.geoJSON(geojson, {
                style: {
                  color: '#008ACF',
                  weight: 3,
                  fillOpacity: 0.15,
                  fillColor: '#008ACF',
                  dashArray: '6 4'
                }
              }).addTo(map);
            });
        }
      }

      // Regency border logic
      if (map) {
        if (regencyGeoJsonLayerRef.current) {
          map.removeLayer(regencyGeoJsonLayerRef.current);
          regencyGeoJsonLayerRef.current = null;
        }
        if (kota) {
          fetch(`/regency/${kota}.geojson`)
            .then(res => res.json())
            .then(geojson => {
              if (regencyGeoJsonLayerRef.current) {
                map.removeLayer(regencyGeoJsonLayerRef.current);
              }
              regencyGeoJsonLayerRef.current = L.geoJSON(geojson, {
                style: {
                  color: '#FB9800', // ungu
                  weight: 3,
                  fillOpacity: 0.15,
                  fillColor: '#FB9800', // ungu muda transparan
                  dashArray: '2 6'
                }
              }).addTo(map);
            });
        }
      }
    }
  }, [markerLatLng, zoom, provinsi, kota, onPickCoordinate]);

  return (
    <div
      ref={mapRef}
      id="leaflet-map"
      style={{ width: '100%', height: 400, borderRadius: '0.75rem', overflow: 'hidden', background: '#e0f7fa' }}
    ></div>
  );
};

export default BanjayMap;