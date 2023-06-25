import path from 'path';
import * as fs from 'fs/promises';
import YAML from 'yamljs';
import { getDefaultSettings, SettingChange, Settings } from 'common/models/Settings';
import { Route } from '../types';
import { assocPath } from 'ramda';

function getSettingsFilePath() {
    return path.join(__dirname, 'settings.yml');
}

export default [
    {
        channel: '@@settings/fetch',
        async handle() {
            let settings: Settings;

            try {
                const fileContent = await fs.readFile(getSettingsFilePath(), 'utf-8');

                settings = YAML.parse(fileContent) as Settings;
            } catch (e) {
                settings = getDefaultSettings();

                await fs.writeFile(getSettingsFilePath(), YAML.stringify(settings, 4));
            }

            return settings;
        }
    },
    {
        channel: '@@settings/update',
        async handle(event, updates: SettingChange[]) {
            const fileContent = await fs.readFile(getSettingsFilePath(), 'utf-8');

            const settings = YAML.parse(fileContent) as Settings;

            const updatedSettings = updates.reduce<Settings>((current, update) => assocPath(update.key.split('.'), update.value, current), settings);

            const yamlSettings = YAML.stringify(updatedSettings, 4);

            await fs.writeFile(getSettingsFilePath(), yamlSettings, 'utf-8');
        }
    }
] as Route[];
