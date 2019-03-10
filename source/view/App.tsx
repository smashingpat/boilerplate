import * as React from 'react';
import { hot } from 'react-hot-loader';
import QRScanner from './components/QRScanner';

function App() {
    return (
        <section>
            <h1>Edit in <code>./source/main.tsx</code></h1>
            <QRScanner />
        </section>
    );
}

export default hot(module)(App);
