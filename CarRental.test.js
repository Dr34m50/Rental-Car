const { price } = require("./rentalPrice"); // Fix the import statement

test("ban for driver with less than 1 year of license", () => {
  const result = price("2024-07-01", "2024-07-05", "Compact", 25, 0.5);

  expect(result).toBe("Driver must have held a license for at least a year");
});

test("ban for driver under 18", () => {
  const result = price("2024-07-01", "2024-07-05", "Compact", 17, 2);

  expect(result).toBe("Driver too young - cannot quote the price");
});

test("ban for driver under 21 with non-compact car", () => {
  const result = price("2024-07-01", "2024-07-05", "Electric", 20, 2);

  expect(result).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
});

test("rental price for a young driver with a compact car", () => {
  const result = price("2024-07-01", "2024-07-05", "Compact", 20, 2);

  expect(result).toBe("$190.00");
});

test("rental price for a driver with a racer car in high season", () => {
  const result = price("2024-07-01", "2024-07-05", "Racer", 24, 3);

  expect(result).toBe("$207.00");
});

test("rental price for a driver with less than 2 years of license", () => {
  const result = price("2024-07-01", "2024-07-05", "Compact", 25, 1);

  expect(result).toBe("$261.88");
});

test("rental price for a driver with less than 3 years of license in high season", () => {
  const result = price("2024-07-01", "2024-07-05", "Compact", 25, 2);

  expect(result).toBe("$218.75");
});

test("rental price for a driver with more than 10 days in low season", () => {
  const result = price("2024-01-01", "2024-01-12", "Compact", 30, 5);

  expect(result).toBe("$327.00");
});

test("rental price for a driver with more than 10 days in high season", () => {
  const result = price("2024-07-01", "2024-07-12", "Compact", 30, 5);

  expect(result).toBe("$417.00");
});

test("rental price for a driver with pickup date in low season and dropoff date in high season", () => {
  const result = price("2024-03-28", "2024-04-04", "Compact", 30, 5);

  expect(result).toBe("$243.00");
});

test("rental price for a driver with pickup date in high season and dropoff date in low season", () => {
  const result = price("2024-10-30", "2024-11-02", "Compact", 30, 5);

  expect(result).toBe("$139.50");
});

test("rental price for a driver with pickup date in high season and dropoff date in high season", () => {
  const result = price("2024-05-01", "2024-05-10", "Compact", 30, 5);

  expect(result).toBe("$348.00");
});

test("50 year old driver rents a car for three days: Monday, Tuesday, Wednesday", () => {
  const result = price("2025-02-03", "2025-02-05", "Compact", 50, 5);

  expect(result).toBe("$150.00");
});

test("50 year old driver rents a car for three days: Thursday, Friday, Saturday", () => {
  const result = price("2025-02-06", "2025-02-08", "Compact", 50, 5);

  expect(result).toBe("$152.50");
});