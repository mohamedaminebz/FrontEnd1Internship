import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, HashRouter} from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';
import {QueryClient, QueryClientProvider} from "react-query";
// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const queryClient = new QueryClient();
root.render(
    <StrictMode>
        <ReduxProvider store={store}>
            <HashRouter basename="/">
                <QueryClientProvider client={queryClient}>
                <App />
                </QueryClientProvider>
            </HashRouter>
        </ReduxProvider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
