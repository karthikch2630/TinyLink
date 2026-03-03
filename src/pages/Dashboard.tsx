import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { linksApi, type Link as LinkType } from "../lib/api";
import {
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Calendar,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";

function Dashboard() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await linksApi.getAllLinks();
      setLinks(data);
      setError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load links";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (code: string) => {
    const shortUrl = `${import.meta.env.VITE_API_URL}/r/${code}`;
    await navigator.clipboard.writeText(shortUrl);

    toast.success("Short URL copied!");

    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await linksApi.deleteLink(code);
      setLinks((prev) => prev.filter((l) => l.code !== code));

      toast.success("Link deleted successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete link";
      toast.error(msg);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
          <p className="text-gray-600">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage all your shortened links</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {links.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No links yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first shortened link to get started
            </p>
            <RouterLink
              to="/create"
              className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-all font-medium"
            >
              Create Link
            </RouterLink>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <div
                key={link.code}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">

                    <div className="flex items-center space-x-3 mb-3">
                      <code className="text-lg font-mono font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg">
                        /{link.code}
                      </code>

                      <button
                        onClick={() => handleCopy(link.code)}
                        className="text-gray-400 hover:text-cyan-600 transition-colors"
                      >
                        {copiedCode === link.code ? (
                          <span className="text-green-600 text-sm">
                            Copied!
                          </span>
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-start space-x-2 mb-4">
                      <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5" />
                      <a
                        href={link.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-cyan-600 break-all"
                      >
                        {link.target}
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MousePointerClick className="w-4 h-4" />
                        <span className="font-semibold">{link.clicks}</span>
                        <span>clicks</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(link.createdAt)}</span>
                      </div>

                      {link.lastClick && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <span>Last click {formatDate(link.lastClick)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <RouterLink
                      to={`/link/${link.code}`}
                      className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </RouterLink>

                    <button
                      onClick={() => handleDelete(link.code)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
