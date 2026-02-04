import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Music, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function SignupScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyUserId, setSpotifyUserId] = useState("");
  const [signupToken, setSignupToken] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // 컴포넌트 마운트 시 데이터 복구 및 토큰 확인
  useEffect(() => {
    // 1. URL 파라미터에서 토큰 확인
    const params = new URLSearchParams(location.search);
    const token = params.get("signupToken");
    const spotifyUserId = params.get("spotifyUserId");

    // 1. 토큰이 URL에 있는지 먼저 확인 (최우선)
    if (token) {
      console.log("토큰 발견:", token);
      setSignupToken(token);
      setSpotifyUserId(spotifyUserId);
      setIsSpotifyConnected(true);
      
      // URL 파라미터 제거 (깔끔하게 유지)
      // replaceState는 상태 변경 후 마지막에 수행하는 것이 안전합니다.
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. 세션 스토리지에서 이전 입력 데이터 확인
    const savedForm = sessionStorage.getItem('temp_reg_form');

    if (savedForm) {
      const formData = JSON.parse(savedForm);
      // 데이터 복구 (기존 입력값 유지)
      setUserId(formData.userId || "");
      setPassword(formData.password || "");
      setConfirmPassword(formData.confirmPassword || "");

      // 3. 토큰이 있다면 인증 성공 처리
      if (token) {
        sessionStorage.removeItem('temp_reg_form');
      }
    }
  }, [location]);

  const handleSpotifyAuth = () => {
    // Session Storage에 저장할 데이터 구성
    const signupForm = {
        userId,
        password,
        confirmPassword,
    };

    // Session Storage에 데이터 저장
    sessionStorage.setItem('temp_reg_form', JSON.stringify(signupForm));

    // spotify api OAuth2 요청 연결
    window.location.href = "http://localhost:8080/auth/spotifyOAuth2";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isSpotifyConnected) {
      alert("Spotify 계정을 먼저 인증해주세요.");
      return;
    }

    // Register api 요청 후 test
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId,
          password: password,
          spotifyUserId: spotifyUserId,
          signupToken: signupToken,
        }),
      });
      console.log(response.body);
      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "회원가입 실패");
      }

      alert("회원가입에 성공");
      navigate("/login");

    } catch (error) {
      alert(error.message);
    };
  }
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
                onClick={() => navigate("/login")}
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
