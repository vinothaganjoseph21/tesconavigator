import { useState } from "react";
import StoreLocatorMap from "./components/StoreLocatorMap";
import SearchBar from "./components/SearchBar";
import StoreDetails from "./components/StoreDetails";
import storeData from "./tesco_stores.json";
import "./App.css";

interface Store {
  id: number;
  name: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  openingHours?: {
    [day: string]: string;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
  services?: string[];
  accessibility?: string[];
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

const referencePostcodes: {
  [key: string]: { latitude: number; longitude: number };
} = {
  EN53AW: { latitude: 51.6558, longitude: -0.1983 },
  AL109AB: { latitude: 51.765, longitude: -0.237 },
};

function App() {
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [lastSearchedPostcode, setLastSearchedPostcode] = useState<
    string | null
  >(null);

  const handlePostcodeSearch = (postcode: string) => {
    const standardizedPostcode = postcode.replace(/\s/g, "").toUpperCase();
    setLastSearchedPostcode(postcode);

    if (referencePostcodes[standardizedPostcode]) {
      const searchCoords = referencePostcodes[standardizedPostcode];

      const storesWithDistance = (storeData as Store[]).map((store) => ({
        ...store,
        distance: haversineDistance(
          searchCoords.latitude,
          searchCoords.longitude,
          store.latitude,
          store.longitude
        ),
      }));

      const nearestStores = storesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      if (nearestStores.length > 0) {
        setFilteredStores(nearestStores);
        setSearchError(null);
        setSelectedStore(nearestStores[0]);
      } else {
        setFilteredStores([]);
        setSearchError(
          `No nearby Tesco stores found for ${postcode}. Please try another postcode.`
        );
        setSelectedStore(null);
      }
    } else {
      const results = (storeData as Store[]).filter((store) =>
        store.postcode.toUpperCase().includes(postcode)
      );

      if (results.length > 0) {
        setFilteredStores(results);
        setSearchError(null);
        setSelectedStore(results[0]);
      } else {
        setFilteredStores([]);
        setSearchError(`No Tesco stores found with the postcode: ${postcode}.`);
        setSelectedStore(null);
      }
    }
  };

  const handleMarkerClick = (store: Store) => {
    setSelectedStore(store);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Tesco Store Locator</h1>
      </header>
      <main>
        <SearchBar onSearch={handlePostcodeSearch} />
        {lastSearchedPostcode && filteredStores.length > 0 && !searchError && (
          <p className="search-results-message">
            Showing nearby Tescos for the area and zoom out to view all clearly:{" "}
            <strong>{lastSearchedPostcode}</strong>
          </p>
        )}
        {searchError && (
          <p className="error-message" role="alert" aria-live="assertive">
            {searchError}
          </p>
        )}
        <div className="map-details-container">
          <div className="map-wrapper">
            <StoreLocatorMap
              stores={filteredStores}
              onMarkerClick={handleMarkerClick}
              selectedStoreId={selectedStore ? selectedStore.id : null}
            />
          </div>
          <StoreDetails
            store={selectedStore}
            originPostcode={lastSearchedPostcode}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
