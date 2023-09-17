import classnames from 'classnames';
import { Editor } from '$components';
import { Tab } from '../types';
import { useControlledEffect } from 'ui/hooks';

export function QueryTab({ editorContent, autoRun }: Tab) {
    const editorContainerClass = classnames('z-10 duration-200 h-9 focus-within:h-96 relative group');

    useControlledEffect(() => {
        console.log('Run query', editorContent);
    }, autoRun);

    return (
        <>
            <div className="flex-1">

            </div>
            <div className={editorContainerClass}>
                <div className="absolute h-10 -top-10 inset-x-0 -z-10 opacity-0 group-focus-within:opacity-100 group-focus-within:z-20 bg-base-400 shadow-md duration-200" tabIndex={-1}>

                </div>
                <Editor placeholder="SELECT something FROM somewhere" defaultValue={editorContent} />
            </div>
        </>
    );
}
