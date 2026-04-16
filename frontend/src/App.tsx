import { ToastProvider } from './components/ui/toast';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <ToastProvider>
      <SearchPage />
    </ToastProvider>
  );
}

export default App;
