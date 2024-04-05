import Dexie from "dexie";

const DATABASE_NAME = "client-state";
const STORES = {
  flights: "flightId",
  selections: "++id",
};

function createStorageRepository() {
  const db = new Dexie(DATABASE_NAME, { autoOpen: true });
  db.version(1).stores(STORES);

  return {
    flights: db.flights,
    selections: db.selections,
  };
}

export default createStorageRepository;