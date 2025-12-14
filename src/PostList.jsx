import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://be-post-mnm.onrender.com/api/posts'; // Or '/api/posts' if using proxy

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (err) {
      console.error("Lỗi khi fetch data:", err);
      if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
        setError('Lỗi CORS: Không thể kết nối do chính sách bảo mật. Vui lòng kiểm tra backend hoặc sử dụng proxy.');
      } else {
        setError(err.response?.data?.message || 'Không thể kết nối tới server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Tiêu đề không được để trống!");
      return;
    }

    const postData = { title: title.trim(), description: description.trim() };

    try {
      if (isEditing && currentPost) {
        await axios.put(`${API_URL}/${currentPost.idPost}`, postData);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, postData);
        alert('Tạo mới thành công!');
      }
      resetForm();
      fetchPosts();
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert(`Lỗi khi ${isEditing ? 'cập nhật' : 'tạo mới'}: ${err.response?.data?.message || 'Lỗi server'}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIsEditing(false);
    setCurrentPost(null);
  };

  const handleEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setTitle(post.title);
    setDescription(post.description);
  };

  const handleDelete = async (idPost) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết ID: ${idPost} không?`)) {
      try {
        await axios.delete(`${API_URL}/${idPost}`);
        alert('Xóa thành công!');
        setPosts(posts.filter(post => post.idPost !== idPost)); 
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        alert(`Lỗi khi xóa: ${err.response?.data?.message || 'Lỗi server'}`);
        fetchPosts(); // Refresh on error to sync state
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</div>;
  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
      {error}
      <br />
      <button onClick={fetchPosts} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        Thử lại
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Frontend React CRUD (Kết nối Backend Node.js)</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
        <h2>{isEditing ? 'Cập nhật Bài viết' : 'Tạo Bài viết Mới'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tiêu đề (*)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: '8px', width: '100%', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <textarea
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '8px', width: '100%', marginBottom: '10px', minHeight: '80px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: isEditing ? '#ffc107' : '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginRight: '10px' }}>
            {isEditing ? 'Lưu Cập nhật' : 'Tạo Bài viết'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              onClick={resetForm}
              style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
              Hủy
            </button>
          )}
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Danh sách Bài viết ({posts.length})</h2>
        <button onClick={fetchPosts} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Làm mới
        </button>
      </div>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Chưa có bài viết nào. Tạo một bài mới ở trên!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.idPost} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <h3>{post.title} (ID: {post.idPost})</h3>
              <p>{post.description}</p>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleEdit(post)} 
                  style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                >
                  Chỉnh sửa
                </button>
                <button 
                  onClick={() => handleDelete(post.idPost)} 
                  style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;