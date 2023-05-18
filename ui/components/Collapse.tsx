import { PropsWithChildren } from 'react';
import classnames from 'classnames';
import { Disclosure, Transition } from '@headlessui/react';
import { FaChevronLeft } from '$components/icons';

interface OwnProps {
    title: string;
    className?: string;
}

export function Collapse({ title, children, className }: PropsWithChildren<OwnProps>) {
    const buttonClass = classnames(className, [
        'flex items-center px-4 py-2',
        'transition-all duration-200 select-none cursor-pointer rounded-md shadow-lg',
        'bg-surface-500 hover:bg-surface-600 active:bg-surface-700',
        'text-foreground-subtlest hover:text-foreground-subtle active:text-foreground-default text-sm',
    ]);

    return (
        <Disclosure as="div" className="w-full flex flex-col">
            {({ open }) => {
                const chevronClass = classnames('ml-auto transition-transform', {
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
