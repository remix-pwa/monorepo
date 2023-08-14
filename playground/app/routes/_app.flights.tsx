import { redirect, defer, json } from "@remix-run/router";
import { useLoaderData, Form, useNavigation, Await } from "@remix-run/react";
import { Suspense } from "react";

export function loader() {
  return json({
    flights: [
      {
        date: "2023-07-01T23:30:00",
        arrival: "EZE",
        departure: "ARN",
        flightId: 1,
        flightNumber: "SK0000 - server",
      },
      {
        date: "2023-07-06T07:35:00",
        arrival: "ARN",
        departure: "EZE",
        flightId: 2,
        flightNumber: "SK0001 - server",
      },
    ],
  });
}

/**
 * @param {import('@remix-run/node').ActionArgs} args
 */
export const workerAction = async ({ request, context }) => {
  const formData = await request.formData();
  const { database, fetchFromServer } = context;

  try {
    // Send action to server
    fetchFromServer();
    // Save selection in client
    await database.selections.add(Object.fromEntries(formData.entries()));
    return redirect("/selection");
  } catch (error) {
    throw json({ message: "Something went wrong", error }, 500);
  }
};

/**
 * @param {import('@remix-run/node').LoaderArgs} args
 */
export const workerLoader = async ({ context }) => {
  try {
    const { fetchFromServer, database } = context;
    const [serverResult, clientResult] = await Promise.allSettled([
      // NOTE: If the user decides to use the server loader, must use the `context.event.request` object instead of `request`.
      // This is because we strip the `_data` and `index` from the request object just to follow what Remix does.
      fetchFromServer()
        .then((response) => response.json())
        .then(({ flights }) => flights),
      database.flights.toArray(),
    ]);
    const flights = serverResult.value || clientResult.value;

    if (serverResult.value) {
      await database.flights.bulkPut(
        flights.map((f) => ({
          ...f,
          flightNumber: `${f.flightNumber.split("-")[0].trim()} - client`,
        }))
      );
    }

    // can't use same `json` here because is only for node
    return defer({ flights });
  } catch (error) {
    console.error(error);
    throw json({ message: "Something went wrong", error }, 500);
  }
};

export async function action({ request }) {
  const formData = await request.formData();
  const flight = formData.get("flightId");

  console.log(flight, "here is the flight id");

  return redirect("/server-redirect");
}

export default function FlightsRoute() {
  const { flights } = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";

  return (
    <div>
      <h1>Flights</h1>

      <section>
        <Form method="post">
          <Suspense fallback={<p>Loading more data...</p>}>
            <Await resolve={flights}>
              {(flights) =>
                flights && (
                  <fieldset disabled={loading}>
                    {flights.map((flight, index) => (
                      <div key={`${flight.flightId}-${index}`}>
                        <label>
                          <input
                            type="radio"
                            name="flightId"
                            value={flight.flightId}
                          />
                          {flight.flightNumber}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                )
              }
            </Await>
          </Suspense>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </Form>
      </section>
    </div>
  );
}
