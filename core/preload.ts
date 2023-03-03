import { contextBridge, ipcRenderer } from 'electron';
import { Interop } from 'common/models/Interop';

contextBridge.exposeInMainWorld('interop', {
    platform: process.platform,
    control: {
        close: () => ipcRenderer.invoke('@@app/close'),
        minimize: () => ipcRenderer.invoke('@@app/minimize'),
        maximize: () => ipcRenderer.invoke('@@app/maximize'),
    },
    data: {
        encrypt: (data) => ipcRenderer.invoke('@@data/encrypt', data),
    },
    dialog: {
        file: () => ipcRenderer.invoke('dialog:file'),
    },
    connections: {
        open: (connection) => ipcRenderer.invoke('@@connection/init', connection),
    },
    database: {
        fetchTableNames: (connectionId, database) => ipcRenderer.invoke('@@db/tables', connectionId, database),
        fetchTableContent: (connectionId, table) => ipcRenderer.invoke('@@db/table-initial', connectionId, table),
    },
} as Interop);

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
    return new Promise(resolve => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find(e => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find(e => e === child)) {
            return parent.removeChild(child);
        }
    }
};

function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
    const oStyle = document.createElement('style');
    const oDiv = document.createElement('div');

    oStyle.id = 'app-loading-style';
    oStyle.innerHTML = styleContent;
    oDiv.className = 'app-loading-wrap';
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        }
    };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = ev => {
    ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
