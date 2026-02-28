import { MapPin } from "lucide-react";

const MapView = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Interactive Map</h1>
        <p className="font-raleway text-sm text-muted-foreground">Property locations overview</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="relative w-full h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.3011806427!2d54.89784018564417!3d25.076280455498805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Properties Map"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-raleway text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-kaya-olive" />
          Popular Areas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay", "JBR", "Dubai Hills", "Arabian Ranches", "DIFC"].map((area) => (
            <div key={area} className="px-3 py-2 bg-muted/50 rounded-lg font-raleway text-xs text-foreground hover:bg-muted cursor-pointer transition-colors">
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
