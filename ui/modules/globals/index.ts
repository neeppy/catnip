import './global.css';
import './themes/rubydark.css';

// windows scrollbar styles
if (interop.platform === 'win32') {
    // @ts-ignore
    import('./win32.css');
}

export * from './components';
export * from './constants';
export * from './state';
