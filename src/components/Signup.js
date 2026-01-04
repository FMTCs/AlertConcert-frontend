import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Music, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function SignupScreen({ onSignupComplete, onGoToLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  const handleSpotifyAuth = () => {
    // Mock Spotify authentication
    setIsSpotifyConnected(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isSpotifyConnected) {
      alert("Spotify 계정을 먼저 인증해주세요.");
      return;
    }

    // Mock signup
    onSignupComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Music className="w-10 h-10 text-white" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
            <p className="text-gray-600">
              계정을 만들고 맞춤 콘서트를 추천받으세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label>Spotify 계정 연동</Label>

              {!isSpotifyConnected ? (
                <Button
                  type="button"
                  onClick={handleSpotifyAuth}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Spotify 인증하기
                </Button>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Spotify 계정이 연결되었습니다
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-500">
                음악 취향 분석을 위해 Spotify 계정 연동이 필요합니다
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6"
            >
              회원가입
            </Button>
          </form>

          <div className="w-full border-t pt-4">
            <p className="text-sm text-gray-600 text-center">
              이미 계정이 있으신가요?{" "}
              <button
                onClick={onGoToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
