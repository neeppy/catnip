import { PropsWithChildren, useEffect, useRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Disclosure, Transition } from '@headlessui/react';
import classnames from 'classnames';

interface OwnProps {
    title: string;
    className?: string;
}

export function Collapse({ title, children, className }: PropsWithChildren<OwnProps>) {
    const buttonClass = classnames(className, [
        'w-full cursor-pointer bg-scene-400 px-4 py-2 rounded-md shadow-lg flex items-center hover:bg-scene-500 active:bg-scene-600 text-sm text-scene-800 hover:text-scene-900 active:text-scene-default transition-all duration-200 select-none'
    ]);

    return (
        <Disclosure as="div" className="w-full">
            {({ open }) => {
                const chevronClass = classnames('ml-auto', {
                    'rotate-[-90deg]': open
                });

                return (
                    <>
                        <Disclosure.Button className={buttonClass}>
                            {title}
                            <FaChevronLeft className={chevronClass}/>
                        </Disclosure.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel>
                                <div className="py-4">
                                    {children}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </>
                );
            }}
        </Disclosure>
    );
}
