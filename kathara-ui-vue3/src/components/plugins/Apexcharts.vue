<script>
import VueApexCharts from "vue3-apexcharts";
import { useAppVariableStore } from '@/stores/app-variable';

const appVariable = useAppVariableStore();

Apex = {
	title: {
		style: {
			fontSize:  '14px',
			fontWeight:  'bold',
			fontFamily:  appVariable.font.family,
			color:  appVariable.color.white
		},
	},
	legend: {
		fontFamily: appVariable.font.family,
		labels: {
			colors: '#fff'
		}
	},
	tooltip: {
		style: {
			fontSize: '12px',
			fontFamily: appVariable.font.family
		}
	},
	grid: {
		borderColor: 'rgba('+ appVariable.color.whiteRgb + ', .25)',
	},
	dataLabels: {
		style: {
			fontSize: '12px',
			fontFamily: appVariable.font.family,
			fontWeight: 'bold',
			colors: undefined
		}
	},
	xaxis: {
		axisBorder: {
			show: true,
			color: 'rgba('+ appVariable.color.whiteRgb + ', .25)',
			height: 1,
			width: '100%',
			offsetX: 0,
			offsetY: -1
		},
		axisTicks: {
			show: true,
			borderType: 'solid',
			color: 'rgba('+ appVariable.color.whiteRgb + ', .25)',
			height: 6,
			offsetX: 0,
			offsetY: 0
		},
		labels: {
			style: {
				colors: '#fff',
				fontSize: '12px',
				fontFamily: appVariable.font.family,
				fontWeight: 400,
				cssClass: 'apexcharts-xaxis-label',
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				colors: '#fff',
				fontSize: '12px',
				fontFamily: appVariable.font.family,
				fontWeight: 400,
				cssClass: 'apexcharts-xaxis-label',
			}
		}
	}
};

export default {
	props: ['height', 'options', 'series'],
  components: {
    apexchart: VueApexCharts,
  }
};
</script>

<template>
  <div>
    <apexchart
      :height="height"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>