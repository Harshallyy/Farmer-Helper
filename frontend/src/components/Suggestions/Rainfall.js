import React from "react";
import crops from "./crops.json";
import { normalizeCropData } from "./Temperature";

function Rainfall() {
  const currentRainfall = 250;
  const normalizedCrops = normalizeCropData(crops);

  const suitableCrops = normalizedCrops.filter(
    (crop) =>
      currentRainfall >= crop.minRainfall &&
      currentRainfall <= crop.maxRainfall,
  );

  return (
    <div>
      <h4 className="mb-3">Crops suitable for current rainfall</h4>

      <p className="text-muted">
        Current Rainfall: <strong>{currentRainfall} mm</strong>
      </p>

      {suitableCrops.length > 0 ? (
        <div className="row">
          {suitableCrops.map((crop) => (
            <div className="col-md-4 mb-3" key={crop.name}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{crop.name}</h5>
                  <p className="card-text text-muted mb-0">
                    Required rainfall: {crop.minRainfall} - {crop.maxRainfall}{" "}
                    mm
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">
          No suitable crops found for the current rainfall.
        </p>
      )}
    </div>
  );
}

export default Rainfall;
