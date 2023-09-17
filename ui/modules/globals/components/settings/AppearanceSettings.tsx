import { Settings } from 'common/models/Settings';
import { SettingsSectionProps } from './types';

interface OwnProps extends SettingsSectionProps {
    settings: Settings['appearance'];
}

const themes = ['rubydark', 'skyblue'] as const;

export function AppearanceSettings({ settings, onChangeSetting }: OwnProps) {
    return (
        <div>
            <h2 className="m-0 mb-7 text-xl font-semibold">Appearance Settings</h2>
            <label className="text-sm">
                Theme
            </label>
            <div className="flex mt-1 gap-4 p-4 bg-surface-500 border border-surface-600 flex-wrap">
                {themes.map(theme => (
                    <button
                        key={theme} data-theme={theme}
                        className={`w-16 h-16 shrink-0 bg-gradient-to-br rounded-full from-accent from-50% to-50% to-primary ${settings.theme === theme ? 'ring-2 ring-base-content' : ''}`}
                        onClick={() => onChangeSetting('appearance.theme', theme)}
                    />
                ))}
            </div>
        </div>
    );
}
