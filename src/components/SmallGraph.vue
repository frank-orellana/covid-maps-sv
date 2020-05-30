<template>
	<div class="graph">
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SmallGraph extends Vue{
	@Prop() private title!: string;
	@Prop() private datos!: [];
}
</script>

<style scoped>

</style>