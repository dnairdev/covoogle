var TITLE = 'Texas Google Trend Symptoms and Confirmed Cases';

var X_AXIS = 'March 1st 2020-August 5th 2020';  // x-axis label and label in tooltip
var Y_AXIS = 'Number of Cases'; // y-axis label and label in tooltip

var BEGIN_AT_ZERO = false;  // Should x-axis start from 0? `true` or `false`

var SHOW_GRID = true; // `true` to show the grid, `false` to hide
var SHOW_LEGEND = true; // `true` to show the legend, `false` to hide


$(document).ready(function() {

  // Read data file and create a chart
  $.get('./txdata.csv', function(csvString) {

    var data = Papa.parse(csvString).data;
    var timeLabels = data.slice(1).map(function(row) { return row[0]; });

    var datasets = [];
    for (var i = 1; i < data[0].length; i++) {
      datasets.push(
        {
          label: data[0][i], // column name
          data: data.slice(1).map(function(row) {return row[i]}), // data in that column
          fill: false // `true` for area charts, `false` for regular line charts
        }
      )
    }

    // Get container for the chart
    var ctx = document.getElementById('chart-container').getContext('2d');

    new Chart(ctx, {
      type: 'line',

      data: {
        labels: timeLabels,
        datasets: datasets,
      },
      
      options: {
        title: {
          display: true,
          text: TITLE,
          fontSize: 14,
        },
        legend: {
          display: SHOW_LEGEND,
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: X_AXIS !== '',
              labelString: X_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              callback: function(value, index, values) {
                return value.toLocaleString();
              }
            }
          }],
          yAxes: [{
            beginAtZero: true,
            scaleLabel: {
              display: Y_AXIS !== '',
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: BEGIN_AT_ZERO,
              callback: function(value, index, values) {
                return value.toLocaleString()
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, all) {
              return all.datasets[tooltipItem.datasetIndex].label
                + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        plugins: {
          colorschemes: {
            scheme: 'brewer.Paired11'
          }
        }
      }
    });

  });

});
