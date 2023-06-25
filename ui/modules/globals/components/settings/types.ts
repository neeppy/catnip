import { Settings } from 'common/models/Settings';

type ChangeSettingFn<T extends Leaves<Settings> = Leaves<Settings>> = (key: T, value: LeafType<Settings, T>) => Promise<void>;

export interface SettingsSectionProps {
    onChangeSetting: ChangeSettingFn;
}
