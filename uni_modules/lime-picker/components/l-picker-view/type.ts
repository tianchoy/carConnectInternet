// @ts-nocheck
import type{ PickerProps, PickerColumn, PickerValue, PickerColumnItem, PickerConfirmEvent, PickerPickEvent, PickerChangeInfo } from '../l-picker/type';

export type ManageChildInList = (child: LPickerItemComponentPublicInstance, shouldAdd: boolean) => void;
export type OnPick = (value: PickerValue, index:number, column: number) => void;
export type UpdateItems = (value: PickerValue, index:number, column: number) => void;

export interface PickerViewProps extends PickerProps {
	// 可以在这里添加l-picker-view特有的属性
}