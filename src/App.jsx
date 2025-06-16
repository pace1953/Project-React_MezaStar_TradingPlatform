import AppRouter from './AppRouter';
import { ContextProvider } from './Context/ContextAPI';

    function App() {
    return (
        <ContextProvider>
            <AppRouter />
        </ContextProvider>
    );}

    export default App;