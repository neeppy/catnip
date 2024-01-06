import { SettingsSectionProps } from './types';
import { Settings } from 'common/models/Settings';

interface OwnProps extends SettingsSectionProps {
    settings: Settings['shortcuts'];
}

export function KeyboardShortcutsSettings({ settings }: OwnProps) {
    return (
        <div>
            <h2 className="m-0 mb-7 text-xl font-semibold">Keyboard Settings</h2>
            <div className="grid grid-cols-6">

            </div>
        </div>
    );
}
