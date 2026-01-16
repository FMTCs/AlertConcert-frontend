import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label";
import { Music } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginScreen() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "로그인 실패");
      }

      const data = await response.json();
      
      // 토큰 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      navigate("/recommendations");
    } catch (err) {
      alert(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Music className="w-10 h-10 text-white" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              콘서트 파인더
            </h1>
            <p className="text-gray-600">
              로그인하고 맞춤 콘서트를 추천받으세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6"
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="w-full border-t pt-4">
            <p className="text-sm text-gray-600 text-center">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
