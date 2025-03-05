const { getPrice, CarRental } = require("./rentalPrice");

test("throws errors for invalid inputs", () => {
  expect(() => {
    new CarRental(17, 2, "Compact", 5, "2025-06-01");
  }).toThrow("Driver too young - cannot quote the price");

  expect(() => {
    new CarRental(20, 0.5, "Compact", 5, "2025-06-01");
  }).toThrow("Driver's license held for less than a year");

  expect(() => {
    new CarRental(20, 2, "Compact", 0, "2025-06-01");
  }).toThrow("Rental period must be at least 1 day");

  expect(() => {
    new CarRental(20, 2, "Racer", 5, "2025-06-01");
  }).toThrow("Drivers 21 y/o or less can only rent Compact vehicles");
});

test("calculates the correct rental prices", () => {
  expect(getPrice("2025-06-01", "2025-06-15", "Compact", 30, 10)).toBe(
    "$489.90"
  );
  expect(getPrice("2025-07-01", "2025-07-05", "Compact", 30, 10)).toBe(
    "$138.00"
  );
  expect(getPrice("2025-06-05", "2025-06-09", "Compact", 30, 10)).toBe(
    "$141.45"
  );
  expect(getPrice("2025-06-01", "2025-06-05", "Compact", 30, 1.5)).toBe(
    "$181.64"
  );
  expect(getPrice("2025-03-01", "2025-03-15", "Compact", 30, 10)).toBe(
    "$383.40"
  );
  expect(getPrice("2025-07-01", "2025-07-05", "Compact", 30, 2.5)).toBe(
    "$198.00"
  );
  expect(getPrice("2025-06-01", "2025-06-05", "Racer", 22, 2)).toBe("$163.21");
});

test("applies young driver surcharge for Racer in low season", () => {
  expect(getPrice("2025-02-01", "2025-02-05", "Racer", 24, 2)).toBe("$147.60");
});