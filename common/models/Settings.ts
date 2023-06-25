interface AppearanceSettings {
    theme: 'dark' | 'skyblue';
}

interface BehaviourSettings {
    newSessionActivity: 'restore' | 'new';
    persistence: 'smart' | 'auto' | 'manual';
    autoPersistDelay: number;
}

export interface Settings {
    appearance: AppearanceSettings;
    behaviour: BehaviourSettings;
}

export interface SettingChange<T extends Leaves<Settings> = Leaves<Settings>> {
    key: T;
    value: LeafType<Settings, T>;
}

export const getDefaultSettings = (): Settings => ({
    appearance: {
        theme: 'dark',
    },
    behaviour: {
        newSessionActivity: 'restore',
        persistence: 'smart',
        autoPersistDelay: 10,
    },
});
