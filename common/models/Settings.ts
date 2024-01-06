interface AppearanceSettings {
    theme: 'rubydark' | 'skyblue';
}

interface BehaviourSettings {
    newSessionActivity: 'restore' | 'new';
    persistence: 'smart' | 'auto' | 'manual';
    autoPersistDelay: number;
}

export interface Settings {
    appearance: AppearanceSettings;
    behaviour: BehaviourSettings;
    shortcuts: Record<string, string>;
}

export interface SettingChange<T extends Leaves<Settings> = Leaves<Settings>> {
    key: T;
    value: LeafType<Settings, T>;
}

export const getDefaultSettings = (): Settings => ({
    appearance: {
        theme: 'rubydark',
    },
    behaviour: {
        newSessionActivity: 'restore',
        persistence: 'smart',
        autoPersistDelay: 10000,
    },
    shortcuts: {
        overview: 'alt+shift+f',
        cmdbar: 'ctrl+t',
        openSettings: 'alt+shift+s',
    },
});
