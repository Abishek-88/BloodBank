export const scoreBankByDistance = (requestLocation, bankLocation) => {
  if (!requestLocation || !bankLocation) return Number.MAX_SAFE_INTEGER;

  const latitudeDelta = requestLocation.latitude - bankLocation.latitude;
  const longitudeDelta = requestLocation.longitude - bankLocation.longitude;
  return Math.sqrt(latitudeDelta ** 2 + longitudeDelta ** 2);
};

export const sortBanksByProximity = (requestLocation, banks) =>
  [...banks].sort(
    (a, b) => scoreBankByDistance(requestLocation, a) - scoreBankByDistance(requestLocation, b)
  );