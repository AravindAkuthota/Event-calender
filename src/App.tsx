import { Calendar } from '@/components/Calendar';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-3xl font-bold">Event Calendar</h1>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <Calendar />
      </main>
    </div>
  );
}

export default App;