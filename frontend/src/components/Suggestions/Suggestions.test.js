import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";

import Suggestions from "./Suggestions";
import Temperature from "./Temperature";
import Rainfall from "./Rainfall";
import Location from "./Location";

describe("crop suggestion components", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders the temperature suggestion card from the object-shaped crop data", () => {
    act(() => {
      root.render(<Temperature />);
    });

    expect(container.textContent).toContain(
      "Crops suitable for current temperature",
    );
    expect(container.textContent).toContain("Rice");
    expect(container.textContent).toContain("25°C");
  });

  it("renders rainfall and location suggestions without crashing", () => {
    act(() => {
      root.render(
        <>
          <Rainfall />
          <Location />
        </>,
      );
    });

    expect(container.textContent).toContain(
      "Crops suitable for current rainfall",
    );
    expect(container.textContent).toContain("Current Rainfall:");
    expect(container.textContent).toContain("Crops Suitable for Location");
    expect(container.textContent).toContain("Madhya Pradesh");
  });

  it("renders the farming suggestions panel and tabs", () => {
    act(() => {
      root.render(<Suggestions />);
    });

    expect(container.textContent).toContain("Farming Suggestions");
    expect(container.textContent).toContain("Temperature");
    expect(container.textContent).toContain("Rainfall");
    expect(container.textContent).toContain("Location");
  });
});
