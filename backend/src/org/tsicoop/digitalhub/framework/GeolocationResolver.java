package org.tsicoop.digitalhub.framework;
import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.Location;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;

public class GeolocationResolver {

    private static DatabaseReader reader;

    public GeolocationResolver(){

    }
    public static LocationData getLocationFromIp(String ipAddress) throws IOException, GeoIp2Exception {
        InetAddress ip = InetAddress.getByName(ipAddress);
        CityResponse response = reader.city(ip);

        Location location = response.getLocation();
        String city = response.getCity().getName();
        String country = response.getCountry().getName();
        String countryCode = response.getCountry().getIsoCode();

        return new LocationData(
                location.getLatitude(),
                location.getLongitude(),
                city,
                country,
                countryCode
        );
    }

    public static class LocationData {
        private final Double latitude;
        private final Double longitude;
        private final String city;
        private final String country;
        private final String countryCode;

        public LocationData(Double latitude, Double longitude, String city, String country, String countryCode) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.city = city;
            this.country = country;
            this.countryCode = countryCode;
        }

        // Getters
        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
        public String getCity() { return city; }
        public String getCountry() { return country; }
        public String getCountryCode() { return countryCode; }

        @Override
        public String toString() {
            return "LocationData{" +
                    "latitude=" + latitude +
                    ", longitude=" + longitude +
                    ", city='" + city + '\'' +
                    ", country='" + country + '\'' +
                    ", countryCode='" + countryCode + '\'' +
                    '}';
        }
    }

    public static boolean isIndiaIP(String ipaddress){
        boolean indiaIP = false;

        String resourcePath = null;
        try{
            if(reader == null) {
                if (isWindows()) {
                    resourcePath = "c:/work/tsi-coop/resources/GeoLite2-City.mmdb";
                } else {
                    resourcePath = "/home/ubuntu/resources/GeoLite2-City.mmdb";
                }
                try {
                    File database = new File(resourcePath);
                    reader = new DatabaseReader.Builder(database).build();
                } catch (Exception e) {
                }
            }

            LocationData location = getLocationFromIp(ipaddress);
            System.out.println(location);
            if(location.countryCode.equalsIgnoreCase("IN")){
                indiaIP = true;
            }
        } catch (Exception e) {
                e.printStackTrace();
        }
        return indiaIP;
    }

    public static boolean isWindows() {
        String osName = System.getProperty("os.name");
        return osName != null && osName.toLowerCase().startsWith("windows");
    }

    /**
     * Checks if the current operating system is Linux.
     * @return true if the OS is Linux, false otherwise.
     */
    public static boolean isLinux() {
        String osName = System.getProperty("os.name");
        return osName != null && osName.toLowerCase().startsWith("linux");
    }

    public static void main(String[] args) {

        String clientIp = "82.165.180.207"; // Google's public DNS for example
        System.out.println(GeolocationResolver.isIndiaIP(clientIp));
    }
}
