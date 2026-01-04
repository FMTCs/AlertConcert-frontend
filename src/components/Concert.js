import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Music2,
  MapPin,
  Calendar,
  ExternalLink,
  TrendingUp,
  Sparkles,
  RefreshCw
} from "lucide-react";

export function ConcertRecommendations() {
  const [isRefreshingTaste, setIsRefreshingTaste] = useState(false);
  const [isRefreshingConcerts, setIsRefreshingConcerts] = useState(false);

  // Mock user profile (Spotify)
  const [userProfile, setUserProfile] = useState({
    topArtists: ["NewJeans", "아이유", "Le Sserafim", "BTS", "TWICE"],
    topGenres: ["K-Pop", "인디", "R&B", "힙합"]
  });

  // Mock concerts
  const [concerts] = useState([
    {
      id: "1",
      name: "NewJeans 2026 World Tour - Seoul",
      artist: "NewJeans",
      date: "2026년 3월 15일",
      venue: "고척스카이돔",
      location: "서울",
      genre: "K-Pop",
      matchScore: 98,
      imageUrl:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
      ticketUrl: "#"
    },
    {
      id: "2",
      name: "IU Concert: The Golden Hour",
      artist: "아이유",
      date: "2026년 4월 22일",
      venue: "잠실실내체육관",
      location: "서울",
      genre: "K-Pop",
      matchScore: 95,
      imageUrl:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
      ticketUrl: "#"
    },
    {
      id: "3",
      name: "Seoul Jazz Festival 2026",
      artist: "Various Artists",
      date: "2026년 5월 10일 - 12일",
      venue: "올림픽공원",
      location: "서울",
      genre: "R&B",
      matchScore: 87,
      imageUrl:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
      ticketUrl: "#"
    }
  ]);

  const handleRefreshTaste = () => {
    setIsRefreshingTaste(true);

    setTimeout(() => {
      setUserProfile({
        topArtists: ["IVE", "Seventeen", "Zico", "비비", "NewJeans"],
        topGenres: ["K-Pop", "힙합", "R&B", "인디"]
      });
      setIsRefreshingTaste(false);
    }, 1500);
  };

  const handleRefreshConcerts = () => {
    setIsRefreshingConcerts(true);
    setTimeout(() => setIsRefreshingConcerts(false), 1000);
  };

  const sortedConcerts = [...concerts].sort(
    (a, b) => b.matchScore - a.matchScore
  );
  const recommendedConcerts = sortedConcerts.filter(c => c.matchScore >= 85);

  const getMatchColor = score => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    return "bg-purple-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <Music2 className="w-8 h-8" />
            <h1 className="text-3xl font-bold">콘서트 파인더</h1>
          </div>
          <p className="text-white/90 mt-2">
            당신의 음악 취향에 맞춘 콘서트 추천
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* User Taste */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold">당신의 음악 취향</h2>
            </div>
            <Button
              onClick={handleRefreshTaste}
              variant="outline"
              size="sm"
              disabled={isRefreshingTaste}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isRefreshingTaste ? "animate-spin" : ""
                }`}
              />
              새로고침
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
                  <Badge key={i} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Concerts */}
        <Tabs defaultValue="recommended">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="recommended">추천 콘서트</TabsTrigger>
            <TabsTrigger value="all">전체</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedConcerts.map(concert => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                getMatchColor={getMatchColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedConcerts.map(concert => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                getMatchColor={getMatchColor}
              />
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
          src={concert.imageUrl}
          alt={concert.name}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-3 right-3 ${getMatchColor(
            concert.matchScore
          )} text-white px-3 py-1 rounded-full text-sm`}
        >
          {concert.matchScore}% 매칭
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold">{concert.name}</h3>
        <p className="text-sm text-gray-600">{concert.artist}</p>

        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{concert.date}</span>
        </div>

        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>
            {concert.venue}, {concert.location}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline">{concert.genre}</Badge>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <ExternalLink className="w-4 h-4 mr-1" />
            티켓 보기
          </Button>
        </div>
      </div>
    </Card>
  );
}
