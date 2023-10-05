import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';

function Charts(props) {
  const { totalsByAirframe, USDollar, chartType } = props;
  return (
    <div className="charts-container">

      {chartType === 'pie' ? (
        <PieChart totalsByAirframe={totalsByAirframe} USDollar={USDollar} />
      ) : (
        <BarChart totalsByAirframe={totalsByAirframe} USDollar={USDollar} />
      )}
    </div>
  );
}

function PieChart(props) {
  const { totalsByAirframe } = props;

  const Airframe_labels = totalsByAirframe.map((airframe) => airframe.label);
  const Airframe_values = totalsByAirframe.map((airframe) => airframe.value);

  const data = {
    labels: Airframe_labels,
    datasets: [
      {
        data: Airframe_values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.45)',
          'rgba(72, 223, 237, 0.45)',
          'rgba(255, 206, 86, 0.45)',
          'rgba(75, 192, 192, 0.45)',
          'rgba(153, 102, 255, 0.45)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '5%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          },
          color: 'rgba(255, 255, 255, 1)',
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Total FY Spending, per Airframe:',
        font: {
          size: 20,
          weight: 1,
        },
        color: 'rgba(255, 255, 255, 1)',
        padding: {
          bottom: 30,
          top: 70,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}


// Bar chart function
function BarChart(props) {
  const { totalsByAirframe, USDollar } = props;

  const airframeLabels = totalsByAirframe.map((airframe) => airframe.label);


  // Define an array of colors for the bars
  const backgroundColors = [
    'rgba(255, 99, 132, 0.45)',
    'rgba(72, 223, 237, 0.45)',
    'rgba(255, 206, 86, 0.45)',
    'rgba(75, 192, 192, 0.45)',
    'rgba(153, 102, 255, 0.45)',
  ];

  const borderColor=[
    'rgba(255, 99, 132, 1)',
    'rgba(72, 223, 237, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
  ]
  const datasets = totalsByAirframe.map((airframe, index) => ({
    label: airframe.label,
    data: [airframe.value],
    backgroundColor: backgroundColors[index],
    borderColor: borderColor[index],
    borderWidth: 2.5,
  }));

  const data = {
    labels: airframeLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    indexAxis: 'x', 
    plugins: {
      title: {
        display: true,
        text: 'Total FY Spending Per Airframe',
        font: {
          size: 20,
          weight: 1,
        },
        padding: {
          bottom: 30,
        },
        color: 'rgba(255, 255, 255, 1)',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 15,
          },
          color: 'rgba(255, 255, 255, 1)',
        },
      },
      width: 0.1,
      tooltip: {
        callbacks: {
          title: function (tooltipItems, data) {
            return '';
          },
          label: function (context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += USDollar.format(context.parsed.y); 
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false, 
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        stacked: false, 
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    barPercentage: 0.7, 
    categoryPercentage: 0.9,
  };

  return <Bar data={data} options={options} />;
}



export default Charts;
