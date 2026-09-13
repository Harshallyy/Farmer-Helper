import React from "react";
import { Row, Col, CardHeader, Table, Card } from "reactstrap";
import crops from "./crops.json";

function getCropEntries(rawCrops) {
  if (!rawCrops || typeof rawCrops !== "object") {
    return [];
  }

  if (Array.isArray(rawCrops)) {
    return rawCrops.filter((crop) => crop && typeof crop === "object");
  }

  return Object.entries(rawCrops).filter(
    ([, crop]) => crop && typeof crop === "object",
  );
}

function Location() {
  const currentLocation = "Madhya Pradesh";
  const cropEntries = getCropEntries(crops);

  const suggestedCrops = cropEntries.filter(
    ([, crop]) =>
      Array.isArray(crop?.locations) &&
      crop.locations.includes(currentLocation),
  );

  return (
    <Col className="mb-xl-0 p-0" xl="">
      <Card className="shadow p-4 modern-card">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0 text-center">Crops Suitable for Location</h3>
            </div>
          </Row>
        </CardHeader>

        <p>
          <strong>Current Location: {currentLocation}</strong>
        </p>

        <Table
          className="align-items-center table-flush table-striped"
          responsive
        >
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Min Required Temperature</th>
              <th scope="col">Max Allowed Temperature</th>
            </tr>
          </thead>

          <tbody>
            {suggestedCrops.length > 0 ? (
              suggestedCrops.map(([cropName, crop]) => (
                <tr key={cropName}>
                  <td>{cropName}</td>
                  <td>{crop.min_T}ºC</td>
                  <td>{crop.max_T}ºC</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No suitable crops found for this location.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}

export default Location;
