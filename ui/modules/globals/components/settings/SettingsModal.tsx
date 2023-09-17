import classnames from 'classnames';
import { Tabs } from '$components';
import { AiFillControl, FaPalette } from '$components/icons';
import { AppearanceSettings } from './AppearanceSettings';
import { BehaviourSettings } from './BehaviourSettings';
import { useSettings } from 'ui/hooks';

export function SettingsModal() {
    const { settings, updateSetting: changeSetting } = useSettings();

    const tabHeaderClass = classnames('items-center w-10 h-10 rounded-full flex-center border');
    const activeTabClass = classnames('bg-primary text-primary-content border-primary-light');
    const inactiveTabClass = classnames('bg-base-300 hover:bg-base-400 focus:bg-base-400 active:bg-base-500 border-base-400 text-content-subtlest');

    return (
        <div className="w-[48rem] h-[36rem] bg-base-200 rounded-md shadow-md p-4 border border-base-300">
            <Tabs initial="appearance">
                <div className="flex absolute left-0 -top-12 gap-2">
                    <Tabs.Header id="appearance" className={tabHeaderClass} activeClassName={activeTabClass} inactiveClassName={inactiveTabClass}>
                        <FaPalette className="text-lg" />
                    </Tabs.Header>
                    <Tabs.Header id="behaviour" className={tabHeaderClass} activeClassName={activeTabClass} inactiveClassName={inactiveTabClass}>
                        <AiFillControl className="text-lg" />
                    </Tabs.Header>
                </div>
                <Tabs.Content id="appearance">
                    <AppearanceSettings settings={settings.appearance} onChangeSetting={changeSetting} />
                </Tabs.Content>
                <Tabs.Content id="behaviour">
                    <BehaviourSettings settings={settings.behaviour} onChangeSetting={changeSetting} />
                </Tabs.Content>
            </Tabs>
        </div>
    );
}
