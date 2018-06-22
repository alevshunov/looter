import * as React from 'react';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as numeral from 'numeral';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import ifSetThen from '../../../components/ifSetThen';
import asDate from '../../../components/asDate';

class HistoryGraph extends React.Component<{ data: any }> {
    render() {
        const { data } = this.props;

        const start = moment({ year: 2018, month: 1, day: 20 });
        const end = moment().startOf('day');

        const dates: Moment[] = [];
        let cur = start;
        while (cur < end) {
            dates.push(cur.clone());
            cur.add({day: 1});
        }

        let soldPerDate = dates
            .map(d => data.soldPrice.find((p: any) => d.isSame(moment(p.date), 'day')));

        let daySellPrice = soldPerDate.map(v => ifSetThen(v, o => o.dayPrice));
        let daySellMinPrice = soldPerDate.map(v => ifSetThen(v, o => o.minPrice));
        let daySellMaxPrice = soldPerDate.map(v => ifSetThen(v, o => o.maxPrice));

        let boughtPerDate = dates
            .map(d => data.boughtPrice.find((p: any) => d.isSame(moment(p.date), 'day')));

        let dayBuyPrice = boughtPerDate.map(v => ifSetThen(v, o => o.dayPrice));
        let dayBuyMinPrice = boughtPerDate.map(v => ifSetThen(v, o => o.minPrice));
        let dayBuyMaxPrice = boughtPerDate.map(v => ifSetThen(v, o => o.maxPrice));

        let maxPrice = 1000;
        dayBuyPrice.forEach(x => maxPrice = Math.max(x, maxPrice));
        daySellPrice.forEach(x => maxPrice = Math.max(x, maxPrice));

        const graph: ChartData = {
            labels: dates.map(x => asDate(x, 'DD MMMM YYYY')),
            datasets: [
                {
                    label: 'Продажа',
                    data: daySellPrice,
                    spanGaps: true,
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                },
                {
                    label: 'От',
                    data: daySellMinPrice,
                    spanGaps: true,
                    fill: '+1',
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: 'rgba(54, 162, 235, 0)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)'
                },
                {
                    label: 'До',
                    data: daySellMaxPrice,
                    spanGaps: true,
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'rgba(54, 162, 235, 0)',
                    backgroundColor: 'rgba(54, 162, 235, 0.4)'
                },
                {
                    label: 'Скупка',
                    data: dayBuyPrice,
                    spanGaps: true,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                },
                {
                    label: 'От',
                    data: dayBuyMinPrice,
                    spanGaps: true,
                    fill: '+1',
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: 'rgba(255, 99, 132, 0)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                },
                {
                    label: 'До',
                    data: dayBuyMaxPrice,
                    spanGaps: true,
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 99, 132, 0)',
                    backgroundColor: 'rgba(255, 99, 132, 0.4)'
                }
            ]
        };

        const options: ChartOptions = {
            legend: {
                display: true,
                labels: {
                    filter: legendItem => legendItem.datasetIndex === 0 || legendItem.datasetIndex === 3
                }

            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    label: (tooltipItem, d) => {
                        if (!d.datasets ||
                            tooltipItem.datasetIndex === undefined ||
                            !d.datasets[tooltipItem.datasetIndex]) {
                            return '';
                        }

                        return d.datasets[tooltipItem.datasetIndex].label + ': ' +
                            numeral(tooltipItem.yLabel).format('0,0') + ' z';
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        callback: function(label: any, index: number) {
                            return asDate(dates[index], 'DD MMMM YYYY');
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: maxPrice * 1.2,
                        autoSkip: true,
                        callback: label => numeral(label).format('0,0') + ' z'
                    }
                }]
            }
        };

        return (
            <Line data={graph} options={options}/>
        );
    }
}

export default HistoryGraph;
