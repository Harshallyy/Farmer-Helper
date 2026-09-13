const fonts = {
  base: "Inter, Open Sans, sans-serif",
};

const colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529",
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
  },
  black: "#12263f",
  white: "#ffffff",
  transparent: "transparent",
};

function chartOptions() {
  return {
    color: colors.gray[600],
    font: {
      family: fonts.base,
      size: 13,
    },
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        backgroundColor: colors.theme.primary,
      },
      line: {
        tension: 0.4,
        borderWidth: 4,
        borderColor: colors.theme.primary,
        backgroundColor: colors.transparent,
      },
      bar: {
        backgroundColor: colors.theme.warning,
        borderRadius: 6,
        borderSkipped: false,
      },
      arc: {
        backgroundColor: colors.theme.primary,
        borderColor: colors.white,
        borderWidth: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 20,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: colors.gray[300],
          drawBorder: false,
          borderDash: [2],
        },
        ticks: {
          padding: 10,
        },
      },
    },
  };
}

function parseOptions(ChartJS, options) {
  if (options?.color) {
    ChartJS.defaults.color = options.color;
  }

  if (options?.font) {
    Object.assign(ChartJS.defaults.font, options.font);
  }

  if (options?.plugins) {
    if (options.plugins.legend) {
      Object.assign(ChartJS.defaults.plugins.legend, options.plugins.legend);
    }

    if (options.plugins.tooltip) {
      Object.assign(ChartJS.defaults.plugins.tooltip, options.plugins.tooltip);
    }
  }

  if (options?.elements) {
    Object.entries(options.elements).forEach(([element, settings]) => {
      if (ChartJS.defaults.elements[element]) {
        Object.assign(ChartJS.defaults.elements[element], settings);
      }
    });
  }
}

const chartExample3 = {
  options: {
    scales: {
      y: {
        grid: {
          color: colors.gray[300],
        },
        ticks: {
          callback: (value) => (value % 10 === 0 ? `${value}%` : undefined),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`,
        },
      },
    },
  },
};

const chartExample4 = {
  options: {
    scales: {
      y: {
        grid: {
          color: colors.gray[300],
        },
        ticks: {
          callback: (value) => (value % 10 === 0 ? `${value}ºC` : undefined),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}ºC`,
        },
      },
    },
  },
};

const chartExample2 = {
  options: {
    scales: {
      y: {
        ticks: {
          callback: (value) => (value % 10 === 0 ? `₹${value}` : undefined),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y}`,
        },
      },
    },
  },
};

export {
  chartOptions,
  parseOptions,
  chartExample2,
  chartExample3,
  chartExample4,
};
