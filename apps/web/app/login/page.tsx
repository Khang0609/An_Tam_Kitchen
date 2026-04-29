"use client";

import { login } from "@/lib/api/auth";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await login(formData.email, formData.password);
      setMessage("Đăng nhập thành công! Đang vào trang chủ...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.";
      setError(errorMessage);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ padding: "40px", border: "1px solid #000", width: "350px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <h1 style={{ margin: "0 0 10px 0", color: "#000" }}>Đăng nhập</h1>
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
        <button type="submit" style={{ padding: "10px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          ĐĂNG NHẬP
        </button>
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <p style={{ fontSize: "12px" }}>
          Chưa có tài khoản? <a href="/signup" style={{ color: "#007bff" }}>Đăng ký miễn phí</a>
        </p>
      </form>
    </div>
  );
}
