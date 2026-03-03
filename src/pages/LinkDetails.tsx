import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { linksApi, type Link as LinkType } from "../lib/api";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  MousePointerClick,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

function LinkDetails() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

 useEffect(() => {
  if (!code) return;

  const getLink = async () => {
    try {
      setLoading(true);
      const data = await linksApi.getLinkStats(code);
      setLink(data);
      setError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load link";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  getLink();
}, [code]);


  

  const handleCopy = async () => {
    if (!code) return;

    const shortUrl = `${import.meta.env.VITE_API_URL}/r/${code}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    toast.success("Short URL copied!");

    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading link details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!link) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Link Statistics
            </h1>
            <p className="text-gray-600">
              Detailed analytics for your short link
            </p>
          </div>

          <div className="space-y-6">
            {/* Short Code Box */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Code
              </label>
              <div className="flex items-center space-x-3">
                <code className="flex-1 text-2xl font-mono font-bold text-cyan-600 bg-white px-4 py-3 rounded-lg">
                  /{link.code}
                </code>

                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  {copied ? (
                    <span className="flex items-center space-x-2">
                      <span>Copied!</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Copy className="w-5 h-5" />
                      <span>Copy URL</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Target URL */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target URL
              </label>
              <div className="flex items-start space-x-2">
                <ExternalLink className="w-5 h-5 text-gray-400 mt-1" />
                <a
                  href={link.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-gray-700 hover:text-cyan-600 break-all"
                >
                  {link.target}
                </a>
              </div>
            </div>

            {/* Stats Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-2">
                  <MousePointerClick className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Total Clicks
                  </span>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {link.clicks}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Created
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-700">
                  {formatDate(link.createdAt)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Last Click
                  </span>
                </div>
                <p className="text-sm font-semibold text-purple-700">
                  {link.lastClick ? formatDate(link.lastClick) : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkDetails;
