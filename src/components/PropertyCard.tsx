import { Link } from "react-router-dom";
import { Bed, Bath, Maximize } from "lucide-react";

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  type: string;
  status: string;
}

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="pt-4 pb-6">
        <p className="font-raleway font-light text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
          {property.location}
        </p>
        <h3 className="font-raleway font-light tracking-[0.1em] text-foreground text-base mb-2">
          {property.title}
        </h3>
        <p className="font-raleway font-medium text-foreground text-lg mb-3">
          {property.price}
        </p>
        <div className="flex gap-4 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs font-raleway">
            <Bed size={14} /> {property.beds} Beds
          </span>
          <span className="flex items-center gap-1 text-xs font-raleway">
            <Bath size={14} /> {property.baths} Baths
          </span>
          <span className="flex items-center gap-1 text-xs font-raleway">
            <Maximize size={14} /> {property.sqft} sqft
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
