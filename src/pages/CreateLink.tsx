import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linksApi, CreateLinkResponse } from '../lib/api';
import { Link2, Copy, CheckCircle, ExternalLink } from 'lucide-react';

function CreateLink() {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateLinkResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await linksApi.createLink({
        target: target.trim(),
        code: code.trim() || undefined
      });
      setResult(data);
      setTarget('');
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Short Link</h1>
          <p className="text-gray-600">Transform your long URLs into short, shareable links</p>
        </div>

        {result ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Created!</h2>
              <p className="text-gray-600">Your short link is ready to share</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Short URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-cyan-600 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  {copied ? (
                    <span className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Copied!</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Copy className="w-5 h-5" />
                      <span>Copy</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2">
                <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 mb-1">Original URL</p>
                  <p className="text-sm text-gray-600 break-all">{result.target}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setResult(null)}
                className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-medium"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                View Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="target" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the long URL you want to shorten
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Code (optional)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-mono">/</span>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="my-link"
                    pattern="[a-zA-Z0-9]+"
                    maxLength={50}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all font-mono"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Leave empty to generate a random code (alphanumeric only)
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !target.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </span>
                ) : (
                  'Create Short Link'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLink;
