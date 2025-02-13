class CarRental {
    static CAR_CLASSES = ["Compact", "Electric", "Cabrio", "Racer"];
    static SEASONS = { LOW: "Low", HIGH: "High" };
    static WEEKEND_SURCHARGE = 1.05;
    static YOUTH_AGE_LIMIT = 18;
    static COMPACT_CAR_AGE_LIMIT = 21;
    static RACER_YOUNG_DRIVER_SURCHARGE = 1.5;
    static HIGH_SEASON_SURCHARGE = 1.15;
    static LONG_RENT_DISCOUNT = 0.9;
    static LICENSE_YEARS_SURCHARGES = {
      LESS_THAN_ONE: 1, // Исправлено null -> 1 (без надбавки)
      LESS_THAN_TWO: 1.3,
      LESS_THAN_THREE: 15,
    };
  
    constructor(driverAge, licenseYears, carType, rentalDays, startDate) {
      if (!Number.isFinite(driverAge) || driverAge < CarRental.YOUTH_AGE_LIMIT) {
        throw new Error("Driver too young - cannot quote the price");
      }
      if (
        driverAge <= CarRental.COMPACT_CAR_AGE_LIMIT &&
        String(carType || "").trim().toLowerCase() !== "compact"
      ) {
        throw new Error("Drivers 21 y/o or less can only rent Compact vehicles");
      }
      if (!Number.isFinite(licenseYears) || licenseYears < 1) {
        throw new Error("Driver's license held for less than a year");
      }
      if (!Number.isFinite(rentalDays) || rentalDays <= 0) {
        throw new Error("Rental period must be at least 1 day");
      }
  
      this.driverAge = driverAge;
      this.licenseYears = licenseYears;
      this.carType = String(carType || "").trim();
      this.carType = this.carType.charAt(0).toUpperCase() + this.carType.slice(1).toLowerCase();
      this.rentalDays = rentalDays;
      this.startDate = new Date(startDate);
    }
  
    isHighSeason() {
      const month = this.startDate.getMonth() + 1;
      return month >= 4 && month <= 10;
    }
  
    isWeekend(day) {
      return day === 6 || day === 0;
    }
  
    calculatePrice() {
      let rentalPrice = this.driverAge;
  
      if (this.carType === "Racer" && this.driverAge <= 25 && !this.isHighSeason()) {
        rentalPrice *= CarRental.RACER_YOUNG_DRIVER_SURCHARGE;
      }
      if (this.isHighSeason()) {
        rentalPrice *= CarRental.HIGH_SEASON_SURCHARGE;
      }
      if (this.licenseYears < 2) {
        rentalPrice *= CarRental.LICENSE_YEARS_SURCHARGES.LESS_THAN_TWO || 1;
      } else if (this.licenseYears < 3 && this.isHighSeason()) {
        rentalPrice += CarRental.LICENSE_YEARS_SURCHARGES.LESS_THAN_THREE;
      }
      if (this.rentalDays > 10 && !this.isHighSeason()) {
        rentalPrice *= CarRental.LONG_RENT_DISCOUNT;
      }
  
      let totalPrice = 0;
      for (let i = 0; i < this.rentalDays; i++) {
        const day = new Date(this.startDate);
        day.setDate(day.getDate() + i);
        totalPrice += this.isWeekend(day.getDay())
          ? rentalPrice * CarRental.WEEKEND_SURCHARGE
          : rentalPrice;
      }
      return totalPrice.toFixed(2);
    }
  }
  
  module.exports = CarRental;  