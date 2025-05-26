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
  originPostcode: string | null;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({
  store,
  originPostcode,
}) => {
  if (!store) {
    return (
      <div className="initial-details-message" role="status" aria-live="polite">
        <p>Enter a postcode in the search bar to find nearby Tesco stores.</p>
        <p>
          Click on a store marker or select a store from the search results to
          view its details.
        </p>
      </div>
    );
  }

  const getGoogleMapsDirectionsUrl = (
    destination: string,
    origin: string | null,
    travelMode: "driving" | "walking" | "bicycling" | "transit"
  ) => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;
    if (origin) {
      url += `&origin=${encodeURIComponent(origin)}`;
    }
    url += `&travelmode=${travelMode}`;
    return url;
  };

  return (
    <aside
      className="store-details-horizontal"
      aria-labelledby="store-name-heading"
    >
      <h2 id="store-name-heading" className="sr-only">
        {store.name} Details
      </h2>
      <div className="other-details-section">
        <h2>{store.name}</h2>
        <p className="address">{store.address}</p>
        <p className="postcode">{store.postcode}</p>

        {originPostcode && (
          <section className="section directions-section">
            <h3>Directions from {originPostcode}</h3>
            <div className="directions-options">
              <a
                href={getGoogleMapsDirectionsUrl(
                  store.address,
                  originPostcode,
                  "driving"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
                aria-label={`Get driving directions to ${store.name} from ${originPostcode}`}
              >
                <i className="fas fa-car"></i> Driving
              </a>
              <a
                href={getGoogleMapsDirectionsUrl(
                  store.address,
                  originPostcode,
                  "transit"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
                aria-label={`Get public transport directions to ${store.name} from ${originPostcode}`}
              >
                <i className="fas fa-bus"></i> Public Transport
              </a>
              <a
                href={getGoogleMapsDirectionsUrl(
                  store.address,
                  originPostcode,
                  "walking"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
                aria-label={`Get walking directions to ${store.name} from ${originPostcode}`}
              >
                <i className="fas fa-walking"></i> Walking
              </a>
              <a
                href={getGoogleMapsDirectionsUrl(
                  store.address,
                  originPostcode,
                  "bicycling"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
                aria-label={`Get cycling directions to ${store.name} from ${originPostcode}`}
              >
                <i className="fas fa-bicycle"></i> Cycling
              </a>
            </div>
          </section>
        )}

        {store.contact && (
          <section className="section">
            <h3>Contact</h3>
            {store.contact.phone && (
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${store.contact.phone}`}>{store.contact.phone}</a>{" "}
              </p>
            )}
            {store.contact.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={store.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit website for ${store.name}`}
                >
                  Visit Website{" "}
                  <span className="sr-only">(opens in new tab)</span>{" "}
                </a>
              </p>
            )}
          </section>
        )}
        {store.services && store.services.length > 0 && (
          <section className="section">
            <h3>Services</h3>
            <ul>
              {store.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </section>
        )}
        {store.accessibility && store.accessibility.length > 0 && (
          <section className="section">
            <h3>Accessibility</h3>
            <ul>
              {store.accessibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="opening-hours-section">
        {store.openingHours && (
          <section className="section">
            <h3>Opening Hours</h3>
            <dl>
              {Object.entries(store.openingHours).map(([day, time]) => (
                <React.Fragment key={day}>
                  <dt>
                    <strong>{day}:</strong>
                  </dt>
                  <dd>{time}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        )}
      </div>
    </aside>
  );
};

export default StoreDetails;
