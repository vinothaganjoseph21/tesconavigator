import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./StoreLocatorMap.css";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Store {
  id: number;
  name: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

interface StoreLocatorMapProps {
  stores: Store[];
  onMarkerClick?: (store: Store) => void;
  selectedStoreId?: number | null;
}

const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  Stadia_AlidadeSmooth:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  Stadia_TonerLite:
    "https://tiles.stadiamaps.com/tiles/toner_lite/{z}/{x}/{y}{r}.png",
};

const StoreLocatorMap: React.FC<StoreLocatorMapProps> = ({
  stores,
  onMarkerClick,
  selectedStoreId,
}) => {
  const mapRef = useRef<L.Map | null>(null);

  const initialMapCenter: [number, number] = [51.509865, -0.118092];
  const initialZoomLevel: number = 10;

  const [currentTileLayer, setCurrentTileLayer] = useState<string>(
    tileLayers.OpenStreetMap
  );

  useEffect(() => {
    if (mapRef.current) {
      if (stores.length > 0) {
        const latLngs = stores.map((store) =>
          L.latLng(store.latitude, store.longitude)
        );
        const bounds = L.latLngBounds(latLngs);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapRef.current.setView(initialMapCenter, initialZoomLevel);
      }
    }
  }, [stores]);

  useEffect(() => {
    if (mapRef.current && selectedStoreId !== null) {
      const selectedStore = stores.find(
        (store) => store.id === selectedStoreId
      );
      if (selectedStore) {
        if (stores.length === 1 || mapRef.current.getZoom() < 12) {
          mapRef.current.setView(
            [selectedStore.latitude, selectedStore.longitude],
            14
          );
        } else if (stores.length > 1) {
          mapRef.current.panTo([
            selectedStore.latitude,
            selectedStore.longitude,
          ]);
        }
      }
    }
  }, [selectedStoreId, stores]);

  const handleTileLayerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentTileLayer(event.target.value);
  };

  return (
    <div className="map-container">
      <div className="layer-selector">
        <label htmlFor="tileLayer">Map View: </label>
        <select
          id="tileLayer"
          value={currentTileLayer}
          onChange={handleTileLayerChange}
        >
          {Object.entries(tileLayers).map(([name, url]) => (
            <option key={name} value={url}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        center={initialMapCenter}
        zoom={initialZoomLevel}
        style={{ height: "500px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> contributors'
          url={currentTileLayer}
        />
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(store);
                }
              },
            }}
          >
            <Popup>
              <b>{store.name}</b>
              <br />
              {store.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StoreLocatorMap;
