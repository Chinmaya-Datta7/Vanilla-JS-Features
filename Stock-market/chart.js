let stocksChart;

const createChart = (dataColumn) => {
  const chartCtx = document.getElementById('myChart').getContext('2d');

  //hoverCrosshair plugin
  let crosshair;
  const hoverCrosshair = {
    id: 'hoverCrosshair',
    events: ['mousemove'],

    beforeDatasetsDraw(chart) {
      if (crosshair) {
        const { ctx } = chart;
        ctx.save();
        crosshair.forEach((line) => {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(102,102,102,1)';
          ctx.lineWidth = 2;
          ctx.moveTo(line.startX, line.startY);
          ctx.lineTo(line.endX, line.endY);
          ctx.stroke();
          ctx.closePath();
        });

        ctx.restore();
      }
    },

    afterEvent(chart, args) {
      const {
        chartArea: { top, bottom },
      } = chart;

      const xCoor = args.event.x;

      if (!args.inChartArea && crosshair) {
        crosshair = undefined;
        args.changed = true;
      } else if (args.inChartArea) {
        crosshair = [
          {
            startX: xCoor,
            startY: top,
            endX: xCoor,
            endY: bottom,
          },
        ];
        args.changed = true;
      }
    },
  };

  const config = {
    type: 'line',
    data: dataColumn,
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          ticks: {
            display: false, // Hide ticks on the x-axis
          },
          grid: {
            display: false, // Hide grid lines on the x-axis
          },
        },
        y: {
          display: true,
          ticks: {
            display: true, // Hide ticks on the y-axis
          },
          grid: {
            display: false, // Hide grid lines on the y-axis
          },
        },
      },
      plugins: {
        tooltip: {
          intersect: false,
          axis: 'x',
        },
      },
    },
    plugins: [hoverCrosshair],
  };
  // create new chart
  stocksChart = new Chart(chartCtx, config);
};
export { stocksChart };
export default createChart;
