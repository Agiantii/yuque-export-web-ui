import { useState } from 'react';

export default function ConfigForm({ onSubmit, loading }) {
  const [cookie, setCookie] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cookie);
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <div className="form-group">
        <label htmlFor="cookie">语雀 Cookie:</label>
        <textarea
          id="cookie"
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          placeholder="请输入你的语雀 Cookie"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? '加载中...' : '获取书籍列表'}
      </button>
    </form>
  );
} 