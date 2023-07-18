import { getDefaultSettings, Settings } from 'common/models/Settings';
import { SettingsSectionProps } from './types';
import { Input, RadioGroup } from '$components';

interface OwnProps extends SettingsSectionProps {
    settings: Settings['behaviour'];
}

const newSessionOptions = [
    {
        value: 'restore',
        label: 'Restore previous session',
    },
    {
        value: 'new',
        label: 'Start with an empty session',
    },
];

const persistenceOptions = [
    {
        value: 'auto',
        label: 'Automatic',
        description: 'When a change is done to a table cell, it is instantly persisted to the database. This results in a nicer experience, but it also causes multiple DB calls, which can be slow if the connection is slow.',
    },
    {
        value: 'manual',
        label: 'Manual',
        description: 'After a change is done to a table cell, it will not be persisted unless you manually click the persist button. Multiple changes are persisted using a single transaction.',
    },
    {
        value: 'smart',
        label: 'Smart',
        description: 'When a change is done to a table cell, it is automatically persisted after a time window. If another change is done during the time window, the automatic persist is cancelled and manual mode is triggered, allowing for bulk persistence in a single transaction.'
    },
];

const defaultSettings = getDefaultSettings().behaviour;

export function BehaviourSettings({ settings, onChangeSetting }: OwnProps) {
    return (
        <div>
            <h2 className="m-0 mb-7 text-xl font-semibold">Behaviour Settings</h2>
            <RadioGroup
                label="When starting the application:"
                initialValue={settings.newSessionActivity || defaultSettings.newSessionActivity} options={newSessionOptions}
                onChange={value => onChangeSetting('behaviour.newSessionActivity', value as Settings['behaviour']['newSessionActivity'])}
            />
            <RadioGroup
                label="How should your table changes be persisted?"
                initialValue={settings.persistence || defaultSettings.persistence} options={persistenceOptions}
                className="mt-7"
                onChange={value => onChangeSetting('behaviour.persistence', value as Settings['behaviour']['persistence'])}
            />
            {settings.persistence === 'smart' && (
                <Input
                    type="number"
                    min={0} step={100}
                    label="A single cell change will be automatically persisted after (milliseconds)"
                    defaultValue={settings.autoPersistDelay || defaultSettings.autoPersistDelay}
                    className="mt-10 animate-fade-in-left"
                    onBlur={e => onChangeSetting('behaviour.autoPersistDelay', Math.floor(e.target.valueAsNumber) || 10000)}
                />
            )}
        </div>
    );
}
