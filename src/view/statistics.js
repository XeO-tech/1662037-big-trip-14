import AbstractView from './abstract.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { sortDataAndLabels, defineDateTimeFormats } from '../utils/events.js';
dayjs.extend(duration);

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyChartContainerElement, events) => {
  const calculateDataForEvents = (eventsForType) => {
    if (eventsForType.length === 0) {
      return 0;
    }

    return eventsForType.reduce((accumulator, currentEvent) => accumulator + currentEvent.basePrice, 0);
  };

  const sortedDataAndLabels = sortDataAndLabels(events, calculateDataForEvents);

  return new Chart(moneyChartContainerElement, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedDataAndLabels.sortedLabels,
      datasets: [{
        data: sortedDataAndLabels.sortedData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          clip: true,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeChartContainerElement, events) => {
  const calculateDataForEvents = (eventsForType) => eventsForType.length;

  const sortedDataAndLabels = sortDataAndLabels(events, calculateDataForEvents);

  return new Chart(typeChartContainerElement, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedDataAndLabels.sortedLabels,
      datasets: [{
        data: sortedDataAndLabels.sortedData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          clip: true,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpentChart = (timeSpentChartContainerElement, events) => {

  const calculateDataForEvents = (eventsForType) => {
    if (eventsForType.length === 0) {
      return 0;
    }

    if (eventsForType.length === 1) {
      return dayjs.duration(dayjs(eventsForType[0].dateTo).diff(dayjs(eventsForType[0].dateFrom))).asMilliseconds();
    }

    return eventsForType.reduce((a, b) => {
      const currentDurationA = dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom)));

      const currentDurationB = dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom)));

      return currentDurationA.add(currentDurationB).asMilliseconds();
    });
  };

  const sortedDataAndLabels = sortDataAndLabels(events, calculateDataForEvents);

  return new Chart(timeSpentChartContainerElement, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedDataAndLabels.sortedLabels,
      datasets: [{
        data: sortedDataAndLabels.sortedData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          clip: true,
          formatter: (val) => {
            if (val === 0) {
              return '';
            }
            const durationValue = dayjs.duration(val);
            const format = defineDateTimeFormats(durationValue).durationFormat;

            return `${durationValue.format(format)}`;
          },
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

export default class Statistics extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    const moneyChartContainerElement = this.getElement().querySelector('.statistics__chart--money');
    const typeChartContainerElement = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpentChartContainerElement = this.getElement().querySelector('.statistics__chart--time');

    moneyChartContainerElement.height = typeChartContainerElement.height = timeSpentChartContainerElement.height = BAR_HEIGHT * 9;

    renderMoneyChart(moneyChartContainerElement, this._events);
    renderTypeChart(typeChartContainerElement, this._events);
    renderTimeSpentChart(timeSpentChartContainerElement, this._events);
  }
}
