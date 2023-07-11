<script>
import Chart from 'chart.js/auto';
import { useAppVariableStore } from '@/stores/app-variable';

const appVariable = useAppVariableStore();

export default {
	props: ['data', 'type', 'options', 'width', 'height'],
  mounted() {
  	Chart.defaults.font.family = appVariable.font.family;
		Chart.defaults.color = 'rgba('+ appVariable.color.whiteRgb +', .5)';
		Chart.defaults.plugins.legend.display = false;
		Chart.defaults.plugins.tooltip.padding = 8;
		Chart.defaults.plugins.tooltip.backgroundColor = 'rgba('+ appVariable.color.gray800Rgb +', .95)';
		Chart.defaults.plugins.tooltip.titleFont.family = appVariable.font.family;
		Chart.defaults.plugins.tooltip.titleFont.weight = 600;
		Chart.defaults.plugins.tooltip.footerFont.family = appVariable.font.family;
		Chart.defaults.scale.grid.color = 'rgba('+ appVariable.color.whiteRgb +', .25)';
		Chart.defaults.scale.ticks.backdropColor = 'rgba('+ appVariable.color.whiteRgb + ', 0)';
		
		new Chart(this.$refs.canvas, {
			type: this.$props.type,
			data: this.$props.data,
			options: this.$props.options
		});
  }
}
</script>

<template>
	<canvas ref="canvas" :height="height" />
</template>