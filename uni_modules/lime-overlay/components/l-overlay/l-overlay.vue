<template>
	<view 
		v-if="inited" 
		class="l-overlay" 
		:class="[lClass, classes]"
		:style="[styles, lStyle]"
		@click.stop="onClick" 
		@touchmove.stop="noop" 
		@transitionend="finished"
		:aria-role="ariaRole || 'button'" 
		:aria-label="ariaLabel || '关闭'">
		<slot></slot>
	</view>
</template>

<script lang="ts">
	// @ts-nocheck
	import { computed, defineComponent } from '@/uni_modules/lime-shared/vue';
	import { useTransition, UseTransitionOptions, TransitionEmitStatus } from '@/uni_modules/lime-transition';
	import overlayProps from './props';

	export default defineComponent({
		props: overlayProps,
		emits: ['click', 'before-enter', 'enter', 'after-enter', 'before-leave', 'leave', 'after-leave'],
		options: {
			addGlobalClass: true,
			virtualHost: true,
			externalClasses: true,
		},
		externalClasses: ['l-class'],
		setup(props, { emit }) {
			
			const {inited, display, classes, finished} = useTransition({
				defaultName: 'fade',
				appear: props.visible,
				emits: (name:TransitionEmitStatus) => { emit(name) },
				visible: (): boolean => props.visible,
				duration: props.duration,
			} as UseTransitionOptions)


			const styles = computed(() => ({
				'transition-duration': props.duration + 'ms',
				'background': props.bgColor,
				'z-index': props.zIndex,
				'display': !display.value ? 'none' : '',
			}))

			const onClick = () => {
				emit('click', !props.visible)
			}
			const noop = (e) => {
				e?.preventDefault();
				return
			}

			return {
				inited,
				styles,
				classes,
				noop,
				onClick,
				finished
			}
		}
	})
</script>
<style lang="scss">
	@import './index';
</style>