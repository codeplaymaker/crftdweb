'use client';

import { Download, Instagram, Video } from 'lucide-react';

export default function SocialMediaDownloads() {
  const instagramPosts = [
    {
      id: 1,
      title: 'Five Formulas Introduction',
      description: 'Introduce the core framework',
      filename: 'instagram-five-formulas.png',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      title: 'AI Mentor Feature',
      description: 'Highlight Wisdom Keeper AI',
      filename: 'instagram-ai-mentor.png',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Daily Habits Quote',
      description: 'Motivational habit building',
      filename: 'instagram-habits-quote.png',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Goal Setting Tips',
      description: 'Practical goal achievement',
      filename: 'instagram-goal-tips.png',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'User Testimonial',
      description: 'Social proof highlight',
      filename: 'instagram-testimonial.png',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 6,
      title: 'Free Beta Announcement',
      description: 'Call to action post',
      filename: 'instagram-free-beta.png',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const tiktokPosts = [
    {
      id: 1,
      title: 'What is Life Lab HQ?',
      description: 'Product introduction vertical',
      filename: 'tiktok-intro.png',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      title: 'Five Formulas Explained',
      description: 'Educational content',
      filename: 'tiktok-five-formulas.png',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 3,
      title: 'Transform Your Life',
      description: 'Motivational vertical',
      filename: 'tiktok-transform.png',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 4,
      title: 'AI Mentor Demo',
      description: 'Feature showcase',
      filename: 'tiktok-ai-demo.png',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 5,
      title: 'Success Story',
      description: 'User transformation',
      filename: 'tiktok-success.png',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      id: 6,
      title: 'Get Started Free',
      description: 'Call to action',
      filename: 'tiktok-cta.png',
      color: 'from-pink-600 to-rose-600'
    }
  ];

  const handleDownload = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/social-posts/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = (type: 'instagram' | 'tiktok') => {
    const posts = type === 'instagram' ? instagramPosts : tiktokPosts;
    posts.forEach((post, index) => {
      setTimeout(() => {
        handleDownload(post.filename);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Download className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Social Media Marketing Assets</h1>
          <p className="text-xl text-gray-600 mb-8">
            Download professionally designed posts for Instagram and TikTok
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleDownloadAll('instagram')}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Download All Instagram Posts
            </button>
            <button
              onClick={() => handleDownloadAll('tiktok')}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Video className="w-5 h-5" />
              Download All TikTok Posts
            </button>
          </div>
        </div>

        {/* Instagram Posts */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Instagram className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl font-bold">Instagram Posts</h2>
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
              1080 x 1080px
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instagramPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`aspect-square bg-gradient-to-br ${post.color} flex items-center justify-center p-8`}>
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-2xl font-bold mb-2">{post.title}</div>
                    <div className="text-sm opacity-90">1080 x 1080px</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                  <button
                    onClick={() => handleDownload(post.filename)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TikTok Posts */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-gray-800" />
            <h2 className="text-3xl font-bold">TikTok Posts</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              1080 x 1920px
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiktokPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`aspect-[9/16] bg-gradient-to-br ${post.color} flex items-center justify-center p-8`}>
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-2xl font-bold mb-2">{post.title}</div>
                    <div className="text-sm opacity-90">1080 x 1920px</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                  <button
                    onClick={() => handleDownload(post.filename)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Tips */}
        <section className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Usage Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                Instagram Best Practices
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Post during peak hours (11am-1pm, 7pm-9pm)</li>
                <li>• Use 20-30 relevant hashtags</li>
                <li>• Include call-to-action in captions</li>
                <li>• Tag location for local visibility</li>
                <li>• Engage with comments within first hour</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-gray-800" />
                TikTok Best Practices
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Post 1-3 times daily for best reach</li>
                <li>• Use trending sounds when relevant</li>
                <li>• Hook viewers in first 3 seconds</li>
                <li>• Include text overlay for silent viewing</li>
                <li>• Use 3-5 targeted hashtags</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Note about PNG Generation */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
          <p className="text-gray-700">
            <strong>Note:</strong> The actual PNG files will be generated using a design tool like Canva, Figma, or HTML2Canvas. 
            The download buttons are ready - just add the PNG files to the <code className="bg-white px-2 py-1 rounded">/public/social-posts/</code> directory.
          </p>
        </div>
      </div>
    </div>
  );
}
