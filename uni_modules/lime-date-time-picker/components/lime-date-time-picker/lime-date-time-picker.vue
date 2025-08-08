<template>
	<view class="demo-block">
		<text class="demo-block__title-text ultra">DateTimePicker 时间选择器</text>
		<text class="demo-block__desc-text">用于选择时间，支持日期、时分等时间维度</text>
		<view class="demo-block__body">
			<view class="demo-block card">
				<text class="demo-block__title-text">基础用法</text>
				<view class="demo-block__body">
					<l-date-time-picker></l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">年月 1|2 </text>
				<view class="demo-block__body">
					<l-date-time-picker confirm-btn="确认" cancel-btn="取消" title="选择日期" :mode="3"></l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">时分秒 8|16|32</text>
				<view class="demo-block__body">
					<l-date-time-picker confirm-btn="确认" cancel-btn="取消" title="选择时间" :mode="56"></l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">完整的时间 1|2|4|8|16|32</text>
				<view class="demo-block__body">
					<l-date-time-picker confirm-btn="确认" cancel-btn="取消" title="选择日期" :mode="63"></l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">自定义范围{{value}}</text>
				<view class="demo-block__body">
					<l-date-time-picker 
						title="选择日期"
						v-model="value" 
						confirm-btn="确认"
						cancel-btn="取消"
						start="2020-6-30"
						end="2025-6-30"
						format="YYYY-MM-DD"
						@confirm="onConfirm"
						@pick="onPick">
					</l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">自定义label</text>
				<view class="demo-block__body">
					<l-date-time-picker 
						title="选择日期"
						confirm-btn="确认"
						cancel-btn="取消"
						start="2020-6-30"
						end="2025-6-30"
						format="YYYY-MM-DD"
						:renderLabel="renderLabel"
						@confirm="onConfirm"
						@pick="onPick">
					</l-date-time-picker>
				</view>
			</view>
			<view class="demo-block card">
				<text class="demo-block__title-text">过滤项</text>
				<view class="demo-block__body">
					<l-date-time-picker 
						title="选择日期"
						confirm-btn="确认"
						cancel-btn="取消"
						start="2020-6-30"
						end="2025-6-30"
						format="YYYY-MM-DD"
						:customFilter="filter"
						@confirm="onConfirm"
						@pick="onPick">
					</l-date-time-picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '2024-05-02'
			}
		},
		methods: {
			onConfirm(value) {
				console.log('onConfirm', value)
			},
			onPick(value) {
				console.log('onPick', value)
			},
			renderLabel(type, value) {
				if(type == 'year') {
					return `${value}年`
				}
				return value
			},
			filter(type, columns) {
				if (type == 'month') {
				    return columns.filter((option) => parseInt(option.value) % 6 == 0);
				}
				return columns
			}
		}
	}
	
</script>

<style lang="scss">
	.btn {
		margin-bottom: 20rpx;
		margin-right: 20rpx;
		align-self: center;
	}

	.demo-block {
		margin: 32px 0 0;

		// overflow: visible;
		&.card {
			// background-color: white;
			padding: 30rpx;
			margin-bottom: 20rpx;
		}

		&__title {
			margin: 0;
			margin-top: 8px;

			&-text {
				color: rgba(0, 0, 0, 0.6);
				font-weight: 400;
				font-size: 14px;
				line-height: 16px;
				display: flex;
				margin-left: 5px;

				&.large {
					color: rgba(0, 0, 0, 0.9);
					font-size: 18px;
					font-weight: 700;
					line-height: 26px;
					margin-left: 20px;
				}

				&.ultra {
					color: rgba(0, 0, 0, 0.9);
					font-size: 24px;
					font-weight: 700;
					line-height: 32px;
					padding-left: 15px ;
				}
			}
		}

		&__desc-text {
			color: rgba(0, 0, 0, 0.6);
			margin: 8px 16px 0 0;
			font-size: 14px;
			line-height: 22px;
			margin-left: 20px;
		}

		&__body {
			margin: 16px 0;
			overflow: visible;

			.demo-block {
				// margin-top: 0px;
				margin: 0;
				overflow: visible;
			}
		}
	}
</style>