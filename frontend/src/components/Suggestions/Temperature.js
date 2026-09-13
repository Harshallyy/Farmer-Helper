import React from "react";
import crops from "./crops.json";

function Temperature() {
  const currentTemperature = 25;

  const suitableCrops = crops.filter(
    (crop) =>
      currentTemperature >= crop.minTemp && currentTemperature <= crop.maxTemp,
  );

  return (
    <div>
      <h4 className="mb-3">Crops suitable for current temperature</h4>

      <p className="text-muted">
        Current Temperature: <strong>{currentTemperature}°C</strong>
      </p>

      {suitableCrops.length > 0 ? (
        <div className="row">
          {suitableCrops.map((crop) => (
            <div className="col-md-4 mb-3" key={crop.name}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title mb-1">{crop.name}</h5>
                  <p className="card-text text-muted mb-0">
                    Best temperature: {crop.minTemp}°C - {crop.maxTemp}°C
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">
          No suitable crops found for the current temperature.
        </p>
      )}
    </div>
  );
}

export default Temperature;
