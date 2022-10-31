export const mergeDates = function (values, dates) {
  return values.map((d, i) => ({ x: new Date(dates[i]).getTime(), y: d }));
};

export const mergeResponseDates = function (values, dates) {
  return values.map((d, i) => {
    if (d > 11000) {
      return {
        x: new Date(dates[i]).getTime(),
        y: d,
        color: '#BF0B23',
        marker: { lineColor: '#BF0B23', lineWidth: 2 },
      };
    }
    return { x: new Date(dates[i]).getTime(), y: d };
  });
};
export const getSeries = function (data, name = 'Some Series', dates) {
  return {
    lineWidth: 1,
    color: '#333',
    name,
    data: mergeDates(data, dates),
    step: 'center',
    tooltip: {
      valueDecimals: 2,
    },
    states: {
      hover: {
        lineWidth: 1,
      },
    },
    marker: {
      enabled: false,
    },
  };
};
