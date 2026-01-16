import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 경로 이동을 위한 navigate 추가
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Music2,
  MapPin,
  ExternalLink,
  Sparkles,
  RefreshCw,
  LogOut // 로그아웃 아이콘 추가
} from "lucide-react";

export function ConcertRecommendations() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 백엔드 RecommendResponseDto 구조에 맞춘 상태 관리
  const [userProfile, setUserProfile] = useState({
    topArtists: [],
    topGenres: []
  });
  const [concerts, setConcerts] = useState([]);

  // API 호출 로직 (GET: 추천 조회, POST: 취향 갱신)
  const fetchRecommendations = useCallback(async (isUpdate = false) => {
    const token = localStorage.getItem("accessToken");

    // 토큰이 없으면 데이터를 비우고 로그인 페이지로 튕겨냄
    if (!token) {
      handleLogout();
      return;
    }

    const endpoint = isUpdate ? "/api/interest" : "/api/recommend";
    setIsRefreshing(true);

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: isUpdate ? "POST" : "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // 헤더에 토큰 담기
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout(); // 인증 만료 시 로그아웃
        }
        throw new Error("데이터를 가져오는 데 실패했습니다.");
      }

      const data = await response.json();

      // DTO 필드 매핑 로직
      setUserProfile({
        topArtists: data.topArtists.slice(0, 5).map(a => a.name),
        topGenres: data.topGenres.slice(0, 5).map(g => g.name)
      });
      setConcerts(data.recommendedConcerts);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [navigate]);

  // 페이지 진입 시 실행
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserProfile({ topArtists: [], topGenres: [] }); // 상태 초기화
    setConcerts([]); // 데이터 초기화
    navigate("/login");
  };

  const getMatchColor = score => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    return "bg-purple-500";
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header with Logout */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-8 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <Music2 className="w-8 h-8" />
                <h1 className="text-3xl font-bold">콘서트 파인더</h1>
              </div>
              <p className="text-white/90 mt-2">당신의 음악 취향에 맞춘 콘서트 추천</p>
            </div>
            <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* User Taste Card */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold">당신의 음악 취향</h2>
              </div>
              <Button
                  onClick={() => fetchRecommendations(true)}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                취향 갱신
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Top 아티스트</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.topArtists.map((artist, i) => (
                      <Badge key={i}>{artist}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">선호 장르</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.topGenres.map((genre, i) => (
                      <Badge key={i} variant="secondary">{genre}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Concerts Tabs */}
          <Tabs defaultValue="recommended">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="recommended">추천 콘서트</TabsTrigger>
              <TabsTrigger value="all">전체 목록</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerts.filter(c => c.matchingRate >= 80).map((concert, idx) => (
                  <ConcertCard key={idx} concert={concert} getMatchColor={getMatchColor} />
              ))}
            </TabsContent>

            <TabsContent value="all" className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerts.map((concert, idx) => (
                  <ConcertCard key={idx} concert={concert} getMatchColor={getMatchColor} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}

function ConcertCard({ concert, getMatchColor }) {
  return (
      <Card className="overflow-hidden hover:shadow-lg transition">
        <div className="relative h-48">
          <img
              src={concert.posterImgUrl || "https://via.placeholder.com/400x300?text=No+Poster"}
              alt={concert.concertName} // DTO: concertName
              className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 right-3 ${getMatchColor(concert.matchingRate)} text-white px-3 py-1 rounded-full text-sm`}>
            {concert.matchingRate}% 매칭
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-bold truncate">{concert.concertName}</h3>
          <p className="text-sm text-gray-600">
            {concert.casts && concert.casts.length > 0
                ? concert.casts.map(c => c.name).join(", ")
                : "출연진 정보 없음"}
          </p>

          <div className="text-sm text-gray-600 flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>공연장 정보(준비중)</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {concert.genres && concert.genres.slice(0, 2).map((g, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">{g}</Badge>
              ))}
            </div>
            <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => concert.bookingUrl && window.open(concert.bookingUrl, "_blank")} // DTO: bookingUrl
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              예매하기
            </Button>
          </div>
        </div>
      </Card>
  );
}