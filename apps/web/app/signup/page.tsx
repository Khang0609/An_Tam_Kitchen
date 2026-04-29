"use client";

import { signup } from "@/lib/api/auth";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await signup(formData.name, formData.email, formData.password);
      setMessage("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đăng ký thất bại";
      setError(errorMessage);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ padding: "40px", border: "1px solid #000", width: "350px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <h1 style={{ margin: "0 0 10px 0", color: "#000" }}>Đăng ký</h1>
        <input 
          type="text" 
          placeholder="Họ tên" 
          required 
          style={{ padding: "10px", border: "1px solid #ccc" }}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          style={{ padding: "10px", border: "1px solid #ccc" }}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          required 
          style={{ padding: "10px", border: "1px solid #ccc" }}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          ĐĂNG KÝ
        </button>
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <p style={{ fontSize: "12px" }}>
          Đã có tài khoản? <a href="/login" style={{ color: "#007bff" }}>Đăng nhập ngay</a>
        </p>
      </form>
    </div>
  );
}
