import PostList from './PostList';
import './App.css'; // Giữ lại file CSS mặc định nếu có

function App() {
  return (
    <div className="App" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <PostList />
    </div>
  );
}

export default App;