import { DragEvent, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Editor } from 'ui-kit';

interface OwnProps {
    className?: string;
}

function getDragDropProps() {
    let mouseStartX = 0, mouseStartY = 0;

    return {
        onDragStart(event: DragEvent) {
            mouseStartX = event.clientX;
            mouseStartY = event.clientY;
        },
        onDragEnd(event: DragEvent) {
            const target = event.target as HTMLElement;

            const { top, left } = target.getBoundingClientRect();

            target.classList.remove('translate-x-[-50%]', 'translate-y-[-50%]');

            const relativeMouseX = Math.abs(left - mouseStartX);
            const relativeMouseY = Math.abs(top - mouseStartY);

            const maxTop = window.innerHeight - 48 - target.clientHeight;
            const minTop = 48;
            const minLeft = 8;
            const maxLeft = window.innerWidth - 8 - target.clientWidth;

            const newTop = Math.max(Math.min(maxTop, event.clientY - relativeMouseY), minTop);
            const newLeft = Math.max(Math.min(maxLeft, event.clientX - relativeMouseX), minLeft);

            target.style.top = newTop + 'px';
            target.style.left = newLeft + 'px';
        },
    };
}

export default function FloatingEditor({ className }: OwnProps) {
    const [defaultValue, setDefaultValue] = useState('');

    useEffect(() => {
        function handler(event: KeyboardEvent) {
            if (event.key.length === 1) {
                setDefaultValue(event.key);

                window.removeEventListener('keydown', handler);
            }
        }

        if (!defaultValue) {
            window.addEventListener('keydown', handler);

            return () => window.removeEventListener('keydown', handler);
        }
    }, [defaultValue]);

    function handleQuerySubmit(query: string) {
        console.log(query);
    }

    if (!defaultValue) {
        return null;
    }

    return (
        <div draggable="true" {...getDragDropProps()} className={classnames(className, 'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-20')}>
            <div className="h-full pl-6 py-1 pr-1 rounded-md bg-scene-100">
                <Editor
                    defaultValue={defaultValue}
                    onSubmit={handleQuerySubmit}
                    onEscape={() => setDefaultValue('')}
                />
            </div>
        </div>
    );
}
