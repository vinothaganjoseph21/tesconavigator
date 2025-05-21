import React from "react";
import "./StoreDetails.css";

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

interface StoreDetailsProps {
  store: Store | null;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ store }) => {
  if (!store) {
    return (
      <div className="initial-details-message">
        <p>Enter a postcode in the search bar to find nearby Tesco stores.</p>
        <p>
          Click on a store marker or select a store from the search results to
          view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="store-details-horizontal">
      <div className="opening-hours-section">
        {store.openingHours && (
          <div className="section">
            <h3>Opening Hours</h3>
            <ul>
              {Object.entries(store.openingHours).map(([day, time]) => (
                <li key={day}>
                  <strong>{day}:</strong> {time}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="other-details-section">
        {/* {store.imageUrl && (
          <img
            src={store.imageUrl}
            alt={`Image of ${store.name}`}
            className="store-image"
          />
        )} */}
        <h2>{store.name}</h2>
        <p className="address">{store.address}</p>
        <p className="postcode">{store.postcode}</p>

        {store.contact && (
          <div className="section">
            <h3>Contact</h3>
            {store.contact.phone && (
              <p>
                <strong>Phone:</strong> {store.contact.phone}
              </p>
            )}
            {store.contact.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={store.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </p>
            )}
          </div>
        )}

        {store.services && store.services.length > 0 && (
          <div className="section">
            <h3>Services</h3>
            <ul>
              {store.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        )}

        {store.accessibility && store.accessibility.length > 0 && (
          <div className="section">
            <h3>Accessibility</h3>
            <ul>
              {store.accessibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;
